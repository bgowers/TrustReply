import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { detectQuestionColumn, parseCsv, parseXlsx, type ParsedSheet } from "@/lib/parsers";
import { PLANS, planAllowsAnotherQuestionnaire, planAllowsRows, type Plan } from "@/lib/plans";

const MAX_BYTES = 10 * 1024 * 1024;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { user, supabase } = await requireUser();

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  const filename = file.name || "questionnaire";
  const ext = filename.toLowerCase().split(".").pop();
  let parsed: ParsedSheet;
  try {
    if (ext === "csv") {
      parsed = parseCsv(await file.text());
    } else if (ext === "xlsx") {
      parsed = parseXlsx(await file.arrayBuffer());
    } else {
      return NextResponse.json({ error: "Unsupported file type. Use CSV or XLSX." }, { status: 400 });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to parse file";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (parsed.headers.length === 0 || parsed.rows.length === 0) {
    return NextResponse.json({ error: "No data rows detected" }, { status: 400 });
  }

  const questionColumn = detectQuestionColumn(parsed);

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();
  const plan = (profile?.plan ?? "free") as Plan;

  const { count } = await supabase
    .from("questionnaires")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  const current = count ?? 0;

  if (!planAllowsAnotherQuestionnaire(plan, current)) {
    return NextResponse.json(
      {
        error: "plan_limit",
        message: `Your ${PLANS[plan].label} plan allows ${PLANS[plan].maxQuestionnaires} questionnaire${PLANS[plan].maxQuestionnaires === 1 ? "" : "s"}. Upgrade to upload more.`,
      },
      { status: 402 },
    );
  }
  if (!planAllowsRows(plan, parsed.rows.length)) {
    return NextResponse.json(
      {
        error: "plan_limit",
        message: `Your ${PLANS[plan].label} plan allows up to ${PLANS[plan].maxRowsPerQuestionnaire} rows per questionnaire. This file has ${parsed.rows.length}.`,
      },
      { status: 402 },
    );
  }

  // Filter rows that have a non-empty question
  const dataRows = parsed.rows
    .map((r, idx) => ({ idx, q: (r[questionColumn] ?? "").toString().trim() }))
    .filter((r) => r.q.length > 0);

  if (dataRows.length === 0) {
    return NextResponse.json({ error: "No questions detected in column" }, { status: 400 });
  }

  const { data: q, error: qErr } = await supabase
    .from("questionnaires")
    .insert({
      user_id: user.id,
      name: filename,
      source_filename: filename,
      source_format: ext,
      question_column: questionColumn,
      total_rows: dataRows.length,
      status: "pending",
      layout: { headers: parsed.headers, rows: parsed.rows },
    })
    .select("id")
    .single();
  if (qErr || !q) {
    return NextResponse.json({ error: qErr?.message ?? "Insert failed" }, { status: 500 });
  }

  const questionRows = dataRows.map((r) => ({
    questionnaire_id: q.id,
    user_id: user.id,
    row_index: r.idx,
    question_text: r.q,
    status: "pending" as const,
  }));
  const { error: rowsErr } = await supabase.from("questions").insert(questionRows);
  if (rowsErr) {
    return NextResponse.json({ error: rowsErr.message }, { status: 500 });
  }

  return NextResponse.json({ id: q.id });
}
