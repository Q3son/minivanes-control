"use server";

import { revalidatePath } from "next/cache";
import { guardarPerfil } from "@/lib/data/perfil";
import { esquemaPerfil } from "@/lib/domain";

export type EstadoPerfil = {
  guardado?: boolean;
  errores?: Partial<Record<"nombre" | "empresa", string>>;
  mensaje?: string;
};

export async function actualizarPerfil(_: EstadoPerfil, datos: FormData): Promise<EstadoPerfil> {
  const r = esquemaPerfil.safeParse({
    nombre: String(datos.get("nombre") ?? ""),
    empresa: String(datos.get("empresa") ?? ""),
  });
  if (!r.success) {
    const errores: EstadoPerfil["errores"] = {};
    for (const i of r.error.issues) errores[i.path[0] as "nombre" | "empresa"] ??= i.message;
    return { errores };
  }
  try {
    await guardarPerfil(r.data);
  } catch {
    return { mensaje: "No se pudo guardar. Revisa tu conexión e inténtalo otra vez." };
  }
  revalidatePath("/", "layout");
  return { guardado: true };
}
