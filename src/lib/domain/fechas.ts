/** Días entre dos fechas ISO (YYYY-MM-DD), sin efectos de zona horaria. */
export function diasEntre(desde: string, hasta: string): number {
  const a = Date.UTC(...partes(desde));
  const b = Date.UTC(...partes(hasta));
  return Math.round((b - a) / 86_400_000);
}

/** Lunes de la semana de la fecha dada, en ISO. */
export function lunesDe(fecha: string): string {
  const [y, m, d] = partes(fecha);
  const dt = new Date(Date.UTC(y, m, d));
  const offset = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - offset);
  return dt.toISOString().slice(0, 10);
}

function partes(fecha: string): [number, number, number] {
  const [y, m, d] = fecha.split("-").map(Number);
  if (!y || !m || !d) throw new Error(`Fecha inválida: ${fecha}`);
  return [y, m - 1, d];
}
