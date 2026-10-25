# Decisiones técnicas

## Supabase en vez de servidor propio

Un solo usuario y menos de 20 unidades generan unos cientos de registros al mes. Supabase da
PostgreSQL, autenticación, almacenamiento de fotos y respaldos sin mantener un servidor. El plan
gratuito alcanza para empezar; si crecen las fotos, el plan Pro agrega respaldos diarios.

## Lógica de negocio fuera de los componentes

Las reglas (cuándo avisar del aceite, cuándo un km es sospechoso, si una llanta coincide) viven en
`src/lib/domain/` como funciones puras con pruebas. Así se pueden probar sin pantalla ni base de
datos, y se reutilizan si mañana hay una app nativa.

## La base de datos también valida

Las reglas críticas están repetidas en SQL: placa con 6 caracteres, una sola llanta puesta por
posición, DOT de 4 dígitos y `dot_coincide` calculado por la base. Si el frontend falla, los
datos igual quedan consistentes.

## `owner_id` desde el día uno

Aunque hoy hay un solo usuario, cada tabla guarda `owner_id` con RLS. Agregar conductores o un
segundo negocio no requiere migrar datos.
