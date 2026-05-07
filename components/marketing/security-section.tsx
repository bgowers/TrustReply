import { Shield, Lock, Quote, Globe2, FileSignature, Zap } from "lucide-react";
import { AuroraBackground } from "./aurora-background";
import { GridOverlay } from "./grid-overlay";
import { NoiseTexture } from "./noise-texture";
import { FeatureStat } from "./feature-stat";
import { FadeIn } from "@/components/motion/fade-in";

const TILES = [
  {
    icon: <Lock className="h-4 w-4" />,
    label: "Training data",
    number: "0",
    body: "Your policies and questionnaires are never used to train upstream models. Anthropic API zero-retention applies.",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    label: "Auth boundary",
    number: "RLS",
    body: "Postgres row-level security is the primary auth boundary, not API code. Owner-only on every user table.",
  },
  {
    icon: <Quote className="h-4 w-4" />,
    label: "Citations",
    number: "Always",
    body: "Every answer cites the policy snippet it draws from. If we can't cite it, we say so explicitly.",
  },
  {
    icon: <Globe2 className="h-4 w-4" />,
    label: "Region",
    number: "EU",
    body: "Data processed in EU regions. UK GDPR and ICO complaint pathway documented in /legal/privacy.",
  },
  {
    icon: <FileSignature className="h-4 w-4" />,
    label: "Webhooks",
    number: "Signed",
    body: "Every Stripe webhook signature is verified before processing. No unsigned event is accepted.",
  },
  {
    icon: <Zap className="h-4 w-4" />,
    label: "Latency",
    number: "P95 12s",
    body: "Median question drafted in under 8s. Prompt caching keeps the policy block free across the batch.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="relative isolate overflow-hidden text-white">
      <AuroraBackground variant="cta" />
      <GridOverlay variant="dark" />
      <NoiseTexture />

      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-[color:var(--color-ink-muted)]">
            05 · Built like security software
          </p>
          <h2 className="mt-6 t-h1 tracking-tight text-white">
            Your policies don&apos;t leave your tenant. Period.
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[color:var(--color-ink-muted)]">
            TrustReply was built by someone who&apos;s filled the questionnaires too.
            We made the trade-offs you&apos;d make.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {TILES.map((tile, i) => (
            <FadeIn key={tile.label} delay={i * 0.05} y={20}>
              <FeatureStat
                icon={tile.icon}
                label={tile.label}
                number={tile.number}
                body={tile.body}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
