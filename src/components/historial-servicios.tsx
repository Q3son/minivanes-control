import { Tarjeta } from "@/components/ui";
import { TIPOS_SERVICIO, conKmDesdeAnterior, fechaCorta, type Servicio } from "@/lib/domain";
import { soles } from "@/lib/formato";

const VISIBLES = 5;
const km = (n: number) => `${n.toLocaleString("es-PE")} km`;

function Fila({ s }: { s: ReturnType<typeof conKmDesdeAnterior>[number] }) {
  return (
    <li className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <b className="block font-semibold">{TIPOS_SERVICIO[s.tipo]}</b>
        <span className="block text-sm text-gray-600 tabular-nums">
          {fechaCorta(s.fecha)} · {km(s.km)}
          {s.kmDesdeAnterior != null && ` · ${km(s.kmDesdeAnterior)} desde el anterior`}
        </span>
        {s.nota && <span className="block text-sm text-gray-700 italic">“{s.nota}”</span>}
      </div>
      <span className="shrink-0 font-bold tabular-nums">{s.costo > 0 ? soles(s.costo) : "—"}</span>
    </li>
  );
}

/** Todo lo que se le hizo a la unidad, del más reciente al más antiguo. */
export function HistorialServicios({ servicios }: { servicios: Servicio[] }) {
  const lista = conKmDesdeAnterior(servicios);
  const total = servicios.reduce((t, s) => t + s.costo, 0);

  return (
    <Tarjeta data-tour="historial-mantenimiento">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-bold">Historial de mantenimiento</h2>
        {servicios.length > 0 && (
          <span className="text-sm text-gray-600 tabular-nums">
            {servicios.length} · {soles(total)}
          </span>
        )}
      </div>
      {lista.length === 0 ? (
        <p className="text-gray-600">
          Aún no hay mantenimientos. Cuando anotes uno arriba, aparecerá aquí con su fecha y km.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {lista.slice(0, VISIBLES).map((s) => (
              <Fila key={s.id} s={s} />
            ))}
          </ul>
          {lista.length > VISIBLES && (
            <details className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center rounded-xl border border-gray-400 font-bold text-marca active:bg-gray-100 group-open:hidden">
                Ver los {lista.length - VISIBLES} anteriores
              </summary>
              <ul className="divide-y divide-gray-200 border-t border-gray-200">
                {lista.slice(VISIBLES).map((s) => (
                  <Fila key={s.id} s={s} />
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </Tarjeta>
  );
}
