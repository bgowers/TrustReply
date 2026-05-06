# Marketing & Legal

The public-facing surface that anyone can hit without signing in: landing page,
pricing, and legal pages. Lives under the `app/(marketing)/` route group.

## Layout

```
app/(marketing)/
  layout.tsx              # SiteHeader + <main> + SiteFooter wrapper
  page.tsx                # /  (hero, how-it-works, pricing)
  legal/
    terms/page.tsx        # /legal/terms
    privacy/page.tsx      # /legal/privacy
    refund/page.tsx       # /legal/refund
```

The `(marketing)` route-group folder doesn't appear in the URL — it just scopes
the layout to these pages so the dashboard (`/app/*`) and `/login` stay
unaffected.

All four pages are server components and prerender as static content
(`pnpm build` shows them as `○`).

## Shared chrome

- `components/site-header.tsx` — top nav. Anchor links use `/#how` and
  `/#pricing` so they work from `/legal/*` too.
- `components/site-footer.tsx` — copyright, contact mailto, legal links.

Both consume `lib/site.ts`, which is the single source of truth for:

- `name` — display name
- `domain` — the registered domain
- `contactEmail` — shown in the footer and every legal page
- `legalEntity`, `shortLegalEntity`, `jurisdiction` — used in the Terms and
  Privacy
- `legalLastUpdated` — stamped at the top of every legal page

To change the contact email, jurisdiction, or update date, edit `lib/site.ts`
and ship — no other files need to change.

## Legal content

The three legal pages are plain-English templates, not legal advice. They
cover what Stripe (and most B2B prospects) expect to see:

- **Terms**: who we are, account, acceptable use, IP ownership of customer
  content, AI disclaimer, subscription terms, warranty disclaimer, liability
  cap (= 12 months of fees), governing law (England & Wales).
- **Privacy**: data collected, subprocessors (Supabase / Anthropic / Stripe /
  Vercel / Resend), retention, security, UK GDPR rights, ICO complaint route.
- **Refund**: monthly billing in advance, cancel anytime via Customer Portal,
  no prorated refunds for partial months, billing-error exception.

If you change pricing tiers or subprocessors, update the relevant legal page
**and** bump `SITE.legalLastUpdated`.

## Design

Reuses the design tokens in `app/globals.css` (`--color-fg`, `--color-muted`,
`--color-accent`, `--color-card`, `--color-border`). No `@tailwindcss/typography`
plugin — legal pages use ad-hoc Tailwind classes for prose (max-width
`max-w-3xl`, `text-sm leading-relaxed`, muted body copy).
