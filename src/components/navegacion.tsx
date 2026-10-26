"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const iconos = {
  inicio: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  unidades:
    "M2 6h15v10H2zM17 9h3l2 3v4h-5M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  alertas: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  reportes: "M4 20V10M10 20V4M16 20v-7M22 20H2",
};

const enlaces = [
  { href: "/", texto: "Inicio", icono: iconos.inicio },
  { href: "/unidades", texto: "Unidades", icono: iconos.unidades },
  { href: "/alertas", texto: "Alertas", icono: iconos.alertas },
  { href: "/reportes", texto: "Reportes", icono: iconos.reportes },
] as const;

export function Navegacion() {
  const ruta = usePathname();
  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {enlaces.map(({ href, texto, icono }) => {
          const activo = href === "/" ? ruta === "/" : ruta.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs font-semibold ${
                  activo ? "text-marca" : "text-gray-500"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d={icono} />
                </svg>
                {texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
