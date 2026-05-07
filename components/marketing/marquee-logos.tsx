import { Marquee } from "@/components/motion/marquee";

const PLACEHOLDER_BRANDS = [
  "Northbridge Labs",
  "Acrelane",
  "Quoram",
  "Sigil & Co.",
  "Metabolt",
  "Veridian Stack",
  "Noetic Forge",
  "Bastion AI",
];

export function MarqueeLogos() {
  return (
    <Marquee speed={48} className="text-[color:var(--color-subtle)]">
      {PLACEHOLDER_BRANDS.map((name) => (
        <span
          key={name}
          className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] opacity-50 transition-opacity duration-300 hover:opacity-90"
        >
          {name}
        </span>
      ))}
    </Marquee>
  );
}
