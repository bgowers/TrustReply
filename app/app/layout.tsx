import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, supabase } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan = profile?.plan ?? "free";

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/app" className="text-sm font-semibold tracking-tight">
            TrustReply
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/app" className="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">
              Questionnaires
            </Link>
            <Link href="/app/policies" className="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">
              Policies
            </Link>
            <Link href="/app/billing" className="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">
              Billing
            </Link>
            <Link
              href="/app/billing"
              className="rounded-full border px-2 py-0.5 text-xs uppercase tracking-wide text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
              aria-label={`Plan: ${plan}. Manage billing.`}
            >
              {plan}
            </Link>
            <span className="hidden text-[color:var(--color-muted)] sm:inline">{user.email}</span>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
