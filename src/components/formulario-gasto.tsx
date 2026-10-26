"use client";

import { useActionState } from "react";
import { anotarGasto } from "@/app/(app)/acciones";
import { Boton, Campo } from "@/components/ui";
import { CATEGORIAS_GASTO } from "@/lib/domain";

export function FormularioGasto({
  placas,
  placaInicial,
  hoy,
}: {
  placas: { placa: string; conductor: string | null }[];
  placaInicial?: string;
  hoy: string;
}) {
  const [estado, enviar, guardando] = useActionState(anotarGasto, {});
  const e = estado.errores ?? {};

  return (
    <form action={enviar} className="flex flex-col gap-4" noValidate>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-[15px] font-semibold">¿Qué unidad?</legend>
        <div className="grid grid-cols-3 gap-2">
          {placas.map(({ placa, conductor }) => (
            <label
              key={placa}
              className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-[1.5px] border-gray-200 p-2 has-checked:border-marca has-checked:bg-marca-suave"
            >
              <input
                type="radio"
                name="placa"
                value={placa}
                defaultChecked={placa === placaInicial}
                className="sr-only"
              />
              <span className="text-sm font-extrabold tracking-wider">{placa}</span>
              <span className="truncate text-xs text-gray-500">
                {conductor?.split(" ")[0] ?? "—"}
              </span>
            </label>
          ))}
        </div>
        {e.placa && <p className="text-sm text-red-700">{e.placa}</p>}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-[15px] font-semibold">¿En qué?</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIAS_GASTO).map(([valor, texto]) => (
            <label
              key={valor}
              className="cursor-pointer rounded-full border border-gray-200 px-3.5 py-2 text-[15px] font-semibold has-checked:border-marca has-checked:bg-marca-suave has-checked:text-marca"
            >
              <input type="radio" name="categoria" value={valor} className="sr-only" />
              {texto}
            </label>
          ))}
        </div>
        {e.categoria && <p className="text-sm text-red-700">{e.categoria}</p>}
      </fieldset>

      <Campo id="monto" name="monto" etiqueta="¿Cuánto? (S/)" inputMode="decimal" error={e.monto} />
      <Campo
        id="nota"
        name="nota"
        etiqueta="Detalle (opcional)"
        placeholder="Ej. foco delantero, plumillas"
        error={e.nota}
      />
      <Campo
        id="fecha"
        name="fecha"
        type="date"
        etiqueta="Fecha"
        defaultValue={hoy}
        error={e.fecha}
      />
      <p className="text-sm text-gray-500">
        Aceite, frenos y llantas se anotan en su propia sección y su costo se suma solo.
      </p>
      <Boton type="submit" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar gasto"}
      </Boton>
    </form>
  );
}
