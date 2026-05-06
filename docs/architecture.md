# Architecture

## Stack (pinned)

Resolved at scaffold time via `npm view <pkg> version`. Recorded in `changelog.md`.

| Layer        | Tech                                                       |
| ------------ | ---------------------------------------------------------- |
| Runtime      | Node 22 LTS                                                |
| Framework    | Next.js 16 (App Router) + React 19                         |
| Language     | TypeScript 6 (strict)                                      |
| Styling      | Tailwind v4 + minimal hand-rolled UI components            |
| DB / Auth    | Supabase (Postgres + auth + RLS)                           |
| AI           | `@anthropic-ai/sdk` with `claude-sonnet-4-6`               |
| Billing      | Stripe (Checkout + Customer Portal + webhook)              |
| File parsing | `papaparse` (CSV), `xlsx` (Excel)                          |
| Validation   | `zod`                                                      |
| Email        | Supabase magic-link (Resend optional for branded sender)   |

## Data model

Postgres tables (see `supabase/migrations/20260506000000_initial.sql`):

- `profiles` — per-user billing state (`plan`, `stripe_customer_id`,
  `stripe_subscription_id`, `current_period_end`). PK is `auth.users.id`.
- `policies` — `id`, `user_id`, `title`, `category`, `body`, `updated_at`.
- `questionnaires` — `id`, `user_id`, `name`, `source_filename`, `question_column`,
  `total_rows`, `status` (`pending` | `drafting` | `complete`), `created_at`.
- `questions` — one row per question: `id`, `questionnaire_id`, `row_index`,
  `question_text`, `draft_answer`, `final_answer`, `citations` (jsonb),
  `confidence`, `status` (`pending` | `drafted` | `approved`).

Every table has a row-level security policy: `user_id = auth.uid()`. The Supabase
secret key (`SUPABASE_SECRET_KEY`, `sb_secret_…`) is only used in
`/api/stripe/webhook` (no user session) and in code paths that explicitly need to
bypass RLS for system writes. The browser only ever sees the publishable key.

## AI design — prompt caching

The policy library and the system prompt are identical across every question in
a given questionnaire. We exploit this with Anthropic prompt caching:

```
system:    [cached] instructions + JSON output schema
user[0]:   [cached] company description + full policy library
user[1]:   the question text (fresh per call)
```

`cache_control: { type: "ephemeral" }` is set on the cached blocks. After the first
question warms the cache, subsequent questions in the batch hit a near-zero input
cost. We run 5 questions in parallel via `Promise.all` to saturate cache hits and
stay under per-minute rate limits.

Output is JSON:

```ts
{
  answer: string,
  policy_ids: number[],         // which policies were cited
  confidence: "high" | "medium" | "low",
  needs_review_reason?: string  // present only when confidence !== "high"
}
```

`zod` validates this at the boundary; malformed responses retry once with a
re-prompt that includes the error.

## Request flows

### Upload → draft

1. Client `POST /api/questionnaires` with multipart form (file).
2. Server parses with `lib/parsers.ts`, auto-detects question column (longest
   string column with ≥80% non-empty cells), inserts `questionnaire` + `questions`.
3. Returns `questionnaire.id`.
4. Client opens SSE: `GET /api/questionnaires/[id]/draft`.
5. Server loads policies once, builds the cached prompt blocks once, then iterates
   questions in batches of 5; for each completed question, `UPDATE` row + emit SSE
   event. Final event flips `questionnaires.status` to `complete`.

### Review → export

1. Client edits `final_answer` per row via `PATCH /api/questionnaires/[id]/questions/[rowId]`.
2. `GET /api/questionnaires/[id]/export?format=xlsx` rebuilds the original file
   layout with `final_answer ?? draft_answer` substituted into the answer column,
   streams the bytes back.

### Billing

1. `POST /api/stripe/checkout` with a price ID → server creates a Checkout session
   bound to the user, returns `url`. Client redirects.
2. Stripe webhook `POST /api/stripe/webhook`:
   - Signature verified with `STRIPE_WEBHOOK_SECRET`.
   - `checkout.session.completed`: insert/update `profiles.stripe_customer_id`,
     `stripe_subscription_id`, `plan`.
   - `customer.subscription.updated|deleted`: sync plan / period end.
3. `POST /api/stripe/portal`: server creates a Customer Portal session, returns
   redirect URL.

## Security

- RLS on every user table (owner-only).
- Supabase secret key never reaches the browser; only used in `/api/stripe/webhook`.
- Stripe webhook always verifies signature.
- File uploads validated server-side: ≤10 MB, mime-type allowlist (CSV/XLSX).
- Anthropic API key only on the server.

## Smoke test

End-to-end check:

1. `pnpm install && pnpm dev`
2. `supabase start` to boot the local stack; the migration auto-applies. Copy
   the printed URL + keys into `.env.local`.
3. Sign in, add 3 policies, upload `samples/sample-sig-25.csv`.
4. Watch the SSE stream populate the table (<90s for 25 rows).
5. Edit one answer, click Export, open the XLSX, verify answers in correct column.
6. Upload a second questionnaire on Free plan → expect paywall → complete Stripe
   Checkout with test card `4242 4242 4242 4242` → confirm plan upgrade.
7. Open Customer Portal, cancel; webhook downgrades plan back to Free.

`pnpm typecheck` and `pnpm lint` must pass.
