/**
 * Silueta de los volcanes de Arequipa (Chachani, Misti y Pichu Pichu) con
 * lomas al frente, para usar como fondo. Colores sólidos para que no se vean
 * uniones entre formas. Decorativa: oculta para lectores de pantalla.
 */
export function Volcanes({
  className = "",
  cerros,
  nieve,
  lomas,
}: {
  className?: string;
  cerros: string;
  nieve: string;
  lomas: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        fill={cerros}
        d="M0 300V210l50-14 45-26 35 8 45-46 30 14 35-28 45 32 35-6 40 28 35 16 35 8 40-16 50-40 55-52 30-26 13-4h24l13 4 30 26 55 52 50 36 40 14 40-12 35 8 35-26 35 12 30-16 40 20 40-14 40 20 35-6 40 14v110z"
      />
      <path
        fill={nieve}
        d="M605 62l13-4h24l13 4 30 26-13 4-12-8-12 12-14-10-14 12-14-10-14 8-17-8z"
      />
      <path fill={lomas} d="M0 300v-46c120-22 260-6 400-14s280-30 420-18 260 24 380 10v68z" />
    </svg>
  );
}
