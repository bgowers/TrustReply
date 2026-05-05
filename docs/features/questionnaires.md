# Questionnaires

Upload → parse → draft → review → export.

## Model

- `questionnaires(id, user_id, name, source_filename, question_column, total_rows,
  status, created_at)`
- `questions(id, questionnaire_id, row_index, question_text, draft_answer,
  final_answer, citations, confidence, status)`

## Upload (`POST /api/questionnaires`)

Accepts CSV or XLSX (≤10 MB). Server:

1. Detects format by file extension + mime sniff.
2. Parses with `papaparse` or `xlsx`.
3. Auto-detects the question column: longest mean string length among columns where
   ≥80% of cells are non-empty and average length ≥20 chars.
4. Inserts `questionnaires` + one `questions` row per data row.

Plan limits enforced here:

- Free: 1 total questionnaire, ≤25 rows.
- Solo: unlimited questionnaires, ≤200 rows each.
- Team: unlimited.

## Draft (`GET /api/questionnaires/[id]/draft`)

Server-Sent Events stream. Server:

1. Loads all of the user's policies.
2. Builds the cached prompt blocks (system + policy library) once.
3. Iterates `questions` in batches of 5 with `Promise.all`.
4. For each completed question: persist `draft_answer`, `citations`, `confidence`,
   then emit `{ row_index, draft_answer, citations, confidence }` as SSE.
5. After the final batch: flips `questionnaires.status` to `complete`, emits
   `{ done: true }`.

## Review

Inline edit `final_answer` per row via `PATCH
/api/questionnaires/[id]/questions/[rowId]`. Approving a row sets
`status = 'approved'`. "Approve all high-confidence" bulk action available.

## Export (`GET /api/questionnaires/[id]/export?format=xlsx`)

Reconstructs the original column layout, fills the answer column with
`final_answer ?? draft_answer`, returns a streamed file download. Free-plan exports
include a "Drafted with TrustReply" watermark cell.
