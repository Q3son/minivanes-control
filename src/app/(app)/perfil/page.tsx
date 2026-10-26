import type { Metadata } from "next";
import Link from "next/link";
import { FormularioPerfil } from "@/components/formulario-perfil";
import { Tarjeta } from "@/components/ui";
import { obtenerPerfil } from "@/lib/data/perfil";
import { inicialDe } from "@/lib/domain";
import { actualizarPerfil } from "./acciones";

export const metadata: Metadata = { title: "Mi perfil · Control de Minivanes" };

export default async function MiPerfil() {
  const perfil = await obtenerPerfil();

  return (
    <>
      <Link
        href="/"
        className="-mx-2 inline-flex min-h-11 items-center self-start rounded-lg px-2 text-[15px] font-semibold text-gray-700 active:bg-gray-200"
      >
        ← Inicio
      </Link>
      <Tarjeta className="items-center py-6 text-center">
        <span
          aria-hidden
          className="grid size-20 place-items-center rounded-full bg-marca text-4xl font-extrabold text-white uppercase"
        >
          {inicialDe(perfil)}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{perfil.nombre ?? "Mi perfil"}</h1>
          {perfil.empresa && <p className="font-semibold text-gray-700">{perfil.empresa}</p>}
          <p className="text-sm break-all text-gray-600">{perfil.correo}</p>
        </div>
      </Tarjeta>
      <Tarjeta>
        <FormularioPerfil accion={actualizarPerfil} perfil={perfil} />
      </Tarjeta>
      <p className="px-1 text-sm text-gray-600">
        Para entrar siempre usas este correo. Si necesitas cambiarlo, pídelo a quien te dio el
        acceso.
      </p>
    </>
  );
}
