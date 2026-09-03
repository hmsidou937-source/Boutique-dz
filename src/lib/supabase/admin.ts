import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY client using the service role key. Bypasses Row Level
// Security. Only ever import this inside src/app/admin/**/actions.ts
// or other server-side code — never in a "use client" file.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
