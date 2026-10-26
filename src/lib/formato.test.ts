import { describe, expect, it } from "vitest";
import { nombreMes, soles } from "./formato";

describe("formato", () => {
  it("soles con signo para pérdidas", () => {
    expect(soles(1250)).toBe("S/ 1,250");
    expect(soles(-400)).toBe("−S/ 400");
  });
  it("nombre del mes", () => {
    expect(nombreMes("2026-09")).toBe("setiembre");
    expect(nombreMes("2026-11", true)).toBe("nov");
  });
});
