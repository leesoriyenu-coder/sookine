import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient(useServiceRole = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const key = useServiceRole 
    ? process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
    
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}
