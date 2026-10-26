"use client";

import { useId, useState } from "react";
import { comprimirFoto } from "@/lib/imagen";
import { crearClienteSupabase } from "@/lib/supabase/client";

type Estado =
  | { tipo: "vacio" }
  | { tipo: "subiendo" }
  | { tipo: "lista"; vista: string }
  | { tipo: "error"; mensaje: string };

/**
 * Toma o elige una foto, la comprime y la sube al bucket privado `fotos`
 * en la carpeta del usuario. El formulario recibe solo la ruta en un campo oculto.
 */
export function CampoFoto({
  nombre,
  etiqueta,
  guia,
  carpeta,
}: {
  nombre: string;
  etiqueta: string;
  guia: string;
  carpeta: string;
}) {
  const id = useId();
  const [estado, setEstado] = useState<Estado>({ tipo: "vacio" });
  const [ruta, setRuta] = useState("");

  async function alElegir(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    setEstado({ tipo: "subiendo" });
    try {
      const supabase = crearClienteSupabase();
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Tu sesión venció. Vuelve a ingresar.");
      const foto = await comprimirFoto(archivo);
      const destino = `${data.user.id}/${carpeta}/${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage
        .from("fotos")
        .upload(destino, foto, { contentType: "image/jpeg" });
      if (error) throw error;
      setRuta(destino);
      setEstado({ tipo: "lista", vista: URL.createObjectURL(foto) });
    } catch (e) {
      setRuta("");
      setEstado({
        tipo: "error",
        mensaje: e instanceof Error ? e.message : "No se pudo subir la foto. Intenta otra vez.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[15px] font-semibold">{etiqueta}</span>
      <div className="relative grid aspect-[4/3] max-w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed border-marca/40 bg-gray-50 p-4 text-center text-sm text-gray-600">
        {estado.tipo === "lista" ? (
          // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:)
          <img
            src={estado.vista}
            alt={etiqueta}
            className="absolute inset-0 size-full object-cover"
          />
        ) : estado.tipo === "subiendo" ? (
          "Subiendo foto…"
        ) : (
          guia
        )}
      </div>
      {estado.tipo === "error" && <p className="text-sm text-red-700">{estado.mensaje}</p>}
      <label
        htmlFor={id}
        className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-gray-100 px-5 font-bold"
      >
        {estado.tipo === "lista" ? "Tomar otra foto" : "Tomar foto"}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={alElegir}
        className="sr-only"
      />
      <input type="hidden" name={nombre} value={ruta} />
    </div>
  );
}
