# 2026-10-04 — D18 y D19: diseño de la ficha y el historial (Diego)

**Trabajado:** RNF-01 (fase 2). HU-02 y HU-06. Rama: `feature/diseno-ficha` (D18 integrado en el PR #25; D19 queda en un PR aparte porque se subió después).

**Qué se hizo:**
- `FichaRecurso.css`, `FormularioCambioEstado.css` y `AvisoUbicacion.css` (D18): la ficha mantiene sus dos columnas (datos e historial a la izquierda, acciones a la derecha) con tarjetas blancas, sombra suave y variables de `global.css`. El botón "Guardar cambio" pasó de gris oscuro a azul principal. En escritorio el formulario queda fijo (`position: sticky`) mientras se baja por el historial. El aviso de ubicación lleva una franja de color a la izquierda.
- `TablaHistorial.css` (D19): tarjeta blanca con cabeceras discretas en mayúsculas, separadores suaves y resaltado azul claro al pasar el mouse sobre una fila.
- `global.css` (D19, archivo compartido): `.etiqueta` toma forma de píldora con `--radio-pildora`. Los colores por estado no cambian. Se avisó a Martín.

**Archivos tocados:** `src/components/FichaRecurso.css`, `src/components/FormularioCambioEstado.css`, `src/components/AvisoUbicacion.css`, `src/components/TablaHistorial.css`, `src/styles/global.css`, `docs/avance.md`.
