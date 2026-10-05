# 2026-10-04 — Favicon con el logo de la UCEN (Johann)

**Trabajado:** identidad visual (RNF-01). Directo en `main`, a pedido de Johann.

**Qué se hizo:**
- `public/favicon.png` (nuevo): logo de la UCEN reducido de 1667 a 256 px con `sips` (herramienta de macOS), para que pese poco (13 KB).
- Se borró `public/favicon.svg`, que era el logo morado que trae Vite por defecto.
- `index.html`: el ícono de la pestaña apunta a `/favicon.png`. También se agregó `apple-touch-icon`, el ícono que usa el celular si se agrega la app a la pantalla de inicio.

**Archivos tocados:** `public/favicon.png`, `public/favicon.svg` (borrado), `index.html`, `docs/avance/2026-10-04-favicon-ucen.md`.
