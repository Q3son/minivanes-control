import "server-only";
import type { DatosLlantaNueva, DatosRetiro } from "@/lib/domain";
import { crearClienteServidor } from "@/lib/supabase/server";

export interface RegistroLlanta {
  id: string;
  placa: string;
  posicion: string;
  marca: string | null;
  medida: string | null;
  dot: string | null;
  codigoPropio: string | null;
  mmInicial: number | null;
  kmPuesta: number;
  fechaPuesta: string;
  precio: number;
  fotoPuesta: string | null;
  kmRetiro: number | null;
  fechaRetiro: string | null;
  mmRetiro: number | null;
  dotDevuelto: string | null;
  fotoRetiro: string | null;
  dotCoincide: boolean | null;
}

interface Fila {
  id: string;
  placa: string;
  posicion: string;
  marca: string | null;
  medida: string | null;
  dot: string | null;
  codigo_propio: string | null;
  mm_inicial: number | string | null;
  km_puesta: number;
  fecha_puesta: string;
  precio: number | string;
  foto_puesta: string | null;
  km_retiro: number | null;
  fecha_retiro: string | null;
  mm_retiro: number | string | null;
  dot_devuelto: string | null;
  foto_retiro: string | null;
  dot_coincide: boolean | null;
}

const num = (v: number | string | null) => (v == null ? null : Number(v));

function aRegistro(f: Fila): RegistroLlanta {
  return {
    id: f.id,
    placa: f.placa,
    posicion: f.posicion,
    marca: f.marca,
    medida: f.medida,
    dot: f.dot,
    codigoPropio: f.codigo_propio,
    mmInicial: num(f.mm_inicial),
    kmPuesta: f.km_puesta,
    fechaPuesta: f.fecha_puesta,
    precio: Number(f.precio),
    fotoPuesta: f.foto_puesta,
    kmRetiro: f.km_retiro,
    fechaRetiro: f.fecha_retiro,
    mmRetiro: num(f.mm_retiro),
    dotDevuelto: f.dot_devuelto,
    fotoRetiro: f.foto_retiro,
    dotCoincide: f.dot_coincide,
  };
}

/** Todas las llantas de una unidad: las puestas y las que ya salieron (más recientes primero). */
export async function listarLlantas(placa: string): Promise<RegistroLlanta[]> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("llantas")
    .select("*")
    .eq("placa", placa)
    .order("fecha_puesta", { ascending: false });
  if (error) throw new Error(`No se pudieron leer las llantas: ${error.message}`);
  return (data as Fila[]).map(aRegistro);
}

/**
 * Cambia la llanta de una posición: retira la actual (si hay) y registra la nueva.
 * Si la nueva falla al guardarse, la retirada queda registrada igual: el retiro ya ocurrió.
 */
export async function cambiarLlanta(
  placa: string,
  posicion: string,
  nueva: DatosLlantaNueva,
  retiro: DatosRetiro | null,
  fecha: string,
): Promise<void> {
  const supabase = await crearClienteServidor();

  if (retiro) {
    const { error } = await supabase
      .from("llantas")
      .update({
        km_retiro: nueva.km,
        fecha_retiro: fecha,
        mm_retiro: retiro.mmRetiro,
        dot_devuelto: retiro.dotDevuelto,
        foto_retiro: retiro.fotoRetiro,
      })
      .eq("placa", placa)
      .eq("posicion", posicion)
      .is("fecha_retiro", null);
    if (error) throw new Error(`No se pudo retirar la llanta: ${error.message}`);
  }

  const { error } = await supabase.from("llantas").insert({
    placa,
    posicion,
    marca: nueva.marca,
    medida: nueva.medida,
    dot: nueva.dot,
    codigo_propio: nueva.codigoPropio,
    mm_inicial: nueva.mm,
    km_puesta: nueva.km,
    fecha_puesta: fecha,
    precio: nueva.precio,
    foto_puesta: nueva.foto,
  });
  if (error) throw new Error(`No se pudo registrar la llanta nueva: ${error.message}`);

  await supabase.from("lecturas_km").insert({ placa, km: nueva.km, fecha });
}

/** URLs firmadas (1 hora) para mostrar fotos del bucket privado. */
export async function urlsDeFotos(rutas: string[]): Promise<Record<string, string>> {
  if (rutas.length === 0) return {};
  const supabase = await crearClienteServidor();
  const { data } = await supabase.storage.from("fotos").createSignedUrls(rutas, 3600);
  const urls: Record<string, string> = {};
  for (const d of data ?? []) if (d.path && d.signedUrl) urls[d.path] = d.signedUrl;
  return urls;
}
