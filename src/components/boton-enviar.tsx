"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

/**
 * Botón de envío para formularios de servidor sin estado propio:
 * cambia el texto y se desactiva al instante mientras el servidor responde.
 */
export function BotonEnviar({
  pendiente,
  children,
  ...props
}: ComponentProps<"button"> & { pendiente: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? pendiente : children}
    </button>
  );
}
