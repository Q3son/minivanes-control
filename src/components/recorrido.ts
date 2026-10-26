"use client";

import { RECORRIDOS, type Pantalla } from "@/lib/recorridos";

const CLAVE_VISTO = "recorrido-inicio-visto";

/** Inicia el recorrido de una pantalla. driver.js se carga solo cuando hace falta. */
export async function iniciarRecorrido(pantalla: Pantalla) {
  const { driver } = await import("driver.js");
  const pasos = RECORRIDOS[pantalla].filter(
    (p) => !p.ancla || document.querySelector(`[data-tour="${p.ancla}"]`),
  );
  driver({
    showProgress: pasos.length > 1,
    progressText: "{{current}} de {{total}}",
    nextBtnText: "Siguiente",
    prevBtnText: "Atrás",
    doneBtnText: "Entendido",
    closeBtnLabel: "Cerrar recorrido",
    popoverClass: "recorrido",
    stagePadding: 6,
    stageRadius: 14,
    overlayOpacity: 0.6,
    smoothScroll: true,
    steps: pasos.map((p) => ({
      element: p.ancla ? `[data-tour="${p.ancla}"]` : undefined,
      popover: { title: p.titulo, description: p.texto },
    })),
  }).drive();
}

/** El recorrido de Inicio se muestra solo la primera vez en cada celular. */
export function yaVioElRecorrido() {
  try {
    return localStorage.getItem(CLAVE_VISTO) === "1";
  } catch {
    return true;
  }
}

export function marcarRecorridoVisto() {
  try {
    localStorage.setItem(CLAVE_VISTO, "1");
  } catch {
    // Sin almacenamiento (modo privado): simplemente se volverá a ofrecer.
  }
}
