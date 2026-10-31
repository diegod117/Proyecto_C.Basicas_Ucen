# 2026-10-31 — J30: unidades con número de serie (Johann)

**HU trabajada:** HU-12 (RF-11, CA-12.1 a CA-12.3). Rama: `feature/hu-12-unidades-serie`.

**Qué se hizo:**
- Tipo nuevo `Unidad` (`numero` y `estado`) y campo opcional `unidades` en `Recurso`. Cuando un recurso tiene unidades, `cantidades` se calcula contándolas (`contarUnidadesPorEstado`), así no se desfasan.
- `Categoria` tiene un campo opcional `usaNumeroSerie`. `instrumento` y `equipo` lo traen en los datos de prueba. Las categorías ya guardadas en Firestore no lo tienen y las reglas no dejan modificarlas, así que `categoriaUsaNumeroSerie` (en `utils/unidades.ts`) asume que sí para esas dos claves.
- "Agregar recurso" (CA-12.1, CA-12.2): en categorías con número de serie aparece un campo por cada unidad (`CamposNumerosSerie`). Se valida que ninguno falte y que no haya repetidos (sin importar mayúsculas), con un máximo de 100 unidades. El campo suelto "N° de serie" solo aparece en las demás categorías.
- Ficha (CA-12.3): tabla `TablaUnidadesSerie` con el número y el estado de cada unidad. Si el recurso es de una categoría con número de serie pero se creó antes de HU-12, dice que todavía no tiene unidades registradas.
- Configuración: al crear una categoría hay una casilla "Cada unidad tiene número de serie o de inventario", y la lista muestra "· número de serie".
- Las reglas de Firestore **no cambian**: HU-12 solo crea recursos nuevos.

**Decisión pendiente de HU-02 y HU-14:** "Cambiar estado" y "Reponer stock" cambian solo las cantidades, así que se desactivan en los recursos que ya tienen unidades (la ficha lo avisa). Si no, la tabla de unidades y las cantidades quedarían distintas. En los recursos antiguos siguen funcionando como siempre. Elegir la unidad en un cambio de estado o una incidencia (CA-12.4) llega con HU-02 y HU-04.

**Los datos de prueba (`data/recursos.ts`) no se tocaron:** por lo anterior, agregarles unidades les quitaría el cambio de estado en la demo. Para ver la tabla hay que agregar un equipo o instrumento nuevo desde "Agregar recurso".

**Verificación:** `npm run build` y `npm run lint` pasan sin errores. No se probó en el navegador desde esta sesión (requiere iniciar sesión con Firebase): ver "cómo probar" en el PR.

**Ojo:** `FichaRecurso.tsx`, `FormularioNuevoRecurso.tsx` y `nuevoRecurso.ts` quedaron en ~168 líneas (casi todo comentarios).

**Archivos nuevos:** `src/utils/unidades.ts`, `src/components/CamposNumerosSerie.tsx`, `src/components/TablaUnidadesSerie.tsx/.css`.

**Archivos modificados:** `src/types/Recurso.ts`, `src/types/Configuracion.ts`, `src/data/configuracion.ts`, `src/utils/nuevoRecurso.ts`, `src/components/FormularioNuevoRecurso.tsx/.css`, `src/components/CamposDetalleRecurso.tsx`, `src/components/FichaRecurso.tsx`, `src/components/SeccionCategorias.tsx`.
