import { requireUser } from "@/lib/auth";
import { draftAnswer, type PolicyForPrompt } from "@/lib/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH_SIZE = 5;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, supabase } = await requireUser();
  const { id } = await params;
  const questionnaireId = Number(id);
  if (Number.isNaN(questionnaireId)) {
    return new Response("Invalid id", { status: 400 });
  }

  const { data: questionnaire, error: qErr } = await supabase
    .from("questionnaires")
    .select("id, name, status")
    .eq("id", questionnaireId)
    .eq("user_id", user.id)
    .single();
  if (qErr || !questionnaire) return new Response("Not found", { status: 404 });

  const { data: policies } = await supabase
    .from("policies")
    .select("id, title, category, body")
    .eq("user_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name")
    .eq("id", user.id)
    .single();

  const { data: pendingQs } = await supabase
    .from("questions")
    .select("id, row_index, question_text")
    .eq("questionnaire_id", questionnaireId)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("row_index");

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        await supabase
          .from("questionnaires")
          .update({ status: "drafting" })
          .eq("id", questionnaireId)
          .eq("user_id", user.id);

        send("start", { total: pendingQs?.length ?? 0 });

        const policyList: PolicyForPrompt[] = (policies ?? []) as PolicyForPrompt[];
        const queue = [...(pendingQs ?? [])];

        while (queue.length > 0) {
          const batch = queue.splice(0, BATCH_SIZE);
          const settled = await Promise.allSettled(
            batch.map(async (q) => {
              const result = await draftAnswer({
                companyName: profile?.company_name ?? null,
                policies: policyList,
                question: q.question_text,
              });
              const citations = result.policy_ids
                .map((pid) => {
                  const p = policyList.find((x) => x.id === pid);
                  return p ? { id: p.id, title: p.title, category: p.category } : null;
                })
                .filter(Boolean);
              await supabase
                .from("questions")
                .update({
                  draft_answer: result.answer,
                  citations,
                  confidence: result.confidence,
                  needs_review_reason: result.needs_review_reason ?? null,
                  status: "drafted",
                  updated_at: new Date().toISOString(),
                })
                .eq("id", q.id)
                .eq("user_id", user.id);
              return { q, result, citations };
            }),
          );
          for (let i = 0; i < settled.length; i++) {
            const r = settled[i];
            const q = batch[i];
            if (r.status === "fulfilled") {
              send("row", {
                row_index: q.row_index,
                question_id: q.id,
                draft_answer: r.value.result.answer,
                citations: r.value.citations,
                confidence: r.value.result.confidence,
                needs_review_reason: r.value.result.needs_review_reason,
              });
            } else {
              const reason = r.reason instanceof Error ? r.reason.message : String(r.reason);
              await supabase
                .from("questions")
                .update({
                  draft_answer: "",
                  confidence: "low",
                  needs_review_reason: `Draft failed: ${reason}`,
                  status: "drafted",
                  updated_at: new Date().toISOString(),
                })
                .eq("id", q.id)
                .eq("user_id", user.id);
              send("row", {
                row_index: q.row_index,
                question_id: q.id,
                draft_answer: "",
                citations: [],
                confidence: "low",
                needs_review_reason: `Draft failed: ${reason}`,
              });
            }
          }
        }

        await supabase
          .from("questionnaires")
          .update({ status: "complete" })
          .eq("id", questionnaireId)
          .eq("user_id", user.id);

        send("done", { ok: true });
        controller.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "draft failed";
        send("error", { message: msg });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
