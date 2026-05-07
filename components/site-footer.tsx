import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logomark } from "@/components/marketing/logomark";

const COLUMNS = [
  {
    label: "Product",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#product", label: "Product" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#security", label: "Security" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: `mailto:${SITE.contactEmail}`, label: "Contact" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/refund", label: "Refunds" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative isolate overflow-hidden bg-[color:var(--color-bg)]">
      {/* Top hairline — subtle aurora gradient */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--aurora-1) 28%, transparent) 30%, color-mix(in oklab, var(--aurora-3) 32%, transparent) 70%, transparent 100%)",
        }}
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[color:var(--color-fg)]">
            <Logomark className="text-[color:var(--color-accent)]" />
            <span>TrustReply</span>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed text-[color:var(--color-muted)]">
            Cited draft answers from your policy library, in minutes instead of days.
          </p>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="inline-block font-mono text-[12px] tracking-wider text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-fg)]"
          >
            {SITE.contactEmail}
          </a>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.label}>
            <p className="eyebrow mb-4 text-[color:var(--color-subtle)]">{col.label}</p>
            <ul className="space-y-2.5 text-[13.5px]">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-fg)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-[color:var(--color-border)] px-6 py-5 text-[12px] text-[color:var(--color-subtle)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} TrustReply · Built in {SITE.jurisdiction}
        </p>
        <span className="inline-flex items-center gap-2 font-mono tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-[breathe_2.4s_ease-in-out_infinite] rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          ALL SYSTEMS NORMAL
        </span>
      </div>
    </footer>
  );
}
