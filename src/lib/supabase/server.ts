import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Se crea uno nuevo en cada petición.
 */
export async function crearClienteServidor() {
  const almacen = await cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Desde un Server Component no se pueden escribir cookies; el proxy ya refresca la sesión.
        }
      },
    },
  });
}

/** Devuelve el usuario con sesión o null. Valida el token contra Supabase, no solo la cookie. */
export async function usuarioActual() {
  const supabase = await crearClienteServidor();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
