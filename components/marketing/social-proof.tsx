import { MarqueeLogos } from "./marquee-logos";

export function SocialProof() {
  return (
    <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-bg)] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow mb-6 text-center text-[color:var(--color-subtle)]">
          Trusted by security teams shipping faster
        </p>
        <MarqueeLogos />
      </div>
    </section>
  );
}
