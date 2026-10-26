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

const CAMPOS_PASO_1 = ["dotDevuelto", "mmRetiro", "fotoRetiro"];

function Pasos({ actual, total }: { actual: number; total: number }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-gray-500">
        Paso {actual} de {total}
      </p>
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < actual ? "bg-marca" : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Cambio de llanta en dos pasos cuando ya hay una puesta:
 * 1) comprobar la que sale (DOT devuelto), 2) registrar la nueva.
 * Solo se piden los datos necesarios; el resto va en "Más datos".
 */
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
  const [paso, setPaso] = useState(1);
  const [dotDevuelto, setDotDevuelto] = useState("");
  const [errorPaso1, setErrorPaso1] = useState<string>();
  const e = estado.errores ?? {};
  const total = actual ? 2 : 1;
  const devuelto = normalizarDot(dotDevuelto);
  const coincide = actual?.dot && devuelto ? actual.dot === devuelto : null;
  const enNueva = !actual || paso === 2;

  // Si el servidor rechaza un dato de la llanta que sale, volver a ese paso
  // (ajuste durante el render, el patrón que recomienda React en vez de un efecto).
  const [estadoVisto, setEstadoVisto] = useState(estado);
  if (estado !== estadoVisto) {
    setEstadoVisto(estado);
    if (Object.keys(estado.errores ?? {}).some((k) => CAMPOS_PASO_1.includes(k))) setPaso(1);
  }

  function siguiente() {
    if (!devuelto) {
      setErrorPaso1("Escribe los 4 números del DOT de la llanta que te devuelven.");
      return;
    }
    setErrorPaso1(undefined);
    setPaso(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form action={enviar} className="flex flex-col gap-5" noValidate>
      {actual && <Pasos actual={paso} total={total} />}

      {actual && (
        <div hidden={paso !== 1} className="flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold">Revisa la llanta que te devuelven</h2>
            <p className="text-gray-600">
              Busca en el costado de la llanta el código <b>DOT</b> y escribe los{" "}
              <b>4 últimos números</b>.
            </p>
          </div>

          <Aviso tono="info">
            La que se puso tiene DOT <b>{actual.dot ?? "—"}</b>
            {actual.codigoPropio && (
              <>
                {" "}
                y tu marca <b>{actual.codigoPropio}</b>
              </>
            )}
            .
          </Aviso>

          <Campo
            id="dotDevuelto"
            name="dotDevuelto"
            etiqueta="DOT de la llanta devuelta"
            inputMode="numeric"
            maxLength={6}
            placeholder="4 números"
            value={dotDevuelto}
            onChange={(ev) => setDotDevuelto(ev.target.value)}
            error={errorPaso1 ?? e.dotDevuelto}
          />

          {coincide === true && (
            <Aviso tono="exito">Coincide: es la misma llanta que se puso. Todo en orden.</Aviso>
          )}
          {coincide === false && (
            <Aviso tono="error">
              No coincide: te están devolviendo otra llanta. Puedes seguir y guardar; quedará
              marcada en rojo en el historial como prueba.
            </Aviso>
          )}

          <CampoFoto
            nombre="fotoRetiro"
            etiqueta="Foto de la llanta devuelta (recomendado)"
            guia="Toma el costado donde se ve el código DOT."
            carpeta={carpeta}
          />

          <details className="rounded-xl bg-gray-50 p-3">
            <summary className="cursor-pointer font-semibold">Más datos (opcional)</summary>
            <div className="mt-3">
              <Campo
                id="mmRetiro"
                name="mmRetiro"
                etiqueta="Profundidad que le queda (mm)"
                inputMode="decimal"
                placeholder="Ej. 3"
                error={e.mmRetiro}
              />
            </div>
          </details>

          <Boton type="button" onClick={siguiente}>
            Siguiente: la llanta nueva
          </Boton>
        </div>
      )}

      <div hidden={!enNueva} className="flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-bold">
            {actual ? "Ahora, la llanta nueva" : "Datos de la llanta"}
          </h2>
          <p className="text-gray-600">Solo son obligatorios el kilometraje y el DOT.</p>
        </div>

        <Campo
          id="km"
          name="km"
          etiqueta="Kilometraje del tablero hoy"
          inputMode="numeric"
          defaultValue={kmActual ?? ""}
          error={e.km}
        />
        <Campo
          id="dot"
          name="dot"
          etiqueta="DOT de la llanta nueva"
          ayuda="Los 4 últimos números del código DOT, en el costado de la llanta."
          inputMode="numeric"
          maxLength={6}
          placeholder="4 números"
          error={e.dot}
        />
        <CampoFoto
          nombre="foto"
          etiqueta="Foto de la llanta nueva (recomendado)"
          guia="Toma el costado donde se ve el código DOT."
          carpeta={carpeta}
        />

        <details
          className="rounded-xl bg-gray-50 p-3"
          open={Boolean(e.marca || e.medida || e.mm || e.codigoPropio || e.precio)}
        >
          <summary className="cursor-pointer font-semibold">
            Más datos (opcional): marca, medida, precio
          </summary>
          <div className="mt-3 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Campo
                id="marca"
                name="marca"
                etiqueta="Marca"
                placeholder="Ej. Michelin"
                defaultValue={actual?.marca ?? ""}
                error={e.marca}
              />
              <Campo
                id="medida"
                name="medida"
                etiqueta="Medida"
                placeholder="Ej. 205/75 R16"
                defaultValue={actual?.medida ?? ""}
                error={e.medida}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo
                id="mm"
                name="mm"
                etiqueta="Profundidad (mm)"
                inputMode="decimal"
                placeholder="Ej. 9"
                error={e.mm}
              />
              <Campo
                id="precio"
                name="precio"
                etiqueta="Precio (S/)"
                inputMode="decimal"
                placeholder="Ej. 420"
                error={e.precio}
              />
            </div>
            <Campo
              id="codigoPropio"
              name="codigoPropio"
              etiqueta="Tu marca en la llanta"
              ayuda="Escríbela con plumón de pintura en la llanta. Así nadie la cambia sin que lo notes."
              defaultValue={codigoSugerido}
              error={e.codigoPropio}
            />
          </div>
        </details>

        <div className="flex flex-col gap-2">
          <Boton type="submit" disabled={guardando}>
            {guardando ? "Guardando…" : actual ? "Guardar cambio de llanta" : "Guardar llanta"}
          </Boton>
          {actual && (
            <Boton type="button" variante="secundario" onClick={() => setPaso(1)}>
              Volver a la llanta devuelta
            </Boton>
          )}
        </div>
      </div>
    </form>
  );
}
