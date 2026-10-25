import { alertasDeFlota, type Vehiculo } from "@/lib/domain";

const ejemplo: Vehiculo[] = [
  {
    placa: "XBG963",
    conductor: "Ejemplo",
    marca: "Mercedes-Benz",
    cuotaSemanal: 1050,
    traserasDobles: true,
    intervaloAceiteKm: 9000,
    kmActual: 176_700,
    kmActualFecha: "2026-11-01",
    kmUltimoAceite: 168_500,
    soatVence: "2027-03-14",
    revisionVence: "2027-02-02",
  },
];

export default function Inicio() {
  const alertas = alertasDeFlota(ejemplo, "2026-11-01");
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 px-4 py-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Mis minivanes
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Control de Minivanes</h1>
        <p className="mt-1 text-gray-600">
          Cobros, gastos, mantenimientos y llantas de cada unidad, por placa.
        </p>
      </header>
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-bold">Para atender</h2>
        <ul className="flex flex-col gap-2">
          {alertas.map((a) => (
            <li key={a.placa + a.tipo} className="rounded-xl bg-amber-50 p-3">
              <b className="block">{a.titulo}</b>
              <span className="text-sm text-gray-600">
                {a.placa} · {a.detalle}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-sm text-gray-500">Versión en construcción · datos de ejemplo.</p>
    </main>
  );
}
