import Papa from "papaparse";
import * as XLSX from "xlsx";

export type SourceFormat = "csv" | "xlsx";

export interface ParsedSheet {
  format: SourceFormat;
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCsv(text: string): ParsedSheet {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  if (result.errors.length > 0) {
    const fatal = result.errors.find((e) => e.type === "Quotes" || e.type === "Delimiter");
    if (fatal) throw new Error(`CSV parse error: ${fatal.message}`);
  }
  const headers = (result.meta.fields ?? []).filter((h) => h && h.length > 0);
  const rows = (result.data || []).map((r) => {
    const out: Record<string, string> = {};
    for (const h of headers) out[h] = (r[h] ?? "").toString();
    return out;
  });
  return { format: "csv", headers, rows };
}

export function parseXlsx(buffer: ArrayBuffer): ParsedSheet {
  const wb = XLSX.read(buffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("Workbook has no sheets");
  const sheet = wb.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });
  const headers = json.length > 0 ? Object.keys(json[0]).filter((h) => h.trim().length > 0) : [];
  const rows = json.map((r) => {
    const out: Record<string, string> = {};
    for (const h of headers) out[h] = String(r[h] ?? "");
    return out;
  });
  return { format: "xlsx", headers, rows };
}

/**
 * Pick the column most likely to contain questions: among columns with ≥80%
 * non-empty cells and average length ≥20, return the one with the longest mean.
 * Falls back to the first column if no candidate qualifies.
 */
export function detectQuestionColumn(sheet: ParsedSheet): string {
  const { headers, rows } = sheet;
  if (headers.length === 0) throw new Error("No header columns detected");
  if (rows.length === 0) return headers[0];

  let best: { header: string; meanLen: number } | null = null;
  for (const h of headers) {
    let nonEmpty = 0;
    let totalLen = 0;
    for (const r of rows) {
      const v = (r[h] ?? "").toString().trim();
      if (v.length > 0) {
        nonEmpty++;
        totalLen += v.length;
      }
    }
    const filledRatio = nonEmpty / rows.length;
    const meanLen = nonEmpty > 0 ? totalLen / nonEmpty : 0;
    if (filledRatio < 0.8) continue;
    if (meanLen < 20) continue;
    // Prefer headers that look like a question column
    const looksLikeQuestion = /question|prompt|item|control|requirement|inquiry|ask/i.test(h);
    const score = meanLen + (looksLikeQuestion ? 1000 : 0);
    if (!best || score > best.meanLen) best = { header: h, meanLen: score };
  }
  return best?.header ?? headers[0];
}

export function detectAnswerColumn(headers: string[]): string {
  const match = headers.find((h) => /answer|response|reply|description/i.test(h));
  return match ?? "Answer";
}
