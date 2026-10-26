import type { EstadoVehiculo } from "@/lib/domain";

/**
 * Colores de seguridad (ISO 3864 / ISO 22324): rojo = actuar ya, ámbar = precaución,
 * verde = en orden. Cada estado lleva además un símbolo, para no depender solo del color.
 */
export type Tono = "ok" | "precaucion" | "peligro";

const tonos: Record<Tono, { clase: string; simbolo: string }> = {
  ok: { clase: "bg-marca-suave text-marca ring-marca/30", simbolo: "✓" },
  precaucion: { clase: "bg-amber-100 text-amber-900 ring-amber-400/60", simbolo: "!" },
  peligro: { clase: "bg-red-100 text-red-800 ring-red-400/60", simbolo: "!!" },
};

export function Insignia({ tono, children }: { tono: Tono; children: React.ReactNode }) {
  const { clase, simbolo } = tonos[tono];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-bold whitespace-nowrap ring-1 ring-inset ${clase}`}
    >
      <span aria-hidden className="text-[11px] leading-none">
        {simbolo}
      </span>
      {children}
    </span>
  );
}

const estados: Record<EstadoVehiculo, { texto: string; tono: Tono }> = {
  "al-dia": { texto: "Al día", tono: "ok" },
  revisar: { texto: "Revisar", tono: "precaucion" },
  atender: { texto: "Atender", tono: "peligro" },
};

export function PildoraEstado({ estado }: { estado: EstadoVehiculo }) {
  const { texto, tono } = estados[estado];
  return <Insignia tono={tono}>{texto}</Insignia>;
}
