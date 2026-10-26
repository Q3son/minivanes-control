import "server-only";
import { perfilDeMetadatos, type DatosPerfil, type Perfil } from "@/lib/domain";
import { crearClienteServidor } from "@/lib/supabase/server";

/**
 * Perfil del usuario con sesión. Se lee de los datos del token (sin ir a la red),
 * así que el saludo no hace más lenta ninguna pantalla.
 */
export async function obtenerPerfil(): Promise<Perfil> {
  const supabase = await crearClienteServidor();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  return perfilDeMetadatos(claims?.user_metadata, (claims?.email as string | undefined) ?? null);
}

/** Guarda nombre y empresa, y renueva la sesión para que el token ya los traiga. */
export async function guardarPerfil(p: DatosPerfil): Promise<void> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.updateUser({ data: p });
  if (error) throw new Error(`No se pudo guardar tu perfil: ${error.message}`);
  await supabase.auth.refreshSession();
}
