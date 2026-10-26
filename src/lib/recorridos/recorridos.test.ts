import { describe, expect, it } from "vitest";
import { RECORRIDOS, pantallaDe } from ".";

describe("pantallaDe", () => {
  it.each([
    ["/", "inicio"],
    ["/alertas", "alertas"],
    ["/unidades", "unidades"],
    ["/unidades/ABC123", "ficha"],
    ["/unidades/ABC123/llantas", "llantas"],
    ["/unidades/nueva", null],
    ["/unidades/ABC123/editar", null],
    ["/unidades/ABC123/llantas/DI", null],
    ["/gastos/nuevo", null],
  ])("%s → %s", (ruta, esperado) => {
    expect(pantallaDe(ruta)).toBe(esperado);
  });
});

describe("RECORRIDOS", () => {
  it("cada pantalla tiene pasos con título y texto", () => {
    for (const pasos of Object.values(RECORRIDOS)) {
      expect(pasos.length).toBeGreaterThan(0);
      for (const p of pasos) {
        expect(p.titulo.trim()).not.toBe("");
        expect(p.texto.trim()).not.toBe("");
      }
    }
  });
});
