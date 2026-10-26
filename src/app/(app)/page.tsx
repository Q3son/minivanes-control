import Link from "next/link";
import { Encabezado } from "@/components/encabezado";
import { Tarjeta } from "@/components/ui";
import { listarVehiculos } from "@/lib/data/vehiculos";

export default async function Inicio() {
  const vehiculos = await listarVehiculos();
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
      <Tarjeta>
        <p className="text-gray-600">
          Tienes {vehiculos.length} {vehiculos.length === 1 ? "unidad" : "unidades"} registradas.
        </p>
        <Link href="/unidades" className="font-semibold text-marca">
          Ver unidades
        </Link>
      </Tarjeta>
    </>
  );
}
