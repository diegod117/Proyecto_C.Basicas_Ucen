# 2026-10-04 — D20: diseño de incidencias (Diego)

**Trabajado:** RNF-01 (fase 2). HU-04 y HU-10. Rama: `feature/diseno-incidencias`.

**Qué se hizo:**
- `FormularioIncidencia.css`: tarjeta blanca con sombra, labels en mayúsculas pequeñas, aro azul claro al enfocar, checkbox con `accent-color` azul y botón "Registrar" con el estilo de `.boton-principal`. El error lleva una franja roja a la izquierda.
- `TablaIncidencias.css`: tarjeta con cabeceras discretas y filas que se resaltan en azul claro. Los botones de acción son secundarios (azul para "Pasar a en revisión" y verde para "Marcar como resuelta"). La tabla se desliza hacia el lado en pantallas angostas (`overflow-x: auto`).
- `EtiquetaEstadoIncidencia.css`: etiquetas en forma de píldora con los colores de estado de `global.css`.
- `PaginaIncidencias.css`: el mensaje de confirmación usa variables y franja lateral verde.
- Solo se tocaron `.css`, así que no hubo conflicto con J19 de Johann.

**Pendiente:** usar el encabezado `.encabezado-pagina` en `PaginaIncidencias.tsx`, en un commit aparte.

**Archivos tocados:** `src/components/FormularioIncidencia.css`, `src/components/TablaIncidencias.css`, `src/components/EtiquetaEstadoIncidencia.css`, `src/pages/PaginaIncidencias.css`, `docs/avance.md`.
