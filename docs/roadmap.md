# Hoja de ruta

Cada punto es un issue y una rama. Se marca cuando su PR se fusiona.

## v0.1 · Base (este repo)

- [x] Esquema de base de datos con RLS y bucket privado de fotos
- [x] Reglas de negocio probadas: alertas de aceite y documentos, validación de km, llantas, finanzas
- [x] CI, plantillas, Conventional Commits, versiones automáticas

## v0.2 · Lo que el cliente usa cada semana (meta: 1 de noviembre)

- [x] Inicio de sesión del dueño (Supabase Auth, enlace mágico al correo)
- [x] Unidades: alta, edición y búsqueda por placa
- [x] Cobro semanal en un toque y gasto por categoría
- [x] Kilometraje con validación (la foto del tablero queda para v0.3)
- [x] Alertas en la pantalla de inicio

## v0.3 · Llantas y reportes

- [x] Cambio de llanta por posición con DOT, mm, marca propia y fotos de entrada y salida
- [x] Aviso cuando el DOT devuelto no coincide
- [ ] Reporte mensual por unidad y exportación a Excel
- [ ] Cuentas por cobrar a conductores

## Después

- [ ] Instalar como app en el celular (PWA)
- [ ] Usuario para conductores con permisos limitados
- [ ] Comparación automática de fotos de llantas (visión por computadora)
- [ ] Migrar el historial de los Excel anteriores
