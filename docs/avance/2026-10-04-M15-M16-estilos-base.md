# 2026-10-04 — M15 y M16: variables CSS base y fuente Inter (Martín)

**Trabajado:** RNF-01 (fase 2, base visual compartida). Rama: `feature/diseno-base`.

**Qué se hizo:**
- **M15 — `src/styles/global.css`:** se expandió el bloque `:root` con las variables que usarán todos los archivos CSS de la Fase 2. Nuevas variables: `--color-principal-claro` (#e8f0fe), `--color-fondo-menu` (#f1f5f9), `--color-blanco`, colores de alerta (`--color-alerta-critica/advertencia/info`), sombras (`--sombra-tarjeta`, `--sombra-elevada`), bordes redondeados (`--radio-borde` 10px, `--radio-borde-sm` 6px, `--radio-pildora` 20px), espaciado (`--espacio-xs` a `--espacio-xl`) y dimensiones de layout (`--ancho-menu`, `--alto-header`). **Regla de oro:** ningún `.css` del proyecto puede usar colores o tamaños sueltos; siempre `var(--nombre)`.
- **M16 — `index.html` + `global.css`:** se cargó la fuente **Inter** (400/500/600/700) desde Google Fonts con `<link>` + `preconnect` en `index.html`, sin instalar ningún paquete npm. En `global.css` se aplicó al `body` (`font-family: 'Inter', Arial, sans-serif`) y se definieron las tres clases de botón reutilizables: `.boton-principal` (azul relleno), `.boton-secundario` (borde azul, fondo transparente) y `.boton-peligro` (rojo relleno). Incluyen `:hover`, `:active` y `:disabled`.

**Archivos tocados:** `src/styles/global.css`, `index.html`, `docs/avance.md`.
