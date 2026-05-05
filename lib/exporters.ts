import * as XLSX from "xlsx";
import { detectAnswerColumn } from "@/lib/parsers";

export interface QuestionForExport {
  row_index: number;
  question_text: string;
  draft_answer: string | null;
  final_answer: string | null;
}

export interface ExportInput {
  format: "csv" | "xlsx";
  questionnaireName: string;
  questionColumn: string;
  layoutHeaders: string[];
  layoutRows: Record<string, string>[];
  questions: QuestionForExport[];
  watermark: boolean;
}

export function buildExport(input: ExportInput): { buffer: Buffer; filename: string; contentType: string } {
  const headers = [...input.layoutHeaders];
  const answerColumn = detectAnswerColumn(headers);
  if (!headers.includes(answerColumn)) headers.push(answerColumn);

  const byRow = new Map<number, QuestionForExport>();
  for (const q of input.questions) byRow.set(q.row_index, q);

  const filledRows = input.layoutRows.map((row, idx) => {
    const q = byRow.get(idx);
    const answer = q?.final_answer ?? q?.draft_answer ?? "";
    const out: Record<string, string> = {};
    for (const h of headers) out[h] = row[h] ?? "";
    out[answerColumn] = answer;
    return out;
  });

  if (input.watermark) {
    const note: Record<string, string> = {};
    for (const h of headers) note[h] = "";
    note[headers[0]] = "Drafted with TrustReply (free plan watermark)";
    filledRows.push(note);
  }

  const safeName = input.questionnaireName.replace(/[^\w\-]+/g, "_").slice(0, 60) || "trustreply";

  if (input.format === "csv") {
    const csv = toCsv(headers, filledRows);
    return {
      buffer: Buffer.from(csv, "utf8"),
      filename: `${safeName}-trustreply.csv`,
      contentType: "text/csv; charset=utf-8",
    };
  }

  const ws = XLSX.utils.json_to_sheet(filledRows, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Questionnaire");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return {
    buffer: buf,
    filename: `${safeName}-trustreply.xlsx`,
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
}

function toCsv(headers: string[], rows: Record<string, string>[]): string {
  const escape = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const head = headers.map(escape).join(",");
  const body = rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(",")).join("\n");
  return `${head}\n${body}\n`;
}
