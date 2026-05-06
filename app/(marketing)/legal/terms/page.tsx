import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `Terms of Service — ${SITE.name}`,
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
      >
        ← {SITE.name}
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Last updated: {SITE.legalLastUpdated}
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold">1. Who we are</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            {SITE.name} is a service operated by Ben Gowers, a sole trader based in{" "}
            {SITE.jurisdiction}. In these Terms, &quot;{SITE.name}&quot;, &quot;we&quot;,
            and &quot;us&quot; refer to that operator. &quot;You&quot; refers to the
            individual or organisation using the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">2. Acceptance</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            By creating an account or using the service, you agree to these Terms. If you
            don&apos;t agree, don&apos;t use the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">3. Your account</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            You&apos;re responsible for activity on your account and for keeping your
            sign-in secure. Tell us at{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="underline hover:text-[color:var(--color-fg)]"
            >
              {SITE.contactEmail}
            </a>{" "}
            if you suspect unauthorised access.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">4. Acceptable use</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Don&apos;t use the service to break the law, infringe anyone&apos;s rights,
            upload content you don&apos;t have rights to, or attempt to disrupt the
            service or other users.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">5. Your content</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            You own the policies, questionnaires, and other content you upload. You grant
            us a limited licence to host, process, and display that content solely so we
            can run the service for you (including sending it to our AI subprocessor to
            draft answers). We don&apos;t use your content to train models, and we
            don&apos;t share it with third parties beyond the subprocessors listed in our{" "}
            <Link href="/legal/privacy" className="underline hover:text-[color:var(--color-fg)]">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">6. AI-generated drafts</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Drafts produced by the service are starting points, not finished answers. You
            remain responsible for reviewing every answer before submitting a
            questionnaire to a third party. We don&apos;t guarantee accuracy, completeness,
            or fitness for any particular procurement process.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">7. Subscriptions and fees</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Paid plans are billed monthly in advance via Stripe. You can cancel at any
            time from the Customer Portal; your plan remains active until the end of the
            current billing period. See our{" "}
            <Link href="/legal/refund" className="underline hover:text-[color:var(--color-fg)]">
              Refund Policy
            </Link>{" "}
            for refund terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">8. Termination</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            You can close your account any time. We may suspend or terminate accounts
            that breach these Terms, with notice where reasonable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">9. Warranty disclaimer</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            The service is provided &quot;as is&quot; and &quot;as available&quot;. To
            the fullest extent permitted by law, we disclaim all implied warranties,
            including merchantability, fitness for a particular purpose, and
            non-infringement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">10. Limitation of liability</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            To the fullest extent permitted by law, our total liability for any claim
            arising out of or relating to the service is capped at the fees you paid us
            in the twelve months before the event giving rise to the claim. We are not
            liable for indirect, incidental, or consequential damages. Nothing in these
            Terms limits liability that cannot be limited under applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">11. Governing law</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            These Terms are governed by the laws of {SITE.jurisdiction}. The courts of{" "}
            {SITE.jurisdiction} have exclusive jurisdiction over any dispute.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">12. Changes</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            We may update these Terms from time to time. If a change is material we&apos;ll
            notify active users by email before it takes effect. Continued use after the
            effective date means you accept the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">13. Contact</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Questions about these Terms? Email{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="underline hover:text-[color:var(--color-fg)]"
            >
              {SITE.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
