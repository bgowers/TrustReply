# SETUP

One-time setup to run TrustReply locally. The app connects to four external services:
Supabase (DB + auth), Anthropic (drafts), Stripe (billing), and optionally Resend
(branded magic-link email).

> Read [CLAUDE.md](./CLAUDE.md) and [spec.md](./spec.md) first if you haven't.

## 0. Prerequisites

- Node 22 LTS (`node --version`)
- pnpm (`corepack enable && corepack prepare pnpm@latest --activate`)
- Stripe CLI (`brew install stripe/stripe-cli/stripe` or
  https://docs.stripe.com/stripe-cli)

```sh
pnpm install
cp .env.example .env.local
```

## 1. Supabase

1. Create a free project at https://supabase.com. When prompted, **enable the Data
   API** with "automatically expose new tables" and "automatic RLS" checked — every
   table in `db/schema.sql` already declares its own RLS policies, but the default
   keeps you safe if you ever add a table.
2. **Settings → Data API**: copy the Project URL into `NEXT_PUBLIC_SUPABASE_URL`.
3. **Settings → API Keys**: TrustReply uses the new key model (`sb_publishable_…` /
   `sb_secret_…`), not the legacy anon / service-role JWTs. If you don't see them
   yet, click "Opt in" — Supabase creates a default publishable key and one secret
   key. Copy them into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`.
4. **SQL editor**: paste the contents of `db/schema.sql` and run it.
5. **Authentication → URL Configuration**: set Site URL to `http://localhost:3000`
   and add `http://localhost:3000/auth/callback` as a redirect URL.
6. **Authentication → Email**: keep the default Supabase mailer for dev (works
   without Resend). Magic-link emails arrive in seconds.

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
