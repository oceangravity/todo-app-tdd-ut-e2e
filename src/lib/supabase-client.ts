import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database-types";

const supabaseUrl: string = process.env.SUPABASE_URL ?? "";
const supabaseAnonKey: string = process.env.SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
}

type SupabaseDatabaseClient = SupabaseClient<Database>;

export const supabaseClient: SupabaseDatabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
