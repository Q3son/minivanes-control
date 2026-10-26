import { describe, expect, it } from "vitest";
import { cobrosDeLaSemana, esquemaGasto } from "./movimientos";
import type { Movimiento, Vehiculo } from "./tipos";

const vehiculo = (placa: string): Vehiculo => ({
  placa,
  conductor: null,
  marca: null,
  cuotaSemanal: 1000,
  traserasDobles: false,
  intervaloAceiteKm: 9000,
  kmActual: null,
  kmActualFecha: null,
  kmUltimoAceite: null,
  soatVence: null,
  revisionVence: null,
});

describe("cobrosDeLaSemana", () => {
  const movs: Movimiento[] = [
    { placa: "ABC123", tipo: "ingreso", monto: 1050, fecha: "2026-11-03" },
    { placa: "ABC123", tipo: "gasto", monto: 50, fecha: "2026-11-04" },
    { placa: "DEF456", tipo: "ingreso", monto: 1300, fecha: "2026-10-28" },
  ];

  it("marca quién pagó esta semana y quién falta", () => {
    const r = cobrosDeLaSemana([vehiculo("ABC123"), vehiculo("DEF456")], movs, "2026-11-02");
    expect(r.map((c) => [c.vehiculo.placa, c.cobrado])).toEqual([
      ["ABC123", 1050],
      ["DEF456", null],
    ]);
  });

  it("suma pagos parciales de la misma semana", () => {
    const r = cobrosDeLaSemana(
      [vehiculo("ABC123")],
      [...movs, { placa: "ABC123", tipo: "ingreso", monto: 200, fecha: "2026-11-07" }],
      "2026-11-02",
    );
    expect(r[0].cobrado).toBe(1250);
  });
});

describe("esquemaGasto", () => {
  it("acepta un gasto válido", () => {
    expect(
      esquemaGasto.parse({
        placa: "ABC123",
        categoria: "repuesto",
        monto: "1,250.50",
        fecha: "2026-11-05",
        nota: "  ",
      }),
    ).toEqual({
      placa: "ABC123",
      categoria: "repuesto",
      monto: 1250.5,
      fecha: "2026-11-05",
      nota: null,
    });
  });

  it("rechaza montos en cero y categorías inventadas", () => {
    expect(
      esquemaGasto.safeParse({
        placa: "ABC123",
        categoria: "repuesto",
        monto: "0",
        fecha: "2026-11-05",
        nota: "",
      }).success,
    ).toBe(false);
    expect(
      esquemaGasto.safeParse({
        placa: "ABC123",
        categoria: "gasolina",
        monto: "10",
        fecha: "2026-11-05",
        nota: "",
      }).success,
    ).toBe(false);
  });
});
