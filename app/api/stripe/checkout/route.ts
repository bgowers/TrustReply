import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";

const bodySchema = z.object({ plan: z.enum(["solo", "team"]) });

export async function POST(request: Request) {
  const { user, supabase } = await requireUser();
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const priceId = parsed.data.plan === "solo" ? env.stripe.priceSolo : env.stripe.priceTeam;
  if (!priceId) {
    return NextResponse.json(
      { error: `Stripe price for ${parsed.data.plan} is not configured` },
      { status: 500 },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email,
    client_reference_id: user.id,
    success_url: `${env.appUrl}/app/billing?upgraded=1`,
    cancel_url: `${env.appUrl}/app/billing?canceled=1`,
    allow_promotion_codes: true,
    subscription_data: { metadata: { user_id: user.id } },
  });

  return NextResponse.json({ url: session.url });
}
