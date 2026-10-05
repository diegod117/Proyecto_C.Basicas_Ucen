# 2026-10-04 — Inicio de sesión con Firebase (Johann)

**Trabajado:** inicio de sesión con roles (sección 3.4 de requerimientos), base para RNF-03. No tiene HU propia. Rama: `feature/login-roles`.

**Qué se hizo:**
- Se instaló el paquete `firebase` (v12) y se creó el proyecto `ucen-gestiondelaboratorio` en Firebase, con el inicio de sesión por correo y contraseña activado.
- `src/services/firebase.ts`: conecta la app con el proyecto. La configuración queda en el repo porque no es secreta (identifica el proyecto, no da permisos), así nadie del equipo tiene que configurar nada.
- `src/types/Usuario.ts`: `Usuario` (correo, nombre, rol) y `RolUsuario` ('encargado' | 'docente' | 'departamento').
- `src/data/usuarios.ts`: tres usuarios de prueba, uno por rol. Firebase revisa la contraseña; el rol se saca de esta lista. Cada correo de la lista también debe estar creado en Firebase (Authentication > Usuarios).
- `src/services/authService.ts`: `iniciarSesion()` (devuelve '' o el error en español), `cerrarSesion()` y `escucharSesion()`. Si una cuenta de Firebase no está en la lista, no puede entrar.
- `src/pages/PaginaLogin.tsx/.css`: formulario de correo y contraseña. El botón se desactiva mientras Firebase responde.
- `App.tsx`: sin sesión muestra el login. Un `useEffect` escucha a Firebase, así la sesión se mantiene al recargar la página. Mientras revisa, muestra "Cargando...".
- `MenuNavegacion`: muestra el nombre y el rol del usuario y el botón "Cerrar sesión".
- Se probó en el navegador: contraseña mala, login con los tres roles, recargar sin perder la sesión y cerrar sesión.

**Pendiente:** ocultar acciones según el rol (RNF-03) y cambiar el texto fijo "Encargado (usuario actual)" de incidencias e historial por el usuario real.

**Archivos tocados:** `package.json`, `package-lock.json`, `src/services/firebase.ts`, `src/services/authService.ts`, `src/types/Usuario.ts`, `src/data/usuarios.ts`, `src/pages/PaginaLogin.tsx`, `src/pages/PaginaLogin.css`, `src/App.tsx`, `src/components/MenuNavegacion.tsx`, `src/components/MenuNavegacion.css`, `docs/avance.md`.
