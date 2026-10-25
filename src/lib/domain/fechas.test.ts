import { describe, expect, it } from "vitest";
import { diasEntre, lunesDe } from "./fechas";

describe("fechas", () => {
  it("cuenta días sin depender de la zona horaria", () => {
    expect(diasEntre("2026-11-01", "2026-11-15")).toBe(14);
    expect(diasEntre("2026-11-15", "2026-11-01")).toBe(-14);
  });

  it("encuentra el lunes de la semana", () => {
    expect(lunesDe("2026-11-05")).toBe("2026-11-02");
    expect(lunesDe("2026-11-02")).toBe("2026-11-02");
    expect(lunesDe("2026-11-08")).toBe("2026-11-02");
  });
});
