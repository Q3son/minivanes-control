/** Saltos mayores a esto entre dos lecturas casi siempre son errores de tipeo. */
export const SALTO_SOSPECHOSO_KM = 15_000;

export type RevisionKm = { ok: true } | { ok: false; motivo: "menor" | "salto"; mensaje: string };

/**
 * Revisa una lectura nueva contra la anterior antes de guardarla.
 * Evita casos como 586,653 km escrito en lugar de 176,653 km.
 */
export function revisarLecturaKm(anterior: number | null, nueva: number): RevisionKm {
  if (!Number.isFinite(nueva) || nueva < 0) {
    return { ok: false, motivo: "menor", mensaje: "El kilometraje debe ser un número positivo." };
  }
  if (anterior == null) return { ok: true };
  if (nueva < anterior) {
    return {
      ok: false,
      motivo: "menor",
      mensaje: `Es menor que la última lectura (${anterior.toLocaleString("es-PE")} km).`,
    };
  }
  if (nueva - anterior > SALTO_SOSPECHOSO_KM) {
    return {
      ok: false,
      motivo: "salto",
      mensaje: `Son ${(nueva - anterior).toLocaleString("es-PE")} km más que la última lectura.`,
    };
  }
  return { ok: true };
}
