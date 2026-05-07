import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuroraBackground } from "./aurora-background";
import { GridOverlay } from "./grid-overlay";
import { NoiseTexture } from "./noise-texture";
import { LiveQuestionnaire } from "./live-questionnaire";
import { Reveal } from "@/components/motion/reveal";
import { FadeIn } from "@/components/motion/fade-in";
import { Parallax } from "@/components/motion/parallax";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-[color:var(--color-ink)] text-white"
    >
      <AuroraBackground variant="hero" />
      <GridOverlay variant="dark" />
      <NoiseTexture />

      {/* Top gutter so content clears the fixed header */}
      <div className="relative mx-auto grid min-h-[92vh] max-w-6xl grid-cols-1 gap-14 px-6 pb-24 pt-32 lg:grid-cols-12 lg:items-center lg:pb-32 lg:pt-40">
        {/* Left — copy + CTAs */}
        <div className="relative z-10 lg:col-span-7">
          <FadeIn delay={0.05} y={8}>
            <p className="eyebrow mb-6 inline-flex items-center gap-2 text-[color:var(--color-ink-muted)]">
              <span className="inline-block h-1 w-6 bg-[color:var(--aurora-1)]" />
              01 · Security questionnaires, finished
            </p>
          </FadeIn>

          <Reveal
            as="h1"
            text="Answer security questionnaires in minutes — not days."
            className="t-display max-w-[14ch] text-balance text-white"
            stagger={0.04}
            delay={0.1}
          />

          <FadeIn delay={0.55} y={12}>
            <p className="mt-6 max-w-xl t-lead text-[color:var(--color-ink-muted)]">
              Upload a SIG, CAIQ, or custom Excel. TrustReply drafts cited answers from
              your policy library so deals stop stalling at procurement.
            </p>
          </FadeIn>

          <FadeIn delay={0.7} y={12}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/login" prefetch>
                <Button variant="shimmer" size="lg" magnetic className="rounded-full">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how">
                <Button variant="ink" size="lg" className="rounded-full">
                  See how it works
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.85} y={6}>
            <p className="mt-6 font-mono text-[11px] tracking-widest text-[color:var(--color-ink-muted)]">
              1 QUESTIONNAIRE · UP TO 25 ROWS · NO CREDIT CARD
            </p>
          </FadeIn>
        </div>

        {/* Right — live questionnaire */}
        <div className="relative z-10 lg:col-span-5">
          <FadeIn delay={0.7} y={20}>
            <Parallax speed={0.18}>
              <LiveQuestionnaire />
            </Parallax>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
