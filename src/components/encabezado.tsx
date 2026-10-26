import type { ReactNode } from "react";

export function Encabezado({ titulo, accion }: { titulo: string; accion?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div>
        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Mis minivanes
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight">{titulo}</h1>
      </div>
      {accion}
    </header>
  );
}
