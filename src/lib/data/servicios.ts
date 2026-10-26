import "server-only";
import type { DatosServicio } from "@/lib/domain";
import { crearClienteServidor } from "@/lib/supabase/server";

/** Guarda un mantenimiento. La base de datos también lo registra como lectura de km. */
export async function registrarServicio(placa: string, s: DatosServicio): Promise<void> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("servicios").insert({ placa, ...s });
  if (error) throw new Error(`No se pudo guardar el mantenimiento: ${error.message}`);
}
