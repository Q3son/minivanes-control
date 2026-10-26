import Link from "next/link";
import { Chevron, FILA_TOCABLE } from "@/components/ui";
import type { Alerta } from "@/lib/domain";

export function ListaAlertas({ alertas }: { alertas: Alerta[] }) {
  return (
    <ul className="divide-y divide-gray-200">
      {alertas.map((a) => (
        <li key={a.placa + a.tipo}>
          <Link href={`/unidades/${a.placa}`} className={FILA_TOCABLE}>
            <span
              aria-hidden
              className={`size-2.5 shrink-0 rounded-full ${
                a.severidad === "critica" ? "bg-red-600" : "bg-amber-500"
              }`}
            />
            <span className="min-w-0 flex-1">
              <b className="block font-semibold">{a.titulo}</b>
              <span className="text-sm text-gray-600">
                {a.placa} · {a.detalle}
              </span>
            </span>
            <Chevron />
          </Link>
        </li>
      ))}
    </ul>
  );
}
