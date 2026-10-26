import { Encabezado } from "@/components/encabezado";
import { FormularioGasto } from "@/components/formulario-gasto";
import { Tarjeta } from "@/components/ui";
import { listarVehiculos } from "@/lib/data/vehiculos";
import { hoyEnLima } from "@/lib/domain";

export default async function NuevoGasto({
  searchParams,
}: {
  searchParams: Promise<{ placa?: string }>;
}) {
  const [{ placa }, vehiculos] = await Promise.all([searchParams, listarVehiculos()]);
  return (
    <>
      <Encabezado titulo="Anotar gasto" />
      <Tarjeta>
        <FormularioGasto
          placas={vehiculos.map(({ placa, conductor }) => ({ placa, conductor }))}
          placaInicial={placa}
          hoy={hoyEnLima()}
        />
      </Tarjeta>
    </>
  );
}
