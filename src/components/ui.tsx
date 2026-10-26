import type { ComponentProps, ReactNode } from "react";

type Variante = "principal" | "secundario" | "contorno" | "peligro";

const estilos: Record<Variante, string> = {
  principal: "bg-marca text-white hover:bg-marca/90",
  secundario: "bg-gray-100 text-tinta hover:bg-gray-200",
  contorno: "border-[1.5px] border-marca text-marca bg-transparent hover:bg-marca-suave",
  peligro: "bg-red-700 text-white hover:bg-red-800",
};

export function Boton({
  variante = "principal",
  className = "",
  ...props
}: ComponentProps<"button"> & { variante?: Variante }) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-bold transition active:scale-[0.98] disabled:opacity-50 ${estilos[variante]} ${className}`}
      {...props}
    />
  );
}

export function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function Campo({
  etiqueta,
  ayuda,
  error,
  id,
  ...props
}: ComponentProps<"input"> & { etiqueta: string; ayuda?: string; error?: string; id: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-semibold">
        {etiqueta}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={ayuda || error ? `${id}-nota` : undefined}
        className="h-13 w-full min-w-0 appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-[17px] placeholder:text-gray-400 placeholder:italic focus:border-marca focus:bg-white focus:outline-none aria-invalid:border-red-600"
        {...props}
      />
      {(error || ayuda) && (
        <p id={`${id}-nota`} className={`text-sm ${error ? "text-red-700" : "text-gray-500"}`}>
          {error ?? ayuda}
        </p>
      )}
    </div>
  );
}

/** Placa peruana: blanca con franja azul arriba. */
export function Placa({ placa, grande = false }: { placa: string; grande?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md border-[1.5px] border-t-[5px] border-gray-900 border-t-blue-700 bg-white font-extrabold tracking-widest text-gray-900 tabular-nums ${
        grande ? "h-11 px-3 text-xl" : "h-7 px-2 text-sm"
      }`}
    >
      {placa}
    </span>
  );
}

export function Aviso({
  tono,
  children,
}: {
  tono: "exito" | "alerta" | "error" | "info";
  children: ReactNode;
}) {
  const color = {
    exito: "bg-marca-suave text-marca",
    alerta: "bg-amber-50 text-amber-800",
    error: "bg-red-50 text-red-700",
    info: "bg-gray-100 text-tinta",
  }[tono];
  return (
    <div
      role={tono === "error" ? "alert" : "status"}
      className={`rounded-xl p-3 text-[15px] font-semibold ${color}`}
    >
      {children}
    </div>
  );
}

/** Clases para una fila de lista que lleva a otra pantalla: se resalta al tocarla. */
export const FILA_TOCABLE =
  "-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-gray-50 active:bg-gray-100";

/** Flecha que indica que la fila se puede abrir. */
export function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
