# 2026-10-03 — D11 a D13: panel de alertas y contador en menú (Diego)

**HU trabajada:** HU-05 (panel de alertas) y RF-04.

**Qué se hizo:**
- `src/types/Pagina.ts`, `src/App.tsx`, `src/components/MenuNavegacion.tsx/.css` (D11): incorporación de la página `'alertas'` en la navegación y menú superior.
- `src/components/TarjetaAlerta.tsx/.css` (D12): tarjetas visuales con diseño distintivo y bordes/etiquetas por color según el tipo de alerta, mostrando mensaje, fecha y ubicación física del recurso.
- `src/pages/PaginaAlertas.tsx/.css` (D12): panel con grilla responsiva de tarjetas, contador total de alertas y botones interactivos de filtrado por tipo.
- `src/components/MenuNavegacion.tsx/.css`, `src/App.tsx` (D13): badge/campana numérico con contador de alertas pendientes en el botón de navegación superior.

**Archivos tocados:** `src/types/Pagina.ts`, `src/App.tsx`, `src/components/MenuNavegacion.tsx`, `src/components/MenuNavegacion.css`, `src/components/TarjetaAlerta.tsx`, `src/components/TarjetaAlerta.css`, `src/pages/PaginaAlertas.tsx`, `src/pages/PaginaAlertas.css`, `docs/avance.md`.
