import type { ReactNode } from "react";

export function Encabezado({
  titulo,
  antetitulo = "Mis minivanes",
  accion,
}: {
  titulo: string;
  antetitulo?: string;
  accion?: ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-600 first-letter:uppercase">{antetitulo}</p>
        <h1 className="text-2xl font-extrabold tracking-tight">{titulo}</h1>
      </div>
      {accion}
    </header>
  );
}
