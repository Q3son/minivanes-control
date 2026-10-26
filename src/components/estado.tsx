import type { EstadoVehiculo } from "@/lib/domain";

const textos: Record<EstadoVehiculo, { texto: string; clase: string }> = {
  "al-dia": { texto: "Al día", clase: "bg-marca-suave text-marca" },
  revisar: { texto: "Revisar", clase: "bg-amber-50 text-amber-800" },
  atender: { texto: "Atender", clase: "bg-red-50 text-red-700" },
};

export function PildoraEstado({ estado }: { estado: EstadoVehiculo }) {
  const { texto, clase } = textos[estado];
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold whitespace-nowrap ${clase}`}
    >
      {texto}
    </span>
  );
}
