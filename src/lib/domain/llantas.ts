import type { Llanta } from "./tipos";

/** Km recorridos por una llanta: hasta su retiro o hasta el km actual si sigue puesta. */
export function kmRecorridos(llanta: Llanta, kmActual: number | null): number | null {
  const fin = llanta.kmRetiro ?? kmActual;
  if (fin == null) return null;
  return Math.max(0, fin - llanta.kmPuesta);
}

/**
 * Compara el DOT registrado al poner la llanta con el de la llanta que devuelven.
 * `null` cuando no hay datos para comparar.
 */
export function dotCoincide(llanta: Pick<Llanta, "dot" | "dotDevuelto">): boolean | null {
  const a = normalizarDot(llanta.dot);
  const b = normalizarDot(llanta.dotDevuelto);
  if (!a || !b) return null;
  return a === b;
}

export function normalizarDot(dot: string | null | undefined): string | null {
  if (!dot) return null;
  const digitos = dot.replace(/\D/g, "");
  return digitos.length === 4 ? digitos : null;
}
