import { describe, expect, it } from "vitest";
import {
  esquemaPerfil,
  fechaLarga,
  inicialDe,
  horaEnLima,
  perfilDeMetadatos,
  saludoSegunHora,
} from "./perfil";

describe("saludoSegunHora", () => {
  it.each([
    [4, "Buenas noches"],
    [5, "Buenos días"],
    [11, "Buenos días"],
    [12, "Buenas tardes"],
    [18, "Buenas tardes"],
    [19, "Buenas noches"],
    [23, "Buenas noches"],
  ])("a las %i → %s", (hora, saludo) => {
    expect(saludoSegunHora(hora)).toBe(saludo);
  });
});

describe("horaEnLima", () => {
  it("usa la hora de Perú (UTC−5), no la del servidor", () => {
    expect(horaEnLima(new Date("2026-10-26T13:30:00Z"))).toBe(8);
    expect(horaEnLima(new Date("2026-10-26T03:00:00Z"))).toBe(22);
  });
});

describe("fechaLarga", () => {
  it("día de la semana y mes en español", () => {
    expect(fechaLarga("2026-10-26")).toBe("lunes 26 de octubre");
    expect(fechaLarga("2026-11-01")).toBe("domingo 1 de noviembre");
  });
});

describe("esquemaPerfil", () => {
  it("limpia espacios y deja la empresa opcional", () => {
    const r = esquemaPerfil.safeParse({ nombre: "  Don   Jorge ", empresa: "" });
    expect(r.success && r.data).toEqual({ nombre: "Don Jorge", empresa: null });
  });
  it("pide el nombre", () => {
    expect(esquemaPerfil.safeParse({ nombre: " ", empresa: "" }).success).toBe(false);
  });
});

describe("perfilDeMetadatos", () => {
  it("tolera metadatos vacíos o de otra forma", () => {
    expect(perfilDeMetadatos(null)).toEqual({ nombre: null, empresa: null, correo: null });
    expect(perfilDeMetadatos({ nombre: 3, empresa: " Transportes Misti " }, "a@b.pe")).toEqual({
      nombre: null,
      empresa: "Transportes Misti",
      correo: "a@b.pe",
    });
  });
});

describe("inicialDe", () => {
  it("salta el tratamiento y usa el correo si no hay nombre", () => {
    expect(inicialDe({ nombre: "Don Jorge", empresa: null, correo: null })).toBe("J");
    expect(inicialDe({ nombre: null, empresa: null, correo: "rosa@gmail.com" })).toBe("R");
  });
});
