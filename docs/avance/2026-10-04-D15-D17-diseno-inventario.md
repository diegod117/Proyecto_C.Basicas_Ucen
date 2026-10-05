# 2026-10-04 — D15 a D17: diseño del inventario (Diego)

**Trabajado:** RNF-01 (fase 2, ver `docs/plan-fase-2.md`). HU-01. Rama: `feature/diseno-inventario` (PR #24).

**Qué se hizo:**
- `TarjetaRecurso.css` y `GrillaRecursos.css` (D15): las tarjetas usan las variables de `global.css` (`--sombra-tarjeta`, `--radio-borde`, colores) y no tienen bordes grises duros. Al pasar el mouse la tarjeta se eleva 4px (`transform: translateY(-4px)`) con `--sombra-elevada`. La grilla usa `--espacio-lg` y un poco de margen vertical para que la elevación no se corte.
- `FiltrosInventario.css` (D16): los filtros van en una franja blanca con sombra suave. El buscador es más grande que los selectores, los labels van en mayúsculas pequeñas grises y los campos muestran un aro azul claro al enfocarse.
- `PaginaInventario.tsx/.css` y `MensajeSinResultados.css` (D17): encabezado de página con título y descripción en gris ("Recursos de los laboratorios de las torres B y C"), con clases `.encabezado-pagina-*` pensadas para reutilizar en las demás páginas. El contador "Mostrando X de 10" y "Limpiar filtros" pasan debajo de los filtros. El mensaje de sin resultados usa variables y el estilo del botón principal.
- Se avisó a Martín del cambio en el JSX de `PaginaInventario.tsx`.

**Archivos tocados:** `src/components/TarjetaRecurso.css`, `src/components/GrillaRecursos.css`, `src/components/FiltrosInventario.css`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/components/MensajeSinResultados.css`, `docs/avance.md`.
