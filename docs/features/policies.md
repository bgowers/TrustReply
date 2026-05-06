# Policies

The policy library is the input that grounds every drafted answer.

## Model

`policies(id, user_id, title, category, body, updated_at)` — RLS owner-only.

## UI

`/app/policies` — list + create + edit. Each policy has:

- **Title** (required, ≤120 chars) — short identifier shown in citations.
- **Category** (required) — one of the seeded categories (Encryption, Access Control,
  BCDR, Vendor Management, Data Handling, Incident Response, Privacy, Network).
  Custom categories allowed.
- **Body** (required) — markdown / plain text. Aim for ≤2 paragraphs per policy;
  multiple narrow policies beat one giant one for citation accuracy.

## Onboarding

First sign-in seeds 8 placeholder policies (one per default category) so the user
sees the structure immediately. They're labelled "Replace me — example" so the user
knows to edit.

## Used by

Every Claude draft call loads all of the user's policies into a single cached
prompt block. Citations reference policies by `id`.
