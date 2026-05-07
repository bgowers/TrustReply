"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { GridOverlay } from "@/components/marketing/grid-overlay";
import { NoiseTexture } from "@/components/marketing/noise-texture";
import { Logomark } from "@/components/marketing/logomark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const origin = window.location.origin;
    const next =
      new URLSearchParams(window.location.search).get("next") ?? "/app";
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (err) {
      setError(err.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden text-white">
      {/* Pinned ink backdrop */}
      <AuroraBackground variant="login" className="fixed" />
      <GridOverlay variant="dark" className="fixed" />
      <NoiseTexture className="fixed" />

      <Link
        href="/"
        className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 text-[14px] font-semibold tracking-tight text-white/85 transition-opacity hover:opacity-100"
      >
        <Logomark className="text-white" /> TrustReply
      </Link>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="surface-glass-dark rounded-2xl border border-white/10 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                  <Mail className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Check your inbox
                </h1>
                <p className="mt-3 text-[14px] leading-relaxed text-white/65">
                  Magic link sent to{" "}
                  <span className="font-mono text-white">{email}</span>. It expires in 1
                  hour.
                </p>
                <p className="mt-6 text-[13px] text-white/50">
                  Didn&apos;t get it?{" "}
                  <button
                    type="button"
                    onClick={reset}
                    className="font-medium text-white underline-offset-4 hover:underline"
                  >
                    Send another
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow mb-3 text-[color:var(--color-ink-muted)]">
                  Sign in
                </p>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome to TrustReply.
                </h1>
                <p className="mt-2 text-[14px] leading-relaxed text-white/65">
                  We&apos;ll email you a magic link. No passwords to remember.
                </p>

                <form onSubmit={onSubmit} className="mt-8 space-y-4">
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      required
                      autoFocus
                      tone="ink"
                      floating
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label
                      htmlFor="email"
                      className="pointer-events-none absolute left-3 top-2.5 origin-top-left text-[13px] text-white/55 transition-all duration-200 peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-mono peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-white/65 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:text-white/65"
                    >
                      Work email
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="ink"
                    size="lg"
                    loading={status === "sending"}
                    className="w-full justify-center"
                  >
                    {status === "sending" ? "Sending" : "Send magic link"}
                    {status !== "sending" ? <ArrowRight className="h-4 w-4" /> : null}
                  </Button>

                  <AnimatePresence>
                    {error ? (
                      <motion.p
                        role="alert"
                        initial={
                          reduced
                            ? { opacity: 1 }
                            : {
                                opacity: 0,
                                y: -6,
                              }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-md border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-[13px] text-rose-200 [animation:shake-x_280ms_ease-in-out_1] motion-reduce:animate-none"
                      >
                        {error}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-[12px] text-white/40">
          By signing in you agree to our{" "}
          <Link
            href="/legal/terms"
            className="text-white/65 underline-offset-4 hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy"
            className="text-white/65 underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
