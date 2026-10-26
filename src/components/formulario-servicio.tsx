"use client";

import { useActionState, useState } from "react";
import type { EstadoServicio } from "@/app/(app)/unidades/[placa]/acciones";
import { Aviso, Boton, Campo } from "@/components/ui";
import { TIPOS_SERVICIO } from "@/lib/domain";

type Accion = (estado: EstadoServicio, datos: FormData) => Promise<EstadoServicio>;

export function FormularioServicio({
  accion,
  kmActual,
}: {
  accion: Accion;
  kmActual: number | null;
}) {
  const [estado, enviar, guardando] = useActionState(accion, {});

  // Tras guardar, limpiar costo y detalle para el siguiente registro.
  const [estadoVisto, setEstadoVisto] = useState(estado);
  const [vuelta, setVuelta] = useState(0);
  if (estado !== estadoVisto) {
    setEstadoVisto(estado);
    if (estado.guardado) setVuelta((n) => n + 1);
  }
  const e = estado.errores ?? {};

  return (
    <form key={vuelta} action={enviar} className="flex flex-col gap-4" noValidate>
      <h2 className="font-bold">Anotar mantenimiento</h2>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">¿Qué se hizo?</legend>
        {Object.entries(TIPOS_SERVICIO).map(([valor, texto]) => (
          <label
            key={valor}
            className="cursor-pointer rounded-full border border-gray-400 bg-white px-3.5 py-2 text-[15px] font-semibold has-checked:border-marca has-checked:bg-marca-suave has-checked:text-marca"
          >
            <input
              type="radio"
              name="tipo"
              value={valor}
              defaultChecked={valor === "aceite"}
              className="sr-only"
            />
            {texto}
          </label>
        ))}
      </fieldset>
      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3">
        <Campo
          id="km-servicio"
          name="km"
          etiqueta="Km del tablero"
          inputMode="numeric"
          defaultValue={kmActual ?? ""}
          error={e.km}
        />
        <Campo id="costo" name="costo" etiqueta="Costo (S/)" inputMode="decimal" error={e.costo} />
      </div>
      <Campo
        id="nota-servicio"
        name="nota"
        etiqueta="Detalle (opcional)"
        placeholder="Ej. aceite 15W40 y filtro"
        error={e.nota}
      />
      {estado.guardado && <Aviso tono="exito">{estado.guardado} guardado.</Aviso>}
      <Boton type="submit" variante="secundario" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar mantenimiento"}
      </Boton>
    </form>
  );
}
