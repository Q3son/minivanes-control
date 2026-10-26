/** Achica una foto del celular a JPEG de máx. `lado` px para subirla rápido con datos móviles. */
export async function comprimirFoto(archivo: File, lado = 1400, calidad = 0.75): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, lado / Math.max(bitmap.width, bitmap.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(bitmap.width * escala);
  lienzo.height = Math.round(bitmap.height * escala);
  lienzo.getContext("2d")?.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
  bitmap.close();
  return new Promise((resolver, rechazar) =>
    lienzo.toBlob(
      (blob) => (blob ? resolver(blob) : rechazar(new Error("No se pudo procesar la foto"))),
      "image/jpeg",
      calidad,
    ),
  );
}
