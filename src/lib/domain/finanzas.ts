import type { Movimiento, Placa } from "./tipos";

export interface Resumen {
  cobrado: number;
  gastado: number;
  neto: number;
}

/** Resumen de un mes (YYYY-MM); si se pasa placa, solo de esa unidad. */
export function resumenMes(movimientos: Movimiento[], mes: string, placa?: Placa): Resumen {
  let cobrado = 0;
  let gastado = 0;
  for (const m of movimientos) {
    if (!m.fecha.startsWith(mes)) continue;
    if (placa && m.placa !== placa) continue;
    if (m.tipo === "ingreso") cobrado += m.monto;
    else gastado += m.monto;
  }
  return {
    cobrado: redondear(cobrado),
    gastado: redondear(gastado),
    neto: redondear(cobrado - gastado),
  };
}

/** Ranking de unidades por lo que dejaron en el mes. */
export function rankingPorUnidad(movimientos: Movimiento[], mes: string, placas: Placa[]) {
  return placas
    .map((placa) => ({ placa, ...resumenMes(movimientos, mes, placa) }))
    .sort((a, b) => b.neto - a.neto);
}

const redondear = (n: number) => Math.round(n * 100) / 100;
