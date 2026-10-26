# Respaldos

Todos los días a las 3:00 a. m. (hora de Lima) GitHub Actions exporta el esquema `public` de
Supabase (unidades, cobros, gastos, mantenimientos, llantas y deudas), lo **cifra con AES-256** y lo
guarda como artefacto del workflow **Respaldo de la base de datos**: el de los domingos por 90 días y
los demás por 14. Así siempre hay dos semanas de respaldos diarios y tres meses de semanales, más de
lo que da Supabase Pro (7 días). También se puede correr a mano con **Run workflow**.

Si un respaldo falla, GitHub le manda un correo al dueño del repositorio.

## Que el proyecto no se pause

El plan gratuito de Supabase pausa el proyecto tras 7 días sin uso. El workflow **Mantener activa
la base de datos** hace una consulta liviana cada mañana con la clave pública, así que eso no pasa
aunque nadie abra la app.

GitHub desactiva los workflows programados de un repositorio que pasa 60 días sin commits (y avisa
por correo antes). Mientras haya actividad en el repo no hay nada que hacer; si llega el aviso, basta
con un commit o con volver a activarlos en **Actions**.

El repositorio es público y sus artefactos se pueden descargar, por eso el archivo nunca se guarda
sin cifrar. Las fotos viven en Supabase Storage y no entran en este respaldo.

## Configuración (una vez)

En GitHub → **Settings → Secrets and variables → Actions → New repository secret**:

| Secreto           | Valor                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SUPABASE_DB_URL` | Supabase → **Connect** → _Session pooler_ (puerto 5432), con la contraseña de la base. Los servidores de GitHub no tienen IPv6, por eso no sirve la _Direct connection_. |
| `CLAVE_RESPALDO`  | Una frase larga que solo tú conozcas. Guárdala en tu gestor de contraseñas: sin ella el respaldo no se puede abrir.                                                      |

## Restaurar

```bash
gpg --decrypt respaldo-AAAA-MM-DD.dump.gpg > respaldo.dump
pg_restore --clean --if-exists --no-owner --schema=public -d "$SUPABASE_DB_URL" respaldo.dump
```

Restaurar reemplaza los datos actuales. Probarlo primero en un proyecto de Supabase aparte.
