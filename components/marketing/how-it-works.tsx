"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { CheckCircle2, FileSpreadsheet, BookOpen } from "lucide-react";

const STEPS = [
  {
    eyebrow: "01",
    title: "Add your policies",
    body: "Drop in short snippets organized by category — encryption, access control, BCDR. We index them once.",
    icon: BookOpen,
  },
  {
    eyebrow: "02",
    title: "Upload the questionnaire",
    body: "CSV or XLSX. We auto-detect the question column. No reformatting needed.",
    icon: FileSpreadsheet,
  },
  {
    eyebrow: "03",
    title: "Review and export",
    body: "Cited drafts arrive in a review table. Edit, approve, export back to the original layout.",
    icon: CheckCircle2,
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Three frames cross-fade across the scroll range. Frame i is fully visible
  // around scrollProgress ≈ (i + 1) / 4.
  const frame0Op = useTransform(
    scrollYProgress,
    [0.05, 0.2, 0.36, 0.46],
    [0, 1, 1, 0],
  );
  const frame1Op = useTransform(
    scrollYProgress,
    [0.36, 0.5, 0.62, 0.72],
    [0, 1, 1, 0],
  );
  const frame2Op = useTransform(
    scrollYProgress,
    [0.62, 0.74, 0.94, 1],
    [0, 1, 1, 1],
  );

  return (
    <section
      id="how"
      ref={containerRef}
      className="relative bg-[color:var(--color-bg)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <p className="eyebrow text-[color:var(--color-muted)]">02 · How it works</p>
        <h2 className="mt-6 t-h1 max-w-2xl tracking-tight">
          Three steps from spreadsheet to signed-off answers.
        </h2>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 lg:grid-cols-12 lg:gap-16">
        {/* Sticky visual */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-[var(--surface-elev-2)]">
              {/* Frame 0 — CSV row */}
              {reduced ? (
                <Frame0 />
              ) : (
                <motion.div
                  style={{ opacity: frame0Op }}
                  className="absolute inset-0"
                >
                  <Frame0 />
                </motion.div>
              )}
              {/* Frame 1 — policy snippet */}
              {reduced ? null : (
                <motion.div
                  style={{ opacity: frame1Op }}
                  className="absolute inset-0"
                >
                  <Frame1 />
                </motion.div>
              )}
              {/* Frame 2 — cited answer */}
              {reduced ? null : (
                <motion.div
                  style={{ opacity: frame2Op }}
                  className="absolute inset-0"
                >
                  <Frame2 />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Steps copy — three blocks tall enough to drive the sticky */}
        <div className="lg:col-span-7">
          <div className="space-y-32 lg:space-y-[80vh] lg:py-[20vh]">
            {STEPS.map((step) => (
              <div key={step.eyebrow} className="max-w-md">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-white text-[color:var(--color-accent)] shadow-[var(--surface-elev-1)]">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="eyebrow text-[color:var(--color-subtle)]">{step.eyebrow}</p>
                <h3 className="mt-2 t-h2 tracking-tight">{step.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-[color:var(--color-muted)]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Frame0() {
  return (
    <div className="absolute inset-0 flex flex-col p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-subtle)]">
        sig-q3.csv
      </p>
      <div className="mt-4 flex-1 overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white shadow-[var(--surface-elev-1)]">
        <div className="grid grid-cols-[28px_1fr] gap-3 border-b border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-subtle)]">
          <span>#</span>
          <span>Question</span>
        </div>
        {[
          "Do you encrypt data at rest?",
          "Describe your incident response process.",
          "How do you handle subprocessors?",
          "What are your password requirements?",
          "How is access provisioned?",
        ].map((q, i) => (
          <div
            key={i}
            className="grid grid-cols-[28px_1fr] gap-3 border-b border-[color:var(--color-border)] px-3 py-2.5 text-[12px]"
          >
            <span className="font-mono text-[10px] text-[color:var(--color-subtle)] nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[color:var(--color-fg)]">{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute inset-0 flex flex-col p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-subtle)]">
        Policy library · Encryption · 3.2
      </p>
      <div className="mt-4 flex-1 rounded-lg border border-[color:var(--color-border)] bg-white p-5 shadow-[var(--surface-elev-1)]">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-accent)]/8 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[color:var(--color-accent)]">
          <span className="h-1 w-1 rounded-full bg-[color:var(--color-accent)]" />
          Encryption
        </div>
        <h4 className="mt-3 text-[15px] font-semibold tracking-tight">
          Encryption at rest and in transit
        </h4>
        <p className="mt-3 text-[12.5px] leading-relaxed text-[color:var(--color-muted)]">
          All customer data at rest is encrypted with AES-256. All data in transit is
          encrypted with TLS 1.3. Encryption keys are managed via AWS KMS and rotated
          quarterly. Backups are encrypted with the same key class.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["Access Control", "BCDR", "Vendor Mgmt"].map((cat) => (
            <div
              key={cat}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-2 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[color:var(--color-subtle)]"
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute inset-0 flex flex-col p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-subtle)]">
        sig-q3 · drafted
      </p>
      <div className="mt-4 flex-1 rounded-lg border border-[color:var(--color-border)] bg-white shadow-[var(--surface-elev-1)]">
        <div className="border-b border-[color:var(--color-border)] px-4 py-3">
          <p className="text-[11px] text-[color:var(--color-subtle)]">Question 01</p>
          <p className="mt-1 text-[12.5px] text-[color:var(--color-fg)]">
            Do you encrypt customer data at rest?
          </p>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              <CheckCircle2 className="h-3 w-3" />
              High confidence
            </span>
            <span className="font-mono text-[10px] text-[color:var(--color-subtle)]">
              ~ 1.8s
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--color-fg)]">
            Yes. All customer data at rest is encrypted with AES-256, with TLS 1.3 in
            transit. Encryption keys are managed via AWS KMS and rotated quarterly.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-[color:var(--color-card)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--color-muted)] ring-1 ring-inset ring-[color:var(--color-border)]">
              <span className="h-1 w-1 rounded-full bg-[color:var(--color-accent)]" />
              Encryption · 3.2
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[color:var(--color-card)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--color-muted)] ring-1 ring-inset ring-[color:var(--color-border)]">
              <span className="h-1 w-1 rounded-full bg-[color:var(--color-accent)]" />
              Vendor Mgmt · 2.1
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-[color:var(--color-border)] px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-subtle)]">
            Draft → Approve
          </span>
          <button className="inline-flex h-7 items-center gap-1 rounded-md bg-[color:var(--color-accent)] px-2.5 text-[11px] font-medium text-white">
            <CheckCircle2 className="h-3 w-3" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
