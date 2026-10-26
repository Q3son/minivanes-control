import { diasEntre, fechaCorta } from "./fechas";
import type { Alerta, Vehiculo } from "./tipos";

export const AVISO_ACEITE_KM = 1000;
export const AVISO_DOCUMENTO_DIAS = 15;
export const KM_SIN_ACTUALIZAR_DIAS = 8;

const km = (n: number) => `${Math.round(n).toLocaleString("es-PE")} km`;

export function proximoCambioAceite(v: Vehiculo): number | null {
  if (v.kmUltimoAceite == null) return null;
  return v.kmUltimoAceite + v.intervaloAceiteKm;
}

export function alertasDe(v: Vehiculo, hoy: string): Alerta[] {
  const alertas: Alerta[] = [];
  const base = { placa: v.placa };

  const proximo = proximoCambioAceite(v);
  if (proximo != null && v.kmActual != null) {
    const faltan = proximo - v.kmActual;
    if (faltan <= 0) {
      alertas.push({
        ...base,
        tipo: "aceite",
        severidad: "critica",
        titulo: "Toca cambio de aceite",
        detalle: `Se pasó por ${km(-faltan)}; tocaba a los ${km(proximo)}`,
      });
    } else if (faltan <= AVISO_ACEITE_KM) {
      alertas.push({
        ...base,
        tipo: "aceite",
        severidad: "aviso",
        titulo: `Faltan ${km(faltan)} para el aceite`,
        detalle: `Próximo cambio a los ${km(proximo)}`,
      });
    }
  }

  const documentos = [
    { tipo: "soat" as const, fecha: v.soatVence, nombre: "SOAT", vencido: "SOAT vencido" },
    {
      tipo: "revision" as const,
      fecha: v.revisionVence,
      nombre: "Revisión técnica",
      vencido: "Revisión técnica vencida",
    },
  ];
  for (const doc of documentos) {
    if (!doc.fecha) continue;
    const dias = diasEntre(hoy, doc.fecha);
    if (dias < 0) {
      alertas.push({
        ...base,
        tipo: doc.tipo,
        severidad: "critica",
        titulo: doc.vencido,
        detalle: `Venció el ${fechaCorta(doc.fecha)}`,
      });
    } else if (dias <= AVISO_DOCUMENTO_DIAS) {
      alertas.push({
        ...base,
        tipo: doc.tipo,
        severidad: "aviso",
        titulo: `${doc.nombre} vence en ${dias} ${dias === 1 ? "día" : "días"}`,
        detalle: `Vence el ${fechaCorta(doc.fecha)}`,
      });
    }
  }

  if (v.kmActualFecha && diasEntre(v.kmActualFecha, hoy) > KM_SIN_ACTUALIZAR_DIAS) {
    alertas.push({
      ...base,
      tipo: "kilometraje",
      severidad: "aviso",
      titulo: "Kilometraje sin actualizar",
      detalle: `Último dato: ${fechaCorta(v.kmActualFecha)}`,
    });
  }

  return alertas;
}

/** Todas las alertas de la flota, primero las críticas. */
export function alertasDeFlota(vehiculos: Vehiculo[], hoy: string): Alerta[] {
  return vehiculos
    .flatMap((v) => alertasDe(v, hoy))
    .sort((a, b) => Number(a.severidad !== "critica") - Number(b.severidad !== "critica"));
}
