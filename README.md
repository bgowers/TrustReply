# TrustReply

AI security-questionnaire auto-responder for B2B SaaS startups. Upload a SIG, CAIQ,
or custom Excel questionnaire, point it at your policy library, and get cited draft
answers in minutes instead of days.

Start here:

- [`CLAUDE.md`](./CLAUDE.md) — entry doc for humans and Claude sessions
- [`spec.md`](./spec.md) — product spec, ICP, pricing, scope
- [`SETUP.md`](./SETUP.md) — local setup walkthrough (Supabase, Stripe, Anthropic)
- [`docs/architecture.md`](./docs/architecture.md) — stack, data model, AI design
- [`docs/project_status.md`](./docs/project_status.md) — what's done and what's next

## Quickstart

```sh
pnpm install
cp .env.example .env.local   # then fill in values per SETUP.md
pnpm dev
```
