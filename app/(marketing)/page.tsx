import { HeroSection } from "@/components/marketing/hero-section";
import { SocialProof } from "@/components/marketing/social-proof";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ProductVisual } from "@/components/marketing/product-visual";
import { Pricing } from "@/components/marketing/pricing";
import { SecuritySection } from "@/components/marketing/security-section";
import { FAQ } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SocialProof />
      <HowItWorks />
      <ProductVisual />
      <Pricing />
      <SecuritySection />
      <FAQ />
      <FinalCta />
    </>
  );
}
