import { describe, expect, it } from "vitest";
import { rankingPorUnidad, resumenMes } from "./finanzas";
import type { Movimiento } from "./tipos";

const movs: Movimiento[] = [
  { placa: "XBG963", tipo: "ingreso", monto: 1050, fecha: "2026-11-03" },
  { placa: "XBG963", tipo: "gasto", monto: 185.5, fecha: "2026-11-05" },
  { placa: "D6T963", tipo: "ingreso", monto: 1300, fecha: "2026-11-04" },
  { placa: "D6T963", tipo: "ingreso", monto: 1300, fecha: "2026-10-28" },
];

describe("finanzas", () => {
  it("resume solo el mes pedido", () => {
    expect(resumenMes(movs, "2026-11")).toEqual({ cobrado: 2350, gastado: 185.5, neto: 2164.5 });
  });

  it("filtra por placa", () => {
    expect(resumenMes(movs, "2026-11", "XBG963").neto).toBe(864.5);
  });

  it("ordena las unidades por lo que dejaron", () => {
    expect(rankingPorUnidad(movs, "2026-11", ["XBG963", "D6T963"]).map((r) => r.placa)).toEqual([
      "D6T963",
      "XBG963",
    ]);
  });
});
