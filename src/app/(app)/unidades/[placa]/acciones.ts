"use server";

import { revalidatePath } from "next/cache";
import { registrarLecturaKm } from "@/lib/data/lecturas";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { hoyEnLima, leerKm, revisarLecturaKm } from "@/lib/domain";

export type EstadoKm =
  | { estado: "inicial" }
  | { estado: "error"; mensaje: string }
  | { estado: "confirmar"; mensaje: string; km: number }
  | { estado: "guardado"; km: number };

export async function registrarKm(placa: string, _: EstadoKm, datos: FormData): Promise<EstadoKm> {
  const km = leerKm(String(datos.get("km") ?? ""));
  if (km == null)
    return { estado: "error", mensaje: "Escribe el kilometraje del tablero, solo números." };

  const vehiculo = await obtenerVehiculo(placa);
  if (!vehiculo) return { estado: "error", mensaje: "Esa unidad ya no existe." };

  const confirmado = datos.get("confirmado") === String(km);
  const revision = revisarLecturaKm(vehiculo.kmActual, km);
  if (!revision.ok && !confirmado) {
    return { estado: "confirmar", mensaje: `${revision.mensaje} ¿Lo escribiste bien?`, km };
  }

  await registrarLecturaKm(placa, km, hoyEnLima());
  revalidatePath("/", "layout");
  return { estado: "guardado", km };
}
