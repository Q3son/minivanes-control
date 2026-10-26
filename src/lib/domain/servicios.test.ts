import { describe, expect, it } from "vitest";
import { esquemaServicio } from "./servicios";

describe("esquemaServicio", () => {
  const base = {
    tipo: "aceite",
    km: "177,480",
    costo: "185",
    nota: "15W40 y filtro",
    fecha: "2026-11-10",
  };

  it("acepta un cambio de aceite", () => {
    expect(esquemaServicio.parse(base)).toEqual({
      tipo: "aceite",
      km: 177_480,
      costo: 185,
      nota: "15W40 y filtro",
      fecha: "2026-11-10",
    });
  });

  it("deja el costo en cero si se deja vacío", () => {
    expect(esquemaServicio.parse({ ...base, costo: "" }).costo).toBe(0);
  });

  it("exige el kilometraje", () => {
    const r = esquemaServicio.safeParse({ ...base, km: "" });
    expect(r.success).toBe(false);
  });
});
