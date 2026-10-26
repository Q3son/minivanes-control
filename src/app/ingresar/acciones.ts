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
    return {
      estado: "error",
      mensaje: "No pudimos enviar el enlace. Revisa el correo o intenta en un minuto.",
    };
  }
  return { estado: "enviado", mensaje: correo.data };
}
