# 2026-10-04 — Botón "Agregar recurso" en el inventario (Johann)

**Trabajado:** RF-01, RF-08 (categoría), RF-10 y HU-11 (ubicación obligatoria), RNF-03 (solo el encargado), RNF-06 (queda en el historial). Rama: `feature/agregar-recurso`.

**Problema:** los recursos nuevos solo se podían agregar escribiéndolos a mano en la consola de Firebase.

**Qué se hizo:**
- `pages/PaginaInventario.tsx`: el encargado ve el botón **"+ Agregar recurso"**. Al hacer clic, el listado se cambia por el formulario; al guardar se abre la ficha del recurso nuevo. El encabezado y el contador se separaron en `EncabezadoInventario.tsx` y `ContadorInventario.tsx`, porque la página pasaba de 200 líneas (quedó en 185, casi todo comentarios).
- `components/FormularioNuevoRecurso.tsx/.css` (nuevos), con dos partes en componentes aparte:
  - `CamposUbicacionRecurso.tsx`: torre, sala, bodega y mueble. Muestra el **código de ubicación, que se genera solo** con `generarCodigoUbicacion()` de J13.
  - `CamposDetalleRecurso.tsx`: marca, número de serie, proveedor y observación (opcionales).
  - Todos los campos se guardan en un solo objeto (`DatosNuevoRecurso`) y se cambian con `{ ...datos, campo: valor }`.
  - El campo **stock mínimo** solo aparece en insumos y reactivos.
  - El mensaje de error se borra apenas se edita un campo.
- `utils/nuevoRecurso.ts` (nuevo):
  - `validarNuevoRecurso()`: nombre, categoría, cantidad entera mayor que 0, stock mínimo, ubicación (reutiliza `validarUbicacion()` de J13) y que no exista otro recurso con el mismo nombre en la misma ubicación;
  - `armarRecurso()`: las unidades iniciales entran como "disponible" y los campos opcionales vacíos no se guardan.
- `services/recursosService.ts`: `agregarRecurso()` calcula el id (el mayor + 1) y guarda en un solo lote el recurso y su registro de **alta** en el historial.
- `types/CambioEstado.ts`: tipo de movimiento nuevo `'alta'`. `historialService.crearRegistroAlta()` lo crea y `TablaHistorial` lo muestra como "Alta 3 → Disponible".
- `types/Recurso.ts`: interface `DatosNuevoRecurso`.
- `utils/permisos.ts`: `puedeAgregarRecurso(rol)`, solo el encargado.
- No hubo que cambiar las reglas de Firestore: ya permitían crear recursos. Si dos personas agregan al mismo tiempo con el mismo id, las reglas rechazan al segundo.

**Pruebas (Chrome, cuenta `encargado@prueba.cl`):**
- Las validaciones salen en orden: sin nombre, sin categoría, cantidad 0, sala "abc", sin bodega.
- El campo de stock mínimo aparece al elegir "Insumo", y el código generado fue `C210-B2-M3`.
- Al guardar se abre la ficha, con "Alta 3 → Disponible" y el usuario en el historial.
- Después de recargar, el inventario pasa de 10 a 11 recursos, y aparece la alerta de reposición del insumo nuevo (3 unidades con mínimo 5).
- Agregarlo de nuevo da el error de duplicado, que sugiere usar "Reponer stock".
- "Cancelar" vuelve al listado.
- En celular (390 px) no hay desplazamiento hacia el lado y los campos van uno debajo del otro.
- Sin errores en la consola.

**Nota:** la prueba dejó en Firestore el recurso "Pipetas Pasteur (prueba Claude)". La app no permite borrar recursos (se dan de baja). Se elimina al limpiar los datos antes de la demo, borrando las colecciones en la consola.

**Archivos tocados:** `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/components/EncabezadoInventario.tsx`, `src/components/ContadorInventario.tsx`, `src/components/FormularioNuevoRecurso.tsx`, `src/components/FormularioNuevoRecurso.css`, `src/components/CamposUbicacionRecurso.tsx`, `src/components/CamposDetalleRecurso.tsx`, `src/components/TablaHistorial.tsx`, `src/utils/nuevoRecurso.ts`, `src/utils/permisos.ts`, `src/services/recursosService.ts`, `src/services/historialService.ts`, `src/types/Recurso.ts`, `src/types/CambioEstado.ts`, `docs/avance/2026-10-04-agregar-recurso.md`.
