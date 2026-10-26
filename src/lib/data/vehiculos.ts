import "server-only";
import type { DatosVehiculo, Vehiculo } from "@/lib/domain";
import { crearClienteServidor } from "@/lib/supabase/server";

/** Fila de la vista `vehiculos_estado` tal como la devuelve Supabase. */
interface FilaVehiculo {
  placa: string;
  conductor: string | null;
  marca: string | null;
  cuota_semanal: number | string;
  traseras_dobles: boolean;
  intervalo_aceite_km: number;
  soat_vence: string | null;
  revision_vence: string | null;
  km_actual: number | null;
  km_actual_fecha: string | null;
  km_ultimo_aceite: number | null;
}

function aVehiculo(f: FilaVehiculo): Vehiculo {
  return {
    placa: f.placa,
    conductor: f.conductor,
    marca: f.marca,
    // numeric de Postgres llega como texto
    cuotaSemanal: Number(f.cuota_semanal),
    traserasDobles: f.traseras_dobles,
    intervaloAceiteKm: f.intervalo_aceite_km,
    kmActual: f.km_actual,
    kmActualFecha: f.km_actual_fecha,
    kmUltimoAceite: f.km_ultimo_aceite,
    soatVence: f.soat_vence,
    revisionVence: f.revision_vence,
  };
}

export async function listarVehiculos(): Promise<Vehiculo[]> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("vehiculos_estado")
    .select("*")
    .eq("activo", true)
    .order("placa");
  if (error) throw new Error(`No se pudieron leer las unidades: ${error.message}`);
  return (data as FilaVehiculo[]).map(aVehiculo);
}

export async function obtenerVehiculo(placa: string): Promise<Vehiculo | null> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("vehiculos_estado")
    .select("*")
    .eq("placa", placa)
    .maybeSingle();
  if (error) throw new Error(`No se pudo leer la unidad ${placa}: ${error.message}`);
  return data ? aVehiculo(data as FilaVehiculo) : null;
}

function aFila(d: DatosVehiculo) {
  return {
    placa: d.placa,
    conductor: d.conductor,
    marca: d.marca,
    cuota_semanal: d.cuotaSemanal,
    traseras_dobles: d.traserasDobles,
    intervalo_aceite_km: d.intervaloAceiteKm,
    soat_vence: d.soatVence,
    revision_vence: d.revisionVence,
  };
}

/** Crea la unidad. Devuelve un mensaje si la placa ya existe. */
export async function crearVehiculo(d: DatosVehiculo): Promise<string | null> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("vehiculos").insert(aFila(d));
  if (error?.code === "23505") return `La placa ${d.placa} ya está registrada.`;
  if (error) throw new Error(`No se pudo guardar la unidad: ${error.message}`);
  return null;
}

export async function actualizarVehiculo(placa: string, d: DatosVehiculo): Promise<void> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("vehiculos").update(aFila(d)).eq("placa", placa);
  if (error) throw new Error(`No se pudo actualizar la unidad: ${error.message}`);
}
