"use client";

import { CONTINUAR, PARAM_RECORRIDO, RECORRIDOS, type Pantalla } from "@/lib/recorridos";

const CLAVE_VISTO = "recorrido-inicio-visto";

const ancla = (nombre: string) => `[data-tour="${nombre}"]`;

/**
 * Inicia el recorrido de una pantalla. driver.js se carga solo cuando hace falta.
 * Si la pantalla tiene continuación (Unidades → ficha → Llantas), el último botón
 * abre la siguiente pantalla con `?recorrido=1` para seguir ahí.
 */
export async function iniciarRecorrido(pantalla: Pantalla, irA?: (href: string) => void) {
  const [{ driver }] = await Promise.all([import("driver.js"), esperarPantalla(pantalla)]);
  const pasos = RECORRIDOS[pantalla].filter(
    (p) => !p.ancla || document.querySelector(ancla(p.ancla)),
  );
  const sigue = CONTINUAR[pantalla];
  const destino =
    sigue && document.querySelector<HTMLAnchorElement>(`a${ancla(sigue.ancla)}`)?.href;

  const recorrido = driver({
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
    steps: pasos.map((p, i) => {
      const ultimo = i === pasos.length - 1;
      return {
        element: p.ancla ? ancla(p.ancla) : undefined,
        popover: {
          title: p.titulo,
          description: p.texto,
          ...(ultimo && destino && irA
            ? {
                doneBtnText: sigue.texto,
                onDoneClick: () => {
                  recorrido.destroy();
                  const url = new URL(destino);
                  url.searchParams.set(PARAM_RECORRIDO, "1");
                  irA(url.pathname + url.search);
                },
              }
            : {}),
        },
      };
    }),
  });
  recorrido.drive();
}

/**
 * Al llegar desde otra pantalla puede verse aún el esqueleto de carga:
 * espera (hasta 5 s) a que aparezca algún elemento del recorrido.
 */
function esperarPantalla(pantalla: Pantalla, limiteMs = 5000) {
  const selector = RECORRIDOS[pantalla].flatMap((p) => (p.ancla ? [ancla(p.ancla)] : [])).join(",");
  return new Promise<void>((listo) => {
    if (!selector || document.querySelector(selector)) return listo();
    const inicio = Date.now();
    const id = setInterval(() => {
      if (document.querySelector(selector) || Date.now() - inicio > limiteMs) {
        clearInterval(id);
        listo();
      }
    }, 100);
  });
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
