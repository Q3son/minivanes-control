import { z } from "zod";

export interface Perfil {
  nombre: string | null;
  empresa: string | null;
  correo: string | null;
}

const texto = (max: number, mensaje: string) =>
  z
    .string()
    .trim()
    .max(max, mensaje)
    .transform((v) => v.replace(/\s+/g, " ") || null);

export const esquemaPerfil = z.object({
  nombre: texto(40, "Usa máximo 40 letras").refine((v) => v != null && v.length >= 2, {
    message: "Escribe cómo quieres que te saludemos",
  }),
  empresa: texto(60, "Usa máximo 60 letras"),
});

export type DatosPerfil = z.infer<typeof esquemaPerfil>;

/** Lee nombre y empresa de los metadatos del usuario sin confiar en su forma. */
export function perfilDeMetadatos(meta: unknown, correo: string | null = null): Perfil {
  const m = (meta && typeof meta === "object" ? meta : {}) as Record<string, unknown>;
  const leer = (k: string) => (typeof m[k] === "string" && m[k].trim() ? m[k].trim() : null);
  return { nombre: leer("nombre"), empresa: leer("empresa"), correo };
}

/** Hora (0–23) en Perú. */
export function horaEnLima(ahora: Date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Lima",
      hour: "numeric",
      hourCycle: "h23",
    }).format(ahora),
  );
}

/** «Buenos días» de 5 a 11:59, «Buenas tardes» de 12 a 18:59 y «Buenas noches» el resto. */
export function saludoSegunHora(hora: number): string {
  if (hora >= 5 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "setiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** "2026-10-26" → "lunes 26 de octubre" */
export function fechaLarga(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const dia = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DIAS[dia]} ${d} de ${MESES[m - 1]}`;
}

/** Letra para el avatar: la del nombre sin «Don»/«Doña», o la del correo. */
export function inicialDe(p: Perfil): string {
  const base = (p.nombre ?? p.correo ?? "?").replace(/^(don|doña|sr\.?|sra\.?)\s+/i, "");
  return base.charAt(0).toUpperCase() || "?";
}
