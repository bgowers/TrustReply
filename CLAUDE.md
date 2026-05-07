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

The frontend is split into two surfaces with deliberately different motion budgets:

- **Marketing** (`/`, `/legal/*`, `/login`): editorial, motion-rich, anchored by
  three deep-navy "ink" bands (hero, security/credibility, final CTA) against an
  otherwise light surface. Aurora gradient mesh + subtle film noise + decorative grid
  on dark moments only. Smooth scroll site-wide via Lenis. Scroll-driven entrances
  (fade + parallax), magnetic CTA buttons, scroll-pinned how-it-works, hover-tilt
  pricing cards. Every motion respects `prefers-reduced-motion`.
- **App** (`/app/*`): Linear-fast and dense. Native scroll, no Lenis. Transitions
  150–220ms, never longer. CSS keyframes + Radix data-state animations only — no
  Motion/framer-motion bundle inside `/app/*`.

**Palette tokens** live in `app/globals.css` under `@theme`. Existing slate/zinc
neutrals + indigo accent are preserved for back-compat. Added: `--color-ink*` for
dark bands, `--aurora-1..4` for the gradient stops, `--surface-glass[-dark]` and
`--surface-elev-{1,2,3}` for layered surfaces. Use these — do not hand-roll new
gradients per-component.

**Type**: Geist Sans + Geist Mono via `next/font` (loaded once in `app/layout.tsx`).
Marketing uses an editorial scale exposed as `.t-display`, `.t-h1`, `.t-h2`, `.t-h3`,
`.t-lead`. Mono eyebrow (`12/16` uppercase tracked at `0.16em`) lives on `.eyebrow`.
No more "no custom fonts" rule.

**Components**: `components/ui/*` upgraded but API-compatible — every existing
caller still works. Marketing primitives live under `components/marketing/*` and
motion primitives under `components/motion/*` (`SmoothScrollProvider`, `FadeIn`,
`Parallax`, `Reveal`, `Magnetic`, `Tilt`, `Marquee`, `ScrollProgress`).

**Accessibility**: WCAG 2.1 AA contrast still holds. Never communicate state with
color alone — always pair with text or icon. Keyboard navigable; visible focus.
Aurora and animated decoration are `aria-hidden` and `pointer-events: none`.

**Motion**: gradients and animation are now intentional, but always anchored to a
security-product reading. No candy-colored hero soup, no chaotic interleaved
parallax. Three rules: (1) every animation honors `prefers-reduced-motion`,
typically by routing through `motion/react`'s `useReducedMotion()` or the global
CSS rule that nullifies durations; (2) marketing motion is expressive; app motion
is fast and snappy; (3) one well-orchestrated moment beats many noisy ones.

**Copy tone**: calm, technical, specific. Say "Generates draft answers from your
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
