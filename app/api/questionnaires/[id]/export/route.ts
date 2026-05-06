import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { buildExport } from "@/lib/exporters";
import { PLANS, type Plan } from "@/lib/plans";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, supabase } = await requireUser();
  const { id } = await params;
  const url = new URL(request.url);
  const format = url.searchParams.get("format") === "csv" ? "csv" : "xlsx";

  const { data: q } = await supabase
    .from("questionnaires")
    .select("id, name, source_format, question_column, layout")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!q) return new NextResponse("Not found", { status: 404 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan = (profile?.plan ?? "free") as Plan;

  const { data: rows } = await supabase
    .from("questions")
    .select("row_index, question_text, draft_answer, final_answer")
    .eq("questionnaire_id", id)
    .eq("user_id", user.id)
    .order("row_index");

  const layout = (q.layout ?? { headers: [q.question_column], rows: [] }) as {
    headers: string[];
    rows: Record<string, string>[];
  };

  const result = buildExport({
    format,
    questionnaireName: q.name,
    questionColumn: q.question_column,
    layoutHeaders: layout.headers,
    layoutRows: layout.rows,
    questions: rows ?? [],
    watermark: PLANS[plan].watermark,
  });

  return new NextResponse(result.buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": result.contentType,
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
