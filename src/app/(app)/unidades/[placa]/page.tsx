import { Insignia, type Tono } from "@/components/estado";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioKm } from "@/components/formulario-km";
import { GananciaUnidad } from "@/components/ganancia-unidad";
import { HistorialServicios } from "@/components/historial-servicios";
import { listarServicios } from "@/lib/data/servicios";
import { listarMovimientos } from "@/lib/data/movimientos";
import { FormularioServicio } from "@/components/formulario-servicio";
import { Aviso, Placa, Tarjeta } from "@/components/ui";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { registrarKm, registrarMantenimiento } from "./acciones";
import {
  alertasDe,
  diasEntre,
  fechaCorta,
  gananciaPorMes,
  hoyEnLima,
  mesesHasta,
  proximoCambioAceite,
  rangoDelMes,
} from "@/lib/domain";

const km = (n: number) => `${n.toLocaleString("es-PE")} km`;

export default async function FichaUnidad({ params }: { params: Promise<{ placa: string }> }) {
  const { placa } = await params;
  const v = await obtenerVehiculo(placa);
  if (!v) notFound();

  const hoy = hoyEnLima();
  const meses = mesesHasta(hoy.slice(0, 7), 6);
  const [movimientos, servicios] = await Promise.all([
    listarMovimientos(rangoDelMes(meses[0])[0], rangoDelMes(meses[meses.length - 1])[1], v.placa),
    listarServicios(v.placa),
  ]);
  const ganancia = gananciaPorMes(movimientos, meses, v.placa);
  const alertas = alertasDe(v, hoy);
  const proximo = proximoCambioAceite(v);
  const faltan = proximo != null && v.kmActual != null ? proximo - v.kmActual : null;
  const avance =
    faltan == null ? 0 : Math.min(100, Math.max(0, 100 - (faltan / v.intervaloAceiteKm) * 100));
  const colorBarra =
    faltan == null
      ? "bg-gray-300"
      : faltan <= 0
        ? "bg-red-600"
        : faltan <= 1000
          ? "bg-amber-500"
          : "bg-marca";

  const documentos = [
    { nombre: "SOAT", vence: v.soatVence },
    { nombre: "Revisión técnica", vence: v.revisionVence },
  ];

  return (
    <>
      <Link
        href="/unidades"
        className="-mx-2 inline-flex min-h-11 items-center self-start rounded-lg px-2 text-[15px] font-semibold text-gray-700 active:bg-gray-200"
      >
        ← Unidades
      </Link>
      <Tarjeta data-tour="cabecera">
        <div className="flex items-center gap-3">
          <Placa placa={v.placa} grande />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">{v.conductor ?? "Sin conductor"}</h1>
            <p className="text-sm text-gray-600">
              {v.marca ?? "Sin marca"} · S/ {v.cuotaSemanal.toLocaleString("es-PE")} por semana
            </p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-3 border-t border-gray-200 pt-3">
          <div>
            <p className="text-[13px] font-semibold text-gray-600">Kilometraje</p>
            <p className="text-3xl font-extrabold tracking-tight whitespace-nowrap tabular-nums">
              {v.kmActual != null ? (
                <>
                  {v.kmActual.toLocaleString("es-PE")}{" "}
                  <span className="text-lg font-bold text-gray-600">km</span>
                </>
              ) : (
                "—"
              )}
            </p>
            <p className="text-[13px] text-gray-600">
              {v.kmActualFecha ? `Anotado el ${fechaCorta(v.kmActualFecha)}` : "Sin lecturas"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/unidades/${v.placa}/llantas`}
              data-tour="llantas"
              className="inline-flex min-h-11 items-center rounded-full bg-marca px-4 text-sm font-bold text-white transition active:scale-95"
            >
              Llantas
            </Link>
            <Link
              href={`/unidades/${v.placa}/editar`}
              className="inline-flex min-h-11 items-center rounded-full border border-gray-400 bg-white px-4 text-sm font-bold transition active:scale-95 active:bg-gray-100"
            >
              Editar
            </Link>
          </div>
        </div>
      </Tarjeta>

      {alertas.map((a) => (
        <Aviso key={a.tipo} tono={a.severidad === "critica" ? "error" : "alerta"}>
          {a.titulo}
          <span className="block text-sm font-normal">{a.detalle}</span>
        </Aviso>
      ))}

      <GananciaUnidad meses={ganancia} />

      <Tarjeta data-tour="km">
        <FormularioKm accion={registrarKm.bind(null, v.placa)} kmAnterior={v.kmActual} />
      </Tarjeta>

      <Tarjeta data-tour="aceite">
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold">Cambio de aceite</h2>
          <span className="text-sm text-gray-600">cada {km(v.intervaloAceiteKm)}</span>
        </div>
        {proximo == null ? (
          <p className="text-gray-600">Anota el último cambio de aceite para activar la alerta.</p>
        ) : (
          <>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${colorBarra}`}
                style={{ width: `${avance}%` }}
              />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-600">Último cambio</dt>
                <dd className="text-base font-bold tabular-nums">{km(v.kmUltimoAceite ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Próximo cambio</dt>
                <dd className="text-base font-bold tabular-nums">{km(proximo)}</dd>
              </div>
            </dl>
          </>
        )}
      </Tarjeta>

      <Tarjeta data-tour="mantenimiento">
        <FormularioServicio
          key={v.kmActual ?? "sin-km"}
          accion={registrarMantenimiento.bind(null, v.placa)}
          kmActual={v.kmActual}
        />
      </Tarjeta>

      <HistorialServicios servicios={servicios} />

      <Tarjeta data-tour="documentos">
        <h2 className="font-bold">Documentos</h2>
        <ul className="divide-y divide-gray-200">
          {documentos.map(({ nombre, vence }) => {
            const dias = vence ? diasEntre(hoy, vence) : null;
            const [texto, tono]: [string, Tono] =
              dias == null
                ? ["Sin fecha", "precaucion"]
                : dias < 0
                  ? ["Vencido", "peligro"]
                  : dias <= 15
                    ? ["Vence pronto", "precaucion"]
                    : ["Vigente", "ok"];
            return (
              <li key={nombre} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <b className="block font-semibold">{nombre}</b>
                  <span className="text-sm text-gray-600">
                    {vence ? `Vence el ${fechaCorta(vence)}` : "Anota la fecha de vencimiento"}
                  </span>
                </div>
                <Insignia tono={tono}>{texto}</Insignia>
              </li>
            );
          })}
        </ul>
      </Tarjeta>
    </>
  );
}
