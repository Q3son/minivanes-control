"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cambiarLlanta, listarLlantas } from "@/lib/data/llantas";
import { dotCoincide, esquemaLlantaNueva, esquemaRetiro, hoyEnLima } from "@/lib/domain";

export type EstadoCambio = { errores?: Partial<Record<string, string>> };

function juntarErrores(...listas: { path: PropertyKey[]; message: string }[][]) {
  const errores: Record<string, string> = {};
  for (const i of listas.flat()) errores[String(i.path[0])] ??= i.message;
  return errores;
}

export async function cambiarLlantaAccion(
  placa: string,
  posicion: string,
  _: EstadoCambio,
  datos: FormData,
): Promise<EstadoCambio> {
  const campos = Object.fromEntries(datos);
  const actual = (await listarLlantas(placa)).find(
    (l) => l.posicion === posicion && !l.fechaRetiro,
  );

  const nueva = esquemaLlantaNueva.safeParse(campos);
  const retiro = actual ? esquemaRetiro.safeParse(campos) : null;
  if (!nueva.success || (retiro && !retiro.success)) {
    return {
      errores: juntarErrores(
        nueva.success ? [] : nueva.error.issues,
        retiro && !retiro.success ? retiro.error.issues : [],
      ),
    };
  }
  if (actual && nueva.data.km < actual.kmPuesta) {
    return {
      errores: {
        km: `Es menor al km con que se puso la llanta anterior (${actual.kmPuesta.toLocaleString("es-PE")}).`,
      },
    };
  }

  await cambiarLlanta(placa, posicion, nueva.data, retiro?.data ?? null, hoyEnLima());
  revalidatePath("/", "layout");

  const engano =
    actual &&
    retiro?.success &&
    dotCoincide({ dot: actual.dot, dotDevuelto: retiro.data.dotDevuelto }) === false;
  redirect(`/unidades/${placa}/llantas${engano ? "?aviso=no-coincide" : "?aviso=ok"}`);
}
