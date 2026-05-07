# Marketing & Legal

The public-facing surface that anyone can hit without signing in: landing page,
legal pages, and the login screen. Lives under `app/(marketing)/` and `app/login/`.

## Layout

```
app/(marketing)/
  layout.tsx              # SmoothScrollProvider + SiteHeader + <main> + SiteFooter
  page.tsx                # /  — composes 8 marketing sections
  legal/
    terms/page.tsx        # /legal/terms (uses LegalShell + drop cap)
    privacy/page.tsx      # /legal/privacy (uses LegalShell)
    refund/page.tsx       # /legal/refund  (uses LegalShell)
app/login/
  page.tsx                # ink/aurora backdrop + animated state transitions
```

The `(marketing)` route group is invisible in the URL — it scopes the layout to
these pages so `/app/*` (the authenticated dashboard) is unaffected. The
authenticated app does **not** mount the smooth-scroll provider.

`/`, `/legal/*` are server components and prerender as static content (`pnpm
build` shows them as `○`). `/login` is a client component because it owns
form state.

## Sections (landing page)

Composed in `app/(marketing)/page.tsx` from `components/marketing/*`:

1. `<HeroSection />` — dark ink band with aurora mesh, parallaxed
   `<LiveQuestionnaire />` ticker on the right, magnetic "Start free" CTA.
2. `<SocialProof />` — narrow band with a CSS-marquee of placeholder logos.
3. `<HowItWorks />` — sticky scroll-pinned visualisation. Three frames
   (`Frame0` CSV → `Frame1` policy → `Frame2` cited answer) cross-fade as
   the right column scrolls past three corresponding step blocks.
4. `<ProductVisual />` — light surface with a real-DOM mock of the
   questionnaire review table inside faux browser chrome. Subtle scanning
   highlight line.
5. `<Pricing />` — 3 cards on `<Tilt>`. Solo highlighted with an animated
   gradient ring + glow.
6. `<SecuritySection />` — second dark band. 6 `<FeatureStat />` tiles.
7. `<FAQ />` — 6 questions in 2 columns, motion-driven accordion.
8. `<FinalCta />` — third dark band. Magnetic "Start free" CTA.

Eyebrow numbers (`01 — 07`) are mono-cased and tracked wide; they tie the
sections together visually.

## Shared chrome

- `components/site-header.tsx` — sticky, scroll-aware. Default state on the
  hero route is transparent over the dark band; once `scrollY > 8` it
  tweens (180 ms) to glass mode (`surface-glass` + navy text + 1px
  hairline). On non-hero routes it starts in glass mode immediately
  (detected via `usePathname()`). Mobile: hamburger → full-viewport overlay
  with stagger-animated nav links.
- `components/site-footer.tsx` — 4-column desktop layout (Brand · Product
  · Resources · Legal). Top hairline is a 1px aurora gradient at 18%
  opacity. Bottom-right shows a breathing emerald dot + "ALL SYSTEMS
  NORMAL".
- `components/marketing/logomark.tsx` — shared SVG mark used in header,
  footer, and login. `currentColor`-driven so it inherits per surface.

`lib/site.ts` is still the single source of truth for `name`, `domain`,
`contactEmail`, `legalEntity`, `jurisdiction`, and `legalLastUpdated`.

## Legal pages

Each legal page wraps content in `<LegalShell>` from
`components/marketing/legal-shell.tsx`. The shell provides:

- A breadcrumb (`Home / Legal / <title>`).
- A 2-column layout on `lg+`: prose left, sticky TOC right
  (`<TocActive>` highlights the section currently in view via
  `IntersectionObserver`).
- A 2px scroll-progress bar at the top of the viewport (`<ScrollProgress>`).
- A drop cap on the first paragraph **only** when `dropCap` is passed
  (Terms only — Privacy and Refund are too short for a drop cap to feel
  earned).

Legal copy itself was preserved verbatim from the previous v0 pages — only
structure and styling changed.

## Login

`app/login/page.tsx` keeps the existing Supabase magic-link auth call but
renders inside a fixed `<AuroraBackground variant="login">` + grid + noise
backdrop. The form lives in a glass-on-ink card (`surface-glass-dark` with
border + heavy elevation). `AnimatePresence mode="wait"` swaps between:

- `idle`/`sending` — form rendered. `sending` toggles the button spinner.
- `sent` — form exits, confirmation block enters with mail icon and
  "Send another" reset button.
- `error` — error message slides in below the button with a small ±2 px X
  shake (omitted under reduced-motion).

The floating label is implemented via Tailwind `peer-focus` /
`peer-[:not(:placeholder-shown)]` on `<Input floating tone="ink">`.

## Design tokens

Marketing surface relies on the extended palette in `app/globals.css`:

- `--color-ink`, `--color-ink-2`, `--color-ink-fg`, `--color-ink-muted`,
  `--color-ink-border` — for dark bands.
- `--aurora-1..4` — gradient stops used by `<AuroraBackground>`,
  `<GradientMesh>`, and the pricing-card glow.
- `--surface-glass`, `--surface-glass-dark` — backdrop-filter glass.
- `--surface-elev-{1,2,3}` — elevation shadow scale.
- `--accent-gradient`, `--accent-gradient-hover` — used by the upgraded
  primary button.

Type scale: `.t-display`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-lead` (responsive
`clamp()` sizes, Geist Sans, balanced via `react-wrap-balancer` where
appropriate). Mono eyebrows: `.eyebrow`.

## Motion

All marketing motion respects `prefers-reduced-motion`:

- `<SmoothScrollProvider>` (Lenis) is disabled in reduced-motion mode and
  falls back to native scroll.
- Each Motion primitive checks `useReducedMotion()` from `motion/react`
  and returns a static element when reduced.
- CSS keyframes (aurora drift, breathing dot, marquee, scan line) are
  neutralised by the global `@media (prefers-reduced-motion: reduce)` rule
  in `globals.css` which sets `animation-duration: 0.001ms !important`.

## Pre-launch deploy

The marketing surface still works as a landing-only deploy: `lib/env.ts`
lazy getters mean a build with no env vars succeeds, and nothing on the
landing or legal pages reads from auth/AI/billing. See `docs/deploy.md`
for the walkthrough.
