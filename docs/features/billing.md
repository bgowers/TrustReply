# Billing

Stripe Checkout + Customer Portal. No custom payment UI.

## Plans

| Slug   | Stripe price env var               | Price    |
| ------ | ---------------------------------- | -------- |
| `free` | (none — default)                   | $0       |
| `solo` | `NEXT_PUBLIC_STRIPE_PRICE_SOLO`    | $99 /mo  |
| `team` | `NEXT_PUBLIC_STRIPE_PRICE_TEAM`    | $399 /mo |

Plan limits live in `lib/plans.ts` (single source of truth). Both UI gating and API
enforcement read from there.

## Endpoints

- `POST /api/stripe/checkout` — body `{ plan: "solo" | "team" }`. Server creates
  a Checkout session with `client_reference_id = user.id`, returns `{ url }`.
- `POST /api/stripe/portal` — server creates a Customer Portal session for the
  user's stored `stripe_customer_id`, returns `{ url }`.
- `POST /api/stripe/webhook` — verifies signature with `STRIPE_WEBHOOK_SECRET`.
  Handles:
  - `checkout.session.completed` → set `profiles.plan`,
    `stripe_customer_id`, `stripe_subscription_id`.
  - `customer.subscription.updated` → sync plan + `current_period_end`.
  - `customer.subscription.deleted` → reset to `free`.

## Paywall

`POST /api/questionnaires` and the draft endpoint check `lib/plans.ts` limits. If
exceeded, return `402 Payment Required`. The upload UI shows an inline callout
linking to `/app/billing`, where the user can start Checkout for Solo/Team.

## Billing page

`/app/billing` is the single place inside the dashboard to change subscription
state. It shows the current plan (with renewal date for paid plans), an
**Upgrade to Solo / Team** button that POSTs to `/api/stripe/checkout` and
redirects to the returned Stripe URL, and a **Manage billing** button (visible
once `stripe_customer_id` is set) that opens the Customer Portal. The header
nav and the plan-name badge both link here.

Stripe redirects back to `/app/billing?upgraded=1` on success and
`?canceled=1` on cancel; the page renders a small banner for each.

## Local dev

```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use test card `4242 4242 4242 4242`, any future date, any CVC.
