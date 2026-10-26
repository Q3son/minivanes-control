import type { MetadataRoute } from "next";

/** Permite instalar la app en el celular: ícono propio y pantalla completa. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Control de Minivanes",
    short_name: "Minivanes",
    description: "Cobros, gastos, mantenimientos y llantas de cada unidad, por placa.",
    lang: "es-PE",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#eceef1",
    theme_color: "#0B6E4F",
    icons: [
      { src: "/icono-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icono-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icono-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
