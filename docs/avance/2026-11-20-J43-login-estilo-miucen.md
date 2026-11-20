# 2026-11-20 — J43: login simple al estilo MiUcen (Johann)

**HU trabajada:** ninguna de la línea base. Es un cambio de diseño que pidió Johann: reemplazar la página de bienvenida de J42 por un ingreso simple, parecido al login de MiUcen (miucen.ucentral.cl), con los créditos del equipo en una esquina. Toca el inicio de sesión (sección 3.4, HU-15), RNF-01 (360 px) y RNF-11 (contraste) **sin cambiar cómo funciona el ingreso**. Rama: `feature/login-estilo-miucen`. (J41 sigue reservado para HU-17.)

**Qué se hizo:**
- **Pantalla dividida, como MiUcen.** A la izquierda va un panel azul UCEN con el logo blanco de la Facultad, la frase "El inventario de los laboratorios, en un solo lugar." y un subtítulo. A la derecha, sobre fondo blanco, van "LabCentral", su descripción, el formulario y "© Universidad Central de Chile".
- **Créditos en la esquina** (`CreditosLogin`): el logo de la carrera, los tres integrantes, la carrera, la asignatura y el profesor. En escritorio quedan abajo del panel azul y en el celular al final de la página. Se ordenan con `grid-template-areas` en `PaginaLogin.css`.
- **El formulario no cambió.** `FormularioIngreso` y `FormularioRecuperarContrasena` tienen la misma lógica: correo y contraseña, validación de campos vacíos, avisos de HU-15 y "¿Olvidaste tu contraseña?". Solo se actualizaron sus comentarios y sus variables de letra (`--bienv-*` pasó a `--login-*`, definidas en `PaginaLogin.css`). Se mantuvo el campo de correo y no se usó "usuario + @ucen.cl" como en MiUcen, porque eso habría cambiado el ingreso con Firebase.
- **Se quitó la bienvenida de J42**, porque solo la usaba esta página: el tablero, la barra, las secciones Qué puedes hacer / Laboratorios / Hecho en la Central / Preguntas, el pie, la animación al bajar, sus datos (`data/bienvenida.ts`, `creditosBienvenida.ts`, `preguntasBienvenida.ts`), `types/Bienvenida.ts`, `utils/bienvenida.ts`, `styles/bienvenida.css` y las fotos de `public/bienvenida/`. De esa carpeta quedan solo los dos logos blancos. Se mantienen Montserrat y los colores UCEN de `global.css`.
- `npm run build` y `npm run lint`: OK.
- Se probó en el navegador (sin iniciar sesión) a 1440×900, a 1280×720 (cabe sin scroll) y a 360 px (no hay scroll horizontal; el panel queda arriba, el formulario al medio y los créditos al final).

**Cómo probarlo:**
1. `npm run dev` y abrir `/login`.
2. Entrar con una cuenta real: debe pasar al inventario como siempre. Con una cuenta desactivada debe aparecer el aviso de HU-15 sobre el botón.
3. "¿Olvidaste tu contraseña?" y "Volver".
4. DevTools a 360 px: no debe aparecer scroll horizontal.

**Archivos tocados:** `src/pages/PaginaLogin.tsx`, `src/pages/PaginaLogin.css`, `src/components/PanelMarcaLogin.tsx` y `.css` (nuevos), `src/components/CreditosLogin.tsx` y `.css` (nuevos), `src/components/FormularioIngreso.tsx` y `.css`, `src/components/FormularioRecuperarContrasena.tsx` y `.css`, y los archivos borrados de arriba; `docs/avance/2026-11-20-J43-login-estilo-miucen.md`.
