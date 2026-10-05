# 2026-10-03 — J3: componente TarjetaRecurso (Johann)

**HU trabajada:** HU-01 (en progreso). Rama: `feature/hu-01-listado-inventario`.

**Qué se hizo:**
- `src/components/TarjetaRecurso.tsx` y `.css`: tarjeta que recibe un `Recurso` por props y muestra la categoría, el código de ubicación, la torre y la sala, la cantidad total y disponible, y una etiqueta de color por cada estado que tenga unidades.
- `src/utils/inventario.ts`: se agregaron `listaEstadosRecurso` (los 5 estados en orden, para recorrerlos con un for) y `obtenerEstadosConUnidades()`. Así la tarjeta no muestra etiquetas como "Dañado (0)".
- `PaginaInventario` muestra una vista previa temporal con la tarjeta del Arduino (id 4). En J4 se reemplaza por el listado completo.

**Archivos tocados:** `src/components/TarjetaRecurso.tsx`, `src/components/TarjetaRecurso.css`, `src/utils/inventario.ts`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `docs/avance.md`.
