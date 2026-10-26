import { Insignia } from "@/components/estado";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Aviso, Placa, Tarjeta } from "@/components/ui";
import { listarLlantas, urlsDeFotos, type RegistroLlanta } from "@/lib/data/llantas";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { fechaCorta, posicionesDe, type Posicion } from "@/lib/domain";

const km = (n: number | null) => (n == null ? "—" : `${n.toLocaleString("es-PE")} km`);

export default async function Llantas({
  params,
  searchParams,
}: {
  params: Promise<{ placa: string }>;
  searchParams: Promise<{ aviso?: string }>;
}) {
  const [{ placa }, { aviso }] = await Promise.all([params, searchParams]);
  const [v, llantas] = await Promise.all([obtenerVehiculo(placa), listarLlantas(placa)]);
  if (!v) notFound();

  const posiciones = posicionesDe(v.traserasDobles);
  const puestas = new Map(llantas.filter((l) => !l.fechaRetiro).map((l) => [l.posicion, l]));
  const retiradas = llantas.filter((l) => l.fechaRetiro);
  const fotos = await urlsDeFotos(
    retiradas.flatMap((l) => [l.fotoPuesta, l.fotoRetiro]).filter((r): r is string => !!r),
  );
  const miniatura = (ruta: string | null, texto: string) =>
    ruta && fotos[ruta] ? (
      <a href={fotos[ruta]} target="_blank" rel="noreferrer" className="relative block">
        {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada temporal de Supabase */}
        <img
          src={fotos[ruta]}
          alt={texto}
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />
        <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 text-[11px] font-semibold text-white">
          {texto}
        </span>
      </a>
    ) : (
      <span className="grid aspect-[4/3] place-items-center rounded-lg bg-gray-100 text-xs text-gray-600">
        Sin foto
      </span>
    );

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
        <span className="text-xs font-semibold text-gray-600">{p.nombre}</span>
        {l ? (
          <>
            <b className="text-lg tabular-nums">{km(recorrido)}</b>
            <span className="truncate text-xs text-gray-600">
              {[l.marca, l.dot && `DOT ${l.dot}`].filter(Boolean).join(" · ") || "Sin datos"}
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
        className="self-start text-sm font-semibold text-gray-600"
      >
        ← {v.placa}
      </Link>
      <header className="flex items-center gap-3">
        <Placa placa={v.placa} grande />
        <h1 className="text-2xl font-extrabold tracking-tight">Llantas</h1>
      </header>

      {aviso === "ok" && <Aviso tono="exito">Cambio de llanta guardado.</Aviso>}
      {aviso === "no-coincide" && (
        <Aviso tono="error">
          Guardado, pero ojo: la llanta que te devolvieron no es la que se puso. Quedó marcada en el
          historial.
        </Aviso>
      )}
      <Tarjeta data-tour="diagrama">
        <p className="text-sm text-gray-600">
          El número es lo que lleva recorrido cada llanta desde que se puso. Toca una para
          cambiarla.
        </p>
        <div className="grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] items-stretch gap-2">
          <div className="flex min-w-0 flex-col justify-between gap-2">
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
          <div className="flex min-w-0 flex-col justify-between gap-2">
            {posiciones.filter((p) => p.lado === "derecha").map(casilla)}
          </div>
        </div>
        {posiciones.filter((p) => p.lado === "repuesto").map(casilla)}
      </Tarjeta>

      <Tarjeta data-tour="historial">
        <h2 className="font-bold">Llantas que ya salieron</h2>
        {retiradas.length === 0 ? (
          <p className="text-gray-600">Aquí verás cuánto duró cada llanta que cambies.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {retiradas.map((l: RegistroLlanta) => (
              <li key={l.id} className="flex flex-col gap-2 py-3">
                <div className="flex items-center gap-3">
                  <span className="min-w-0 flex-1">
                    <b className="block font-semibold">
                      {posiciones.find((p) => p.codigo === l.posicion)?.nombre ?? l.posicion} · duró{" "}
                      {km(l.kmRetiro != null ? l.kmRetiro - l.kmPuesta : null)}
                    </b>
                    <span className="text-sm text-gray-600">
                      {fechaCorta(l.fechaPuesta)} →{" "}
                      {l.fechaRetiro ? fechaCorta(l.fechaRetiro) : "—"} · DOT {l.dot} →{" "}
                      {l.dotDevuelto}
                    </span>
                  </span>
                  <Insignia tono={l.dotCoincide === false ? "peligro" : "ok"}>
                    {l.dotCoincide === false ? "No coincide" : "Coincide"}
                  </Insignia>
                </div>
                {(l.fotoPuesta || l.fotoRetiro) && (
                  <div className="grid grid-cols-2 gap-2">
                    {miniatura(l.fotoPuesta, "Al ponerla")}
                    {miniatura(l.fotoRetiro, "Al sacarla")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </>
  );
}
