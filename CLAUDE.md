# TrustReply

TrustReply is an AI security-questionnaire auto-responder for B2B SaaS startups.
Upload a SIG/CAIQ/custom Excel questionnaire, point it at your policy library, and
get cited draft answers in minutes instead of days.

- Spec: @spec.md
- Architecture: @docs/architecture.md
- Status & milestones: @docs/project_status.md
- Changelog: @docs/changelog.md
- Feature docs: @docs/features/README.md

---

## 1. Project structure

```
app/                 Next.js App Router — pages and route handlers
  api/               Server route handlers (questionnaires, policies, stripe)
  app/               Authenticated dashboard (policies, questionnaires/[id])
  login/             Magic-link sign-in
  page.tsx           Public landing page + pricing
components/          Reusable UI (table, dropzone, pricing table, etc.)
lib/                 Server/client helpers (supabase, anthropic, stripe, parsers)
db/                  schema.sql — Postgres schema + RLS policies for Supabase
docs/                Architecture, status, changelog, per-feature docs
samples/             Demo input data (sample-sig-25.csv)
spec.md              Product spec (ICP, pricing, scope, non-goals)
SETUP.md             One-time external setup walkthrough (Supabase, Stripe, Anthropic)
```

## 2. Design and UX

- **Palette**: neutral, serious. Slate/zinc grays, single accent (indigo-600). No
  gradients, neon, or playful illustrations — this is a security product sold to
  security buyers.
- **Type**: system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", ...`).
  No custom web fonts in v1.
- **Components**: hand-rolled minimal components in `components/ui/` styled with
  Tailwind v4 + `class-variance-authority`. Accessible by default (focus rings always
  visible; semantic HTML; labelled inputs).
- **Accessibility**: WCAG 2.1 AA contrast minimum. Never communicate state with color
  alone (always pair with text or icon). Keyboard navigable; visible focus.
- **Motion**: minimal. No animated heroes, no parallax. Honor
  `prefers-reduced-motion`.
- **Copy tone**: calm, technical, specific. Say "Generates draft answers from your
  policies", not "Supercharge your security workflows!". No exclamation marks in app
  surfaces.

## 3. Constraints

- Node **active LTS** (currently 22). pnpm only — no npm/yarn lockfiles.
- TypeScript **strict** mode. No `any`. Prefer `unknown` + zod parsing at boundaries.
- Server actions and route handlers only — no client-side service-role keys ever.
- All Supabase access goes through `lib/supabase/server.ts` (server) or
  `lib/supabase/client.ts` (browser). Never bypass.
- Anthropic calls always use **prompt caching** on the policy block (`cache_control:
  { type: "ephemeral" }`).
- **Stripe webhook signature verification is mandatory.** Reject any unsigned event.
- **RLS is the primary authz boundary**, not API code. Every table has owner-only
  policies; service-role key is reserved for webhook handlers and server-only flows.
- Dependencies pin to exact versions on initial install (no `^`). Bump deliberately
  with a `docs/changelog.md` entry.

## 4. Repo etiquette

- Branches: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`. Long-running work branches
  carry a date prefix when needed.
- Commit subjects: conventional (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
  Imperative mood, ≤72 chars.
- PRs: squash-merged. Update `docs/changelog.md` in the same PR as the change.
- Never commit `.env*` (only `.env.example`). Never bypass git hooks
  (`--no-verify` is forbidden unless asked).
- Never push directly to `main`.

## 5. Commands

```
pnpm dev          # local dev server on :3000
pnpm build        # production build
pnpm start        # production server
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
pnpm format       # prettier --write .
```

External dev tools (run outside pnpm):
- `stripe listen --forward-to localhost:3000/api/stripe/webhook` — webhook forwarding
- Apply Postgres schema: paste `db/schema.sql` into Supabase SQL editor (or use
  the Supabase CLI: `supabase db push`).

## 6. Working on this project

For humans or agents picking this up:

1. Read `spec.md` first, then `docs/architecture.md`.
2. Skim `docs/project_status.md` to see what's done vs. todo.
3. Run the smoke test in `docs/architecture.md` before changing anything.
4. When finishing a milestone, update `docs/project_status.md`.
5. Every user-visible change gets a one-line entry in `docs/changelog.md`.
6. New features get a doc in `docs/features/<name>.md` linked from
   `docs/features/README.md`.
