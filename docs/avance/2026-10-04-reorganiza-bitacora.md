# 2026-10-04 — Bitácora: un archivo por tarea (Johann)

**Trabajado:** organización del equipo (no corresponde a una HU). Rama: `docs/reorganiza-avance`.

**Qué se hizo:**
- `docs/avance.md` causaba conflictos en casi todos los PR, porque los tres agregaban su entrada al final del mismo archivo. Al resolverlos a mano se perdieron entradas.
- Se separaron las 40 entradas en archivos dentro de la carpeta nueva `docs/avance/`, sin cambiar su texto. Nombre: `AAAA-MM-DD-ID-descripcion.md`.
- Se recuperaron 8 entradas que no estaban en `main`:
  - M1 a M13 de Martín (4 entradas), que se perdieron en un conflicto anterior. Se tomaron del commit `50d2451`.
  - D15 a D21 de Diego (4 entradas), que estaban en la rama `docs/avance-diseno-diego` (commit `2bddbbf`). Ese PR ya no hace falta.
- Para encontrarlas se revisaron los 59 commits que modificaron `docs/avance.md` y se compararon con la versión de `main`.
- `docs/avance.md` quedó como portada: explica la regla, el formato del nombre y una plantilla. Ya no se modifica.
- Se actualizó la regla en `CLAUDE.md` (estructura de carpetas, pasos 1 y 6), `README.md`, `docs/plan-implementacion.md` y `docs/plan-fase-2.md`.

**Archivos tocados:** `docs/avance.md`, `docs/avance/` (41 archivos nuevos), `CLAUDE.md`, `README.md`, `docs/plan-implementacion.md`, `docs/plan-fase-2.md`.
