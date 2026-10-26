"use client";

import { useActionState } from "react";
import { Aviso, Boton, Campo } from "@/components/ui";
import { enviarEnlace, type EstadoIngreso } from "./acciones";

const inicial: EstadoIngreso = { estado: "inicial" };

export function FormularioIngreso() {
  const [estado, accion, enviando] = useActionState(enviarEnlace, inicial);

  if (estado.estado === "enviado") {
    return (
      <Aviso tono="exito">
        Te enviamos un enlace a {estado.mensaje}. Ábrelo desde este mismo equipo para entrar.
      </Aviso>
    );
  }

  return (
    <form action={accion} className="flex flex-col gap-4">
      <Campo
        id="correo"
        name="correo"
        type="email"
        etiqueta="Tu correo"
        autoComplete="email"
        inputMode="email"
        required
        error={estado.estado === "error" ? estado.mensaje : undefined}
      />
      <Boton type="submit" disabled={enviando}>
        {enviando ? "Enviando…" : "Enviarme el enlace"}
      </Boton>
    </form>
  );
}
