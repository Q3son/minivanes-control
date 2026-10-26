import type { Metadata } from "next";
import { Aviso } from "@/components/ui";
import { FormularioIngreso } from "./formulario";

export const metadata: Metadata = { title: "Ingresar · Control de Minivanes" };

const BENEFICIOS = [
  {
    icono: "M3 7h18v10H3zM7 12h.01M17 12h.01M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    titulo: "Cobros y ganancia",
    texto: "Quién pagó su cuota esta semana y cuánto te deja cada unidad.",
  },
  {
    icono:
      "M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    titulo: "Aceite y documentos a tiempo",
    texto: "Te avisa cuando faltan 1,000 km para el aceite y antes de que venza el SOAT.",
  },
  {
    icono:
      "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v6M12 15v6M3 12h6M15 12h6",
    titulo: "Llantas con prueba",
    texto: "Código DOT y foto de cada llanta, para que no te la cambien.",
  },
];

/** La placa peruana como identidad: blanca, franja azul con «PERÚ». */
function PlacaGrande() {
  return (
    <div
      aria-hidden
      className="w-[min(100%,22rem)] -rotate-2 overflow-hidden rounded-xl border-[3px] border-gray-900 bg-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.55)] lg:w-[26rem]"
    >
      <div className="bg-blue-700 py-1 text-center text-[11px] font-bold tracking-[0.35em] text-white lg:text-xs">
        PERÚ
      </div>
      <div className="py-3 text-center text-5xl font-extrabold tracking-[0.12em] text-gray-900 tabular-nums lg:py-4 lg:text-6xl">
        AQP-001
      </div>
    </div>
  );
}

export default async function Ingresar({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-dvh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <section className="relative flex flex-col justify-center overflow-hidden bg-panel px-6 pt-10 pb-12 text-panel-texto lg:px-14 lg:py-16">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
          <PlacaGrande />
          <div className="flex max-w-md flex-col gap-3">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight lg:text-5xl">
              Tus minivanes, placa por placa.
            </h1>
            <p className="text-lg text-panel-suave">
              Cobros, gastos, mantenimientos y llantas de cada unidad, en un solo lugar.
            </p>
          </div>
          <ul className="hidden max-w-md flex-col gap-5 lg:flex">
            {BENEFICIOS.map((b) => (
              <li key={b.titulo} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-panel-sube">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d={b.icono} />
                  </svg>
                </span>
                <span>
                  <b className="block text-[17px] font-bold">{b.titulo}</b>
                  <span className="text-panel-suave">{b.texto}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Línea de carril: el único adorno, tomado de la pista. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-5 h-1 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.22)_0_36px,transparent_36px_64px)]"
        />
      </section>

      <section className="flex flex-col justify-center px-5 py-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-6 lg:max-w-md lg:rounded-3xl lg:border lg:border-gray-200 lg:bg-white lg:p-10 lg:shadow-sm">
          {error === "enlace" && (
            <Aviso tono="error">El enlace ya venció o ya se usó. Pide uno nuevo abajo.</Aviso>
          )}
          <FormularioIngreso />
          <p className="text-sm text-gray-600">
            Acceso solo para el dueño de la flota. Si cambiaste de correo, avísale a quien te dio el
            acceso.
          </p>
        </div>
      </section>
    </main>
  );
}
