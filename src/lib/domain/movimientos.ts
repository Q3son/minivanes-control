import { z } from "zod";
import { lunesDe } from "./fechas";
import type { Movimiento, Vehiculo } from "./tipos";

export const CATEGORIAS_GASTO = {
  repuesto: "Repuesto",
  mecanico: "Mecánico",
  soat: "SOAT",
  revision_tecnica: "Revisión técnica",
  tramite: "Trámite o papeleta",
  lavado: "Lavado",
  otro: "Otro",
} as const;

export type CategoriaGasto = keyof typeof CATEGORIAS_GASTO;

const monto = z.preprocess(
  (v) => (typeof v === "string" ? v.replace(/[\s,]/g, "") : v),
  z.coerce
    .number({ error: "Escribe el monto en soles" })
    .positive("El monto debe ser mayor a cero")
    .max(100_000, "Revisa el monto"),
);

export const esquemaGasto = z.object({
  placa: z.string().regex(/^[A-Z0-9]{6}$/, "Elige la unidad"),
  categoria: z.enum(Object.keys(CATEGORIAS_GASTO) as [CategoriaGasto, ...CategoriaGasto[]], {
    error: "Elige en qué fue el gasto",
  }),
  monto,
  fecha: z.iso.date({ error: "Fecha inválida" }),
  nota: z
    .string()
    .trim()
    .max(140)
    .transform((v) => v || null),
});

export type DatosGasto = z.infer<typeof esquemaGasto>;

export interface CobroSemana {
  vehiculo: Vehiculo;
  cobrado: number | null;
}

/** Para cada unidad, cuánto se le cobró en la semana del lunes dado (o null si falta). */
export function cobrosDeLaSemana(
  vehiculos: Vehiculo[],
  movimientos: Movimiento[],
  lunes: string,
): CobroSemana[] {
  return vehiculos.map((vehiculo) => {
    const pagos = movimientos.filter(
      (m) => m.tipo === "ingreso" && m.placa === vehiculo.placa && lunesDe(m.fecha) === lunes,
    );
    return {
      vehiculo,
      cobrado: pagos.length ? pagos.reduce((s, m) => s + m.monto, 0) : null,
    };
  });
}
