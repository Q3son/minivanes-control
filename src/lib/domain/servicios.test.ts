import { describe, expect, it } from "vitest";
import { conKmDesdeAnterior, esquemaServicio } from "./servicios";

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

describe("conKmDesdeAnterior", () => {
  const base = { costo: 0, nota: null };
  it("mide la distancia solo contra el anterior del mismo tipo", () => {
    const lista = conKmDesdeAnterior([
      { ...base, id: "3", tipo: "aceite", km: 118000, fecha: "2026-12-20" },
      { ...base, id: "2", tipo: "frenos", km: 112000, fecha: "2026-11-30" },
      { ...base, id: "1", tipo: "aceite", km: 109000, fecha: "2026-11-02" },
    ]);
    expect(lista.map((s) => s.kmDesdeAnterior)).toEqual([9000, null, null]);
  });
});
