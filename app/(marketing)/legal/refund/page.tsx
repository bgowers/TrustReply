import { SITE } from "@/lib/site";
import { LegalShell } from "@/components/marketing/legal-shell";

export const metadata = {
  title: `Refund Policy — ${SITE.name}`,
};

const SECTIONS = [
  { id: "free-plan", label: "Free plan" },
  { id: "paid-plans", label: "Paid plans" },
  { id: "billing-errors", label: "Billing errors" },
  { id: "how-to-cancel", label: "How to cancel" },
  { id: "questions", label: "Questions" },
];

export default function RefundPage() {
  return (
    <LegalShell title="Refund Policy" updated={SITE.legalLastUpdated} sections={SECTIONS}>
      <section id="free-plan">
        <h2>Free plan</h2>
        <p>The Free plan is, well, free. Nothing to refund.</p>
      </section>

      <section id="paid-plans">
        <h2>Paid plans</h2>
        <p>
          Solo and Team subscriptions are billed monthly in advance through Stripe. You
          can cancel at any time from the Customer Portal; your plan remains active
          until the end of the current billing period and you won&apos;t be charged
          again after that.
        </p>
        <p>
          We don&apos;t offer prorated refunds for partial months, unused capacity, or
          change-of-mind cancellations after a renewal has charged. Cancel before the
          renewal date if you don&apos;t want to be billed for the next period.
        </p>
      </section>

      <section id="billing-errors">
        <h2>Billing errors</h2>
        <p>
          If you&apos;ve been billed in error — duplicate charges, charges after a
          successful cancellation, or a clear miscalculation — email{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> within 30 days
          of the charge and we&apos;ll refund the affected amount.
        </p>
      </section>

      <section id="how-to-cancel">
        <h2>How to cancel</h2>
        <p>
          Sign in, open the billing menu, click &quot;Manage billing&quot; to launch
          the Stripe Customer Portal, and choose &quot;Cancel plan&quot;. You&apos;ll
          keep access until the end of the period you&apos;ve already paid for.
        </p>
      </section>

      <section id="questions">
        <h2>Questions</h2>
        <p>
          Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. We aim
          to reply within two business days.
        </p>
      </section>
    </LegalShell>
  );
}
