/**
 * Recorridos guiados por pantalla. Cada paso apunta a un elemento con
 * `data-tour="<ancla>"`; si el elemento no está (por ejemplo, no hay alertas),
 * el paso se salta.
 */
export interface PasoRecorrido {
  ancla?: string;
  titulo: string;
  texto: string;
}

export type Pantalla = "inicio" | "unidades" | "ficha" | "llantas" | "alertas";

export const RECORRIDOS: Record<Pantalla, PasoRecorrido[]> = {
  inicio: [
    {
      titulo: "Bienvenido",
      texto:
        "Te muestro en un minuto cómo usar la app. Puedes salir cuando quieras con la ✕ o volver a verlo desde «Más».",
    },
    {
      ancla: "resumen",
      titulo: "Cuánto te queda este mes",
      texto:
        "Lo que cobraste menos lo que gastaste. Se actualiza solo con cada cobro y cada gasto.",
    },
    {
      ancla: "para-atender",
      titulo: "Para atender",
      texto: "Aceite por cambiar, SOAT o revisión por vencer. Toca una fila para ir a esa unidad.",
    },
    {
      ancla: "anotar-gasto",
      titulo: "Anotar un gasto",
      texto: "Combustible, lavado, multas… elige la placa, el tipo y el monto.",
    },
    {
      ancla: "cobros",
      titulo: "Cobros de la semana",
      texto: "Cuando un conductor te pague su cuota, toca «Cobrar». Así sabes quién falta.",
    },
    {
      ancla: "nav-unidades",
      titulo: "Tus unidades",
      texto:
        "Busca por placa o conductor y entra a la ficha: kilometraje, aceite, llantas y documentos.",
    },
    {
      ancla: "nav-alertas",
      titulo: "Alertas",
      texto: "El número rojo te dice cuántas cosas están pendientes en toda la flota.",
    },
    {
      ancla: "nav-mas",
      titulo: "Más opciones",
      texto: "Aquí vuelves a ver este recorrido en cualquier pantalla y cierras sesión.",
    },
  ],
  unidades: [
    {
      ancla: "buscar",
      titulo: "Buscar",
      texto: "Escribe la placa o el nombre del conductor y presiona buscar en el teclado.",
    },
    {
      ancla: "agregar",
      titulo: "Agregar unidad",
      texto: "Para registrar una minivan nueva con su placa, conductor y cuota semanal.",
    },
    {
      ancla: "unidad",
      titulo: "Abrir una unidad",
      texto:
        "Toca la fila para ver su ficha. La etiqueta te dice si está al día (verde), por revisar (ámbar) o por atender (rojo).",
    },
  ],
  ficha: [
    {
      ancla: "km",
      titulo: "Anota el kilometraje",
      texto: "Míralo en el tablero cada vez que puedas. Con eso se calcula cuándo toca el aceite.",
    },
    {
      ancla: "aceite",
      titulo: "Cambio de aceite",
      texto: "La barra se llena con los km. Verde va bien, ámbar se acerca y rojo ya toca.",
    },
    {
      ancla: "llantas",
      titulo: "Llantas",
      texto: "Registra cada llanta con su código DOT y foto, para que no te la cambien.",
    },
    {
      ancla: "mantenimiento",
      titulo: "Anotar mantenimiento",
      texto: "Aceite, frenos u otro arreglo: elige el tipo, el km y lo que costó.",
    },
    {
      ancla: "documentos",
      titulo: "Documentos",
      texto: "Vencimiento del SOAT y la revisión técnica. Te avisa 15 días antes.",
    },
  ],
  llantas: [
    {
      ancla: "diagrama",
      titulo: "Las llantas de la unidad",
      texto: "Toca una posición para poner una llanta o cambiarla. Te pedirá el DOT y una foto.",
    },
    {
      ancla: "historial",
      titulo: "Historial",
      texto:
        "Cada cambio queda guardado con sus fotos. Si el DOT devuelto no coincide, aparece en rojo como prueba.",
    },
  ],
  alertas: [
    {
      ancla: "lista-alertas",
      titulo: "Todo lo pendiente",
      texto: "Rojo es urgente y ámbar es por revisar. Toca una alerta para ir a la unidad.",
    },
  ],
};

/** Qué recorrido corresponde a una ruta de la app. */
export function pantallaDe(ruta: string): Pantalla | null {
  if (ruta === "/") return "inicio";
  if (ruta === "/alertas") return "alertas";
  if (ruta === "/unidades") return "unidades";
  const partes = ruta.split("/").filter(Boolean);
  if (partes[0] !== "unidades" || partes.length < 2 || partes[1] === "nueva") return null;
  if (partes.length === 2) return "ficha";
  if (partes.length === 3 && partes[2] === "llantas") return "llantas";
  return null;
}
