import { describe, expect, it } from "vitest";
import { gananciaPorMes, mesesHasta, rankingPorUnidad, resumenMes } from "./finanzas";
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

describe("mesesHasta", () => {
  it("cuenta hacia atrás cruzando el año", () => {
    expect(mesesHasta("2027-02", 4)).toEqual(["2026-11", "2026-12", "2027-01", "2027-02"]);
  });
  it("con n = 1 devuelve solo el mes", () => {
    expect(mesesHasta("2026-11", 1)).toEqual(["2026-11"]);
  });
});

describe("gananciaPorMes", () => {
  const movs: Movimiento[] = [
    { placa: "ABC123", tipo: "ingreso", monto: 1000, fecha: "2026-11-03" },
    { placa: "ABC123", tipo: "gasto", monto: 250, fecha: "2026-11-10" },
    { placa: "ABC123", tipo: "gasto", monto: 400, fecha: "2026-12-01" },
    { placa: "XYZ789", tipo: "ingreso", monto: 900, fecha: "2026-12-02" },
  ];

  it("calcula cada mes de una unidad, incluso con pérdida", () => {
    expect(gananciaPorMes(movs, ["2026-11", "2026-12"], "ABC123")).toEqual([
      { mes: "2026-11", cobrado: 1000, gastado: 250, neto: 750 },
      { mes: "2026-12", cobrado: 0, gastado: 400, neto: -400 },
    ]);
  });

  it("sin placa suma toda la flota", () => {
    expect(gananciaPorMes(movs, ["2026-12"])[0].neto).toBe(500);
  });
});
