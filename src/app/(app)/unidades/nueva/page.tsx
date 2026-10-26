import { Encabezado } from "@/components/encabezado";
import { FormularioVehiculo } from "@/components/formulario-vehiculo";
import { Tarjeta } from "@/components/ui";
import { crearUnidad } from "../acciones";

export default function NuevaUnidad() {
  return (
    <>
      <Encabezado titulo="Nueva unidad" />
      <Tarjeta>
        <FormularioVehiculo accion={crearUnidad} />
      </Tarjeta>
    </>
  );
}
