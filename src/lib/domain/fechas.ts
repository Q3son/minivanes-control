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

/** Fecha de hoy en Perú (YYYY-MM-DD), sin importar la zona horaria del servidor. */
export function hoyEnLima(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];

/** "2026-11-05" → "5 nov 2026" */
export function fechaCorta(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${y}`;
}

/** Primer y último día de un mes "YYYY-MM". */
export function rangoDelMes(mes: string): [string, string] {
  const [y, m] = mes.split("-").map(Number);
  const ultimo = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return [`${mes}-01`, `${mes}-${String(ultimo).padStart(2, "0")}`];
}
