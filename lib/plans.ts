export type Plan = "free" | "solo" | "team";

export interface PlanLimits {
  maxQuestionnaires: number | null; // null = unlimited
  maxRowsPerQuestionnaire: number | null;
  watermark: boolean;
  label: string;
  priceUsd: number;
  priceEnvVar?: "NEXT_PUBLIC_STRIPE_PRICE_SOLO" | "NEXT_PUBLIC_STRIPE_PRICE_TEAM";
}

export const PLANS: Record<Plan, PlanLimits> = {
  free: {
    maxQuestionnaires: 1,
    maxRowsPerQuestionnaire: 25,
    watermark: true,
    label: "Free",
    priceUsd: 0,
  },
  solo: {
    maxQuestionnaires: null,
    maxRowsPerQuestionnaire: 200,
    watermark: false,
    label: "Solo",
    priceUsd: 99,
    priceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_SOLO",
  },
  team: {
    maxQuestionnaires: null,
    maxRowsPerQuestionnaire: null,
    watermark: false,
    label: "Team",
    priceUsd: 399,
    priceEnvVar: "NEXT_PUBLIC_STRIPE_PRICE_TEAM",
  },
};

export function planAllowsRows(plan: Plan, rows: number): boolean {
  const limit = PLANS[plan].maxRowsPerQuestionnaire;
  return limit === null || rows <= limit;
}

export function planAllowsAnotherQuestionnaire(plan: Plan, current: number): boolean {
  const limit = PLANS[plan].maxQuestionnaires;
  return limit === null || current < limit;
}
