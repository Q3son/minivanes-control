/**
 * Se muestra apenas se toca un enlace, mientras llega la página del servidor.
 * Así el clic responde al instante aunque la consulta tarde.
 */
export default function Cargando() {
  return (
    <div role="status" aria-label="Cargando" className="flex animate-pulse flex-col gap-4">
      <div className="h-8 w-2/3 rounded-lg bg-gray-200" />
      <div className="h-28 rounded-2xl bg-white shadow-sm" />
      <div className="h-44 rounded-2xl bg-white shadow-sm" />
      <div className="h-44 rounded-2xl bg-white shadow-sm" />
    </div>
  );
}
