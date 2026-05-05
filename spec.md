# TrustReply — Product Spec

## What we're building

A focused web app that drafts answers to enterprise security questionnaires from a
team's policy library, using Claude with prompt caching for fast, cheap, cited output.

## Problem

B2B SaaS companies routinely receive 200–1000 row security questionnaires (SIG, CAIQ,
custom Excel) when selling into enterprise. Filling one takes 10–40 hours of
engineering or security-leader time. Deals stall while questionnaires sit in queue.

## Ideal customer profile

- B2B SaaS startup, seed–Series B (10–150 employees)
- Selling into mid-market or enterprise
- Has at least an informal policy library (Notion pages, Google Doc, internal wiki)
- No dedicated GRC team yet — a founder, head-of-security, or staff engineer fills
  questionnaires today

## Core value prop

> Upload a questionnaire CSV/XLSX. Get cited draft answers in 5 minutes. Edit, approve,
> export back to the original layout.

## In scope (v1)

- Magic-link sign-up
- Policy library: text snippets organized by category
- Questionnaire upload (CSV, XLSX) with auto-detected question column
- AI-drafted answers with citations + confidence label
- Per-row review/edit/approve UI
- Export to original CSV/XLSX layout
- Free, Solo ($99/mo), Team ($399/mo) plans via Stripe Checkout + Customer Portal

## Out of scope (v1)

- PDF questionnaire parsing
- Multi-user team collaboration (single owner per account)
- Public-facing Trust Center
- Vector embeddings (full policies fit in a cached prompt)
- SOC2/ISO evidence collection (we're not Vanta)

## Pricing

| Plan  | Price     | Limits                                                  |
| ----- | --------- | ------------------------------------------------------- |
| Free  | $0        | 1 questionnaire, ≤25 rows, watermarked export           |
| Solo  | $99/mo    | Unlimited questionnaires, ≤200 rows each, no watermark  |
| Team  | $399/mo   | Unlimited rows, priority queue, custom branding         |

## Non-goals

We are not building a compliance platform. We are not building a knowledge base
product. We are building one thing well: turning a questionnaire file plus a policy
library into a filled questionnaire file.
