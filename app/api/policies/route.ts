import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.string().min(1).max(60),
  body: z.string().min(1).max(20_000),
});

export async function GET() {
  const { user, supabase } = await requireUser();
  const { data, error } = await supabase
    .from("policies")
    .select("id, title, category, body, updated_at")
    .eq("user_id", user.id)
    .order("category");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { user, supabase } = await requireUser();
  const json = await request.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("policies")
    .insert({ ...parsed.data, user_id: user.id })
    .select("id, title, category, body, updated_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
