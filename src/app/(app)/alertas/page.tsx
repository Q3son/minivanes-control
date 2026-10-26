import { Encabezado } from "@/components/encabezado";
import { ListaAlertas } from "@/components/lista-alertas";
import { Tarjeta } from "@/components/ui";
import { listarVehiculos } from "@/lib/data/vehiculos";
import { AVISO_ACEITE_KM, AVISO_DOCUMENTO_DIAS, alertasDeFlota, hoyEnLima } from "@/lib/domain";

export default async function Alertas() {
  const alertas = alertasDeFlota(await listarVehiculos(), hoyEnLima());
  return (
    <>
      <Encabezado titulo="Alertas" />
      <Tarjeta>
        {alertas.length ? (
          <ListaAlertas alertas={alertas} />
        ) : (
          <p className="py-6 text-center text-gray-500">
            Todo en orden. Ninguna unidad necesita atención.
          </p>
        )}
      </Tarjeta>
      <p className="text-sm text-gray-500">
        El aviso de aceite aparece cuando faltan {AVISO_ACEITE_KM.toLocaleString("es-PE")} km. El de
        SOAT y revisión técnica, {AVISO_DOCUMENTO_DIAS} días antes de vencer.
      </p>
    </>
  );
}
