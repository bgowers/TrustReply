import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `Privacy Policy — ${SITE.name}`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
      >
        ← {SITE.name}
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Last updated: {SITE.legalLastUpdated}
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold">Who we are</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            {SITE.legalEntity}. For the purposes of UK GDPR and the Data Protection Act
            2018, we are the data controller for personal data you give us through this
            service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[color:var(--color-muted)]">
            <li>
              <strong className="text-[color:var(--color-fg)]">Account data</strong> —
              your email address (used for magic-link sign-in) and your plan.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Customer content</strong>{" "}
              — the policies you write into the policy library and the questionnaires
              you upload, plus any drafts and edits you make.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Billing data</strong> —
              when you subscribe, Stripe processes your payment. We store your Stripe
              customer ID and subscription status; we never see or store your card
              details.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Operational logs</strong>{" "}
              — minimal request logs (timestamps, status codes, anonymised IPs) for
              security and debugging.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold">How we use it</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            We use your data to run the service: authenticate you, draft answers from
            your policies, store your work, bill you, and respond to support requests.
            We do not sell your data, we do not use your content to train AI models, and
            we do not share it for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Subprocessors</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            We use a small set of trusted providers to deliver the service. Each is
            contractually bound to protect your data:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[color:var(--color-muted)]">
            <li>
              <strong className="text-[color:var(--color-fg)]">Supabase</strong> —
              Postgres database, authentication, and file storage (EU region).
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Anthropic</strong> — AI
              model that drafts answers from your policy library. Anthropic does not use
              API inputs or outputs to train its models by default.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Stripe</strong> —
              subscription billing and customer portal.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Vercel</strong> — hosting
              and content delivery.
            </li>
            <li>
              <strong className="text-[color:var(--color-fg)]">Resend</strong> (where
              configured) — transactional email delivery.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold">Where your data is stored</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Customer content is stored in our Supabase project (EU region). Some
            subprocessors (Anthropic, Stripe, Vercel) may process data in the United
            States or other regions; transfers rely on Standard Contractual Clauses or
            equivalent safeguards.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Retention</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            We keep your policies and questionnaires for as long as your account is
            active. When you delete an item it is removed from active databases promptly
            and from backups within 30 days. When you close your account, we delete your
            customer content within 30 days, except where we&apos;re required to keep
            limited records (for example, billing data we need to retain for tax
            purposes).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Security</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Data in transit is encrypted with TLS. Data at rest is encrypted by our
            infrastructure providers. Our database enforces row-level security so a
            signed-in user can only read and write their own rows. We never expose
            service keys to the browser.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Your rights</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Under UK GDPR you have the right to access, correct, export, and delete your
            personal data, to restrict or object to processing, and to lodge a complaint
            with the Information Commissioner&apos;s Office (
            <a
              href="https://ico.org.uk"
              className="underline hover:text-[color:var(--color-fg)]"
              target="_blank"
              rel="noreferrer"
            >
              ico.org.uk
            </a>
            ). To exercise any of these rights, email{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="underline hover:text-[color:var(--color-fg)]"
            >
              {SITE.contactEmail}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Cookies</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            We use a single first-party session cookie to keep you signed in. We do not
            use advertising or analytics cookies on the marketing site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Changes</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            We&apos;ll update this page when our practices change and notify active users
            by email if a change is material.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Contact</h2>
          <p className="mt-2 text-[color:var(--color-muted)]">
            Privacy questions or requests:{" "}
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
