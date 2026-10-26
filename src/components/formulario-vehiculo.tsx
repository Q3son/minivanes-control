"use client";

import { useActionState } from "react";
import type { EstadoFormulario } from "@/app/(app)/unidades/acciones";
import { Boton, Campo, Placa } from "@/components/ui";
import type { Vehiculo } from "@/lib/domain";

type Accion = (estado: EstadoFormulario, datos: FormData) => Promise<EstadoFormulario>;

export function FormularioVehiculo({ accion, vehiculo }: { accion: Accion; vehiculo?: Vehiculo }) {
  const [estado, enviar, guardando] = useActionState(accion, {});
  const e = estado.errores ?? {};

  return (
    <form action={enviar} className="flex flex-col gap-4" noValidate>
      {vehiculo ? (
        <Placa placa={vehiculo.placa} grande />
      ) : (
        <Campo
          id="placa"
          name="placa"
          etiqueta="Placa"
          placeholder="ABC123"
          autoCapitalize="characters"
          autoComplete="off"
          required
          error={e.placa}
          className="h-13 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-2xl font-bold tracking-widest uppercase"
        />
      )}
      <Campo
        id="conductor"
        name="conductor"
        etiqueta="Conductor"
        defaultValue={vehiculo?.conductor ?? ""}
        error={e.conductor}
      />
      <div className="grid grid-cols-2 gap-3">
        <Campo
          id="marca"
          name="marca"
          etiqueta="Marca"
          list="marcas"
          defaultValue={vehiculo?.marca ?? ""}
          error={e.marca}
        />
        <Campo
          id="cuotaSemanal"
          name="cuotaSemanal"
          etiqueta="Cuota semanal (S/)"
          inputMode="decimal"
          defaultValue={vehiculo?.cuotaSemanal ?? ""}
          required
          error={e.cuotaSemanal}
        />
      </div>
      <datalist id="marcas">
        <option value="Mercedes-Benz" />
        <option value="Renault" />
        <option value="Hyundai" />
        <option value="Toyota" />
      </datalist>
      <label className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 font-semibold">
        <input
          type="checkbox"
          name="traserasDobles"
          defaultChecked={vehiculo?.traserasDobles ?? false}
          className="size-5 accent-marca"
        />
        Llantas traseras dobles
      </label>
      <Campo
        id="intervaloAceiteKm"
        name="intervaloAceiteKm"
        etiqueta="Cambio de aceite cada (km)"
        inputMode="numeric"
        defaultValue={vehiculo?.intervaloAceiteKm ?? 9000}
        error={e.intervaloAceiteKm}
      />
      <div className="grid grid-cols-2 gap-3">
        <Campo
          id="soatVence"
          name="soatVence"
          type="date"
          etiqueta="Vence SOAT"
          defaultValue={vehiculo?.soatVence ?? ""}
          error={e.soatVence}
        />
        <Campo
          id="revisionVence"
          name="revisionVence"
          type="date"
          etiqueta="Vence revisión"
          defaultValue={vehiculo?.revisionVence ?? ""}
          error={e.revisionVence}
        />
      </div>
      <Boton type="submit" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar unidad"}
      </Boton>
    </form>
  );
}
