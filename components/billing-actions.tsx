"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function UpgradeButton({
  plan,
  label,
  variant = "primary",
}: {
  plan: "solo" | "team";
  label: string;
  variant?: "primary" | "secondary";
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.url) {
      setError(body.error ?? "Could not start checkout");
      setBusy(false);
      return;
    }
    window.location.href = body.url;
  }

  return (
    <div className="space-y-2">
      <Button onClick={start} disabled={busy} variant={variant} className="w-full">
        {busy ? "Redirecting…" : label}
      </Button>
      {error && (
        <p className="text-xs text-[color:var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ManageBillingButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.url) {
      setError(body.error ?? "Could not open customer portal");
      setBusy(false);
      return;
    }
    window.location.href = body.url;
  }

  return (
    <div className="space-y-2">
      <Button onClick={open} disabled={busy} variant="secondary">
        {busy ? "Opening…" : "Manage billing"}
      </Button>
      {error && (
        <p className="text-xs text-[color:var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
