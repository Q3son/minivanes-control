import Link from "next/link";
import { Encabezado } from "@/components/encabezado";
import { Aviso, Placa, Tarjeta } from "@/components/ui";
import { listarMovimientos } from "@/lib/data/movimientos";
import { listarVehiculos } from "@/lib/data/vehiculos";
import { cobrosDeLaSemana, hoyEnLima, lunesDe, rangoDelMes, resumenMes } from "@/lib/domain";
import { cobrarCuota } from "./acciones";

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "setiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const soles = (n: number) =>
  `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export default async function Inicio({
  searchParams,
}: {
  searchParams: Promise<{ gasto?: string }>;
}) {
  const { gasto } = await searchParams;
  const hoy = hoyEnLima();
  const mes = hoy.slice(0, 7);
  const lunes = lunesDe(hoy);
  const [inicioMes, finMes] = rangoDelMes(mes);
  const desde = lunes < inicioMes ? lunes : inicioMes;

  const [vehiculos, movimientos] = await Promise.all([
    listarVehiculos(),
    listarMovimientos(desde, finMes),
  ]);
  const resumen = resumenMes(movimientos, mes);
  const cobros = cobrosDeLaSemana(vehiculos, movimientos, lunes);
  const pagaron = cobros.filter((c) => c.cobrado != null).length;

  return (
    <>
      <Encabezado
        titulo="Inicio"
        accion={
          <form action="/auth/salir" method="post">
            <button className="text-sm font-semibold text-gray-500">Salir</button>
          </form>
        }
      />
      {gasto === "ok" && <Aviso tono="exito">Gasto guardado.</Aviso>}

      <section className="flex flex-col gap-3 rounded-2xl bg-[#0F1D18] p-5 text-[#F2F7F4]">
        <p className="text-sm font-semibold text-[#9DB3A9]">
          Te queda en {MESES[Number(mes.slice(5)) - 1]}
        </p>
        <p className="text-4xl font-extrabold tracking-tight tabular-nums">{soles(resumen.neto)}</p>
        <dl className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
          <div>
            <dt className="text-sm text-[#9DB3A9]">Cobraste</dt>
            <dd className="text-lg font-bold text-[#7BE0B4] tabular-nums">
              {soles(resumen.cobrado)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#9DB3A9]">Gastaste</dt>
            <dd className="text-lg font-bold text-[#FFB4A9] tabular-nums">
              {soles(resumen.gastado)}
            </dd>
          </div>
        </dl>
      </section>

      <Link
        href="/gastos/nuevo"
        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center font-bold"
      >
        Anotar gasto
      </Link>

      <Tarjeta>
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold">Cobros de esta semana</h2>
          <span className="text-sm text-gray-500 tabular-nums">
            {pagaron} de {cobros.length}
          </span>
        </div>
        {cobros.length === 0 ? (
          <p className="text-gray-500">
            Agrega tus unidades para ver aquí los cobros.{" "}
            <Link href="/unidades/nueva" className="font-semibold text-marca">
              Agregar unidad
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {cobros.map(({ vehiculo: v, cobrado }) => (
              <li key={v.placa} className="flex items-center gap-3 py-3">
                <Placa placa={v.placa} />
                <span className="min-w-0 flex-1">
                  <b className="block truncate font-semibold">{v.conductor ?? "Sin conductor"}</b>
                  <span className="text-sm text-gray-500 tabular-nums">
                    {cobrado != null
                      ? `Cobrado ${soles(cobrado)}`
                      : `Cuota ${soles(v.cuotaSemanal)}`}
                  </span>
                </span>
                {cobrado != null ? (
                  <span className="text-sm font-semibold text-marca">✓ Cobrado</span>
                ) : (
                  <form action={cobrarCuota}>
                    <input type="hidden" name="placa" value={v.placa} />
                    <button className="rounded-full border-[1.5px] border-marca px-4 py-1.5 text-sm font-bold text-marca">
                      Cobrar
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </>
  );
}
