"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState<{ message: string } | null>(null);

  function pick() {
    inputRef.current?.click();
  }

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setPaywall(null);

    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/questionnaires", { method: "POST", body: fd });

    if (res.status === 402) {
      const body = await res.json();
      setPaywall({ message: body.message ?? "Upgrade to upload more questionnaires." });
      setBusy(false);
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Upload failed");
      setBusy(false);
      return;
    }
    const body = (await res.json()) as { id: number };
    router.push(`/app/questionnaires/${body.id}?start=1`);
  }

  return (
    <div className="space-y-4">
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-white p-10 text-center"
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) setFile(f);
        }}
      >
        <p className="text-sm font-medium">Drop a CSV or XLSX, or</p>
        <Button type="button" variant="secondary" onClick={pick}>
          Choose file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file && (
          <p className="text-xs text-[color:var(--color-muted)]">
            {file.name} · {(file.size / 1024).toFixed(1)} KB
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button disabled={!file || busy} onClick={upload}>
          {busy ? "Uploading…" : "Upload"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-[color:var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
      {paywall && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="font-medium text-amber-900">{paywall.message}</p>
          <p className="mt-1 text-amber-800">
            <Link className="underline" href="/app/billing">
              View plans &amp; upgrade
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
