-- Esquema inicial: control de minivanes por placa.
-- Un solo dueño por ahora; cada fila guarda owner_id para que la seguridad por fila (RLS)
-- funcione igual cuando se agreguen conductores con su propio usuario.

create extension if not exists "pgcrypto";

-- Unidades -------------------------------------------------------------------
create table public.vehiculos (
  placa            text primary key check (placa ~ '^[A-Z0-9]{6}$'),
  owner_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  marca            text,
  conductor        text,
  cuota_semanal    numeric(10, 2) not null default 0 check (cuota_semanal >= 0),
  traseras_dobles  boolean not null default false,
  intervalo_aceite_km integer not null default 9000 check (intervalo_aceite_km > 0),
  soat_vence       date,
  revision_vence   date,
  activo           boolean not null default true,
  creado_en        timestamptz not null default now()
);

-- Lecturas de kilometraje (con foto opcional del tablero) ---------------------
create table public.lecturas_km (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  placa       text not null references public.vehiculos (placa) on update cascade,
  km          integer not null check (km >= 0),
  foto_path   text,
  fecha       date not null default current_date,
  creado_en   timestamptz not null default now()
);
create index lecturas_km_placa_fecha on public.lecturas_km (placa, fecha desc);

-- Cobros y gastos -----------------------------------------------------------
create type public.tipo_movimiento as enum ('ingreso', 'gasto');
create type public.categoria_gasto as enum (
  'repuesto', 'mecanico', 'soat', 'revision_tecnica', 'tramite', 'lavado', 'otro'
);

create table public.movimientos (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  placa       text not null references public.vehiculos (placa) on update cascade,
  tipo        public.tipo_movimiento not null,
  categoria   public.categoria_gasto,
  monto       numeric(10, 2) not null check (monto > 0),
  fecha       date not null default current_date,
  semana      date generated always as (fecha - (extract(isodow from fecha)::int - 1)) stored,
  nota        text,
  creado_en   timestamptz not null default now(),
  constraint gasto_con_categoria check (tipo = 'ingreso' or categoria is not null)
);
create index movimientos_placa_fecha on public.movimientos (placa, fecha desc);

-- Mantenimientos ------------------------------------------------------------
create type public.tipo_servicio as enum ('aceite', 'frenos', 'alineamiento', 'reparacion', 'otro');

create table public.servicios (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  placa       text not null references public.vehiculos (placa) on update cascade,
  tipo        public.tipo_servicio not null,
  km          integer not null check (km >= 0),
  costo       numeric(10, 2) not null default 0 check (costo >= 0),
  nota        text,
  fecha       date not null default current_date,
  creado_en   timestamptz not null default now()
);
create index servicios_placa_fecha on public.servicios (placa, fecha desc);

-- Llantas: una fila por llanta física, desde que se pone hasta que sale --------
create table public.llantas (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  placa          text not null references public.vehiculos (placa) on update cascade,
  posicion       text not null check (posicion in ('DI','DD','TI','TD','TIE','TII','TDE','TDI','R')),
  marca          text,
  medida         text,
  dot            text check (dot ~ '^[0-9]{4}$'),
  codigo_propio  text,
  mm_inicial     numeric(4, 1),
  km_puesta      integer not null check (km_puesta >= 0),
  fecha_puesta   date not null default current_date,
  precio         numeric(10, 2) not null default 0,
  foto_puesta    text,
  -- retiro
  km_retiro      integer check (km_retiro is null or km_retiro >= km_puesta),
  fecha_retiro   date,
  mm_retiro      numeric(4, 1),
  dot_devuelto   text check (dot_devuelto is null or dot_devuelto ~ '^[0-9]{4}$'),
  foto_retiro    text,
  dot_coincide   boolean generated always as (
                   case when dot_devuelto is null or dot is null then null else dot = dot_devuelto end
                 ) stored,
  creado_en      timestamptz not null default now()
);
-- Solo puede haber una llanta puesta por posición en cada unidad.
create unique index llantas_una_puesta_por_posicion
  on public.llantas (placa, posicion) where fecha_retiro is null;

-- Deudas de conductores -----------------------------------------------------
create table public.deudas (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  placa       text not null references public.vehiculos (placa) on update cascade,
  monto       numeric(10, 2) not null check (monto > 0),
  pagado      numeric(10, 2) not null default 0 check (pagado >= 0),
  nota        text,
  fecha       date not null default current_date,
  creado_en   timestamptz not null default now()
);

-- Seguridad por fila: cada dueño ve y cambia solo lo suyo ----------------------
do $$
declare t text;
begin
  foreach t in array array['vehiculos','lecturas_km','movimientos','servicios','llantas','deudas'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy %I on public.%I for all using (owner_id = auth.uid()) with check (owner_id = auth.uid())',
      t || '_dueno', t
    );
  end loop;
end $$;

-- Fotos: bucket privado, cada dueño en su carpeta ------------------------------
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', false)
  on conflict (id) do nothing;

create policy "fotos_dueno" on storage.objects for all
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);
