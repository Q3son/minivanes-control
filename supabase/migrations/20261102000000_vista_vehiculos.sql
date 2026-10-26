-- Vista con el estado de cada unidad: último kilometraje y último cambio de aceite.
-- security_invoker hace que la vista respete el RLS de las tablas de quien consulta.

create or replace view public.vehiculos_estado
with (security_invoker = true) as
select
  v.*,
  km.km    as km_actual,
  km.fecha as km_actual_fecha,
  ac.km    as km_ultimo_aceite,
  ac.fecha as fecha_ultimo_aceite
from public.vehiculos v
left join lateral (
  select l.km, l.fecha
  from public.lecturas_km l
  where l.placa = v.placa
  order by l.km desc
  limit 1
) km on true
left join lateral (
  select s.km, s.fecha
  from public.servicios s
  where s.placa = v.placa and s.tipo = 'aceite'
  order by s.km desc
  limit 1
) ac on true;

-- Registrar un servicio también cuenta como lectura de kilometraje.
create or replace function public.servicio_registra_km()
returns trigger
language plpgsql
security invoker
as $$
begin
  insert into public.lecturas_km (owner_id, placa, km, fecha)
  values (new.owner_id, new.placa, new.km, new.fecha);
  return new;
end;
$$;

create trigger servicios_registran_km
after insert on public.servicios
for each row execute function public.servicio_registra_km();
