# Project Status

Updated as milestones complete. Status: `todo` | `in progress` | `done` | `deferred`.

## v1 MVP

| #   | Item                                                                  | Status |
| --- | --------------------------------------------------------------------- | ------ |
| 1   | Resolve & pin latest stable dep versions                              | done   |
| 2   | Scaffold Next.js + TS + Tailwind                                      | done   |
| 3   | Write CLAUDE.md + spec.md + docs/ skeleton                            | done   |
| 4   | Supabase auth (magic link) + protected `/app` routes                  | done   |
| 5   | Policy Library CRUD + UI                                              | done   |
| 6   | Questionnaire upload + CSV/XLSX parser + question column auto-detect  | done   |
| 7   | Anthropic wrapper with prompt caching + SSE draft endpoint            | done   |
| 8   | Review table UI with inline edit, approve, citations                  | done   |
| 9   | Export endpoint preserving original layout                            | done   |
| 10  | Stripe: plans, checkout, webhook, customer portal, paywall            | done   |
| 11  | Landing page with pricing                                             | done   |
| 12  | `samples/sample-sig-25.csv` + `SETUP.md` + `.env.example`             | done   |
| 13  | Local typecheck/lint/build green                                      | done   |
| 14  | Vitest unit tests for parsers + exporters; CI workflow                | done   |
| 15  | End-to-end smoke against real Supabase/Anthropic/Stripe (manual)      | todo   |
| 16  | First deploy to Vercel (landing + legal pages, pre-launch)            | in progress |
| 17  | Footer + Terms / Privacy / Refund pages for Stripe activation         | done   |

## Known follow-ups

- Surface a paywall *modal* on upload rather than the inline callout (the
  callout now links to `/app/billing`, but a modal would feel more direct).
- Add backfill for `current_period_end` on `customer.subscription.created`
  (today we rely on `checkout.session.completed`).
- Replace seeded "Replace me" example policies on first edit so the user clears
  them with one click.

## Deferred (post-v1)

- PDF questionnaire parsing
- Multi-user team collaboration
- Vector-store policy retrieval (only needed if libraries grow >100 KB)
- Public Trust Center pages
- Slack/email integration for "questionnaire received" workflows
- Bump ESLint to 10.x once `eslint-plugin-react` ships a compatible release
