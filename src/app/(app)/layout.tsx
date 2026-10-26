import { Navegacion } from "@/components/navegacion";
import { Volcanes } from "@/components/volcanes";
import { obtenerPerfil } from "@/lib/data/perfil";
import { listarVehiculos } from "@/lib/data/vehiculos";
import { alertasDeFlota, hoyEnLima } from "@/lib/domain";

/** Marco de las pantallas con sesión: contenido en una columna y navegación fija abajo. */
export default async function MarcoApp({ children }: { children: React.ReactNode }) {
  const [vehiculos, perfil] = await Promise.all([listarVehiculos(), obtenerPerfil()]);
  const alertas = alertasDeFlota(vehiculos, hoyEnLima()).length;
  return (
    <>
      {/* Fondo: los volcanes de Arequipa, muy tenues, detrás de las tarjetas. */}
      <Volcanes
        cerros="#e2e6ea"
        nieve="#f3f5f7"
        lomas="#dce1e6"
        className="pointer-events-none fixed inset-x-0 bottom-14 -z-10 h-40 w-full sm:h-56"
      />
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-4 px-4 pt-4 pb-28">
        {children}
      </div>
      <Navegacion alertas={alertas} perfil={perfil} />
    </>
  );
}
