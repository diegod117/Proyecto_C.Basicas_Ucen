# 2026-10-04 — Arreglo de la vista en celular y del contenido tapado en PC (Johann)

**Trabajado:** RNF-01 (que se vea bien en PC y celular). Rama: `fix/vista-celular`. Corrige el diseño de M17 y M18 (archivos de Martín, avisado).

**Problemas encontrados:**
- **Celular:** la fila de pestañas (Inventario, Reservas…) quedaba completamente tapada por la barra azul. La barra es `position: fixed`, pero la fila era `position: static`: empezaba arriba de todo, debajo de la barra.
- **Celular (iPhone):** al entrar después del login la app quedaba con zoom. Los campos del login tenían letra de 14,4px (`0.9rem`), y Safari hace zoom al tocar un campo con letra menor a 16px y no lo deshace al cambiar de pantalla.
- **PC:** el contenido no dejaba espacio para la barra ni para el menú lateral, así que el título de cada página quedaba tapado. La regla `.app-contenido` solo existía para celular.

**Qué se hizo:**
- `styles/global.css`: variable nueva `--alto-menu-celular: 52px`.
- `components/MenuNavegacion.css`:
  - PC: `.app-contenido` con `margin-top` (alto de la barra) y `margin-left` (ancho del menú).
  - Celular: la fila de pestañas es `fixed` justo debajo de la barra azul. Si las pestañas no caben, se desliza hacia el lado (`overflow-x: auto` y `flex-shrink: 0` en los botones). El contenido empieza debajo de la barra y de la fila.
- `pages/PaginaLogin.css`: los campos del login usan letra de 16px (`1rem`).
- Se comprobó con capturas de Chrome a 375px, 320px y en PC, usando los mismos archivos CSS del proyecto: las pestañas se ven bajo la barra y el título ya no queda tapado. El zoom del iPhone se comprueba en el celular, porque Chrome no lo reproduce.

**Archivos tocados:** `src/styles/global.css`, `src/components/MenuNavegacion.css`, `src/pages/PaginaLogin.css`, `docs/avance/2026-10-04-fix-vista-celular.md`.
