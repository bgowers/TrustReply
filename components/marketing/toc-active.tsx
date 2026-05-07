"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

export function TocActive({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.4, 1],
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <ol className="space-y-2 text-[13px]">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className={`group flex items-baseline gap-2 transition-colors duration-150 ${
              activeId === s.id
                ? "text-[color:var(--color-accent)]"
                : "text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
            }`}
          >
            <span className="font-mono text-[10px] tracking-wider text-[color:var(--color-subtle)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="leading-snug">{s.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
