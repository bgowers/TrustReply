import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { TocActive } from "./toc-active";

type Section = { id: string; label: string };

type LegalShellProps = {
  title: string;
  updated: string;
  sections: Section[];
  /** Apply the drop cap to the first paragraph in the first section. */
  dropCap?: boolean;
  children: React.ReactNode;
};

export function LegalShell({
  title,
  updated,
  sections,
  dropCap = false,
  children,
}: LegalShellProps) {
  return (
    <>
      <ScrollProgress />
      <article className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[12px] text-[color:var(--color-subtle)]"
        >
          <Link
            href="/"
            className="font-mono uppercase tracking-wider transition-colors hover:text-[color:var(--color-fg)]"
          >
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-mono uppercase tracking-wider">Legal</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-mono uppercase tracking-wider text-[color:var(--color-fg)]">
            {title}
          </span>
        </nav>

        <header className="mt-10 max-w-3xl">
          <h1 className="t-h1 tracking-tight">{title}</h1>
          <p className="mt-3 font-mono text-[12px] tracking-wider text-[color:var(--color-subtle)]">
            LAST UPDATED · {updated.toUpperCase()}
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div
            className={`legal-prose space-y-9 text-[15px] leading-relaxed text-[color:var(--color-muted)] ${
              dropCap ? "with-drop-cap" : ""
            }`}
          >
            {children}
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="eyebrow mb-4 text-[color:var(--color-subtle)]">
                On this page
              </p>
              <TocActive sections={sections} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
