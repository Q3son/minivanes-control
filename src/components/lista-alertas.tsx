import Link from "next/link";
import type { Alerta } from "@/lib/domain";

export function ListaAlertas({ alertas }: { alertas: Alerta[] }) {
  return (
    <ul className="divide-y divide-gray-100">
      {alertas.map((a) => (
        <li key={a.placa + a.tipo}>
          <Link href={`/unidades/${a.placa}`} className="flex items-center gap-3 py-3">
            <span
              aria-hidden
              className={`size-2.5 shrink-0 rounded-full ${
                a.severidad === "critica" ? "bg-red-600" : "bg-amber-500"
              }`}
            />
            <span className="min-w-0 flex-1">
              <b className="block font-semibold">{a.titulo}</b>
              <span className="text-sm text-gray-500">
                {a.placa} · {a.detalle}
              </span>
            </span>
            <span aria-hidden className="text-gray-400">
              ›
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
