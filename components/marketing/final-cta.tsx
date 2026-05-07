import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuroraBackground } from "./aurora-background";
import { GridOverlay } from "./grid-overlay";
import { NoiseTexture } from "./noise-texture";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <AuroraBackground variant="cta" />
      <GridOverlay variant="dark" />
      <NoiseTexture />

      <div className="relative mx-auto max-w-6xl px-6 py-28 text-center lg:py-36">
        <FadeIn>
          <p className="eyebrow text-[color:var(--color-ink-muted)]">
            07 · Get started
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mx-auto mt-6 max-w-2xl t-display tracking-tight text-balance text-white">
            Stop dreading procurement Mondays.
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[color:var(--color-ink-muted)]">
            Upload a questionnaire. Get cited drafts in minutes. Edit, approve, export.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-10 flex justify-center">
            <Link href="/login">
              <Button variant="shimmer" size="lg" magnetic className="rounded-full">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-5 font-mono text-[11px] tracking-widest text-[color:var(--color-ink-muted)]">
            1 QUESTIONNAIRE · UP TO 25 ROWS · NO CREDIT CARD
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
