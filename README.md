# Control de Minivanes

Sistema web para una pequeña empresa de transporte en Arequipa: cobros semanales, gastos,
mantenimientos y llantas de cada unidad, buscados por placa. Pensado para usarse 80% desde
el celular por una sola persona.

[![CI](https://github.com/Q3son/minivanes-control/actions/workflows/ci.yml/badge.svg)](https://github.com/Q3son/minivanes-control/actions/workflows/ci.yml)

## Qué resuelve

| Problema del dueño                                | Cómo lo resuelve el sistema                                                                                                             |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| No sabe qué unidad le deja más plata              | Resumen mensual y ranking de ganancia por placa                                                                                         |
| Se olvida del cambio de aceite                    | Alerta a 1,000 km del próximo cambio (intervalo configurable, 9,000 km por defecto)                                                     |
| Le dicen que "toca llanta" y no puede comprobarlo | Historial por posición con km, profundidad en mm, foto y código DOT; si devuelven otra llanta, el DOT no coincide y el sistema lo marca |
| Kilometrajes mal anotados                         | Valida cada lectura contra la anterior (menor o salto de más de 15,000 km)                                                              |
| SOAT y revisión técnica vencidos                  | Aviso 15 días antes                                                                                                                     |

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Supabase**: PostgreSQL con seguridad por fila (RLS), autenticación y Storage para fotos
- **Vitest** para la lógica de negocio
- **GitHub Actions** para CI, versiones automáticas con release-please y Dependabot

## Estructura

```
src/
  app/                 Pantallas (App Router)
  lib/domain/          Reglas de negocio puras y probadas: alertas, km, llantas, finanzas
  lib/supabase/        Cliente de Supabase
supabase/migrations/   Esquema SQL versionado
.github/               CI, plantillas de PR e issues, Dependabot
docs/                  Decisiones y hoja de ruta
```

## Correr en local

Requisitos: Node 22 (`nvm use`) y un proyecto en Supabase.

```bash
cp .env.example .env.local   # completar con los datos de Supabase
npm ci
npm run dev
```

### Configurar Supabase (una sola vez)

1. **Tablas:** ejecuta `supabase/migrations/*.sql` en orden desde el SQL Editor o con `supabase db push`.
2. **Usuario del dueño:** en Authentication → Users → _Invite user_, invita el correo del dueño.
   El registro libre está apagado a propósito (`shouldCreateUser: false`): nadie más puede crear cuenta.
3. **URL del sitio:** en Authentication → URL Configuration agrega `https://tu-dominio/auth/confirmar`
   (y `http://localhost:3000/auth/confirmar` para desarrollo) como Redirect URL.

Para crear las tablas, ejecuta `supabase/migrations/*.sql` desde el SQL Editor de Supabase
o con `supabase db push`.

| Comando                              | Qué hace                        |
| ------------------------------------ | ------------------------------- |
| `npm run dev`                        | Servidor de desarrollo          |
| `npm test`                           | Pruebas de la lógica de negocio |
| `npm run lint` / `npm run typecheck` | Calidad de código               |
| `npm run format`                     | Formatea con Prettier           |

## Cómo se trabaja en este repo

Ramas cortas, Pull Requests y Conventional Commits. El detalle está en
[CONTRIBUTING.md](CONTRIBUTING.md).

## Hoja de ruta

Ver [docs/roadmap.md](docs/roadmap.md).

---

Desarrollado por [Edson Subia](https://github.com/Q3son).
