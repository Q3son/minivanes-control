"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

interface EventoInstalar extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const MODO_APP = "(display-mode: standalone)";

function useAbiertaComoApp() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(MODO_APP);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(MODO_APP).matches,
    () => false,
  );
}

/**
 * Opción del menú para poner la app en la pantalla de inicio.
 * En Android con Chrome abre el aviso de instalación; si no, explica los pasos.
 */
export function InstalarApp({ alTerminar }: { alTerminar: () => void }) {
  const comoApp = useAbiertaComoApp();
  const [aviso, setAviso] = useState<EventoInstalar | null>(null);
  const [verPasos, setVerPasos] = useState(false);

  useEffect(() => {
    const guardar = (e: Event) => {
      e.preventDefault();
      setAviso(e as EventoInstalar);
    };
    const instalada = () => setAviso(null);
    window.addEventListener("beforeinstallprompt", guardar);
    window.addEventListener("appinstalled", instalada);
    return () => {
      window.removeEventListener("beforeinstallprompt", guardar);
      window.removeEventListener("appinstalled", instalada);
    };
  }, []);

  if (comoApp) return null;

  async function instalar() {
    if (!aviso) {
      setVerPasos((v) => !v);
      return;
    }
    await aviso.prompt();
    await aviso.userChoice;
    setAviso(null);
    alTerminar();
  }

  return (
    <div>
      <button
        type="button"
        onClick={instalar}
        aria-expanded={aviso ? undefined : verPasos}
        className="flex min-h-14 w-full items-center gap-3 rounded-xl px-2 text-left font-semibold transition-colors active:bg-gray-100"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6 text-marca"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 7v7M9 11l3 3 3-3M10 18h4" />
        </svg>
        <span className="flex-1">
          Instalar en el celular
          <span className="block text-sm font-normal text-gray-600">
            Ícono en tu pantalla de inicio, sin abrir el navegador
          </span>
        </span>
      </button>
      {verPasos && (
        <ol className="mx-2 mb-2 list-decimal rounded-xl bg-gray-100 py-3 pr-3 pl-8 text-[15px] leading-relaxed">
          <li>
            <b>Android (Chrome):</b> toca los tres puntos <b>⋮</b> arriba a la derecha y elige{" "}
            <b>«Agregar a la pantalla principal»</b> o <b>«Instalar app»</b>.
          </li>
          <li>
            <b>iPhone (Safari):</b> toca <b>Compartir</b> (cuadro con flecha) y elige{" "}
            <b>«Agregar a inicio»</b>.
          </li>
        </ol>
      )}
    </div>
  );
}
