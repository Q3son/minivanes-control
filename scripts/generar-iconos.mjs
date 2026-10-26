// Genera los íconos de la app (PWA) a partir de scripts/iconos.svg.
// Uso: node scripts/generar-iconos.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile(new URL("./iconos.svg", import.meta.url));
const salida = (n) => new URL(`../public/${n}`, import.meta.url).pathname;

// "any": ícono a sangre completa con esquinas redondeadas.
const redondeado = Buffer.from(
  svg
    .toString()
    .replace('<rect width="512" height="512"', '<rect width="512" height="512" rx="112"'),
);
await sharp(redondeado).resize(192).png().toFile(salida("icono-192.png"));
await sharp(redondeado).resize(512).png().toFile(salida("icono-512.png"));

// "maskable": el dibujo dentro de la zona segura (80 %), fondo completo.
const maskable = Buffer.from(
  svg.toString().replace("<g ", '<g transform="translate(51 51) scale(0.8)" '),
);
await sharp(maskable).resize(512).png().toFile(salida("icono-maskable-512.png"));

// iOS pone sus propias esquinas.
await sharp(svg)
  .resize(180)
  .png()
  .toFile(new URL("../src/app/apple-icon.png", import.meta.url).pathname);
console.log("Íconos generados");
