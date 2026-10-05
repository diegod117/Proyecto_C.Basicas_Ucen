# 2026-10-04 — M20: rediseño de alertas (Martín)

**Trabajado:** RNF-01 / HU-05 (fase 2). Rama: `feature/diseno-alertas`.

**Qué se hizo:**
- **`TarjetaAlerta.css`:** migrado a variables. La franja lateral de 5px a la izquierda ya existía; se ajustaron los colores para usar `--color-danado` (rojo), `--color-mantencion` (ámbar) y `--color-principal` (azul). Se agregó micro-animación de elevación en hover (`translateY(-3px)` + `--sombra-elevada`). Los badges de tipo se mantienen como píldoras redondeadas.
- **`PaginaAlertas.css`:** mismo encabezado de página que M19. Filtros rediseñados como botones pastilla (`--radio-pildora`) dentro de una franja blanca con sombra. Grilla de tarjetas con `auto-fill + minmax(300px, 1fr)`. En celular los filtros se deslizan en fila horizontal con `overflow-x: auto`.

**Archivos tocados:** `src/components/TarjetaAlerta.css`, `src/pages/PaginaAlertas.css`, `docs/avance.md`.
