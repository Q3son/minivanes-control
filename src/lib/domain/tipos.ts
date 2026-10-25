export type Placa = string;

export interface Vehiculo {
  placa: Placa;
  conductor: string | null;
  marca: string | null;
  cuotaSemanal: number;
  traserasDobles: boolean;
  intervaloAceiteKm: number;
  kmActual: number | null;
  kmActualFecha: string | null;
  kmUltimoAceite: number | null;
  soatVence: string | null;
  revisionVence: string | null;
}

export interface Movimiento {
  placa: Placa;
  tipo: "ingreso" | "gasto";
  monto: number;
  fecha: string;
}

export interface Llanta {
  placa: Placa;
  posicion: string;
  dot: string | null;
  kmPuesta: number;
  kmRetiro: number | null;
  dotDevuelto: string | null;
}

export type Severidad = "critica" | "aviso";

export interface Alerta {
  placa: Placa;
  tipo: "aceite" | "soat" | "revision" | "kilometraje";
  severidad: Severidad;
  titulo: string;
  detalle: string;
}
