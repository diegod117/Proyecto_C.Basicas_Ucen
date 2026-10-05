# 2026-10-03 — J4: listado de recursos en grilla (Johann)

**HU trabajada:** HU-01 (en progreso). Rama: `feature/hu-01-listado-inventario`.

**Qué se hizo:**
- `PaginaInventario` muestra los 10 recursos con `.map()`, una `TarjetaRecurso` por cada uno, usando `recurso.id` como `key`. Se quitó la vista previa de J3.
- `PaginaInventario.css`: grilla con `repeat(auto-fill, minmax(240px, 1fr))`. Muestra 4 columnas en computador y 1 en celular, sin reglas especiales (RNF-01).

**Archivos tocados:** `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `docs/avance.md`.
