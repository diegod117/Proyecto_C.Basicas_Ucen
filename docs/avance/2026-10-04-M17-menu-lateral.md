# 2026-10-04 — M17: menú lateral y barra superior (Martín)

**Trabajado:** RNF-01 (fase 2, layout de pantalla completa). Rama: `feature/diseno-menu-lateral`. **Se integró después de que J16 de Johann estuviera en `main`**, porque ambos tocan `App.tsx` y `MenuNavegacion`.

**Qué se hizo:**
- **`MenuNavegacion.css`:** reescrito completamente. El menú pasa de ser una barra horizontal a tener dos partes: un `<header class="app-header">` azul fijo arriba (título + datos del usuario + botón cerrar sesión) y un `<nav class="app-sidebar">` gris fijo a la izquierda (botones de navegación). Los botones del sidebar tienen borde izquierdo de 3px en azul cuando están activos.
- **`MenuNavegacion.tsx`:** reestructurado para devolver `<header>` + `<nav>` con las nuevas clases en vez del antiguo `<header>` único.
- **`App.tsx`:** el `<div>` raíz pasa a `div.app-layout` y el `<main>` recibe la clase `app-contenido`, que lo desplaza a la derecha del sidebar y debajo del header.
- **En celular (max-width 768px):** el sidebar se convierte en fila horizontal debajo del header; el contenido ocupa todo el ancho.

**Para Diego:** el `<main class="app-contenido">` ya aplica el margen izquierdo automáticamente; no hace falta tocarlo en los demás diseños.

**Archivos tocados:** `src/components/MenuNavegacion.css`, `src/components/MenuNavegacion.tsx`, `src/App.tsx`, `docs/avance.md`.
