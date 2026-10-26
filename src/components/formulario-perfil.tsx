"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { EstadoPerfil } from "@/app/(app)/perfil/acciones";
import { Aviso, Boton, Campo } from "@/components/ui";
import type { Perfil } from "@/lib/domain";

type Accion = (estado: EstadoPerfil, datos: FormData) => Promise<EstadoPerfil>;

export function FormularioPerfil({ accion, perfil }: { accion: Accion; perfil: Perfil }) {
  const [estado, enviar, guardando] = useActionState(accion, {});
  const e = estado.errores ?? {};

  return (
    <form action={enviar} className="flex flex-col gap-4" noValidate>
      {estado.guardado && (
        <Aviso tono="exito">
          Listo, ya te saludamos así.{" "}
          <Link href="/" className="underline underline-offset-4">
            Ir a Inicio
          </Link>
        </Aviso>
      )}
      {estado.mensaje && <Aviso tono="error">{estado.mensaje}</Aviso>}
      <Campo
        id="nombre"
        name="nombre"
        etiqueta="¿Cómo quieres que te saludemos?"
        ayuda="Por ejemplo «Don Jorge» o solo «Jorge»."
        placeholder="Don Jorge"
        autoComplete="name"
        autoCapitalize="words"
        defaultValue={perfil.nombre ?? ""}
        error={e.nombre}
      />
      <Campo
        id="empresa"
        name="empresa"
        etiqueta="Nombre de tu empresa (opcional)"
        ayuda="Aparece en tu perfil y en el menú Más."
        placeholder="Transportes Misti"
        autoComplete="organization"
        defaultValue={perfil.empresa ?? ""}
        error={e.empresa}
      />
      <Boton type="submit" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar"}
      </Boton>
    </form>
  );
}
