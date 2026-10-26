import { describe, expect, it } from "vitest";
import { alertasDe, alertasDeFlota, proximoCambioAceite } from "./alertas";
import type { Vehiculo } from "./tipos";

const base: Vehiculo = {
  placa: "ABC123",
  conductor: "Juan Pérez",
  marca: "Mercedes-Benz",
  cuotaSemanal: 1050,
  traserasDobles: true,
  intervaloAceiteKm: 9000,
  kmActual: 170_000,
  kmActualFecha: "2026-11-10",
  kmUltimoAceite: 168_500,
  soatVence: "2027-03-14",
  revisionVence: "2027-02-02",
};
const HOY = "2026-11-12";

describe("alertas de aceite", () => {
  it("calcula el próximo cambio con el intervalo de la unidad", () => {
    expect(proximoCambioAceite(base)).toBe(177_500);
  });

  it("no avisa si faltan más de 1,000 km", () => {
    expect(alertasDe(base, HOY)).toEqual([]);
  });

  it("avisa cuando faltan 1,000 km o menos", () => {
    const [a] = alertasDe({ ...base, kmActual: 176_700 }, HOY);
    expect(a).toMatchObject({ tipo: "aceite", severidad: "aviso" });
  });

  it("marca crítica cuando ya se pasó", () => {
    const [a] = alertasDe({ ...base, kmActual: 178_000 }, HOY);
    expect(a).toMatchObject({ tipo: "aceite", severidad: "critica" });
  });

  it("no calcula nada sin un cambio de aceite registrado", () => {
    expect(alertasDe({ ...base, kmUltimoAceite: null, kmActual: 999_999 }, HOY)).toEqual([]);
  });
});

describe("alertas de documentos", () => {
  it("avisa 15 días antes del vencimiento del SOAT", () => {
    const [a] = alertasDe({ ...base, soatVence: "2026-11-20" }, HOY);
    expect(a).toMatchObject({ tipo: "soat", severidad: "aviso", titulo: "SOAT vence en 8 días" });
  });

  it("usa femenino para la revisión técnica vencida", () => {
    const [a] = alertasDe({ ...base, revisionVence: "2026-10-20" }, HOY);
    expect(a).toMatchObject({
      severidad: "critica",
      titulo: "Revisión técnica vencida",
      detalle: "Venció el 20 oct 2026",
    });
  });
});

describe("alertas de la flota", () => {
  it("pone primero las críticas", () => {
    const flota = [
      { ...base, placa: "AAA111", kmActual: 176_700 },
      { ...base, placa: "BBB222", soatVence: "2026-01-01" },
    ];
    expect(alertasDeFlota(flota, HOY).map((a) => a.severidad)).toEqual(["critica", "aviso"]);
  });
});
