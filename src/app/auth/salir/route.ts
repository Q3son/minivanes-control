import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor } from "@/lib/supabase/server";

/** Cierra la sesión. Solo POST, para que un enlace o una precarga no la cierre por accidente. */
export async function POST(request: NextRequest) {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/ingresar", request.url), { status: 303 });
}
