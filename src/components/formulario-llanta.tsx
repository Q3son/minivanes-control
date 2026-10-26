"use client";

import { useActionState, useState } from "react";
import type { EstadoCambio } from "@/app/(app)/unidades/[placa]/llantas/acciones";
import { CampoFoto } from "@/components/campo-foto";
import { Aviso, Boton, Campo } from "@/components/ui";
import { normalizarDot } from "@/lib/domain";

type Accion = (estado: EstadoCambio, datos: FormData) => Promise<EstadoCambio>;

interface LlantaActual {
  dot: string | null;
  marca: string | null;
  medida: string | null;
  kmPuesta: number;
  fechaPuesta: string;
  mmInicial: number | null;
  codigoPropio: string | null;
}

export function FormularioLlanta({
  accion,
  actual,
  kmActual,
  carpeta,
  codigoSugerido,
}: {
  accion: Accion;
  actual: LlantaActual | null;
  kmActual: number | null;
  carpeta: string;
  codigoSugerido: string;
}) {
  const [estado, enviar, guardando] = useActionState(accion, {});
  const [dotDevuelto, setDotDevuelto] = useState("");
  const e = estado.errores ?? {};
  const devuelto = normalizarDot(dotDevuelto);
  const coincide = actual?.dot && devuelto ? actual.dot === devuelto : null;

  return (
    <form action={enviar} className="flex flex-col gap-4" noValidate>
      {actual && (
        <>
          <h2 className="flex items-center gap-2 font-bold">
            <span className="grid size-6 place-items-center rounded-full bg-marca text-sm text-white">
              1
            </span>
            La llanta que sale
          </h2>
          <Aviso tono="info">
            Se puso con DOT <b>{actual.dot ?? "—"}</b>
            {actual.codigoPropio && (
              <>
                {" "}
                y marca <b>{actual.codigoPropio}</b>
              </>
            )}
            , a los {actual.kmPuesta.toLocaleString("es-PE")} km
            {actual.mmInicial != null && <> con {actual.mmInicial} mm</>}.
          </Aviso>
          <Campo
            id="dotDevuelto"
            name="dotDevuelto"
            etiqueta="DOT de la llanta que te devuelven"
            ayuda="Los 4 números al final del código DOT: semana y año de fabricación."
            inputMode="numeric"
            maxLength={6}
            value={dotDevuelto}
            onChange={(ev) => setDotDevuelto(ev.target.value)}
            error={e.dotDevuelto}
          />
          {coincide === true && (
            <Aviso tono="exito">Coincide. Es la misma llanta que se puso.</Aviso>
          )}
          {coincide === false && (
            <Aviso tono="error">
              No coincide. La llanta registrada tiene DOT {actual.dot}: esta no es la que se puso.
            </Aviso>
          )}
          <Campo
            id="mmRetiro"
            name="mmRetiro"
            etiqueta="Profundidad que le queda (mm)"
            inputMode="decimal"
            error={e.mmRetiro}
          />
          <CampoFoto
            nombre="fotoRetiro"
            etiqueta="Foto de la llanta que sale"
            guia="Encuadra el dibujo y el código DOT, igual que al ponerla."
            carpeta={carpeta}
          />
          <h2 className="mt-2 flex items-center gap-2 font-bold">
            <span className="grid size-6 place-items-center rounded-full bg-marca text-sm text-white">
              2
            </span>
            La llanta nueva
          </h2>
        </>
      )}
      <Campo
        id="km"
        name="km"
        etiqueta="Km del tablero"
        inputMode="numeric"
        defaultValue={kmActual ?? ""}
        error={e.km}
      />
      <div className="grid grid-cols-2 gap-3">
        <Campo
          id="marca"
          name="marca"
          etiqueta="Marca"
          placeholder="Michelin"
          defaultValue={actual?.marca ?? ""}
          error={e.marca}
        />
        <Campo
          id="medida"
          name="medida"
          etiqueta="Medida"
          placeholder="205/75 R16"
          defaultValue={actual?.medida ?? ""}
          error={e.medida}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo
          id="dot"
          name="dot"
          etiqueta="DOT (4 números)"
          inputMode="numeric"
          maxLength={6}
          placeholder="3826"
          error={e.dot}
        />
        <Campo
          id="mm"
          name="mm"
          etiqueta="Profundidad (mm)"
          inputMode="decimal"
          placeholder="9"
          error={e.mm}
        />
      </div>
      <Campo
        id="codigoPropio"
        name="codigoPropio"
        etiqueta="Tu marca en la llanta (opcional)"
        ayuda="Escríbela con plumón de pintura en la llanta. Así nadie la cambia sin que lo notes."
        defaultValue={codigoSugerido}
        error={e.codigoPropio}
      />
      <Campo
        id="precio"
        name="precio"
        etiqueta="Precio (S/, opcional)"
        inputMode="decimal"
        error={e.precio}
      />
      <CampoFoto
        nombre="foto"
        etiqueta="Foto de la llanta nueva"
        guia="Encuadra el dibujo de la llanta y el código DOT."
        carpeta={carpeta}
      />
      <Boton type="submit" disabled={guardando}>
        {guardando ? "Guardando…" : actual ? "Guardar cambio de llanta" : "Guardar llanta"}
      </Boton>
    </form>
  );
}
