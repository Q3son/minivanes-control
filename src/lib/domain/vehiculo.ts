import { z } from "zod";
import type { Alerta } from "./tipos";

export type EstadoVehiculo = "al-dia" | "revisar" | "atender";

/** Resume las alertas de una unidad en un solo estado para la lista. */
export function estadoVehiculo(alertas: Alerta[]): EstadoVehiculo {
  if (alertas.some((a) => a.severidad === "critica")) return "atender";
  if (alertas.length > 0) return "revisar";
  return "al-dia";
}

/** Quita espacios y guiones y pasa a mayúsculas: "abc-123" → "ABC123". */
export function normalizarPlaca(texto: string): string {
  return texto.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

const numero = (mensaje: string) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/[,\s]/g, "") : v),
    z.coerce.number({ error: mensaje }).nonnegative(mensaje),
  );

const fechaOpcional = z
  .string()
  .trim()
  .transform((v) => v || null)
  .pipe(z.iso.date({ error: "Fecha inválida" }).nullable());

/** Valida el formulario de alta y edición de una unidad. */
export const esquemaVehiculo = z.object({
  placa: z
    .string()
    .transform(normalizarPlaca)
    .pipe(
      z.string().regex(/^[A-Z0-9]{6}$/, "La placa tiene 6 letras o números, por ejemplo ABC123"),
    ),
  conductor: z
    .string()
    .trim()
    .max(80)
    .transform((v) => v || null),
  marca: z
    .string()
    .trim()
    .max(40)
    .transform((v) => v || null),
  cuotaSemanal: numero("Escribe la cuota en soles"),
  traserasDobles: z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean()),
  intervaloAceiteKm: numero("Escribe cada cuántos km se cambia el aceite").pipe(
    z.number().int().min(1000, "Mínimo 1,000 km").max(30000, "Máximo 30,000 km"),
  ),
  soatVence: fechaOpcional,
  revisionVence: fechaOpcional,
});

export type DatosVehiculo = z.infer<typeof esquemaVehiculo>;
