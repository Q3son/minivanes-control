import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioLlanta } from "@/components/formulario-llanta";
import { Placa, Tarjeta } from "@/components/ui";
import { listarLlantas } from "@/lib/data/llantas";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { posicionesDe } from "@/lib/domain";
import { cambiarLlantaAccion } from "../acciones";

export default async function CambiarLlanta({
  params,
}: {
  params: Promise<{ placa: string; posicion: string }>;
}) {
  const { placa, posicion } = await params;
  const [v, llantas] = await Promise.all([obtenerVehiculo(placa), listarLlantas(placa)]);
  const pos = v && posicionesDe(v.traserasDobles).find((p) => p.codigo === posicion);
  if (!v || !pos) notFound();

  const actual = llantas.find((l) => l.posicion === posicion && !l.fechaRetiro) ?? null;
  const codigoSugerido = `${v.placa.slice(0, 3)}-${posicion}-${String(llantas.length + 1).padStart(2, "0")}`;

  return (
    <>
      <Link
        href={`/unidades/${v.placa}/llantas`}
        className="self-start text-sm font-semibold text-gray-500"
      >
        ← Llantas
      </Link>
      <header className="flex items-center gap-3">
        <Placa placa={v.placa} />
        <h1 className="text-xl font-extrabold tracking-tight">
          {actual ? "Cambiar" : "Anotar"} {pos.nombre.toLowerCase()}
        </h1>
      </header>
      <Tarjeta>
        <FormularioLlanta
          accion={cambiarLlantaAccion.bind(null, v.placa, posicion)}
          actual={actual}
          kmActual={v.kmActual}
          carpeta={`llantas/${v.placa}`}
          codigoSugerido={codigoSugerido}
        />
      </Tarjeta>
    </>
  );
}
