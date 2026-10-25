# Cómo trabajar en este repo

## Ramas

`main` siempre está lista para producción y está protegida: nadie hace push directo.

| Prefijo     | Para qué                                  | Ejemplo                       |
| ----------- | ----------------------------------------- | ----------------------------- |
| `feat/`     | Funcionalidad nueva                       | `feat/alerta-soat`            |
| `fix/`      | Corrección                                | `fix/km-negativo`             |
| `docs/`     | Documentación                             | `docs/manual-cliente`         |
| `chore/`    | Mantenimiento, dependencias, CI           | `chore/actualizar-next`       |
| `refactor/` | Cambio interno sin cambiar comportamiento | `refactor/finanzas-por-placa` |

Una rama = un issue = un Pull Request. Ramas cortas (idealmente menos de 2 días).

## Flujo

```bash
git switch main && git pull
git switch -c feat/alerta-soat
# ...cambios pequeños, un commit por cambio lógico...
git push -u origin feat/alerta-soat
gh pr create --fill
```

El PR se fusiona con **Squash and merge** cuando el CI está en verde. La rama se borra sola.

## Mensajes de commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/). Husky +
commitlint rechazan los mensajes que no cumplen el formato.

```
tipo(ámbito opcional): descripción en presente y en minúscula

feat(llantas): marcar en rojo cuando el DOT devuelto no coincide
fix(alertas): usar femenino para "revisión técnica vencida"
docs: agregar guía de instalación para el cliente
chore(deps): actualizar next a 15.5.5
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
Un `feat:` sube la versión menor y un `fix:` la de parche; release-please arma el CHANGELOG solo.

## Antes de abrir un PR

```bash
npm run lint && npm run typecheck && npm test
```

El hook `pre-commit` formatea y corrige lo que puede en los archivos que cambiaste.

## Base de datos

Todo cambio de esquema va en una migración nueva en `supabase/migrations/`, con fecha en el
nombre (`20261115000000_agregar_inventario_llantas.sql`). Nunca edites una migración ya aplicada.
