# 2026-10-31 — J36: fecha de adquisición y filtro de antigüedad (Johann)

**HU trabajada:** HU-13 (RF-12; CA-13.1, CA-13.2 y CA-13.3). Rama: `feature/hu-13-fecha-adquisicion`.

**Qué se hizo:**
- "Agregar recurso" tiene un campo nuevo "Fecha de adquisición" (`CampoFechaAdquisicion`). Es obligatoria y no puede ser futura: el selector no deja elegir días posteriores a hoy y `validarNuevoRecurso` rechaza la fecha vacía ("Elige la fecha de adquisición.") y la futura ("La fecha de adquisición no puede ser futura.") (CA-13.1).
- La ficha muestra "Fecha de adquisición" y "Antigüedad" en años y meses, por ejemplo "1 año y 6 meses" (`DatosAntiguedadRecurso`, CA-13.2). Los recursos sin fecha muestran "Sin fecha" en los dos datos. Todos los roles lo ven.
- El inventario tiene un filtro nuevo "Antigüedad" con "Todas", "Menos de 1 año", "Entre 1 y 2 años" y "Más de 2 años" (CA-13.3). Al cambiarlo vuelve a la página 1 y "Limpiar filtros" lo reinicia. Los recursos "Sin fecha" no aparecen con ningún rango activo, pero sí con "Todas".
- `src/utils/antiguedad.ts` tiene las funciones puras (reciben la fecha de hoy por parámetro): `calcularAntiguedad`, `textoAntiguedad` y `cumpleFiltroAntiguedad`. La fecha se guarda como texto `AAAA-MM-DD`, sin `Timestamp`.
- El campo `fechaAdquisicion` del tipo `Recurso` es opcional (decisión D3), porque los recursos que ya estaban guardados no lo tienen.

**Decisiones y reglas acordadas:**
- Rangos por años completos, sin traslape: menos de 1 año = 0 años; entre 1 y 2 años = 1 año; más de 2 años = 2 o más años. Límites (con hoy = 2026-10-31): `2025-10-31` (1 año justo) cae en "Entre 1 y 2 años"; `2024-10-31` (2 años justos) cae en "Más de 2 años"; `2025-11-01` es 11 meses ("Menos de 1 año"); `2024-11-01` es 1 año y 11 meses ("Entre 1 y 2 años"). Estos límites exactos NO se probaron en vivo; están escritos como ejemplos en un comentario de `antiguedad.ts`.
- Regla de datos raros: "dato raro = antigüedad cero". Si la fecha es posterior a hoy o el texto no tiene formato `AAAA-MM-DD`, `calcularAntiguedad` devuelve 0 años y 0 meses (nunca negativos ni `NaN`). Una fecha mal escrita (no vacía) contaría como antigüedad cero y caería en "Menos de 1 año"; por el formulario esto no debería ocurrir.
- La fecha es obligatoria al agregar un recurso, pero opcional en el tipo (por los recursos viejos).
- No hay pantalla para editar la fecha de un recurso que ya existe (decisión aprobada); no es parte de los CA de HU-13.

**Importante sobre los recursos que ya están guardados:**
- Los recursos que ya están en Firestore no tienen fecha y quedan como "Sin fecha". No hay migración.
- Se agregó `fechaAdquisicion` a 6 de los 10 recursos de `src/data/recursos.ts`, pero ese archivo solo se sube a Firestore cuando la colección `recursos` está vacía (`cargarRecursos`). Como Firestore ya tiene recursos, **eso no cambia lo que se ve en la app publicada ni completa la fecha de los recursos existentes**. Solo sirve si alguien vacía la colección y se vuelven a subir los datos de prueba.
- Opcional: si Johann quiere fechas en los recursos viejos, puede escribir el campo `fechaAdquisicion` (texto `AAAA-MM-DD`) a mano en cada documento de `recursos` desde la consola de Firebase.

**Reglas de Firestore:** `docs/firestore.rules` NO cambió y no hay que pegar nada en la consola. Agregar un recurso es un `create` y ya estaba permitido con sesión iniciada.

**Verificación:** `npm run build` y `npm run lint` sin errores. No se probó en el navegador desde la sesión de Claude. Para probarlo:
1. Entrar como encargado > Inventario > "+ Agregar recurso". Dejar la fecha vacía y guardar: error de fecha obligatoria. Escribir una fecha futura a mano: "La fecha de adquisición no puede ser futura.".
2. Agregar 3 recursos con fechas de hace ~6 meses, ~18 meses y más de 3 años.
3. Abrir cada ficha: "Fecha de adquisición" y "Antigüedad" (por ejemplo "1 año y 6 meses"). Un recurso viejo muestra "Sin fecha".
4. Probar los tres rangos del filtro "Antigüedad": los "Sin fecha" no aparecen con ningún rango activo, pero sí con "Todas".
5. Con otro rol (docente o departamento) el botón "Agregar recurso" no aparece, pero la ficha y el filtro sí.
6. Revisar los filtros a 360 px: se apilan.

**Archivos nuevos:** `src/utils/antiguedad.ts`, `src/components/CampoFechaAdquisicion.tsx`, `src/components/DatosAntiguedadRecurso.tsx`, `docs/avance/2026-10-31-J36-hu-13-fecha-adquisicion.md`.

**Archivos modificados:** `src/types/Recurso.ts`, `src/utils/nuevoRecurso.ts`, `src/utils/filtrosInventario.ts`, `src/hooks/useFiltrosInventario.ts`, `src/components/FormularioNuevoRecurso.tsx`, `src/components/FichaRecurso.tsx`, `src/components/FiltrosInventario.tsx`, `src/components/FiltrosInventario.css`, `src/pages/PaginaInventario.tsx`, `src/data/recursos.ts`.
