import { describe, it, expect } from "vitest";
import { detectAnswerColumn, detectQuestionColumn, parseCsv, type ParsedSheet } from "@/lib/parsers";

describe("parseCsv", () => {
  it("trims headers and returns string-coerced rows", () => {
    const out = parseCsv("  Question  ,Answer\nDo you encrypt?,Yes\n");
    expect(out.format).toBe("csv");
    expect(out.headers).toEqual(["Question", "Answer"]);
    expect(out.rows).toEqual([{ Question: "Do you encrypt?", Answer: "Yes" }]);
  });

  it("skips empty lines", () => {
    const out = parseCsv("Q,A\nfoo,1\n\nbar,2\n");
    expect(out.rows.map((r) => r.Q)).toEqual(["foo", "bar"]);
  });
});

describe("detectQuestionColumn", () => {
  function sheet(headers: string[], rows: Record<string, string>[]): ParsedSheet {
    return { format: "csv", headers, rows };
  }

  it("falls back to the first column when the sheet has no rows", () => {
    expect(detectQuestionColumn(sheet(["A", "B"], []))).toBe("A");
  });

  it("throws when there are no headers", () => {
    expect(() => detectQuestionColumn(sheet([], []))).toThrow();
  });

  it("ignores columns whose mean length is too short even if filled", () => {
    const rows = Array.from({ length: 10 }, () => ({ Short: "yes", Long: "x".repeat(40) }));
    expect(detectQuestionColumn(sheet(["Short", "Long"], rows))).toBe("Long");
  });

  it("ignores columns with <80% non-empty cells", () => {
    const rows = [
      { Sparse: "x".repeat(60), Dense: "y".repeat(30) },
      { Sparse: "", Dense: "y".repeat(30) },
      { Sparse: "", Dense: "y".repeat(30) },
      { Sparse: "", Dense: "y".repeat(30) },
      { Sparse: "", Dense: "y".repeat(30) },
    ];
    expect(detectQuestionColumn(sheet(["Sparse", "Dense"], rows))).toBe("Dense");
  });

  it("prefers a column whose header looks like a question over a longer-mean one", () => {
    const rows = Array.from({ length: 5 }, () => ({
      Notes: "x".repeat(80),
      Question: "y".repeat(40),
    }));
    expect(detectQuestionColumn(sheet(["Notes", "Question"], rows))).toBe("Question");
  });

  it("falls back to the first header when no column qualifies", () => {
    const rows = [{ A: "hi", B: "yo" }];
    expect(detectQuestionColumn(sheet(["A", "B"], rows))).toBe("A");
  });
});

describe("detectAnswerColumn", () => {
  it("matches answer/response/reply/description headers", () => {
    expect(detectAnswerColumn(["Q", "Response"])).toBe("Response");
    expect(detectAnswerColumn(["Question", "Reply Text"])).toBe("Reply Text");
    expect(detectAnswerColumn(["Question", "Description"])).toBe("Description");
  });

  it('returns "Answer" when no header matches', () => {
    expect(detectAnswerColumn(["Question", "Notes"])).toBe("Answer");
  });
});
