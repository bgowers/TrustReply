# Changelog

Reverse-chronological. One bullet per user-visible or developer-visible change.

## Unreleased

- Fix: disabled `analytics` and `edge_runtime` in `supabase/config.toml` so
  `supabase start` works under Colima. Both services bind-mount the host
  docker socket, which Colima's Linux VM cannot reach (it surfaces as
  `mkdir <socket-path>: operation not supported`). Neither is needed by
  TrustReply; re-enable in the config if you add Edge Functions or run on
  Docker Desktop.

- Dev workflow: `pnpm dev` now chains `supabase start && next dev`, so a single
  command boots the DB + auth + Studio + mail-catcher stack and the Next
  server. `supabase start` is idempotent so the boot cost is ~2s when the
  stack is already up. Added `pnpm dev:app` (skips Supabase) and
  `pnpm db:{start,stop,reset,status}` for explicit control.
- Dev workflow: switched primary dev environment to local Supabase via the
  Supabase CLI. `supabase init` scaffolded `supabase/config.toml`; the schema
  moved from `db/schema.sql` to `supabase/migrations/20260506000000_initial.sql`
  so `supabase db reset` applies it deterministically. Magic-link emails now
  land in the local Inbucket mailbox at `http://localhost:54324`. Hosted
  Supabase remains supported for staging/prod via `supabase db push`. Updated
  `SETUP.md`, `CLAUDE.md`, and `docs/architecture.md` accordingly.
- Tooling: added `vitest@4.1.5` plus unit tests for `lib/parsers.ts`
  (CSV parsing, question-column heuristic, answer-column detection) and
  `lib/exporters.ts` (CSV/XLSX shape, watermark, formula-injection
  neutralization). New `pnpm test` and `pnpm test:watch` scripts. CI runs
  `typecheck → lint → test → build` via `.github/workflows/ci.yml` on push to
  `main` and on every PR.
- Split `components/ui/input.tsx` into `input.tsx` and `textarea.tsx` so each
  component lives in its own file. Updated import sites in `policy-editor.tsx`
  and `questionnaire-table.tsx`.
- Security: neutralize CSV/Excel formula injection (CWE-1236) in
  `lib/exporters.ts`. Cells starting with `=`, `+`, `-`, `@`, tab, or `\r` are
  prefixed with `'` so Excel renders them as text instead of evaluating them.
  Applies to both CSV and XLSX export paths.
- Switched Supabase auth to the new API key model: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_…`) and
  `SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_SECRET_KEY` (`sb_secret_…`). Updated
  `lib/env.ts`, `lib/supabase/{client,server}.ts`, `proxy.ts`, `.env.example`,
  `SETUP.md`, and architecture/CLAUDE wording to match.
- Initial scaffold with pinned dependency versions:
  - `next@16.2.4`, `react@19.2.5`, `react-dom@19.2.5`
  - `typescript@6.0.3`, `@types/node@25.6.0`, `@types/react@19.2.14`,
    `@types/react-dom@19.2.3`
  - `tailwindcss@4.2.4`, `@tailwindcss/postcss@4.2.4`, `postcss@8.5.14`,
    `autoprefixer@10.5.0`
  - `eslint@9.39.4`, `eslint-config-next@16.2.4` — eslint pinned to 9.x because
    `eslint-plugin-react@7.37.x` is not yet compatible with the ESLint 10 rule
    context API. Bump to 10.x once the plugin ships a fix.
  - `@anthropic-ai/sdk@0.94.0`
  - `@supabase/supabase-js@2.105.3`, `@supabase/ssr@0.10.2`
  - `stripe@22.1.0`
  - `papaparse@5.5.3`, `@types/papaparse@5.5.2`, `xlsx@0.18.5`
  - `zod@4.4.3`, `resend@6.12.2`, `lucide-react@1.14.0`
  - `clsx@2.1.1`, `tailwind-merge@3.5.0`, `class-variance-authority@0.7.1`
- Added `CLAUDE.md`, `spec.md`, and `docs/` skeleton.
- Auth: Supabase magic-link sign-in, `/auth/callback` exchange, `proxy.ts`
  guarding `/app/*` (Next 16 renamed `middleware` → `proxy`).
- Database: `db/schema.sql` with profiles, policies, questionnaires, questions
  tables; RLS owner-only on every user table; auto-seed 8 example policies on
  signup.
- Policies: CRUD UI at `/app/policies`, REST routes at `/api/policies` and
  `/api/policies/[id]`.
- Questionnaires: CSV/XLSX upload with auto-detected question column, plan-aware
  paywall (402 on limit), SSE draft endpoint with Anthropic prompt caching,
  review table UI with inline edit + approve, export endpoint that preserves the
  original layout (with watermark on free plan).
- AI: `lib/anthropic.ts` uses `claude-sonnet-4-6` with `cache_control: ephemeral`
  on system + policy blocks; structured JSON output validated by zod with one
  retry on parse failure.
- Billing: Stripe Checkout (`/api/stripe/checkout`), Customer Portal
  (`/api/stripe/portal`), webhook (`/api/stripe/webhook`) with mandatory
  signature verification syncing `profiles.plan`.
- Landing page at `/` with pricing for Free, Solo ($99/mo), Team ($399/mo).
- Sample input: `samples/sample-sig-25.csv`.
- Setup walkthrough: `SETUP.md`.
