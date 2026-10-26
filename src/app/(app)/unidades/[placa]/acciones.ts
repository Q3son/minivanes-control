"use server";

import { revalidatePath } from "next/cache";
import { registrarLecturaKm } from "@/lib/data/lecturas";
import { registrarServicio } from "@/lib/data/servicios";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { esquemaServicio, hoyEnLima, leerKm, revisarLecturaKm, TIPOS_SERVICIO } from "@/lib/domain";

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

export type EstadoServicio = { errores?: Partial<Record<string, string>>; guardado?: string };

export async function registrarMantenimiento(
  placa: string,
  _: EstadoServicio,
  datos: FormData,
): Promise<EstadoServicio> {
  const r = esquemaServicio.safeParse({ ...Object.fromEntries(datos), fecha: hoyEnLima() });
  if (!r.success) {
    const errores: Record<string, string> = {};
    for (const i of r.error.issues) errores[String(i.path[0])] ??= i.message;
    return { errores };
  }
  await registrarServicio(placa, r.data);
  revalidatePath("/", "layout");
  return { guardado: TIPOS_SERVICIO[r.data.tipo] };
}
