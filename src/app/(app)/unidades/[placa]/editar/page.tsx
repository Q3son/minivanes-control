import { notFound } from "next/navigation";
import { Encabezado } from "@/components/encabezado";
import { FormularioVehiculo } from "@/components/formulario-vehiculo";
import { Tarjeta } from "@/components/ui";
import { obtenerVehiculo } from "@/lib/data/vehiculos";
import { editarUnidad } from "../../acciones";

export default async function EditarUnidad({ params }: { params: Promise<{ placa: string }> }) {
  const { placa } = await params;
  const vehiculo = await obtenerVehiculo(placa);
  if (!vehiculo) notFound();

  return (
    <>
      <Encabezado titulo="Editar unidad" />
      <Tarjeta>
        <FormularioVehiculo accion={editarUnidad.bind(null, placa)} vehiculo={vehiculo} />
      </Tarjeta>
    </>
  );
}
