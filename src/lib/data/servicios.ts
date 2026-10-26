import "server-only";
import type { DatosServicio, Servicio } from "@/lib/domain";
import { crearClienteServidor } from "@/lib/supabase/server";

/** Guarda un mantenimiento. La base de datos también lo registra como lectura de km. */
export async function registrarServicio(placa: string, s: DatosServicio): Promise<void> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("servicios").insert({ placa, ...s });
  if (error) throw new Error(`No se pudo guardar el mantenimiento: ${error.message}`);
}

/** Mantenimientos de una unidad, del más reciente al más antiguo. */
export async function listarServicios(placa: string): Promise<Servicio[]> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("servicios")
    .select("id,tipo,km,costo,nota,fecha")
    .eq("placa", placa)
    .order("fecha", { ascending: false })
    .order("km", { ascending: false });
  if (error) throw new Error(`No se pudo leer el historial: ${error.message}`);
  return (data ?? []).map((s) => ({ ...s, costo: Number(s.costo) }) as Servicio);
}
