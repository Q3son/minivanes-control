import { describe, expect, it } from "vitest";
import { esquemaVehiculo, estadoVehiculo, normalizarPlaca } from "./vehiculo";
import type { Alerta } from "./tipos";

const alerta = (severidad: Alerta["severidad"]): Alerta => ({
  placa: "ABC123",
  tipo: "aceite",
  severidad,
  titulo: "",
  detalle: "",
});

describe("estadoVehiculo", () => {
  it("está al día sin alertas", () => expect(estadoVehiculo([])).toBe("al-dia"));
  it("pide revisar con solo avisos", () =>
    expect(estadoVehiculo([alerta("aviso")])).toBe("revisar"));
  it("pide atender si hay una crítica", () =>
    expect(estadoVehiculo([alerta("aviso"), alerta("critica")])).toBe("atender"));
});

describe("normalizarPlaca", () => {
  it("limpia espacios, guiones y minúsculas", () =>
    expect(normalizarPlaca(" abc-123 ")).toBe("ABC123"));
});

describe("esquemaVehiculo", () => {
  const formulario = {
    placa: "abc-123",
    conductor: " Juan Pérez ",
    marca: "",
    cuotaSemanal: "1,050",
    traserasDobles: "on",
    intervaloAceiteKm: "9000",
    soatVence: "2027-03-14",
    revisionVence: "",
  };

  it("convierte el formulario en datos limpios", () => {
    expect(esquemaVehiculo.parse(formulario)).toEqual({
      placa: "ABC123",
      conductor: "Juan Pérez",
      marca: null,
      cuotaSemanal: 1050,
      traserasDobles: true,
      intervaloAceiteKm: 9000,
      soatVence: "2027-03-14",
      revisionVence: null,
    });
  });

  it("rechaza una placa de 5 caracteres", () => {
    const r = esquemaVehiculo.safeParse({ ...formulario, placa: "AB123" });
    expect(r.success).toBe(false);
  });

  it("rechaza un intervalo de aceite absurdo", () => {
    const r = esquemaVehiculo.safeParse({ ...formulario, intervaloAceiteKm: "90" });
    expect(r.success).toBe(false);
  });
});
