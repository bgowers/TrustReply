"use client";

import { Plus } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useState, type ReactNode } from "react";

type FaqItemProps = {
  question: string;
  children: ReactNode;
};

export function FaqItem({ question, children }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div className="border-b border-[color:var(--color-border)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-medium text-[color:var(--color-fg)] transition-colors hover:text-[color:var(--color-accent)]"
      >
        <span>{question}</span>
        <Plus
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={reduced ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-[14px] leading-relaxed text-[color:var(--color-muted)]">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
