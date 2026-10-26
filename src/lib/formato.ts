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

/** Monto en soles: "S/ 1,250" o "S/ 1,250.50". */
export const soles = (n: number) =>
  `${n < 0 ? "−" : ""}S/ ${Math.abs(n).toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/** "2026-11" → "noviembre"; con corto, "nov". */
export function nombreMes(mes: string, corto = false) {
  const nombre = MESES[Number(mes.slice(5, 7)) - 1] ?? mes;
  return corto ? nombre.slice(0, 3) : nombre;
}
