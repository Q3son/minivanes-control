"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { crearClienteServidor } from "@/lib/supabase/server";

export type EstadoIngreso = { estado: "inicial" | "enviado" | "error"; mensaje?: string };

const correoValido = z.email("Escribe un correo válido, por ejemplo nombre@gmail.com");

export async function enviarEnlace(_: EstadoIngreso, datos: FormData): Promise<EstadoIngreso> {
  const correo = correoValido.safeParse(String(datos.get("correo") ?? "").trim());
  if (!correo.success) return { estado: "error", mensaje: correo.error.issues[0]?.message };

  const origen = (await headers()).get("origin") ?? "";
  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signInWithOtp({
    email: correo.data,
    options: { emailRedirectTo: `${origen}/auth/confirmar`, shouldCreateUser: false },
  });

  if (error) {
    console.error("[ingresar] signInWithOtp", error.code, error.status, error.message);
    return { estado: "error", mensaje: mensajeDeError(error.code, error.status) };
  }
  return { estado: "enviado", mensaje: correo.data };
}

/** Traduce los errores de Supabase Auth a algo que el dueño pueda resolver. */
function mensajeDeError(codigo?: string, status?: number): string {
  if (codigo === "otp_disabled" || codigo === "signup_disabled" || codigo === "user_not_found") {
    return "Ese correo no tiene cuenta en el sistema. Revisa que esté bien escrito.";
  }
  if (
    codigo === "over_email_send_rate_limit" ||
    codigo === "over_request_rate_limit" ||
    status === 429
  ) {
    return "Ya se enviaron varios enlaces. Espera unos minutos y vuelve a intentar.";
  }
  if (codigo === "email_address_not_authorized") {
    return "El servidor de correo todavía no puede enviar a esta dirección. Avisa al desarrollador.";
  }
  return "No pudimos enviar el enlace. Intenta en un minuto.";
}
