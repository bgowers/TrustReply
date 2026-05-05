import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { env } from "@/lib/env";

const MODEL = "claude-sonnet-4-6";

let clientSingleton: Anthropic | null = null;

function client() {
  if (!clientSingleton) {
    clientSingleton = new Anthropic({ apiKey: env.anthropic.apiKey() });
  }
  return clientSingleton;
}

export interface PolicyForPrompt {
  id: number;
  title: string;
  category: string;
  body: string;
}

export interface DraftRequest {
  companyName: string | null;
  policies: PolicyForPrompt[];
  question: string;
}

export interface DraftResult {
  answer: string;
  policy_ids: number[];
  confidence: "high" | "medium" | "low";
  needs_review_reason?: string;
}

const draftSchema = z.object({
  answer: z.string().min(1),
  policy_ids: z.array(z.number().int()),
  confidence: z.enum(["high", "medium", "low"]),
  needs_review_reason: z.string().optional(),
});

const SYSTEM_PROMPT = `You are TrustReply, an expert security analyst drafting answers to enterprise security questionnaires (SIG, CAIQ, custom Excel) on behalf of a B2B SaaS vendor.

Rules:
- Ground every answer ONLY in the provided policy library. Do not invent capabilities.
- If the policies don't address the question, say so plainly and set confidence to "low" with a needs_review_reason.
- Match the question's expected answer format: "Yes/No" questions get a one-line yes/no plus 1-2 sentences of detail; open-ended questions get 2-4 sentences.
- Never quote policies verbatim — paraphrase. Never expose internal IDs or category names in the answer text.
- Cite the policy IDs you used in policy_ids. Cite only policies that materially supported the answer.
- Tone: calm, technical, specific. No marketing language. No exclamation marks.
- Always return valid JSON matching the schema. No prose outside JSON.

Output JSON schema:
{ "answer": string, "policy_ids": number[], "confidence": "high"|"medium"|"low", "needs_review_reason"?: string }`;

function policyBlock(companyName: string | null, policies: PolicyForPrompt[]): string {
  const company = companyName ? `Company: ${companyName}\n\n` : "";
  const lines = policies.map((p) => `[id ${p.id}] (${p.category}) ${p.title}\n${p.body}`);
  return `${company}Policy library:\n\n${lines.join("\n\n---\n\n")}`;
}

export async function draftAnswer(req: DraftRequest): Promise<DraftResult> {
  const c = client();
  const policyText = policyBlock(req.companyName, req.policies);

  const response = await c.messages.create({
    model: MODEL,
    max_tokens: 800,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: policyText,
            cache_control: { type: "ephemeral" },
          },
          {
            type: "text",
            text: `Question:\n${req.question}\n\nReturn only JSON.`,
          },
        ],
      },
    ],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { text: string }).text)
    .join("");

  const parsed = parseJsonLoose(text);
  const result = draftSchema.safeParse(parsed);
  if (!result.success) {
    // One retry with explicit error feedback
    const retry = await c.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${policyText}\n\nQuestion:\n${req.question}\n\nThe previous response was not valid JSON matching the schema. Return strictly valid JSON only, with keys answer, policy_ids, confidence, and optionally needs_review_reason.`,
        },
      ],
    });
    const retryText = retry.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("");
    const retryParsed = parseJsonLoose(retryText);
    const retryResult = draftSchema.safeParse(retryParsed);
    if (!retryResult.success) {
      return {
        answer: text.slice(0, 400) || "Unable to generate a structured answer.",
        policy_ids: [],
        confidence: "low",
        needs_review_reason: "AI did not return valid structured output",
      };
    }
    return retryResult.data;
  }
  return result.data;
}

function parseJsonLoose(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Strip markdown fences
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) {
      try {
        return JSON.parse(fenced[1]);
      } catch {
        // fall through
      }
    }
    // Find first {...} block
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) {
      try {
        return JSON.parse(trimmed.slice(first, last + 1));
      } catch {
        // fall through
      }
    }
    return null;
  }
}
