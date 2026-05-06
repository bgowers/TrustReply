# SETUP

One-time setup to run TrustReply locally. The app connects to four external services:
Supabase (DB + auth), Anthropic (drafts), Stripe (billing), and optionally Resend
(branded magic-link email).

> Read [CLAUDE.md](./CLAUDE.md) and [spec.md](./spec.md) first if you haven't.

## 0. Prerequisites

- Node 22 LTS (`node --version`)
- pnpm (`corepack enable && corepack prepare pnpm@latest --activate`)
- Docker (Docker Desktop or OrbStack) — required for local Supabase
- Supabase CLI (`brew install supabase/tap/supabase` or
  https://supabase.com/docs/guides/cli)
- Stripe CLI (`brew install stripe/stripe-cli/stripe` or
  https://docs.stripe.com/stripe-cli)

```sh
pnpm install
cp .env.example .env.local
```

## 1. Supabase (local — recommended for dev)

The whole Supabase stack runs locally via Docker — Postgres, GoTrue auth, the
Studio UI, and Inbucket (a local mailbox that catches magic-link emails). No
internet required. Schema lives in `supabase/migrations/` and is applied on every
`supabase db reset`.

```sh
supabase start
```

The first run pulls images (a few minutes); subsequent boots are quick. When it's
done, the CLI prints values for the running stack:

- `API URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `Publishable key` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `Secret key` → `SUPABASE_SECRET_KEY`
- Studio UI: http://localhost:54323
- Inbucket (magic-link inbox): http://localhost:54324

Re-print them anytime with `supabase status`.

To wipe and reapply migrations + seed:

```sh
supabase db reset
```

Stop the stack with `supabase stop`. Local data is wiped on each reset; that's the
point.

### Hosted Supabase (staging/prod)

1. Create a project at https://supabase.com.
2. Link the repo to it: `supabase link --project-ref <ref>`.
3. Push migrations: `supabase db push`.
4. Copy the project URL + publishable + secret keys into your hosted env (do not
   put real cloud secrets in `.env.local`).
5. Set Auth → URL Config → Site URL to your deployed origin and add
   `<origin>/auth/callback` as a redirect URL.

## 2. Anthropic

1. Get a key from https://console.anthropic.com.
2. Set `ANTHROPIC_API_KEY` in `.env.local`.
3. The app uses `claude-sonnet-4-6` with prompt caching on the policy block.

## 3. Stripe

1. Sign up for Stripe (test mode is fine).
2. **Products**: create two recurring products and copy their price IDs:
   - "TrustReply Solo" — $99/month → `NEXT_PUBLIC_STRIPE_PRICE_SOLO`
   - "TrustReply Team" — $399/month → `NEXT_PUBLIC_STRIPE_PRICE_TEAM`
3. **Developers → API keys**: copy the secret key into `STRIPE_SECRET_KEY`.
4. Run the local webhook forwarder in another terminal:
   ```sh
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the signing secret it prints into `STRIPE_WEBHOOK_SECRET`.

## 4. Resend (optional)

Only needed when you want branded magic-link emails from your own domain. For dev,
skip this — Supabase's built-in mailer works.

## 5. Run

```sh
pnpm dev
```

Open http://localhost:3000.

## 6. End-to-end smoke test

1. Sign up via magic link.
2. Visit `/app/policies` → seeded examples are present. Replace one with a real policy.
3. Click "Upload questionnaire", upload `samples/sample-sig-25.csv`.
4. Drafting starts automatically; rows populate over ~60–90 seconds.
5. Edit one row, click "Approve", then click "Export XLSX". Open the file — answers
   should be in the Answer column.
6. Try uploading a second questionnaire on the Free plan → expect the paywall.
7. (Optional) Click an upgrade flow that posts to `/api/stripe/checkout`. Use test
   card `4242 4242 4242 4242`, any future date, any CVC.

If `pnpm typecheck && pnpm lint && pnpm build` pass, you're ready to deploy to Vercel.
