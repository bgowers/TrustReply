# TrustReply

TrustReply is an AI security-questionnaire auto-responder for B2B SaaS startups.
Upload a SIG/CAIQ/custom Excel questionnaire, point it at your policy library, and
get cited draft answers in minutes instead of days.

- Spec: @spec.md
- Architecture: @docs/architecture.md
- Status & milestones: @docs/project_status.md
- Changelog: @docs/changelog.md
- Feature docs: @docs/features/README.md
- Deploy walkthrough: @docs/deploy.md

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
supabase/            Local stack config + schema migrations (applied via supabase CLI)
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
- Server actions and route handlers only — never expose `SUPABASE_SECRET_KEY`
  (`sb_secret_…`) to the browser. Only `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  (`sb_publishable_…`) is safe client-side.
- All Supabase access goes through `lib/supabase/server.ts` (server) or
  `lib/supabase/client.ts` (browser). Never bypass.
- Anthropic calls always use **prompt caching** on the policy block (`cache_control:
  { type: "ephemeral" }`).
- **Stripe webhook signature verification is mandatory.** Reject any unsigned event.
- **RLS is the primary authz boundary**, not API code. Every table has owner-only
  policies; the Supabase secret key is reserved for webhook handlers and server-only
  flows.
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
pnpm dev          # boots local Supabase stack, then next dev on :3000
pnpm dev:app      # next dev only (skip supabase start — assumes DB is up)
pnpm build        # production build
pnpm start        # production server (against hosted Supabase)
pnpm db:start     # boot local Supabase stack
pnpm db:stop      # stop local Supabase stack
pnpm db:reset     # wipe local DB and re-apply migrations + seed
pnpm db:status    # print local Supabase URL/keys
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
pnpm format       # prettier --write .
```

`pnpm dev` requires Docker to be running. `supabase start` is idempotent — when
the stack is already up it returns in ~2s. Containers persist between sessions
on purpose; restart speed > clean shutdown.

External dev tools (run outside pnpm):
- `stripe listen --forward-to localhost:3000/api/stripe/webhook` — webhook
  forwarding. Run in a second terminal; copy the printed signing secret into
  `STRIPE_WEBHOOK_SECRET` once.
- `supabase db push` — apply local migrations to a linked hosted project.

## 6. Working on this project

For humans or agents picking this up:

### Before you start

1. Read `spec.md` first, then `docs/architecture.md`.
2. Skim `docs/project_status.md` to see what's done vs. todo.
3. Run the smoke test in `docs/architecture.md` before changing anything.

### Definition of done

A change isn't done until **all** of the following are true. Do them in order;
don't skip steps to save time.

1. **Code passes static checks.** `pnpm typecheck && pnpm lint && pnpm test`
   all green. CI runs the same on every PR — keep it green locally first.
2. **UI changes are validated in a real browser.** Type checks and unit tests
   verify code correctness, not feature correctness. For anything that touches
   `app/**/*.tsx`, `components/**`, CSS, or layouts:
   - Boot the dev server (`pnpm dev`, or `pnpm dev:app` if Supabase is already
     up).
   - Drive the affected route(s) using the Playwright MCP browser tools
     (`browser_navigate`, `browser_click`, `browser_fill_form`,
     `browser_snapshot`, `browser_console_messages`). Exercise the golden path
     plus at least one edge case.
   - If the page can't be reached locally (auth wall, missing env vars, etc.),
     say so explicitly rather than skipping validation silently.
3. **Docs are updated alongside the code, in the same change.** Doc updates
   are part of the work, not a separate cleanup pass:
   - Every user-visible or developer-visible change → one bullet in
     `docs/changelog.md` under `## Unreleased`.
   - New feature → a doc in `docs/features/<name>.md`, linked from
     `docs/features/README.md`.
   - Existing feature changed → update the relevant `docs/features/*.md`.
   - Architectural shift (data model, request flow, security boundary) →
     update `docs/architecture.md`.
   - Operational shift (env vars, deploy steps, smoke test) → update
     `docs/deploy.md` or `SETUP.md`.
   - Workflow / etiquette shift → update this file (`CLAUDE.md`).
   - Milestone or follow-up resolved → update `docs/project_status.md`.
4. **Summarize what changed and what was validated.** When reporting done,
   state the validation that actually happened (e.g. "loaded
   `/app/billing` in a browser, clicked Upgrade to Solo, saw the Stripe
   redirect"), not just "typecheck passes".

If a step doesn't apply (e.g. a server-only refactor with no UI surface, no
docs implication), state that explicitly rather than silently skipping.
