import Stripe from "stripe";
import { env } from "@/lib/env";

let singleton: Stripe | null = null;

export function getStripe() {
  if (!singleton) {
    // Use the SDK's pinned API version (set when we bumped stripe@22.1.0).
    singleton = new Stripe(env.stripe.secretKey());
  }
  return singleton;
}

import type { Plan } from "@/lib/plans";

export function planFromPriceId(priceId: string | null | undefined): Plan {
  if (!priceId) return "free";
  if (priceId === env.stripe.priceSolo) return "solo";
  if (priceId === env.stripe.priceTeam) return "team";
  return "free";
}
