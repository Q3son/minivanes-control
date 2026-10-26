import { Tarjeta } from "@/components/ui";
import type { Resumen } from "@/lib/domain";
import { nombreMes, soles } from "@/lib/formato";

/**
 * Lo que dejó una unidad: el mes actual en grande y los últimos meses en barras.
 * Las barras rojas son meses en pérdida.
 */
export function GananciaUnidad({ meses }: { meses: (Resumen & { mes: string })[] }) {
  const actual = meses[meses.length - 1];
  const tope = Math.max(1, ...meses.map((m) => Math.abs(m.neto)));
  const hayDatos = meses.some((m) => m.cobrado > 0 || m.gastado > 0);

  return (
    <Tarjeta data-tour="ganancia">
      <h2 className="font-bold">Ganancia de esta unidad</h2>
      <div>
        <p className="text-sm font-semibold text-gray-600">Te dejó en {nombreMes(actual.mes)}</p>
        <p
          className={`text-3xl font-extrabold tracking-tight tabular-nums ${
            actual.neto < 0 ? "text-red-800" : "text-marca"
          }`}
        >
          {soles(actual.neto)}
        </p>
        <p className="text-sm text-gray-600 tabular-nums">
          Cobraste {soles(actual.cobrado)} · Gastaste {soles(actual.gastado)}
        </p>
      </div>

      {hayDatos ? (
        <ul
          className="flex flex-col gap-2 border-t border-gray-200 pt-3"
          aria-label="Últimos meses"
        >
          {meses.map((m) => (
            <li key={m.mes} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 text-sm">
              <span className="font-semibold text-gray-700 capitalize">
                {nombreMes(m.mes, true)}
              </span>
              <span className="h-3 overflow-hidden rounded-full bg-gray-100" aria-hidden>
                <span
                  className={`block h-full rounded-full ${m.neto < 0 ? "bg-red-600" : "bg-marca"}`}
                  style={{ width: `${(Math.abs(m.neto) / tope) * 100}%` }}
                />
              </span>
              <span
                className={`min-w-20 text-right font-bold tabular-nums ${
                  m.neto < 0 ? "text-red-800" : "text-tinta"
                }`}
              >
                {soles(m.neto)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">
          Cuando cobres su cuota o anotes un gasto de esta placa, aquí verás cuánto te deja cada
          mes.
        </p>
      )}
    </Tarjeta>
  );
}
