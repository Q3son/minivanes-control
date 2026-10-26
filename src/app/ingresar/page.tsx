import type { Metadata } from "next";
import { Aviso, Tarjeta } from "@/components/ui";
import { FormularioIngreso } from "./formulario";

export const metadata: Metadata = { title: "Ingresar · Control de Minivanes" };

export default async function Ingresar({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-4 py-10">
      <header>
        <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
          Mis minivanes
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Entra a tu cuenta</h1>
        <p className="mt-1 text-gray-600">
          Te mandamos un enlace al correo. Sin contraseñas que recordar.
        </p>
      </header>
      {error === "enlace" && (
        <Aviso tono="error">El enlace ya venció o ya se usó. Pide uno nuevo.</Aviso>
      )}
      <Tarjeta>
        <FormularioIngreso />
      </Tarjeta>
    </main>
  );
}
