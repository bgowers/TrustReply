import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-xs text-[color:var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <a href={`mailto:${SITE.contactEmail}`} className="hover:text-[color:var(--color-fg)]">
          {SITE.contactEmail}
        </a>
        <nav className="flex items-center gap-4">
          <Link href="/legal/terms" className="hover:text-[color:var(--color-fg)]">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:text-[color:var(--color-fg)]">
            Privacy
          </Link>
          <Link href="/legal/refund" className="hover:text-[color:var(--color-fg)]">
            Refunds
          </Link>
        </nav>
      </div>
    </footer>
  );
}
