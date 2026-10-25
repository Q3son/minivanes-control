import { describe, expect, it } from "vitest";
import { revisarLecturaKm } from "./kilometraje";

describe("revisarLecturaKm", () => {
  it("acepta la primera lectura", () => {
    expect(revisarLecturaKm(null, 120_000)).toEqual({ ok: true });
  });

  it("acepta un avance normal de una semana", () => {
    expect(revisarLecturaKm(176_100, 177_400)).toEqual({ ok: true });
  });

  it("rechaza una lectura menor a la anterior", () => {
    expect(revisarLecturaKm(176_100, 170_000)).toMatchObject({ ok: false, motivo: "menor" });
  });

  it("detecta el error de tipeo 586,653 en lugar de 176,653", () => {
    expect(revisarLecturaKm(176_100, 586_653)).toMatchObject({ ok: false, motivo: "salto" });
  });
});
