import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioKm } from "@/components/formulario-km";
import { FormularioServicio } from "@/components/formulario-servicio";
import { Aviso, Placa, Tarjeta } from "@/components/ui";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { registrarKm, registrarMantenimiento } from "./acciones";
import { alertasDe, diasEntre, fechaCorta, hoyEnLima, proximoCambioAceite } from "@/lib/domain";

const km = (n: number) => `${n.toLocaleString("es-PE")} km`;

export default async function FichaUnidad({ params }: { params: Promise<{ placa: string }> }) {
  const { placa } = await params;
  const v = await obtenerVehiculo(placa);
  if (!v) notFound();

  const hoy = hoyEnLima();
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
        className="-mx-2 self-start rounded-lg px-2 py-1 text-sm font-semibold text-gray-500 active:bg-gray-100"
      >
        ← Unidades
      </Link>
      <Tarjeta>
        <div className="flex items-center gap-3">
          <Placa placa={v.placa} grande />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">{v.conductor ?? "Sin conductor"}</h1>
            <p className="text-sm text-gray-500">
              {v.marca ?? "Sin marca"} · S/ {v.cuotaSemanal.toLocaleString("es-PE")} por semana
            </p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
          <div>
            <p className="text-[13px] font-semibold text-gray-500">Kilometraje</p>
            <p className="text-3xl font-extrabold tracking-tight whitespace-nowrap tabular-nums">
              {v.kmActual != null ? (
                <>
                  {v.kmActual.toLocaleString("es-PE")}{" "}
                  <span className="text-lg font-bold text-gray-500">km</span>
                </>
              ) : (
                "—"
              )}
            </p>
            <p className="text-[13px] text-gray-500">
              {v.kmActualFecha ? `Anotado el ${fechaCorta(v.kmActualFecha)}` : "Sin lecturas"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/unidades/${v.placa}/llantas`}
              className="rounded-full bg-marca px-4 py-2 text-sm font-bold text-white transition active:scale-95"
            >
              Llantas
            </Link>
            <Link
              href={`/unidades/${v.placa}/editar`}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold transition active:scale-95 active:bg-gray-200"
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

      <Tarjeta>
        <FormularioKm accion={registrarKm.bind(null, v.placa)} kmAnterior={v.kmActual} />
      </Tarjeta>

      <Tarjeta>
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold">Cambio de aceite</h2>
          <span className="text-sm text-gray-500">cada {km(v.intervaloAceiteKm)}</span>
        </div>
        {proximo == null ? (
          <p className="text-gray-500">Anota el último cambio de aceite para activar la alerta.</p>
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
                <dt className="text-gray-500">Último cambio</dt>
                <dd className="text-base font-bold tabular-nums">{km(v.kmUltimoAceite ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Próximo cambio</dt>
                <dd className="text-base font-bold tabular-nums">{km(proximo)}</dd>
              </div>
            </dl>
          </>
        )}
      </Tarjeta>

      <Tarjeta>
        <FormularioServicio
          key={v.kmActual ?? "sin-km"}
          accion={registrarMantenimiento.bind(null, v.placa)}
          kmActual={v.kmActual}
        />
      </Tarjeta>

      <Tarjeta>
        <h2 className="font-bold">Documentos</h2>
        <ul className="divide-y divide-gray-100">
          {documentos.map(({ nombre, vence }) => {
            const dias = vence ? diasEntre(hoy, vence) : null;
            const [texto, clase] =
              dias == null
                ? ["Sin fecha", "bg-amber-50 text-amber-800"]
                : dias < 0
                  ? ["Vencido", "bg-red-50 text-red-700"]
                  : dias <= 15
                    ? ["Vence pronto", "bg-amber-50 text-amber-800"]
                    : ["Vigente", "bg-marca-suave text-marca"];
            return (
              <li key={nombre} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <b className="block font-semibold">{nombre}</b>
                  <span className="text-sm text-gray-500">
                    {vence ? `Vence el ${fechaCorta(vence)}` : "Anota la fecha de vencimiento"}
                  </span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${clase}`}>
                  {texto}
                </span>
              </li>
            );
          })}
        </ul>
      </Tarjeta>
    </>
  );
}
