import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

const patchSchema = z.object({
  final_answer: z.string().max(20_000).optional(),
  status: z.enum(["pending", "drafted", "approved"]).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; rowId: string }> },
) {
  const { user, supabase } = await requireUser();
  const { id, rowId } = await params;
  const json = await request.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("questions")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", rowId)
    .eq("questionnaire_id", id)
    .eq("user_id", user.id)
    .select("id, status, final_answer")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
