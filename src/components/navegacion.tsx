"use client";

import "driver.js/dist/driver.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { iniciarRecorrido, marcarRecorridoVisto, yaVioElRecorrido } from "@/components/recorrido";
import { pantallaDe } from "@/lib/recorridos";

const iconos = {
  inicio: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  unidades:
    "M2 6h15v10H2zM17 9h3l2 3v4h-5M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  alertas: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  mas: "M4 6h16M4 12h16M4 18h16",
  recorrido:
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01",
  salir: "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3",
};

const enlaces = [
  { href: "/", texto: "Inicio", icono: iconos.inicio, tour: "nav-inicio" },
  { href: "/unidades", texto: "Unidades", icono: iconos.unidades, tour: "nav-unidades" },
  { href: "/alertas", texto: "Alertas", icono: iconos.alertas, tour: "nav-alertas" },
] as const;

const PESTANA =
  "relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-[13px] transition-colors active:bg-gray-100";

function Icono({ d, className = "size-6" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export function Navegacion({ alertas = 0 }: { alertas?: number }) {
  const ruta = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const pantalla = pantallaDe(ruta);

  // La primera vez que se abre Inicio en este celular, se ofrece el recorrido solo.
  useEffect(() => {
    if (pantalla !== "inicio" || yaVioElRecorrido()) return;
    marcarRecorridoVisto();
    const t = setTimeout(() => void iniciarRecorrido("inicio"), 700);
    return () => clearTimeout(t);
  }, [pantalla]);

  function verRecorrido() {
    menu.current?.close();
    if (pantalla) void iniciarRecorrido(pantalla);
  }

  return (
    <>
      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-4">
          {enlaces.map(({ href, texto, icono, tour }) => {
            const activo = href === "/" ? ruta === "/" : ruta.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  data-tour={tour}
                  aria-current={activo ? "page" : undefined}
                  className={`${PESTANA} ${activo ? "font-bold text-marca" : "font-semibold text-gray-600"}`}
                >
                  <Icono d={icono} />
                  {href === "/alertas" && alertas > 0 && (
                    <span className="absolute top-1 left-[calc(50%+4px)] grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                      {alertas}
                      <span className="sr-only"> pendientes</span>
                    </span>
                  )}
                  {texto}
                  {activo && (
                    <span
                      aria-hidden
                      className="absolute inset-x-6 top-0 h-[3px] rounded-b bg-marca"
                    />
                  )}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              data-tour="nav-mas"
              aria-haspopup="dialog"
              onClick={() => menu.current?.showModal()}
              className={`${PESTANA} font-semibold text-gray-600`}
            >
              <Icono d={iconos.mas} />
              Más
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={menu}
        aria-labelledby="menu-titulo"
        onClick={(e) => e.target === e.currentTarget && menu.current?.close()}
        className="menu-inferior mx-auto mt-auto mb-0 w-full max-w-xl rounded-t-3xl bg-white p-0 text-tinta"
      >
        <div className="flex flex-col gap-1 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <span aria-hidden className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-gray-300" />
          <h2 id="menu-titulo" className="px-2 pb-1 text-lg font-extrabold">
            Más opciones
          </h2>
          <button
            type="button"
            onClick={verRecorrido}
            disabled={!pantalla}
            className="flex min-h-14 items-center gap-3 rounded-xl px-2 text-left font-semibold transition-colors active:bg-gray-100 disabled:opacity-50"
          >
            <Icono d={iconos.recorrido} className="size-6 text-marca" />
            <span className="flex-1">
              Ver recorrido guiado
              <span className="block text-sm font-normal text-gray-600">
                {pantalla
                  ? "Te explica esta pantalla paso a paso"
                  : "Disponible en Inicio, Unidades, la ficha, Llantas y Alertas"}
              </span>
            </span>
          </button>
          <form action="/auth/salir" method="post">
            <button className="flex min-h-14 w-full items-center gap-3 rounded-xl px-2 text-left font-semibold text-red-800 transition-colors active:bg-red-50">
              <Icono d={iconos.salir} />
              Cerrar sesión
            </button>
          </form>
          <button
            type="button"
            onClick={() => menu.current?.close()}
            className="mt-2 min-h-12 rounded-xl bg-gray-100 font-bold active:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </dialog>
    </>
  );
}
