import { UploadDropzone } from "@/components/upload-dropzone";

export default function NewQuestionnairePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Upload a questionnaire</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          CSV or XLSX, ≤10 MB. We auto-detect the question column.
        </p>
      </header>
      <UploadDropzone />
    </div>
  );
}
