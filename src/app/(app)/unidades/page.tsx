import Link from "next/link";
import { Encabezado } from "@/components/encabezado";
import { PildoraEstado } from "@/components/estado";
import { Chevron, FILA_TOCABLE, Placa, Tarjeta } from "@/components/ui";
import { listarVehiculos } from "@/lib/data/vehiculos";
import { alertasDe, estadoVehiculo, hoyEnLima, normalizarPlaca } from "@/lib/domain";

export default async function Unidades({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const hoy = hoyEnLima();
  const busqueda = normalizarPlaca(q);
  const todos = await listarVehiculos();
  const vehiculos = busqueda
    ? todos.filter(
        (v) => v.placa.includes(busqueda) || normalizarPlaca(v.conductor ?? "").includes(busqueda),
      )
    : todos;

  return (
    <>
      <Encabezado
        titulo="Mis unidades"
        accion={
          <Link
            href="/unidades/nueva"
            data-tour="agregar"
            className="inline-flex min-h-11 items-center rounded-full bg-marca px-4 text-sm font-bold text-white transition active:scale-95"
          >
            Agregar
          </Link>
        }
      />
      <form role="search" data-tour="buscar" className="relative">
        <label htmlFor="q" className="sr-only">
          Buscar placa o conductor
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Buscar placa o conductor"
          className="h-11 w-full rounded-full border border-gray-500 bg-white px-4 text-base"
        />
      </form>
      <Tarjeta>
        {vehiculos.length === 0 ? (
          <p className="py-6 text-center text-gray-600">
            {todos.length === 0
              ? "Aún no tienes unidades. Agrega la primera con su placa y conductor."
              : `No encontré “${q}”.`}
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {vehiculos.map((v, i) => (
              <li key={v.placa}>
                <Link
                  href={`/unidades/${v.placa}`}
                  data-tour={i === 0 ? "unidad" : undefined}
                  className={FILA_TOCABLE}
                >
                  <Placa placa={v.placa} />
                  <span className="min-w-0 flex-1">
                    <b className="block truncate font-semibold">{v.conductor ?? "Sin conductor"}</b>
                    <span className="text-sm text-gray-600 tabular-nums">
                      {v.marca ?? "Sin marca"} ·{" "}
                      {v.kmActual != null ? `${v.kmActual.toLocaleString("es-PE")} km` : "sin km"}
                    </span>
                  </span>
                  <PildoraEstado estado={estadoVehiculo(alertasDe(v, hoy))} />
                  <Chevron />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </>
  );
}
