import { z } from "zod";
import { leerKm } from "./kilometraje";

export const TIPOS_SERVICIO = {
  aceite: "Cambio de aceite",
  frenos: "Frenos / pastillas",
  alineamiento: "Alineamiento y balanceo",
  reparacion: "Reparación",
  otro: "Otro trabajo",
} as const;

export type TipoServicio = keyof typeof TIPOS_SERVICIO;

export const esquemaServicio = z.object({
  tipo: z.enum(Object.keys(TIPOS_SERVICIO) as [TipoServicio, ...TipoServicio[]], {
    error: "Elige qué se hizo",
  }),
  km: z.string().transform((v, ctx) => {
    const km = leerKm(v);
    if (km == null) {
      ctx.addIssue({ code: "custom", message: "Escribe el kilometraje del tablero" });
      return z.NEVER;
    }
    return km;
  }),
  costo: z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/[\s,]/g, "") || "0" : v),
    z.coerce
      .number({ error: "Escribe el costo en soles" })
      .min(0, "El costo no puede ser negativo"),
  ),
  nota: z
    .string()
    .trim()
    .max(140)
    .transform((v) => v || null),
  fecha: z.iso.date({ error: "Fecha inválida" }),
});

export type DatosServicio = z.infer<typeof esquemaServicio>;
