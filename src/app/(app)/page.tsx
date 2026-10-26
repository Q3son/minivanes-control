import Link from "next/link";
import { BotonEnviar } from "@/components/boton-enviar";
import { Insignia } from "@/components/estado";
import { Encabezado } from "@/components/encabezado";
import { ListaAlertas } from "@/components/lista-alertas";
import { Aviso, Placa, Tarjeta } from "@/components/ui";
import { listarMovimientos } from "@/lib/data/movimientos";
import { listarVehiculos } from "@/lib/data/vehiculos";
import {
  alertasDeFlota,
  cobrosDeLaSemana,
  hoyEnLima,
  lunesDe,
  rangoDelMes,
  resumenMes,
} from "@/lib/domain";
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
  const alertas = alertasDeFlota(vehiculos, hoy);

  return (
    <>
      <Encabezado titulo="Inicio" />
      {gasto === "ok" && <Aviso tono="exito">Gasto guardado.</Aviso>}

      <section
        data-tour="resumen"
        className="flex flex-col gap-3 rounded-2xl bg-panel p-5 text-panel-texto"
      >
        <p className="text-sm font-semibold text-panel-suave">
          Te queda en {MESES[Number(mes.slice(5)) - 1]}
        </p>
        <p className="text-4xl font-extrabold tracking-tight tabular-nums">{soles(resumen.neto)}</p>
        <dl className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
          <div>
            <dt className="text-sm text-panel-suave">Cobraste</dt>
            <dd className="text-lg font-bold text-panel-sube tabular-nums">
              {soles(resumen.cobrado)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-panel-suave">Gastaste</dt>
            <dd className="text-lg font-bold text-panel-baja tabular-nums">
              {soles(resumen.gastado)}
            </dd>
          </div>
        </dl>
      </section>

      {alertas.length > 0 && (
        <Tarjeta data-tour="para-atender">
          <div className="flex items-baseline justify-between">
            <h2 className="font-bold">Para atender</h2>
            <Link
              href="/alertas"
              className="-my-2 inline-flex min-h-11 items-center text-[15px] font-semibold text-marca underline-offset-4 active:underline"
            >
              Ver las {alertas.length}
            </Link>
          </div>
          <ListaAlertas alertas={alertas.slice(0, 3)} />
        </Tarjeta>
      )}

      <Link
        href="/gastos/nuevo"
        data-tour="anotar-gasto"
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-marca bg-white px-4 font-bold text-marca transition active:scale-[0.98] active:bg-marca-suave"
      >
        <span aria-hidden className="text-xl leading-none">
          +
        </span>
        Anotar gasto
      </Link>

      <Tarjeta data-tour="cobros">
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold">Cobros de esta semana</h2>
          <span className="text-sm text-gray-600 tabular-nums">
            {pagaron} de {cobros.length}
          </span>
        </div>
        {cobros.length === 0 ? (
          <p className="text-gray-600">
            Agrega tus unidades para ver aquí los cobros.{" "}
            <Link href="/unidades/nueva" className="font-semibold text-marca">
              Agregar unidad
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cobros.map(({ vehiculo: v, cobrado }) => (
              <li key={v.placa} className="flex items-center gap-3 py-3">
                <Placa placa={v.placa} />
                <span className="min-w-0 flex-1">
                  <b className="block truncate font-semibold">{v.conductor ?? "Sin conductor"}</b>
                  <span className="text-sm text-gray-600 tabular-nums">
                    {cobrado != null
                      ? `Cobrado ${soles(cobrado)}`
                      : `Cuota ${soles(v.cuotaSemanal)}`}
                  </span>
                </span>
                {cobrado != null ? (
                  <Insignia tono="ok">Cobrado</Insignia>
                ) : (
                  <form action={cobrarCuota}>
                    <input type="hidden" name="placa" value={v.placa} />
                    <BotonEnviar
                      pendiente="Cobrando…"
                      className="min-h-11 rounded-full bg-marca px-5 text-sm font-bold text-white transition active:scale-95 disabled:opacity-60"
                    >
                      Cobrar
                    </BotonEnviar>
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
