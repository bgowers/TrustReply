"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FileText, Quote } from "lucide-react";
import { useReducedMotionGuard } from "@/components/motion/use-reduced-motion-guard";

type RowStatus = "drafting" | "cited" | "approved";

type Row = {
  id: number;
  question: string;
  answer: string;
  citation: string;
};

const ROWS: Row[] = [
  {
    id: 1,
    question: "Do you encrypt customer data at rest?",
    answer: "Yes. AES-256 at rest, TLS 1.3 in transit. Keys rotated quarterly via KMS.",
    citation: "Encryption · 3.2",
  },
  {
    id: 2,
    question: "Describe your incident response process.",
    answer: "On-call rotation, P0/P1 paging, blameless postmortems within 5 business days.",
    citation: "Incident Response · 1.1",
  },
  {
    id: 3,
    question: "How do you handle subprocessors?",
    answer: "Public list at trustreply.co.uk/subprocessors. 30-day notice on additions.",
    citation: "Vendor Management · 2.4",
  },
];

const STATUS_CYCLE: RowStatus[] = ["drafting", "cited", "approved"];

const statusStyles: Record<RowStatus, string> = {
  drafting:
    "bg-amber-400/10 text-amber-300 ring-amber-400/30",
  cited: "bg-indigo-400/10 text-indigo-200 ring-indigo-400/30",
  approved: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
};

const statusLabels: Record<RowStatus, string> = {
  drafting: "Drafting",
  cited: "Cited",
  approved: "Approved",
};

const statusIcons: Record<RowStatus, React.ComponentType<{ className?: string }>> = {
  drafting: Quote,
  cited: FileText,
  approved: CheckCircle2,
};

export function LiveQuestionnaire() {
  const reduced = useReducedMotionGuard();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2200);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="relative">
      {/* Outer glow */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.35), transparent 70%)",
        }}
      />
      {/* Glass card */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-1 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
        {/* Faux browser chrome */}
        <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="ml-3 font-mono text-[10px] tracking-wider text-white/40">
            trustreply.co.uk/app/questionnaires/sig-q3
          </span>
        </div>

        {/* Header strip */}
        <div className="flex items-center justify-between border-y border-white/[0.06] px-4 py-2 text-[11px] text-white/60">
          <span className="flex items-center gap-2 font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-[breathe_2s_ease-in-out_infinite] rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Drafting · 25 rows
          </span>
          <span className="font-mono nums">
            <span className="text-white">{Math.min(25, 8 + (tick % 18))}</span>
            <span className="text-white/40"> / 25</span>
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.06]">
          {ROWS.map((row, i) => {
            const status = STATUS_CYCLE[(tick + i) % STATUS_CYCLE.length];
            const Icon = statusIcons[status];
            return (
              <div key={row.id} className="grid grid-cols-[28px_1fr_auto] items-start gap-3 px-4 py-3">
                <span className="mt-0.5 font-mono text-[10px] text-white/30 nums">
                  {String(row.id).padStart(2, "0")}
                </span>
                <div className="space-y-1">
                  <p className="text-[12px] leading-snug text-white/55">{row.question}</p>
                  <p className="text-[12.5px] leading-snug text-white">{row.answer}</p>
                  <p className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-white/50 ring-1 ring-inset ring-white/[0.06]">
                    <span className="h-1 w-1 rounded-full bg-[color:var(--aurora-1)]" />
                    {row.citation}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset transition-colors duration-300 ${statusStyles[status]}`}
                >
                  <Icon className="h-3 w-3" />
                  {statusLabels[status]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-4 py-2 text-[10px] text-white/35 font-mono">
          <span>Press ⌘K · Approve all high-confidence</span>
          <span>~ 2.4s / row</span>
        </div>
      </div>

      {/* Floating side card — citation popover */}
      <div className="absolute -right-6 bottom-12 hidden w-56 rounded-xl border border-white/10 bg-[color:var(--color-ink-2)]/90 p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl md:block">
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
          Source policy
        </p>
        <p className="mt-1 text-[12px] font-semibold text-white">Encryption · 3.2</p>
        <p className="mt-1 text-[11px] leading-snug text-white/55">
          All customer data at rest is encrypted with AES-256. Keys rotated quarterly.
        </p>
      </div>
    </div>
  );
}
