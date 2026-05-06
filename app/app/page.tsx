import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, supabase } = await requireUser();
  const { data: questionnaires } = await supabase
    .from("questionnaires")
    .select("id, name, total_rows, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { count: policyCount } = await supabase
    .from("policies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Questionnaires</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            Upload a CSV or XLSX questionnaire and get cited draft answers.
          </p>
        </div>
        <Link href="/app/questionnaires/new">
          <Button>Upload questionnaire</Button>
        </Link>
      </header>

      {policyCount === 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="font-medium text-amber-900">No policies yet.</p>
          <p className="mt-1 text-amber-800">
            Drafts work best with a populated{" "}
            <Link className="underline" href="/app/policies">
              policy library
            </Link>
            . Defaults were seeded — replace them with your real policies.
          </p>
        </div>
      )}

      {!questionnaires || questionnaires.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-sm text-[color:var(--color-muted)]">
            No questionnaires yet. Upload a CSV/XLSX to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {questionnaires.map((q) => (
            <li key={q.id} className="rounded-lg border bg-white p-4">
              <Link href={`/app/questionnaires/${q.id}`} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{q.name}</p>
                  <p className="text-xs text-[color:var(--color-muted)]">
                    {q.total_rows} rows · {new Date(q.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={
                    q.status === "complete"
                      ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800"
                      : q.status === "drafting"
                        ? "rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800"
                        : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                  }
                >
                  {q.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
