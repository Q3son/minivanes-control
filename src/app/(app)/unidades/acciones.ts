"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actualizarVehiculo, crearVehiculo } from "@/lib/data/vehiculos";
import { esquemaVehiculo } from "@/lib/domain";

export type EstadoFormulario = {
  errores?: Partial<Record<string, string>>;
  mensaje?: string;
};

function leer(datos: FormData) {
  return esquemaVehiculo.safeParse(Object.fromEntries(datos));
}

function erroresPorCampo(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const errores: Record<string, string> = {};
  for (const i of error.issues) errores[String(i.path[0])] ??= i.message;
  return errores;
}

export async function crearUnidad(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const r = leer(datos);
  if (!r.success) return { errores: erroresPorCampo(r.error) };
  const problema = await crearVehiculo(r.data);
  if (problema) return { errores: { placa: problema } };
  revalidatePath("/", "layout");
  redirect(`/unidades/${r.data.placa}`);
}

export async function editarUnidad(
  placa: string,
  _: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  datos.set("placa", placa);
  const r = leer(datos);
  if (!r.success) return { errores: erroresPorCampo(r.error) };
  await actualizarVehiculo(placa, r.data);
  revalidatePath("/", "layout");
  redirect(`/unidades/${placa}`);
}
