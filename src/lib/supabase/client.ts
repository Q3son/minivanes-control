import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/** Cliente de Supabase para componentes del navegador. */
export function crearClienteSupabase() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
