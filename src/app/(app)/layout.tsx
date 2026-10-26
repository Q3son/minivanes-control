import { Navegacion } from "@/components/navegacion";
import { listarVehiculos } from "@/lib/data/vehiculos";
import { alertasDeFlota, hoyEnLima } from "@/lib/domain";

/** Marco de las pantallas con sesión: contenido en una columna y navegación fija abajo. */
export default async function MarcoApp({ children }: { children: React.ReactNode }) {
  const alertas = alertasDeFlota(await listarVehiculos(), hoyEnLima()).length;
  return (
    <>
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-4 px-4 pt-4 pb-28">
        {children}
      </div>
      <Navegacion alertas={alertas} />
    </>
  );
}
