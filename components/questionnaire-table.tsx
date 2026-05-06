"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Citation {
  id: number;
  title: string;
  category: string;
}

interface Question {
  id: number;
  row_index: number;
  question_text: string;
  draft_answer: string | null;
  final_answer: string | null;
  citations: Citation[] | null;
  confidence: "high" | "medium" | "low" | null;
  needs_review_reason: string | null;
  status: "pending" | "drafted" | "approved";
}

interface Questionnaire {
  id: number;
  name: string;
  status: "pending" | "drafting" | "complete";
  total_rows: number;
  question_column: string;
  source_format: "csv" | "xlsx";
}

const STATUS_LABEL: Record<Questionnaire["status"], string> = {
  pending: "Not started",
  drafting: "Drafting…",
  complete: "Complete",
};

const CONFIDENCE_LABEL: Record<NonNullable<Question["confidence"]>, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function QuestionnaireTable({
  questionnaire,
  questions: initial,
  autoStart,
}: {
  questionnaire: Questionnaire;
  questions: Question[];
  autoStart: boolean;
}) {
  const [questions, setQuestions] = useState<Question[]>(initial);
  const [status, setStatus] = useState<Questionnaire["status"]>(questionnaire.status);
  const [drafting, setDrafting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: questionnaire.total_rows });
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const updateRow = (row_index: number, patch: Partial<Question>) =>
    setQuestions((rows) => rows.map((r) => (r.row_index === row_index ? { ...r, ...patch } : r)));

  async function startDraft() {
    if (drafting) return;
    setDrafting(true);
    setError(null);
    setStatus("drafting");

    const resp = await fetch(`/api/questionnaires/${questionnaire.id}/draft`);
    if (!resp.ok || !resp.body) {
      setError(`Draft failed: ${resp.status}`);
      setDrafting(false);
      return;
    }
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) >= 0) {
        const chunk = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const lines = chunk.split("\n");
        let event = "message";
        let dataLine = "";
        for (const ln of lines) {
          if (ln.startsWith("event:")) event = ln.slice(6).trim();
          else if (ln.startsWith("data:")) dataLine += ln.slice(5).trim();
        }
        if (!dataLine) continue;
        let payload: unknown = null;
        try {
          payload = JSON.parse(dataLine);
        } catch {
          continue;
        }
        if (event === "start") {
          const p = payload as { total: number };
          setProgress({ done: 0, total: p.total });
        } else if (event === "row") {
          const p = payload as {
            row_index: number;
            draft_answer: string;
            citations: Citation[];
            confidence: Question["confidence"];
            needs_review_reason?: string;
          };
          updateRow(p.row_index, {
            draft_answer: p.draft_answer,
            citations: p.citations,
            confidence: p.confidence,
            needs_review_reason: p.needs_review_reason ?? null,
            status: "drafted",
          });
          setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
        } else if (event === "done") {
          setStatus("complete");
        } else if (event === "error") {
          const p = payload as { message: string };
          setError(p.message);
        }
      }
    }
    setDrafting(false);
  }

  useEffect(() => {
    if (autoStart && !startedRef.current) {
      startedRef.current = true;
      void startDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  async function patchRow(q: Question, patch: { final_answer?: string; status?: Question["status"] }) {
    updateRow(q.row_index, patch);
    await fetch(`/api/questionnaires/${questionnaire.id}/questions/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function approveAllHighConfidence() {
    const targets = questions.filter((q) => q.confidence === "high" && q.status !== "approved");
    await Promise.all(targets.map((q) => patchRow(q, { status: "approved" })));
  }

  const exportUrl = `/api/questionnaires/${questionnaire.id}/export?format=${questionnaire.source_format}`;
  const draftedCount = useMemo(() => questions.filter((q) => q.status !== "pending").length, [questions]);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{questionnaire.name}</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            {questionnaire.total_rows} rows · {STATUS_LABEL[status]}
            {drafting ? ` · ${progress.done}/${progress.total} drafted` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {status !== "complete" && (
            <Button onClick={startDraft} disabled={drafting}>
              {drafting ? "Drafting…" : draftedCount > 0 ? "Continue drafting" : "Start drafting"}
            </Button>
          )}
          <Button variant="secondary" onClick={approveAllHighConfidence} disabled={drafting}>
            Approve all high-confidence
          </Button>
          <a href={exportUrl}>
            <Button variant="secondary">Export {questionnaire.source_format.toUpperCase()}</Button>
          </a>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">{error}</div>
      )}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
            <th className="w-10 py-2">#</th>
            <th className="py-2 pr-4">Question</th>
            <th className="py-2 pr-4">Answer</th>
            <th className="w-32 py-2">Confidence</th>
            <th className="w-32 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <Row key={q.id} q={q} onPatch={patchRow} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ q, onPatch }: { q: Question; onPatch: (q: Question, patch: { final_answer?: string; status?: Question["status"] }) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(q.final_answer ?? q.draft_answer ?? "");

  const answer = q.final_answer ?? q.draft_answer ?? "";
  const confidenceClass =
    q.confidence === "high"
      ? "text-emerald-700 bg-emerald-50"
      : q.confidence === "medium"
        ? "text-amber-700 bg-amber-50"
        : q.confidence === "low"
          ? "text-red-700 bg-red-50"
          : "text-slate-500 bg-slate-50";

  return (
    <tr className="border-b align-top">
      <td className="py-3 text-xs text-[color:var(--color-muted)]">{q.row_index + 1}</td>
      <td className="py-3 pr-4 text-sm">
        <p className="whitespace-pre-wrap">{q.question_text}</p>
        {q.citations && q.citations.length > 0 && (
          <p className="mt-2 text-xs text-[color:var(--color-muted)]">
            Cites:{" "}
            {q.citations.map((c) => (
              <span key={c.id} className="mr-2 rounded bg-slate-100 px-1.5 py-0.5">
                {c.category}: {c.title}
              </span>
            ))}
          </p>
        )}
        {q.needs_review_reason && (
          <p className="mt-2 text-xs text-amber-800">⚠ {q.needs_review_reason}</p>
        )}
      </td>
      <td className="py-3 pr-4">
        {editing ? (
          <div className="space-y-2">
            <Textarea rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setDraft(q.final_answer ?? q.draft_answer ?? "");
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onPatch(q, { final_answer: draft });
                  setEditing(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="whitespace-pre-wrap text-sm">{answer || <span className="text-[color:var(--color-muted)]">No answer yet</span>}</p>
            {answer && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-xs text-[color:var(--color-accent)] underline"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </td>
      <td className="py-3">
        <span className={`rounded-full px-2 py-0.5 text-xs ${confidenceClass}`}>
          {q.confidence ? CONFIDENCE_LABEL[q.confidence] : "—"}
        </span>
      </td>
      <td className="py-3">
        {q.status === "approved" ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">Approved</span>
        ) : q.status === "drafted" ? (
          <Button size="sm" variant="secondary" onClick={() => onPatch(q, { status: "approved" })}>
            Approve
          </Button>
        ) : (
          <span className="text-xs text-[color:var(--color-muted)]">Pending</span>
        )}
      </td>
    </tr>
  );
}
