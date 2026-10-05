# 2026-10-03 — J1 y J2: servicio de recursos y funciones de ayuda (Johann)

**HU trabajada:** HU-01 (base). Prepara los formularios de HU-03 y HU-04.

**Qué se hizo:**
- `src/services/recursosService.ts` (J1): `obtenerRecursos()` y `obtenerRecursoPorId(id)`. Desde ahora, las páginas piden los recursos al servicio y no importan `src/data/` directamente. `PaginaInventario` ya usa el servicio.
- `src/utils/inventario.ts` (J2): `textoEstado()`, `textoCategoria()` y `calcularCantidadTotal()`.

**Para Martín y Diego:** en sus formularios usen `obtenerRecursos()` para el selector de recurso, y `textoEstado()`/`textoCategoria()` para mostrar textos legibles.

**Archivos tocados:** `src/services/recursosService.ts`, `src/utils/inventario.ts`, `src/pages/PaginaInventario.tsx`, `docs/avance.md`.
