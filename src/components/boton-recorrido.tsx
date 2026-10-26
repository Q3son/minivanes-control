"use client";

import { useRouter } from "next/navigation";
import { iniciarRecorrido } from "@/components/recorrido";
import type { Pantalla } from "@/lib/recorridos";

/** Atajo visible para ver el recorrido guiado de una pantalla. */
export function BotonRecorrido({ pantalla, texto }: { pantalla: Pantalla; texto: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() =>
        void iniciarRecorrido(pantalla, {
          push: (h) => router.push(h),
          prefetch: (h) => router.prefetch(h),
        })
      }
      className="flex min-h-11 items-center gap-2 self-start rounded-full border border-marca/40 bg-marca-suave px-4 text-[15px] font-semibold text-marca transition active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01" />
      </svg>
      {texto}
    </button>
  );
}
