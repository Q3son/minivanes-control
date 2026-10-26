import "server-only";
import type { DatosGasto, Movimiento } from "@/lib/domain";
import { crearClienteServidor } from "@/lib/supabase/server";

interface FilaMovimiento {
  placa: string;
  tipo: "ingreso" | "gasto";
  monto: number | string;
  fecha: string;
}

/** Cobros y gastos entre dos fechas (incluidas), más el costo de servicios y llantas como gasto. */
export async function listarMovimientos(desde: string, hasta: string): Promise<Movimiento[]> {
  const supabase = await crearClienteServidor();
  const [movs, servicios, llantas] = await Promise.all([
    supabase
      .from("movimientos")
      .select("placa,tipo,monto,fecha")
      .gte("fecha", desde)
      .lte("fecha", hasta),
    supabase
      .from("servicios")
      .select("placa,costo,fecha")
      .gte("fecha", desde)
      .lte("fecha", hasta)
      .gt("costo", 0),
    supabase
      .from("llantas")
      .select("placa,precio,fecha_puesta")
      .gte("fecha_puesta", desde)
      .lte("fecha_puesta", hasta)
      .gt("precio", 0),
  ]);
  const error = movs.error ?? servicios.error ?? llantas.error;
  if (error) throw new Error(`No se pudieron leer los movimientos: ${error.message}`);

  return [
    ...(movs.data as FilaMovimiento[]).map((m) => ({ ...m, monto: Number(m.monto) })),
    ...(servicios.data ?? []).map((s) => ({
      placa: s.placa as string,
      tipo: "gasto" as const,
      monto: Number(s.costo),
      fecha: s.fecha as string,
    })),
    ...(llantas.data ?? []).map((l) => ({
      placa: l.placa as string,
      tipo: "gasto" as const,
      monto: Number(l.precio),
      fecha: l.fecha_puesta as string,
    })),
  ];
}

export async function registrarCobro(placa: string, monto: number, fecha: string): Promise<void> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from("movimientos")
    .insert({ placa, tipo: "ingreso", monto, fecha, nota: "Cobro semanal" });
  if (error) throw new Error(`No se pudo guardar el cobro: ${error.message}`);
}

export async function registrarGasto(g: DatosGasto): Promise<void> {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("movimientos").insert({
    placa: g.placa,
    tipo: "gasto",
    categoria: g.categoria,
    monto: g.monto,
    fecha: g.fecha,
    nota: g.nota,
  });
  if (error) throw new Error(`No se pudo guardar el gasto: ${error.message}`);
}
