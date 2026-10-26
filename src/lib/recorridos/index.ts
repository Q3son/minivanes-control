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

/**
 * Al terminar, el recorrido puede seguir en otra pantalla: abre el enlace del
 * elemento `ancla` y ahí arranca el recorrido de esa pantalla.
 */
export interface Continuacion {
  ancla: string;
  texto: string;
}

export const CONTINUAR: Partial<Record<Pantalla, Continuacion>> = {
  unidades: { ancla: "unidad", texto: "Abrir esta unidad →" },
  ficha: { ancla: "llantas", texto: "Ver sus llantas →" },
};

/** Parámetro de la URL que pide arrancar el recorrido al llegar a una pantalla. */
export const PARAM_RECORRIDO = "recorrido";

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
      titulo: "Tus unidades",
      texto:
        "Aquí está cada minivan con su propia ficha: lo que te deja, kilometraje, aceite, mantenimientos, llantas y documentos. Te lo muestro completo.",
    },
    {
      ancla: "buscar",
      titulo: "Buscar por placa",
      texto:
        "Escribe la placa (con o sin guion) o el nombre del conductor y toca buscar en el teclado.",
    },
    {
      ancla: "agregar",
      titulo: "Agregar una minivan",
      texto:
        "Registra una unidad nueva con su placa, conductor, cuota semanal y fechas de SOAT y revisión.",
    },
    {
      ancla: "unidad",
      titulo: "Cada fila es una unidad",
      texto:
        "La etiqueta de la derecha te dice cómo está: ✓ verde al día, ! ámbar por revisar, !! rojo por atender. Toca la fila para abrir su ficha.",
    },
  ],
  ficha: [
    {
      ancla: "cabecera",
      titulo: "La ficha de la unidad",
      texto:
        "Placa, conductor, cuota y el último kilometraje anotado. Con «Editar» cambias sus datos.",
    },
    {
      ancla: "ganancia",
      titulo: "Cuánto te deja",
      texto:
        "Lo que cobraste menos lo que gastaste en esta unidad este mes, y cómo le fue en los últimos meses. Las barras rojas son meses en pérdida.",
    },
    {
      ancla: "km",
      titulo: "Anota el kilometraje",
      texto:
        "Míralo en el tablero cada vez que puedas. Si escribes un número raro, la app te avisa antes de guardarlo.",
    },
    {
      ancla: "aceite",
      titulo: "Cambio de aceite",
      texto:
        "La barra se llena con los km. Verde va bien, ámbar faltan menos de 1,000 km y rojo ya toca.",
    },
    {
      ancla: "mantenimiento",
      titulo: "Anotar un mantenimiento",
      texto:
        "Aceite, frenos, alineamiento o una reparación: elige qué se hizo, el km y cuánto costó.",
    },
    {
      ancla: "historial-mantenimiento",
      titulo: "Historial",
      texto:
        "Todo lo que se le hizo, con fecha, km y costo. También te dice cuántos km pasaron desde el anterior del mismo tipo.",
    },
    {
      ancla: "documentos",
      titulo: "SOAT y revisión técnica",
      texto: "Te avisa 15 días antes de que venzan, aquí y en Alertas.",
    },
    {
      ancla: "llantas",
      titulo: "Llantas",
      texto:
        "Cada llanta queda registrada con su código DOT y foto, para que no te la cambien sin que lo sepas.",
    },
  ],
  llantas: [
    {
      ancla: "diagrama",
      titulo: "Las llantas de la unidad",
      texto:
        "Cada casilla es una posición, con los km que lleva esa llanta. Toca una para ponerla o cambiarla: te pedirá el DOT y una foto.",
    },
    {
      ancla: "historial",
      titulo: "Llantas que ya salieron",
      texto:
        "Cada cambio queda guardado con sus fotos y cuánto duró. Si el DOT devuelto no coincide, aparece en rojo como prueba.",
    },
    {
      titulo: "¡Listo!",
      texto:
        "Ya conoces cómo funciona una unidad. Puedes volver a ver este recorrido cuando quieras desde «Más».",
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
