# Deploy

Operational walkthrough for shipping TrustReply to Vercel and a note on how
the environments split.

## Environments

| Environment | Where it runs                | Supabase                  | Anthropic       | Stripe                       |
| ----------- | ---------------------------- | ------------------------- | --------------- | ---------------------------- |
| Local dev   | `pnpm dev` on your laptop    | Local CLI stack (Docker)  | Test API key    | Test mode + `stripe listen`  |
| Preview     | Vercel preview deploys (PRs) | Hosted "staging" project  | Test API key    | Test mode webhook            |
| Production  | Vercel `main` branch         | Hosted "prod" project     | Production key  | Live mode + production webhook |

Local dev is fully covered by [SETUP.md](../SETUP.md). Preview and production
both run on Vercel with their own env vars and (eventually) their own hosted
Supabase projects.

## Pre-launch landing-only deploy

The landing page and legal pages don't depend on Supabase / Anthropic / Stripe
to render — `lib/env.ts` uses lazy getter functions, so a build with zero
secrets succeeds. This is the path for getting a public URL up to submit to
Stripe activation before the rest of the app is ready.

What ships and works in landing-only mode:

- `/` — hero, how-it-works, pricing
- `/legal/terms`, `/legal/privacy`, `/legal/refund`

What ships but won't function (intentional — fill in env vars later):

- `/login`, `/auth/callback`
- `/app/*`
- `/api/*`

### Steps

1. Buy your domain (Cloudflare Registrar, Namecheap, etc.). Set up email
   forwarding (`support@<domain>` → your inbox).
2. In Vercel: **Add New → Project → Import** the GitHub repo. Vercel detects
   Next.js + pnpm automatically.
3. **Settings → Environment Variables → Production**, set:
   - `NEXT_PUBLIC_APP_URL = https://<your-domain>`
4. **Settings → Domains**: add the custom domain. Follow Vercel's DNS
   instructions; if your registrar is Cloudflare, set the records to
   "DNS only" (grey cloud).
5. Trigger a deploy (push or **Deployments → Redeploy**).
6. Smoke-check the live URL: `/`, `/legal/terms`, `/legal/privacy`,
   `/legal/refund` should all return 200 and render the footer with the
   custom-domain email link.
7. Submit the URL to Stripe activation.

## Adding the rest later

When you're ready to enable auth and billing in production:

1. Create a hosted Supabase production project. Follow the "Hosted Supabase
   (staging/prod)" section in [SETUP.md](../SETUP.md#hosted-supabase-stagingprod).
2. In Supabase Auth → URL Config, set Site URL to your production origin and
   add `https://<domain>/auth/callback` as a redirect URL.
3. In Vercel **Production** env, set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `ANTHROPIC_API_KEY`
   - `STRIPE_SECRET_KEY` (live key, once Stripe is activated)
   - `STRIPE_WEBHOOK_SECRET` (production webhook signing secret)
   - `NEXT_PUBLIC_STRIPE_PRICE_SOLO`, `NEXT_PUBLIC_STRIPE_PRICE_TEAM`
4. In the Stripe Dashboard, register the production webhook endpoint
   `https://<domain>/api/stripe/webhook` and copy its signing secret into
   `STRIPE_WEBHOOK_SECRET`.
5. Redeploy. Run the smoke test from
   [docs/architecture.md](./architecture.md#smoke-test) against the live site.

## Preview deploys

Preview deploys (one per PR branch) need their own staging Supabase project.
Don't point preview deploys at the production database — use a separate
hosted project with the same migrations. Set the Supabase env vars in
Vercel's **Preview** environment (separate from Production).

Anthropic test keys are cheap, so the same key can be reused across local
and preview. Stripe should stay in test mode for preview environments with a
separate webhook (forwarded via `stripe listen` to a tunnel, or registered
against the preview URL).
