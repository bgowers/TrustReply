import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import { buildExport, type ExportInput } from "@/lib/exporters";

const baseInput = (overrides: Partial<ExportInput> = {}): ExportInput => ({
  format: "csv",
  questionnaireName: "demo",
  questionColumn: "Question",
  layoutHeaders: ["Question", "Answer"],
  layoutRows: [
    { Question: "Do you encrypt at rest?", Answer: "" },
    { Question: "Do you have an IRP?", Answer: "" },
  ],
  questions: [
    { row_index: 0, question_text: "Do you encrypt at rest?", draft_answer: "Yes, AES-256.", final_answer: null },
    { row_index: 1, question_text: "Do you have an IRP?", draft_answer: "draft", final_answer: "Yes." },
  ],
  watermark: false,
  ...overrides,
});

describe("buildExport — CSV", () => {
  it("prefers final_answer over draft_answer", () => {
    const out = buildExport(baseInput());
    const csv = out.buffer.toString("utf8");
    expect(csv).toContain("Yes, AES-256.");
    expect(csv).toContain("Yes.");
    expect(csv).not.toMatch(/^draft$/m);
  });

  it("uses .csv filename and text/csv content type", () => {
    const out = buildExport(baseInput());
    expect(out.filename).toMatch(/\.csv$/);
    expect(out.contentType).toMatch(/text\/csv/);
  });

  it("appends a watermark row when watermark is true", () => {
    const out = buildExport(baseInput({ watermark: true }));
    const csv = out.buffer.toString("utf8");
    expect(csv).toContain("Drafted with TrustReply (free plan watermark)");
  });

  it.each([
    ["=cmd|' /C calc'!A1", "'=cmd|' /C calc'!A1"],
    ["+1+1", "'+1+1"],
    ["-2+3", "'-2+3"],
    ["@SUM(A1)", "'@SUM(A1)"],
    ["\tinjected", "'\tinjected"],
    ["\rmalicious", "'\rmalicious"],
  ])("neutralizes formula trigger %j", (raw, expected) => {
    const out = buildExport(
      baseInput({
        questions: [{ row_index: 0, question_text: "Q", draft_answer: null, final_answer: raw }],
        layoutRows: [{ Question: "Q", Answer: "" }],
      }),
    );
    const csv = out.buffer.toString("utf8");
    // The escaped expected value may be quoted by the CSV writer when it contains commas/newlines
    expect(csv).toMatch(new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/^'/, "'")));
  });

  it("does not prefix safe values", () => {
    const out = buildExport(
      baseInput({
        questions: [{ row_index: 0, question_text: "Q", draft_answer: null, final_answer: "Yes, we encrypt." }],
        layoutRows: [{ Question: "Q", Answer: "" }],
      }),
    );
    const csv = out.buffer.toString("utf8");
    expect(csv).not.toMatch(/^'Yes/m);
    expect(csv).toContain("Yes, we encrypt.");
  });
});

describe("buildExport — XLSX", () => {
  it("returns a parseable XLSX with the answer column populated", () => {
    const out = buildExport(baseInput({ format: "xlsx" }));
    expect(out.filename).toMatch(/\.xlsx$/);
    expect(out.contentType).toContain("spreadsheetml");

    const wb = XLSX.read(out.buffer, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
    expect(rows[0].Answer).toBe("Yes, AES-256.");
    expect(rows[1].Answer).toBe("Yes.");
  });

  it("neutralizes formula triggers in XLSX cells", () => {
    const out = buildExport(
      baseInput({
        format: "xlsx",
        questions: [
          { row_index: 0, question_text: "Q", draft_answer: null, final_answer: "=HYPERLINK(\"http://evil\",\"click\")" },
        ],
        layoutRows: [{ Question: "Q", Answer: "" }],
      }),
    );
    const wb = XLSX.read(out.buffer, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
    expect(rows[0].Answer.startsWith("'=")).toBe(true);
  });
});
