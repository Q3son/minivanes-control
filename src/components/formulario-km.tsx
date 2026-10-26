"use client";

import { useActionState } from "react";
import type { EstadoKm } from "@/app/(app)/unidades/[placa]/acciones";
import { Aviso, Boton } from "@/components/ui";

type Accion = (estado: EstadoKm, datos: FormData) => Promise<EstadoKm>;

export function FormularioKm({
  accion,
  kmAnterior,
}: {
  accion: Accion;
  kmAnterior: number | null;
}) {
  const [estado, enviar, guardando] = useActionState(accion, { estado: "inicial" });

  return (
    <form action={enviar} className="flex flex-col gap-3">
      <label htmlFor="km" className="font-semibold">
        ¿Cuánto marca el tablero?
      </label>
      <input
        id="km"
        name="km"
        inputMode="numeric"
        autoComplete="off"
        placeholder={kmAnterior?.toLocaleString("es-PE") ?? "Ej. 176,650"}
        defaultValue={estado.estado === "confirmar" ? estado.km : ""}
        key={estado.estado === "guardado" ? estado.km : "km"}
        aria-describedby="km-nota"
        className="h-14 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-2xl font-bold tabular-nums focus:border-marca focus:bg-white focus:outline-none"
      />
      <div id="km-nota">
        {estado.estado === "error" && <Aviso tono="error">{estado.mensaje}</Aviso>}
        {estado.estado === "confirmar" && <Aviso tono="alerta">{estado.mensaje}</Aviso>}
        {estado.estado === "guardado" && (
          <Aviso tono="exito">Guardado: {estado.km.toLocaleString("es-PE")} km</Aviso>
        )}
      </div>
      {estado.estado === "confirmar" && <input type="hidden" name="confirmado" value={estado.km} />}
      <Boton type="submit" disabled={guardando}>
        {guardando
          ? "Guardando…"
          : estado.estado === "confirmar"
            ? "Sí, está bien"
            : "Guardar kilometraje"}
      </Boton>
    </form>
  );
}
