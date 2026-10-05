# 2026-10-04 — M19: rediseño de reservas (Martín)

**Trabajado:** RNF-01 / HU-03 (fase 2). Rama: `feature/diseno-reservas`.

**Qué se hizo:**
- **`PaginaReservas.css`:** encabezado de página con título grande, descripción en gris y badge de conteo en azul claro. Este patrón de encabezado se reutiliza en todas las páginas (coordinado con Diego).
- **`FormularioReserva.css`:** tarjeta con `--sombra-tarjeta` y `--radio-borde`; inputs con foco azul; todos los valores migrados a `var()`.
- **`TablaReservas.css`:** filas alternadas (**zebra striping**) con `--color-fondo-menu`; encabezados en `uppercase` con `letter-spacing`; hover en `--color-principal-claro`; botón cancelar compacto en rojo.
- **`PaginaReservas.tsx`:** único cambio — clase `pagina-reservas-descripcion` al `<p>` del encabezado.

**Archivos tocados:** `src/pages/PaginaReservas.css`, `src/pages/PaginaReservas.tsx`, `src/components/FormularioReserva.css`, `src/components/TablaReservas.css`, `docs/avance.md`.
