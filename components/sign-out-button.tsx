"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  async function onClick() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
    >
      Sign out
    </button>
  );
}
