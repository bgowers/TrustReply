"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const origin = window.location.origin;
    const next = new URLSearchParams(window.location.search).get("next") ?? "/app";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in to TrustReply</h1>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        We&apos;ll email you a magic link. No passwords.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Work email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-1 block w-full rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm shadow-sm focus:border-[color:var(--color-accent)]"
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="w-full rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--color-accent-hover)] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : status === "sent" ? "Check your inbox" : "Send magic link"}
        </button>
        {error && (
          <p className="text-sm text-[color:var(--color-danger)]" role="alert">
            {error}
          </p>
        )}
        {status === "sent" && (
          <p className="text-sm text-[color:var(--color-success)]">
            Magic link sent to {email}. It expires in 1 hour.
          </p>
        )}
      </form>
    </main>
  );
}
