import { CheckCircle2, AlertCircle, ArrowDown } from "lucide-react";
import { Parallax } from "@/components/motion/parallax";
import { FadeIn } from "@/components/motion/fade-in";

const SAMPLE_ROWS = [
  {
    id: 1,
    question: "Do you encrypt customer data at rest?",
    answer:
      "Yes. All customer data at rest is encrypted with AES-256, with TLS 1.3 in transit. Encryption keys are managed via AWS KMS and rotated quarterly.",
    confidence: "high" as const,
    citations: ["Encryption · 3.2", "Vendor Mgmt · 2.1"],
  },
  {
    id: 2,
    question: "Describe your incident response process.",
    answer:
      "On-call rotation, P0/P1 paging via PagerDuty, blameless postmortems within 5 business days. Customer-impacting incidents trigger status page updates within 30 minutes.",
    confidence: "high" as const,
    citations: ["Incident Response · 1.1"],
  },
  {
    id: 3,
    question: "How long are backups retained?",
    answer:
      "Daily encrypted backups are retained for 30 days. Monthly backups are retained for 12 months. Backups are tested quarterly via automated restore drills.",
    confidence: "medium" as const,
    citations: ["BCDR · 4.5"],
  },
];

export function ProductVisual() {
  return (
    <section
      id="product"
      className="relative isolate overflow-hidden bg-[color:var(--color-bg)] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-[color:var(--color-muted)]">03 · The review surface</p>
          <h2 className="mt-6 t-h1 tracking-tight">
            Every answer cited. Every cell editable.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[color:var(--color-muted)]">
            Drafts arrive in a familiar review table. Edit inline, approve in bulk, and
            export back to the original spreadsheet shape — no cells out of place.
          </p>
        </div>

        <FadeIn delay={0.15} y={32}>
          <Parallax speed={-0.06}>
            <div className="relative mx-auto mt-16 max-w-5xl">
              {/* Decorative gradient frame */}
              <div
                aria-hidden
                className="absolute -inset-4 rounded-3xl opacity-60 blur-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--aurora-1) 40%, transparent), color-mix(in oklab, var(--aurora-2) 30%, transparent), transparent)",
                }}
              />
              {/* Browser chrome */}
              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-[var(--surface-elev-3)]">
                <div className="flex items-center gap-1.5 border-b border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
                  <span className="ml-4 font-mono text-[10px] tracking-wider text-[color:var(--color-subtle)]">
                    trustreply.co.uk/app/questionnaires/sig-q3
                  </span>
                </div>

                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-6 py-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-subtle)]">
                      Questionnaire
                    </p>
                    <p className="mt-0.5 text-[14px] font-semibold tracking-tight">
                      SIG · Acme Corp · Q3 review
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Drafting complete · 25 / 25
                    </span>
                    <button className="inline-flex h-8 items-center gap-1 rounded-md bg-[color:var(--color-accent)] px-3 text-[12px] font-medium text-white">
                      <ArrowDown className="h-3 w-3" />
                      Export XLSX
                    </button>
                  </div>
                </div>

                {/* Table head */}
                <div className="grid grid-cols-[40px_1fr_1.5fr_120px_120px] gap-x-4 border-b border-[color:var(--color-border)] bg-[color:var(--color-card)] px-6 py-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-subtle)]">
                  <span>#</span>
                  <span>Question</span>
                  <span>Answer</span>
                  <span>Confidence</span>
                  <span>Status</span>
                </div>

                {/* Rows */}
                <div className="relative divide-y divide-[color:var(--color-border)]">
                  {/* Scanning highlight line */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[color:var(--color-accent)] to-transparent opacity-70 [animation:scan-line_6s_ease-in-out_infinite] motion-reduce:hidden"
                  />
                  {SAMPLE_ROWS.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[40px_1fr_1.5fr_120px_120px] items-start gap-x-4 px-6 py-4"
                    >
                      <span className="font-mono text-[11px] text-[color:var(--color-subtle)] nums">
                        {String(row.id).padStart(2, "0")}
                      </span>
                      <p className="text-[13px] leading-snug text-[color:var(--color-fg)]">
                        {row.question}
                      </p>
                      <div>
                        <p className="text-[13px] leading-snug text-[color:var(--color-fg)]">
                          {row.answer}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {row.citations.map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center gap-1 rounded-md bg-[color:var(--color-card)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--color-muted)] ring-1 ring-inset ring-[color:var(--color-border)]"
                            >
                              <span className="h-1 w-1 rounded-full bg-[color:var(--color-accent)]" />
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        {row.confidence === "high" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            High
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                            <AlertCircle className="h-3 w-3" />
                            Medium
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Approved
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Parallax>
        </FadeIn>
      </div>
    </section>
  );
}
