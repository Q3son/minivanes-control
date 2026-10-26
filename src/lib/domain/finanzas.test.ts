import { describe, expect, it } from "vitest";
import { rankingPorUnidad, resumenMes } from "./finanzas";
import type { Movimiento } from "./tipos";

const movs: Movimiento[] = [
  { placa: "ABC123", tipo: "ingreso", monto: 1050, fecha: "2026-11-03" },
  { placa: "ABC123", tipo: "gasto", monto: 185.5, fecha: "2026-11-05" },
  { placa: "DEF456", tipo: "ingreso", monto: 1300, fecha: "2026-11-04" },
  { placa: "DEF456", tipo: "ingreso", monto: 1300, fecha: "2026-10-28" },
];

describe("finanzas", () => {
  it("resume solo el mes pedido", () => {
    expect(resumenMes(movs, "2026-11")).toEqual({ cobrado: 2350, gastado: 185.5, neto: 2164.5 });
  });

  it("filtra por placa", () => {
    expect(resumenMes(movs, "2026-11", "ABC123").neto).toBe(864.5);
  });

  it("ordena las unidades por lo que dejaron", () => {
    expect(rankingPorUnidad(movs, "2026-11", ["ABC123", "DEF456"]).map((r) => r.placa)).toEqual([
      "DEF456",
      "ABC123",
    ]);
  });
});
