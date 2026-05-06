import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Answer security questionnaires in minutes, not days.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-[color:var(--color-muted)]">
          Upload a SIG, CAIQ, or custom Excel security questionnaire. TrustReply drafts cited
          answers from your policy library so deals stop stalling at procurement.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--color-accent-hover)]"
          >
            Start free
          </Link>
          <a
            href="#how"
            className="inline-flex items-center justify-center rounded-md border bg-white px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--color-card)]"
          >
            How it works
          </a>
        </div>
        <p className="mt-3 text-xs text-[color:var(--color-muted)]">
          1 free questionnaire, up to 25 rows. No credit card required.
        </p>
      </section>

      <section id="how" className="border-y bg-[color:var(--color-card)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-3">
          <Step n={1} title="Add your policies">
            Drop in short snippets organized by category — encryption, access control, BCDR, etc.
          </Step>
          <Step n={2} title="Upload the questionnaire">
            CSV or XLSX. We auto-detect the question column. No reformatting needed.
          </Step>
          <Step n={3} title="Review and export">
            Cited drafts arrive in a review table. Edit, approve, export back to the original layout.
          </Step>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Start free. Upgrade when one questionnaire isn&apos;t enough.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <PlanCard
            name={PLANS.free.label}
            price="$0"
            features={[
              "1 questionnaire",
              "Up to 25 rows",
              "Cited drafts",
              "Watermarked export",
            ]}
            cta="Start free"
            href="/login"
          />
          <PlanCard
            highlight
            name={PLANS.solo.label}
            price={`$${PLANS.solo.priceUsd}/mo`}
            features={[
              "Unlimited questionnaires",
              "Up to 200 rows each",
              "No watermark",
              "Priority support",
            ]}
            cta="Start free, upgrade later"
            href="/login"
          />
          <PlanCard
            name={PLANS.team.label}
            price={`$${PLANS.team.priceUsd}/mo`}
            features={[
              "Unlimited rows",
              "Priority queue",
              "Custom branding",
              "Email support",
            ]}
            cta="Start free, upgrade later"
            href="/login"
          />
        </div>
      </section>
    </>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-[color:var(--color-muted)]">Step {n}</p>
      <h3 className="mt-1 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">{children}</p>
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  cta,
  href,
  highlight,
}: {
  name: string;
  price: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-lg border bg-white p-6 " +
        (highlight ? "border-[color:var(--color-accent)] shadow-sm" : "")
      }
    >
      <p className="text-sm font-medium">{name}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{price}</p>
      <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-muted)]">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={
          "mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium " +
          (highlight
            ? "bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-hover)]"
            : "border bg-white hover:bg-[color:var(--color-card)]")
        }
      >
        {cta}
      </Link>
    </div>
  );
}
