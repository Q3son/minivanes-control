import { z } from "zod";
import { leerKm } from "./kilometraje";
import type { Llanta } from "./tipos";

export interface Posicion {
  codigo: string;
  nombre: string;
  lado: "izquierda" | "derecha" | "repuesto";
}

/** Posiciones de llanta según si la unidad tiene traseras dobles. */
export function posicionesDe(traserasDobles: boolean): Posicion[] {
  const traseras: Posicion[] = traserasDobles
    ? [
        { codigo: "TIE", nombre: "Trasera izq. afuera", lado: "izquierda" },
        { codigo: "TII", nombre: "Trasera izq. adentro", lado: "izquierda" },
        { codigo: "TDE", nombre: "Trasera der. afuera", lado: "derecha" },
        { codigo: "TDI", nombre: "Trasera der. adentro", lado: "derecha" },
      ]
    : [
        { codigo: "TI", nombre: "Trasera izq.", lado: "izquierda" },
        { codigo: "TD", nombre: "Trasera der.", lado: "derecha" },
      ];
  return [
    { codigo: "DI", nombre: "Delantera izq.", lado: "izquierda" },
    { codigo: "DD", nombre: "Delantera der.", lado: "derecha" },
    ...traseras,
    { codigo: "R", nombre: "Repuesto", lado: "repuesto" },
  ];
}

const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const kmTablero = z.string().transform((v, ctx) => {
  const km = leerKm(v);
  if (km == null) {
    ctx.addIssue({ code: "custom", message: "Escribe el kilometraje del tablero" });
    return z.NEVER;
  }
  return km;
});

const mm = z.preprocess(
  (v) => (typeof v === "string" ? v.replace(",", ".").trim() || null : v),
  z.coerce
    .number({ error: "Escribe la profundidad en mm" })
    .min(0)
    .max(25, "Revisa los mm")
    .nullable(),
);

const dot = (mensaje: string) =>
  z.string().transform((v, ctx) => {
    const d = normalizarDot(v);
    if (!d) {
      ctx.addIssue({ code: "custom", message: mensaje });
      return z.NEVER;
    }
    return d;
  });

/** Datos de la llanta nueva que se pone. */
export const esquemaLlantaNueva = z.object({
  km: kmTablero,
  marca: textoOpcional(40),
  medida: textoOpcional(20),
  dot: dot("Escribe los 4 números del DOT, por ejemplo 3826"),
  mm,
  codigoPropio: textoOpcional(20),
  precio: z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/[\s,]/g, "") || "0" : v),
    z.coerce.number({ error: "Escribe el precio en soles" }).min(0),
  ),
  foto: textoOpcional(300),
});

/** Datos de la llanta que sale. El DOT devuelto es obligatorio: es la prueba contra el engaño. */
export const esquemaRetiro = z.object({
  dotDevuelto: dot("Escribe el DOT de la llanta que te devuelven"),
  mmRetiro: mm,
  fotoRetiro: textoOpcional(300),
});

export type DatosLlantaNueva = z.infer<typeof esquemaLlantaNueva>;
export type DatosRetiro = z.infer<typeof esquemaRetiro>;

/** Km recorridos por una llanta: hasta su retiro o hasta el km actual si sigue puesta. */
export function kmRecorridos(llanta: Llanta, kmActual: number | null): number | null {
  const fin = llanta.kmRetiro ?? kmActual;
  if (fin == null) return null;
  return Math.max(0, fin - llanta.kmPuesta);
}

/**
 * Compara el DOT registrado al poner la llanta con el de la llanta que devuelven.
 * `null` cuando no hay datos para comparar.
 */
export function dotCoincide(llanta: Pick<Llanta, "dot" | "dotDevuelto">): boolean | null {
  const a = normalizarDot(llanta.dot);
  const b = normalizarDot(llanta.dotDevuelto);
  if (!a || !b) return null;
  return a === b;
}

export function normalizarDot(dot: string | null | undefined): string | null {
  if (!dot) return null;
  const digitos = dot.replace(/\D/g, "");
  return digitos.length === 4 ? digitos : null;
}
