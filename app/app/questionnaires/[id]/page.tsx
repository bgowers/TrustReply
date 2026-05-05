import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { QuestionnaireTable } from "@/components/questionnaire-table";

export const dynamic = "force-dynamic";

export default async function QuestionnairePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ start?: string }>;
}) {
  const { user, supabase } = await requireUser();
  const { id } = await params;
  const { start } = await searchParams;
  const questionnaireId = Number(id);
  if (Number.isNaN(questionnaireId)) notFound();

  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select("id, name, status, total_rows, question_column, source_format")
    .eq("id", questionnaireId)
    .eq("user_id", user.id)
    .single();
  if (!questionnaire) notFound();

  const { data: questions } = await supabase
    .from("questions")
    .select(
      "id, row_index, question_text, draft_answer, final_answer, citations, confidence, needs_review_reason, status",
    )
    .eq("questionnaire_id", questionnaireId)
    .eq("user_id", user.id)
    .order("row_index");

  return (
    <QuestionnaireTable
      questionnaire={questionnaire}
      questions={questions ?? []}
      autoStart={start === "1" && questionnaire.status === "pending"}
    />
  );
}
