"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  AnimatePresence,
} from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logomark } from "@/components/marketing/logomark";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#product", label: "Product" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#security", label: "Security" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isHero = pathname === "/";
  const { scrollY } = useScroll();
  const [scrolledPastTop, setScrolledPastTop] = useState(false);
  const [open, setOpen] = useState(false);
  const scrolled = !isHero || scrolledPastTop;

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolledPastTop(y > 8);
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0)",
          color: scrolled ? "rgb(11, 18, 32)" : "rgb(255, 255, 255)",
          borderColor: scrolled ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md ${
          scrolled ? "saturate-150" : ""
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight"
          >
            <Logomark
              className={`transition-colors duration-200 ${
                scrolled ? "text-[color:var(--color-accent)]" : "text-white"
              }`}
            />
            <span>TrustReply</span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13.5px] lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-underline opacity-80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="text-[13.5px] font-medium opacity-80 transition-opacity hover:opacity-100"
            >
              Sign in
            </Link>
            <Button
              size="sm"
              variant={scrolled ? "primary" : "ink"}
              magnetic
              className="rounded-full"
              onClick={() => router.push("/login")}
            >
              Start free
            </Button>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 lg:hidden"
            style={{ borderColor: "currentColor" }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-[color:var(--color-ink)] text-white lg:hidden"
          >
            <div className="absolute inset-0 surface-glass-dark" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 30%, rgba(99,102,241,0.45), transparent 70%)",
              }}
            />
            <div className="relative flex h-full flex-col px-6 pt-5">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight"
                >
                  <Logomark className="text-white" /> TrustReply
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-white/15"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-16 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-2xl font-semibold tracking-tight"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * NAV_LINKS.length, duration: 0.3 }}
                  className="mt-8"
                >
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md border border-white/15 bg-white font-medium text-[color:var(--color-ink)]"
                  >
                    Start free
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isHero ? <div aria-hidden className="h-16" /> : null}
    </>
  );
}
