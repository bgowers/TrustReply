import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `Refund Policy — ${SITE.name}`,
};

export default function RefundPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
      >
        ← {SITE.name}
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Refund Policy</h1>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Last updated: {SITE.legalLastUpdated}
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold">Free plan</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            The Free plan is, well, free. Nothing to refund.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Paid plans</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Solo and Team subscriptions are billed monthly in advance through Stripe. You
            can cancel at any time from the Customer Portal; your plan remains active
            until the end of the current billing period and you won&apos;t be charged
            again after that.
          </p>
          <p className="mt-2 text-[color:var(--color-muted)]">
            We don&apos;t offer prorated refunds for partial months, unused capacity, or
            change-of-mind cancellations after a renewal has charged. Cancel before the
            renewal date if you don&apos;t want to be billed for the next period.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Billing errors</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            If you&apos;ve been billed in error — duplicate charges, charges after a
            successful cancellation, or a clear miscalculation — email{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="underline hover:text-[color:var(--color-fg)]"
            >
              {SITE.contactEmail}
            </a>{" "}
            within 30 days of the charge and we&apos;ll refund the affected amount.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">How to cancel</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Sign in, open the billing menu, click &quot;Manage billing&quot; to launch the
            Stripe Customer Portal, and choose &quot;Cancel plan&quot;. You&apos;ll keep
            access until the end of the period you&apos;ve already paid for.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Questions</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Email{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="underline hover:text-[color:var(--color-fg)]"
            >
              {SITE.contactEmail}
            </a>
            . We aim to reply within two business days.
          </p>
        </section>
      </div>
    </article>
  );
}
