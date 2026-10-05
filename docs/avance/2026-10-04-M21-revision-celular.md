# 2026-10-04 — M21: revisión en celular de todos los diseños (Martín)

**Trabajado:** RNF-01 (fase 2, revisión responsiva). Rama: `feature/diseno-reservas`.

**Qué se hizo:**
Se revisaron todos los diseños de M17 a M20 a **375px de ancho** en las DevTools del navegador (Device Toolbar → resolución personalizada 375×812). Los cambios son solo CSS:

- **`MenuNavegacion.css`** (`@media max-width: 420px`): oculta el rol del usuario para liberar espacio en el header, trunca el título con `text-overflow: ellipsis`, botones del sidebar con `min-height: 44px` (mínimo táctil según Apple HIG), botón "Cerrar sesión" más compacto.
- **`global.css`** (`@media max-width: 420px`): `.contenido-pagina` con `padding: 16px 8px` en lugar de `24px 16px`. Evita que las tarjetas queden pegadas al borde en los celulares más angostos.
- **`TablaReservas.css`** (`@media max-width: 420px`): gradiente sutil en `.tabla-scroll` que actúa como indicador visual de scroll horizontal. Botón "Cancelar" con `min-height: 36px`.
- **`PaginaLogin.css`** (`@media max-width: 400px`): tarjeta a ancho completo con padding mínimo, botón con `min-height: 44px`.

**Archivos tocados:** `src/components/MenuNavegacion.css`, `src/styles/global.css`, `src/components/TablaReservas.css`, `src/pages/PaginaLogin.css`, `docs/avance.md`.
