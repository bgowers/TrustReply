import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { Tilt } from "@/components/motion/tilt";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

type CardProps = {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
};

function PriceCard({
  name,
  price,
  period,
  tagline,
  features,
  highlighted = false,
  ctaLabel,
  ctaHref,
}: CardProps) {
  return (
    <div className={`relative ${highlighted ? "lg:-translate-y-3" : ""}`}>
      {highlighted ? (
        <>
          <div
            aria-hidden
            className="absolute -inset-1 rounded-3xl opacity-50 blur-xl [animation:glow-pulse_6s_ease-in-out_infinite]"
            style={{
              background:
                "linear-gradient(135deg, var(--aurora-1), var(--aurora-2), var(--aurora-3))",
            }}
          />
          <div className="absolute -top-3 right-6 z-10 inline-flex items-center gap-1 rounded-full border border-white/15 bg-[color:var(--color-ink)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
            <Sparkles className="h-3 w-3" /> Most teams pick this
          </div>
        </>
      ) : null}
      <Tilt max={4} glare={highlighted} className="relative">
        <div
          className={`relative flex h-full flex-col rounded-2xl border p-7 ${
            highlighted
              ? "border-transparent bg-white shadow-[var(--surface-elev-3)] [background:linear-gradient(white,white)_padding-box,linear-gradient(135deg,var(--aurora-1),var(--aurora-2),var(--aurora-3))_border-box] border-2"
              : "border-[color:var(--color-border)] bg-white shadow-[var(--surface-elev-1)] hover:shadow-[var(--surface-elev-2)]"
          } transition-shadow duration-300`}
        >
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-subtle)]">
              {name}
            </p>
            <p className="text-[14px] text-[color:var(--color-muted)]">{tagline}</p>
            <div className="flex items-end gap-1.5">
              <span className="t-h2 nums">{price}</span>
              {period ? (
                <span className="pb-1 font-mono text-[12px] tracking-wide text-[color:var(--color-subtle)]">
                  {period}
                </span>
              ) : null}
            </div>
          </div>
          <ul className="mt-7 space-y-3">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 text-[14px] text-[color:var(--color-fg)]"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]">
                  <Check className="h-3 w-3" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-2">
            <Link href={ctaHref} className="block">
              <Button
                variant={highlighted ? "primary" : "secondary"}
                size="md"
                className="w-full rounded-md"
              >
                {ctaLabel}
              </Button>
            </Link>
          </div>
        </div>
      </Tilt>
    </div>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-[color:var(--color-bg)] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-[color:var(--color-muted)]">04 · Pricing</p>
          <h2 className="mt-6 t-h1 tracking-tight">
            Start free. Upgrade when one questionnaire isn&apos;t enough.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[color:var(--color-muted)]">
            No credit card required. Cancel anytime. Solo and Team include a 7-day money-back
            guarantee.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          <FadeIn delay={0}>
            <PriceCard
              name={PLANS.free.label}
              price={`$${PLANS.free.priceUsd}`}
              tagline="Try it on a single questionnaire."
              features={[
                "1 questionnaire",
                "≤ 25 rows",
                "Cited drafts",
                "Watermarked export",
              ]}
              ctaLabel="Start free"
              ctaHref="/login"
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <PriceCard
              name={PLANS.solo.label}
              price={`$${PLANS.solo.priceUsd}`}
              period="/ month"
              tagline="For founders running their own questionnaires."
              features={[
                "Unlimited questionnaires",
                "≤ 200 rows each",
                "No watermark",
                "Priority support",
              ]}
              highlighted
              ctaLabel="Start free trial"
              ctaHref="/login"
            />
          </FadeIn>
          <FadeIn delay={0.16}>
            <PriceCard
              name={PLANS.team.label}
              price={`$${PLANS.team.priceUsd}`}
              period="/ month"
              tagline="For teams shipping into enterprise."
              features={[
                "Unlimited rows",
                "Priority queue",
                "Custom branding",
                "Email support",
              ]}
              ctaLabel="Start free trial"
              ctaHref="/login"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
