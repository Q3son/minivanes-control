# Despliegue

La app corre en **Netlify** (frontend y funciones de Next.js) y **Supabase** (base de datos,
inicio de sesión y fotos). Ambos en plan gratuito, en línea las 24 horas.

| Pieza          | Plan     | Costo            | Límite que importa                                          |
| -------------- | -------- | ---------------- | ----------------------------------------------------------- |
| Supabase       | Free     | S/ 0             | 500 MB de base, 1 GB de fotos; se pausa tras 7 días sin uso |
| Netlify        | Free     | S/ 0             | 300 créditos al mes (sobra para un solo usuario)            |
| Dominio propio | Opcional | ~S/ 50–60 al año | —                                                           |

## 1. Supabase

1. Crear proyecto en <https://supabase.com/dashboard> (región **South America (São Paulo)**, la más
   cercana a Perú).
2. **SQL Editor:** ejecutar en orden los archivos de `supabase/migrations/`.
3. **Authentication → Users → Invite user:** invitar el correo del dueño.
4. **Project Settings → API:** copiar `Project URL` y la clave `anon public`.

## 2. Netlify

1. <https://app.netlify.com> → **Add new project → Import from GitHub** → `Q3son/minivanes-control`.
2. En **Environment variables** agregar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **Deploy**. Cada merge a `main` vuelve a desplegar solo.

## 3. Conectar los dos

En Supabase → **Authentication → URL Configuration**:

- **Site URL:** `https://<tu-sitio>.netlify.app`
- **Redirect URLs:** `https://<tu-sitio>.netlify.app/auth/confirmar`

## Correos

El servidor de correo incluido en Supabase solo envía a los miembros del proyecto y con un límite
bajo por hora. Sirve para la demo con el correo del desarrollador. Para que el cliente reciba su
enlace, configurar un SMTP propio (por ejemplo Resend, plan gratuito) en
**Authentication → Emails → SMTP Settings**.

## Mantenerlo activo

Supabase pausa los proyectos gratuitos tras 7 días sin consultas. Con uso diario no pasa; si
ocurre, se reactiva desde el panel con **Resume project** sin perder datos.
