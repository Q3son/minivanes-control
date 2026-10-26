"use client";

import { useActionState, useState } from "react";
import type { EstadoKm } from "@/app/(app)/unidades/[placa]/acciones";
import { Aviso, Boton } from "@/components/ui";
import { leerKm } from "@/lib/domain";

type Accion = (estado: EstadoKm, datos: FormData) => Promise<EstadoKm>;

export function FormularioKm({
  accion,
  kmAnterior,
}: {
  accion: Accion;
  kmAnterior: number | null;
}) {
  const [estado, enviar, guardando] = useActionState(accion, { estado: "inicial" });
  const [valor, setValor] = useState("");

  // Al recibir una respuesta: precargar el número a confirmar o limpiar tras guardar.
  const [estadoVisto, setEstadoVisto] = useState(estado);
  if (estado !== estadoVisto) {
    setEstadoVisto(estado);
    if (estado.estado === "confirmar") setValor(String(estado.km));
    if (estado.estado === "guardado") setValor("");
  }

  // La advertencia solo vale para el número exacto que se advirtió.
  const porConfirmar = estado.estado === "confirmar" && leerKm(valor) === estado.km;
  const mostrarGuardado = estado.estado === "guardado" && valor === "";

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
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        aria-describedby="km-nota"
        className="h-14 rounded-xl border border-gray-500 bg-white px-3.5 text-2xl font-bold tabular-nums focus:border-marca focus:bg-white focus:outline-none"
      />
      <div id="km-nota">
        {estado.estado === "error" && <Aviso tono="error">{estado.mensaje}</Aviso>}
        {porConfirmar && <Aviso tono="alerta">{estado.mensaje}</Aviso>}
        {mostrarGuardado && (
          <Aviso tono="exito">Guardado: {estado.km.toLocaleString("es-PE")} km</Aviso>
        )}
      </div>
      {porConfirmar && <input type="hidden" name="confirmado" value={estado.km} />}
      <Boton type="submit" disabled={guardando}>
        {guardando ? "Guardando…" : porConfirmar ? "Sí, está bien" : "Guardar kilometraje"}
      </Boton>
    </form>
  );
}
