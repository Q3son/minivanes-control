import { describe, expect, it } from "vitest";
import {
  dotCoincide,
  esquemaLlantaNueva,
  esquemaRetiro,
  kmRecorridos,
  normalizarDot,
  posicionesDe,
} from "./llantas";

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

describe("posicionesDe", () => {
  it("da 5 posiciones con traseras simples", () => {
    expect(posicionesDe(false).map((p) => p.codigo)).toEqual(["DI", "DD", "TI", "TD", "R"]);
  });

  it("da 7 posiciones con traseras dobles", () => {
    expect(posicionesDe(true)).toHaveLength(7);
  });
});

describe("esquemaLlantaNueva", () => {
  const base = {
    km: "176,700",
    marca: "Michelin",
    medida: "225/65 R16",
    dot: "3826",
    mm: "9,5",
    codigoPropio: "ABC-DI-01",
    precio: "420",
    foto: "",
  };

  it("acepta una llanta nueva", () => {
    expect(esquemaLlantaNueva.parse(base)).toMatchObject({
      km: 176_700,
      dot: "3826",
      mm: 9.5,
      foto: null,
    });
  });

  it("exige un DOT de 4 dígitos", () => {
    expect(esquemaLlantaNueva.safeParse({ ...base, dot: "38" }).success).toBe(false);
  });
});

describe("esquemaRetiro", () => {
  it("exige el DOT devuelto", () => {
    expect(
      esquemaRetiro.safeParse({ dotDevuelto: "", mmRetiro: "3", fotoRetiro: "" }).success,
    ).toBe(false);
  });
});
