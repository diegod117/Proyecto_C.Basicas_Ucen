# 2026-10-04 — "¿Olvidaste tu contraseña?" con Firebase (Johann)

**Trabajado:** inicio de sesión (sección 3.4 de requerimientos). Rama: `feature/recuperar-contrasena` (PR #36 y #37). Esta entrada se agregó después, en la rama `feature/reponer-stock`.

**Qué se hizo:**
- `services/firebase.ts`: `autenticacion.languageCode = 'es'`, para que los correos de Firebase lleguen en español.
- `services/authService.ts`: función nueva `enviarCorreoRecuperacion(correo)` con `sendPasswordResetEmail` de Firebase.
  - Devuelve `''` si todo salió bien, o el error traducido.
  - Si el correo no tiene cuenta, responde igual que si la tuviera, para que nadie pueda averiguar qué correos están registrados.
  - El error genérico pasó de "No se pudo iniciar sesión" a "Ocurrió un error inesperado", porque ahora lo usan las dos funciones.
- `components/FormularioRecuperarContrasena.tsx/.css` (nuevos): misma tarjeta del login, con el campo de correo, "Enviar enlace", un aviso verde ("Si el correo está registrado, te llegará un enlace…") y "Volver al inicio de sesión".
- `pages/PaginaLogin.tsx/.css`: enlace "¿Olvidaste tu contraseña?" debajo del botón de ingresar. Un `useState` cambia la tarjeta al formulario de recuperación, que llega con el correo ya escrito.
- `data/usuarios.ts`: se agregó la cuenta real `johann.cortes@alumnos.ucentral.cl` como encargado. Los usuarios de prueba usan correos inventados, así que no reciben el correo de recuperación.

**Decisiones:**
- Viene incluido en el plan gratuito de Firebase (Spark): Firebase envía el correo y tiene su propia página para crear la contraseña nueva. No hubo que programar esa página.
- Para dar acceso a alguien nuevo: crear su cuenta en la consola de Firebase **y** agregar su correo con un rol en `data/usuarios.ts`.

**Archivos tocados:** `src/services/firebase.ts`, `src/services/authService.ts`, `src/components/FormularioRecuperarContrasena.tsx`, `src/components/FormularioRecuperarContrasena.css`, `src/pages/PaginaLogin.tsx`, `src/pages/PaginaLogin.css`, `src/data/usuarios.ts`, `docs/avance/2026-10-04-recuperar-contrasena.md`.
