"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { registrarCobro, registrarGasto } from "@/lib/data/movimientos";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { esquemaGasto, hoyEnLima } from "@/lib/domain";

/** Cobra la cuota semanal de la unidad con un solo toque. */
export async function cobrarCuota(datos: FormData): Promise<void> {
  const vehiculo = await obtenerVehiculo(String(datos.get("placa") ?? ""));
  if (!vehiculo || vehiculo.cuotaSemanal <= 0) return;
  await registrarCobro(vehiculo.placa, vehiculo.cuotaSemanal, hoyEnLima());
  revalidatePath("/", "layout");
}

export type EstadoGasto = { errores?: Partial<Record<string, string>> };

export async function anotarGasto(_: EstadoGasto, datos: FormData): Promise<EstadoGasto> {
  const r = esquemaGasto.safeParse(Object.fromEntries(datos));
  if (!r.success) {
    const errores: Record<string, string> = {};
    for (const i of r.error.issues) errores[String(i.path[0])] ??= i.message;
    return { errores };
  }
  await registrarGasto(r.data);
  revalidatePath("/", "layout");
  redirect(`/?gasto=ok`);
}
