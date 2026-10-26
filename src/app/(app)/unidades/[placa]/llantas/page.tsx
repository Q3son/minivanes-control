import Link from "next/link";
import { notFound } from "next/navigation";
import { Placa, Tarjeta } from "@/components/ui";
import { listarLlantas, type RegistroLlanta } from "@/lib/data/llantas";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { fechaCorta, posicionesDe, type Posicion } from "@/lib/domain";

const km = (n: number | null) => (n == null ? "—" : `${n.toLocaleString("es-PE")} km`);

export default async function Llantas({ params }: { params: Promise<{ placa: string }> }) {
  const { placa } = await params;
  const [v, llantas] = await Promise.all([obtenerVehiculo(placa), listarLlantas(placa)]);
  if (!v) notFound();

  const posiciones = posicionesDe(v.traserasDobles);
  const puestas = new Map(llantas.filter((l) => !l.fechaRetiro).map((l) => [l.posicion, l]));
  const retiradas = llantas.filter((l) => l.fechaRetiro);

  const casilla = (p: Posicion) => {
    const l = puestas.get(p.codigo);
    const recorrido = l && v.kmActual != null ? Math.max(0, v.kmActual - l.kmPuesta) : null;
    return (
      <Link
        key={p.codigo}
        href={`/unidades/${v.placa}/llantas/${p.codigo}`}
        className={`flex min-w-0 flex-col rounded-xl border p-2.5 ${
          l ? "border-gray-200 bg-white" : "border-dashed border-gray-300"
        }`}
      >
        <span className="text-xs font-semibold text-gray-500">{p.nombre}</span>
        {l ? (
          <>
            <b className="text-lg tabular-nums">{km(recorrido)}</b>
            <span className="truncate text-xs text-gray-500">
              {l.marca ?? "—"} · DOT {l.dot ?? "—"}
            </span>
          </>
        ) : (
          <b className="text-[15px] text-marca">+ Anotar</b>
        )}
      </Link>
    );
  };

  return (
    <>
      <Link
        href={`/unidades/${v.placa}`}
        className="self-start text-sm font-semibold text-gray-500"
      >
        ← {v.placa}
      </Link>
      <header className="flex items-center gap-3">
        <Placa placa={v.placa} grande />
        <h1 className="text-2xl font-extrabold tracking-tight">Llantas</h1>
      </header>

      <Tarjeta>
        <p className="text-sm text-gray-600">
          El número es lo que lleva recorrido cada llanta desde que se puso. Toca una para
          cambiarla.
        </p>
        <div className="grid grid-cols-[1fr_56px_1fr] items-stretch gap-2">
          <div className="flex flex-col justify-between gap-2">
            {posiciones.filter((p) => p.lado === "izquierda").map(casilla)}
          </div>
          <svg viewBox="0 0 56 200" className="h-full min-h-48 w-14" aria-hidden>
            <text x="28" y="9" textAnchor="middle" fontSize="7" fontWeight="700" fill="#667085">
              FRENTE
            </text>
            <rect
              x="10"
              y="14"
              width="36"
              height="180"
              rx="11"
              fill="#F5F6F8"
              stroke="#E5E7EB"
              strokeWidth="1.5"
            />
            <rect x="15" y="24" width="26" height="20" rx="5" fill="#E5E7EB" />
            <g fill="#101418">
              <rect x="3" y="36" width="9" height="26" rx="3" />
              <rect x="44" y="36" width="9" height="26" rx="3" />
              <rect x="3" y="140" width="9" height="26" rx="3" />
              <rect x="44" y="140" width="9" height="26" rx="3" />
            </g>
          </svg>
          <div className="flex flex-col justify-between gap-2">
            {posiciones.filter((p) => p.lado === "derecha").map(casilla)}
          </div>
        </div>
        {posiciones.filter((p) => p.lado === "repuesto").map(casilla)}
      </Tarjeta>

      <Tarjeta>
        <h2 className="font-bold">Llantas que ya salieron</h2>
        {retiradas.length === 0 ? (
          <p className="text-gray-500">Aquí verás cuánto duró cada llanta que cambies.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {retiradas.map((l: RegistroLlanta) => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <b className="block font-semibold">
                    {posiciones.find((p) => p.codigo === l.posicion)?.nombre ?? l.posicion} · duró{" "}
                    {km(l.kmRetiro != null ? l.kmRetiro - l.kmPuesta : null)}
                  </b>
                  <span className="text-sm text-gray-500">
                    {fechaCorta(l.fechaPuesta)} → {l.fechaRetiro ? fechaCorta(l.fechaRetiro) : "—"}{" "}
                    · DOT {l.dot} → {l.dotDevuelto}
                  </span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold whitespace-nowrap ${
                    l.dotCoincide === false ? "bg-red-50 text-red-700" : "bg-marca-suave text-marca"
                  }`}
                >
                  {l.dotCoincide === false ? "No coincide" : "Coincide"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </>
  );
}
