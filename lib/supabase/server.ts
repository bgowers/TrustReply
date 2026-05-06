import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabase.url(), env.supabase.publishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — safe to ignore; middleware refreshes.
        }
      },
    },
  });
}

import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js";

// Until we generate typed Database bindings, treat the service client schema as
// permissive (`any`). RLS is bypassed here intentionally for system writes from
// trusted server-only paths (Stripe webhook handler).
let serviceSingleton: SupabaseClient<any, "public", any> | null = null;

export function getSupabaseServiceClient(): SupabaseClient<any, "public", any> {
  if (!serviceSingleton) {
    serviceSingleton = createServiceClient<any, "public", any>(
      env.supabase.url(),
      env.supabase.secretKey(),
      { auth: { persistSession: false } },
    );
  }
  return serviceSingleton;
}
