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
exceeded, return `402 Payment Required` with `{ upgrade_url }`. UI shows an upgrade
modal that opens Checkout.

## Local dev

```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use test card `4242 4242 4242 4242`, any future date, any CVC.
