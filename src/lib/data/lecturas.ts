import "server-only";
import { crearClienteServidor } from "@/lib/supabase/server";

export async function registrarLecturaKm(placa: string, km: number, fecha: string): Promise<void> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("lecturas_km").insert({ placa, km, fecha });
  if (error) throw new Error(`No se pudo guardar el kilometraje: ${error.message}`);
}
