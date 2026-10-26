"use client";

import { CONTINUAR, RECORRIDOS, type Pantalla } from "@/lib/recorridos";

const CLAVE_VISTO = "recorrido-inicio-visto";
const CLAVE_SEGUIR = "recorrido-seguir-en";

export interface Navegador {
  push: (href: string) => void;
  prefetch: (href: string) => void;
}

const ancla = (nombre: string) => `[data-tour="${nombre}"]`;

/**
 * Inicia el recorrido de una pantalla. driver.js se carga solo cuando hace falta.
 * Si la pantalla tiene continuación (Unidades → ficha → Llantas), la siguiente
 * pantalla se precarga mientras se lee el recorrido y el último botón la abre.
 */
export async function iniciarRecorrido(pantalla: Pantalla, nav?: Navegador) {
  const [{ driver }] = await Promise.all([import("driver.js"), esperarPantalla(pantalla)]);
  const pasos = RECORRIDOS[pantalla].filter(
    (p) => !p.ancla || document.querySelector(ancla(p.ancla)),
  );
  const sigue = CONTINUAR[pantalla];
  const href = sigue && document.querySelector<HTMLAnchorElement>(`a${ancla(sigue.ancla)}`)?.href;
  const destino = href ? new URL(href).pathname : null;
  if (destino && nav) nav.prefetch(destino);

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
    steps: pasos.map((p, i) => ({
      element: p.ancla ? ancla(p.ancla) : undefined,
      popover: {
        title: p.titulo,
        description: p.texto,
        ...(i === pasos.length - 1 && sigue && destino && nav
          ? {
              doneBtnText: sigue.texto,
              onDoneClick: () => {
                guardar(sessionStorage, CLAVE_SEGUIR, destino);
                recorrido.destroy();
                nav.push(destino);
              },
            }
          : {}),
      },
    })),
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
    }, 50);
  });
}

// El almacenamiento puede fallar (modo privado): en ese caso solo se pierde la comodidad.
function guardar(almacen: Storage, clave: string, valor: string | null) {
  try {
    if (valor == null) almacen.removeItem(clave);
    else almacen.setItem(clave, valor);
  } catch {}
}

function leer(almacen: () => Storage, clave: string) {
  try {
    return almacen().getItem(clave);
  } catch {
    return null;
  }
}

/** El recorrido de Inicio se muestra solo la primera vez en cada celular. */
export function yaVioElRecorrido() {
  return leer(() => localStorage, CLAVE_VISTO) === "1";
}

export function marcarRecorridoVisto() {
  try {
    guardar(localStorage, CLAVE_VISTO, "1");
  } catch {}
}

/** Si el recorrido anterior pidió seguir en esta ruta, lo consume y devuelve true. */
export function tocaSeguirEn(ruta: string) {
  if (leer(() => sessionStorage, CLAVE_SEGUIR) !== ruta) return false;
  try {
    guardar(sessionStorage, CLAVE_SEGUIR, null);
  } catch {}
  return true;
}
