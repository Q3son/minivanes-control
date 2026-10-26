import { describe, expect, it } from "vitest";
import { CONTINUAR, RECORRIDOS, pantallaDe } from ".";

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

describe("CONTINUAR", () => {
  it("la continuación apunta a un ancla que existe en los pasos de esa pantalla", () => {
    for (const [pantalla, c] of Object.entries(CONTINUAR)) {
      const anclas = RECORRIDOS[pantalla as keyof typeof RECORRIDOS].map((p) => p.ancla);
      expect(anclas).toContain(c.ancla);
    }
  });
});
