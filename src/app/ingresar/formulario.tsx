"use client";

import { useActionState, useEffect, useState } from "react";
import { Boton, Campo } from "@/components/ui";
import { enviarEnlace, type EstadoIngreso } from "./acciones";

const inicial: EstadoIngreso = { estado: "inicial" };
const ESPERA_REENVIO = 60;

const PASOS = [
  "Escribe tu correo.",
  "Abre el mensaje que te llega.",
  "Toca «Entrar» y listo, sin contraseña.",
];

function Enviado({
  correo,
  reenviar,
  enviando,
  otroCorreo,
}: {
  correo: string;
  reenviar: (datos: FormData) => void;
  enviando: boolean;
  otroCorreo: () => void;
}) {
  const [segundos, setSegundos] = useState(ESPERA_REENVIO);
  useEffect(() => {
    const id = setInterval(() => setSegundos((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-5" role="status">
      <span className="grid size-14 place-items-center rounded-2xl bg-marca-suave text-marca">
        <svg
          viewBox="0 0 24 24"
          className="size-8"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
        </svg>
      </span>
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Revisa tu correo</h2>
        <p className="mt-1 text-[17px] text-gray-700">
          Te enviamos el enlace a <b className="break-all text-tinta">{correo}</b>. Ábrelo en este
          mismo equipo y toca «Entrar».
        </p>
      </div>
      <p className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-3 text-[15px] text-amber-900">
        ¿No aparece? Mira en <b>Spam</b> o <b>Promociones</b>. Puede tardar un minuto.
      </p>
      <form action={reenviar} className="flex flex-col gap-2">
        <input type="hidden" name="correo" value={correo} />
        <Boton type="submit" variante="contorno" disabled={segundos > 0 || enviando}>
          {enviando
            ? "Enviando…"
            : segundos > 0
              ? `Reenviar en ${segundos} s`
              : "Reenviar el enlace"}
        </Boton>
        <button
          type="button"
          onClick={otroCorreo}
          className="min-h-11 font-semibold text-gray-700 underline-offset-4 active:underline"
        >
          Usar otro correo
        </button>
      </form>
    </div>
  );
}

export function FormularioIngreso() {
  const [estado, accion, enviando] = useActionState(enviarEnlace, inicial);
  const [editando, setEditando] = useState(false);

  // Un nuevo envío exitoso vuelve a mostrar la pantalla de «Revisa tu correo».
  const [visto, setVisto] = useState(estado);
  if (estado !== visto) {
    setVisto(estado);
    setEditando(false);
  }

  if (estado.estado === "enviado" && estado.mensaje && !editando) {
    return (
      <Enviado
        key={String(estado.mensaje) + String(enviando)}
        correo={estado.mensaje}
        reenviar={accion}
        enviando={enviando}
        otroCorreo={() => setEditando(true)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Entra a tu cuenta</h2>
        <ol className="mt-3 flex flex-col gap-2">
          {PASOS.map((paso, i) => (
            <li key={paso} className="flex items-center gap-3 text-[16px] text-gray-700">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-marca-suave text-sm font-bold text-marca">
                {i + 1}
              </span>
              {paso}
            </li>
          ))}
        </ol>
      </div>
      <form action={accion} className="flex flex-col gap-4" noValidate>
        <Campo
          id="correo"
          name="correo"
          type="email"
          etiqueta="Tu correo"
          placeholder="nombre@gmail.com"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={estado.estado === "enviado" ? "" : undefined}
          error={estado.estado === "error" ? estado.mensaje : undefined}
        />
        <Boton type="submit" disabled={enviando}>
          {enviando ? "Enviando…" : "Enviarme el enlace"}
        </Boton>
      </form>
    </div>
  );
}
