import { describe, expect, it } from "vitest";
import { dotCoincide, kmRecorridos, normalizarDot } from "./llantas";

const llanta = {
  placa: "GHI789",
  posicion: "DI",
  dot: "1826",
  kmPuesta: 158_300,
  kmRetiro: null,
  dotDevuelto: null,
};

describe("llantas", () => {
  it("mide lo recorrido hasta el km actual si sigue puesta", () => {
    expect(kmRecorridos(llanta, 160_000)).toBe(1_700);
  });

  it("mide lo que duró hasta el retiro", () => {
    expect(kmRecorridos({ ...llanta, kmRetiro: 175_700 }, 999_999)).toBe(17_400);
  });

  it("detecta que devolvieron otra llanta", () => {
    expect(dotCoincide({ dot: "1826", dotDevuelto: "0923" })).toBe(false);
  });

  it("acepta el mismo DOT aunque venga con espacios", () => {
    expect(dotCoincide({ dot: "1826", dotDevuelto: " 18 26 " })).toBe(true);
  });

  it("no compara si falta un dato", () => {
    expect(dotCoincide({ dot: null, dotDevuelto: "0923" })).toBeNull();
    expect(normalizarDot("123")).toBeNull();
  });
});
