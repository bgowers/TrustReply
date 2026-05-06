import { requireUser } from "@/lib/auth";
import { PolicyEditor } from "@/components/policy-editor";

export const dynamic = "force-dynamic";

export default async function PoliciesPage() {
  const { user, supabase } = await requireUser();
  const { data: policies } = await supabase
    .from("policies")
    .select("id, title, category, body, updated_at")
    .eq("user_id", user.id)
    .order("category", { ascending: true })
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Policy library</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Short snippets organized by category. Multiple narrow policies beat one big one.
        </p>
      </header>
      <PolicyEditor initial={policies ?? []} />
    </div>
  );
}
