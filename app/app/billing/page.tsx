import { requireUser } from "@/lib/auth";
import { PLANS, type Plan } from "@/lib/plans";
import { UpgradeButton, ManageBillingButton } from "@/components/billing-actions";

export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; canceled?: string }>;
}) {
  const { user, supabase } = await requireUser();
  const params = await searchParams;
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, stripe_customer_id, current_period_end")
    .eq("id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan | undefined) ?? "free";
  const hasStripeCustomer = Boolean(profile?.stripe_customer_id);
  const periodEnd = profile?.current_period_end
    ? new Date(profile.current_period_end as string)
    : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          Manage your subscription and switch plans.
        </p>
      </header>

      {params.upgraded === "1" && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          Subscription updated. It can take a few seconds for the new plan to show here.
        </div>
      )}
      {params.canceled === "1" && (
        <div className="rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-800">
          Checkout canceled. You&apos;re still on the {PLANS[plan].label} plan.
        </div>
      )}

      <section className="rounded-lg border bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-muted)]">
              Current plan
            </p>
            <p className="mt-1 text-lg font-semibold">{PLANS[plan].label}</p>
            {plan !== "free" && periodEnd && (
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                Renews {periodEnd.toLocaleDateString()}
              </p>
            )}
          </div>
          {hasStripeCustomer && <ManageBillingButton />}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold tracking-tight">Plans</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <PlanCard plan="free" current={plan} />
          <PlanCard plan="solo" current={plan} highlight />
          <PlanCard plan="team" current={plan} />
        </div>
      </section>
    </div>
  );
}

function PlanCard({
  plan,
  current,
  highlight,
}: {
  plan: Plan;
  current: Plan;
  highlight?: boolean;
}) {
  const def = PLANS[plan];
  const isCurrent = plan === current;
  const features = featuresFor(plan);

  return (
    <div
      className={
        "rounded-lg border bg-white p-5 " +
        (highlight && !isCurrent ? "border-[color:var(--color-accent)] shadow-sm" : "")
      }
    >
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">{def.label}</p>
        {isCurrent && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-700">
            Current
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {def.priceUsd === 0 ? "$0" : `$${def.priceUsd}`}
        {def.priceUsd > 0 && (
          <span className="text-sm font-normal text-[color:var(--color-muted)]">/mo</span>
        )}
      </p>
      <ul className="mt-4 space-y-1.5 text-sm text-[color:var(--color-muted)]">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        {isCurrent ? (
          <p className="text-xs text-[color:var(--color-muted)]">
            {plan === "free"
              ? "Upgrade to lift the questionnaire and row limits."
              : "Use Manage billing above to change or cancel."}
          </p>
        ) : plan === "free" ? (
          <p className="text-xs text-[color:var(--color-muted)]">
            Downgrades happen via Manage billing.
          </p>
        ) : (
          <UpgradeButton
            plan={plan}
            label={current === "free" ? `Upgrade to ${def.label}` : `Switch to ${def.label}`}
            variant={highlight ? "primary" : "secondary"}
          />
        )}
      </div>
    </div>
  );
}

function featuresFor(plan: Plan): string[] {
  if (plan === "free") {
    return ["1 questionnaire", "Up to 25 rows", "Cited drafts", "Watermarked export"];
  }
  if (plan === "solo") {
    return [
      "Unlimited questionnaires",
      "Up to 200 rows each",
      "No watermark",
      "Priority support",
    ];
  }
  return ["Unlimited rows", "Priority queue", "Custom branding", "Email support"];
}
