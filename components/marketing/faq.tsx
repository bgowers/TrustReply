import { FaqItem } from "./faq-item";

const COLUMN_A = [
  {
    q: "Will my policies be used to train models?",
    a: "No. We use Anthropic's zero-retention API. Your policies and questionnaire content are never used to train upstream models, and they are not retained beyond the time needed to draft answers.",
  },
  {
    q: "Can I export answers back into the original spreadsheet format?",
    a: "Yes. Export preserves the original CSV or XLSX layout — answer column position, header row, and sheet structure are kept intact. Free-plan exports include a small footer watermark; Solo and Team don't.",
  },
  {
    q: "What file types do you support?",
    a: "CSV and XLSX, up to 10 MB. Auto-detection finds the question column heuristically (longest string column with ≥80% non-empty cells). PDF questionnaire parsing is on the roadmap, not in v1.",
  },
];

const COLUMN_B = [
  {
    q: "Where are answers processed?",
    a: "EU regions. Authentication and database run on Supabase EU; AI calls go to Anthropic with EU residency where available. Data residency details are in /legal/privacy.",
  },
  {
    q: "How accurate are the drafts? Do I still review them?",
    a: "Drafts are a starting point. Every answer comes with a confidence label (high / medium / low) and a list of cited policies. You should review every row before exporting — that's why the review table exists.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from the Stripe Customer Portal at any point. We don't lock you into annual contracts and we offer a 7-day money-back guarantee on Solo and Team.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-[color:var(--color-bg)] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-[color:var(--color-muted)]">06 · FAQ</p>
          <h2 className="mt-6 t-h1 tracking-tight">
            Things buyers ask before signing up.
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-x-12 lg:grid-cols-2">
          <div>
            {COLUMN_A.map((item) => (
              <FaqItem key={item.q} question={item.q}>
                {item.a}
              </FaqItem>
            ))}
          </div>
          <div>
            {COLUMN_B.map((item) => (
              <FaqItem key={item.q} question={item.q}>
                {item.a}
              </FaqItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
