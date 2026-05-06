function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const env = {
  appUrl: optional("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000",

  supabase: {
    url: () => required("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: () => required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    secretKey: () => required("SUPABASE_SECRET_KEY"),
  },

  anthropic: {
    apiKey: () => required("ANTHROPIC_API_KEY"),
  },

  stripe: {
    secretKey: () => required("STRIPE_SECRET_KEY"),
    webhookSecret: () => required("STRIPE_WEBHOOK_SECRET"),
    priceSolo: optional("NEXT_PUBLIC_STRIPE_PRICE_SOLO"),
    priceTeam: optional("NEXT_PUBLIC_STRIPE_PRICE_TEAM"),
  },

  resend: {
    apiKey: optional("RESEND_API_KEY"),
  },
};
