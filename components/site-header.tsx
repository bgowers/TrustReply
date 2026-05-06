import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {SITE.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[color:var(--color-muted)]">
          <Link href="/#how" className="hover:text-[color:var(--color-fg)]">
            How it works
          </Link>
          <Link href="/#pricing" className="hover:text-[color:var(--color-fg)]">
            Pricing
          </Link>
          <Link href="/login" className="font-medium text-[color:var(--color-fg)]">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
