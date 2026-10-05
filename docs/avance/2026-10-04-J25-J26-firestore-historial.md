# 2026-10-04 — J25 y J26: historial, cambios de estado y reposiciones en Firestore (Johann)

**Trabajado:** RNF-06, HU-06 y HU-02 (fase 3). Rama: `feature/firestore-historial`.

**Qué se hizo:**
- `services/historialService.ts` (J25):
  - `cargarHistorial()` funciona igual que `cargarRecursos()`: la primera vez sube los 3 registros de `data/historialEstados.ts` a la colección `historial`, y al cargar los ordena por `id`;
  - los registros ahora se **crean** con `crearRegistroCambioEstado()` y `crearRegistroReposicion()` y se **guardan** desde `recursosService`, con `agregarRegistroAlLote()` y `agregarRegistroEnMemoria()`;
  - el id nuevo es el mayor + 1;
  - sigue sin haber funciones para borrar o modificar registros (RNF-06).
- `services/cargaDatos.ts`: ahora carga los recursos y el historial.
- `services/recursosService.ts` (J26):
  - `cambiarEstadoRecurso()` y `reponerStock()` pasan a ser `async` y devuelven `Promise<boolean>`;
  - las dos usan `guardarCambioConHistorial()`, que envía en un solo `writeBatch` las cantidades nuevas del recurso (`update`) y su registro del historial (`set`). Firestore guarda los dos o ninguno;
  - primero se guarda en Firestore y, solo si sale bien, se actualiza la copia en memoria. Si falla, nada cambia.
- `FormularioCambioEstado.tsx` y `FormularioReponerStock.tsx`: esperan con `await`, el botón dice "Guardando..." y queda desactivado mientras tanto, y si falla aparece "Revisa tu conexión e inténtalo de nuevo".
- Se probó en Chrome con la cuenta `encargado@prueba.cl`, recargando la página después de cada paso:
  - multímetro, 1 unidad de Disponible → Dañado: después de recargar quedan 11 disponibles y 2 dañadas, con la fila en el historial;
  - guantes de nitrilo, reposición de 4: después de recargar quedan 6 disponibles, con "Reposición +4" en el historial, y el contador de alertas bajó de 6 a 5;
  - sin errores en la consola. La colección `historial` quedó en Firestore.

**Notas:**
- **En modo de desarrollo, recargar con F5 después de cambiar un servicio.** Vite reemplaza los archivos en caliente: la lista en memoria del servicio vuelve a quedar vacía, pero `CargadorDatos` no vuelve a descargar. Por eso al principio el inventario se veía vacío y el historial no se subía. A un usuario de la app publicada no le pasa.
- Los datos de prueba en Firestore quedaron modificados por esta prueba (multímetro y guantes), y los registros "Prueba J26 (Claude)" quedan en el historial. Para la demo conviene el botón opcional "Restablecer datos de prueba" (plan de la fase 3, sección 7).
- `FormularioCambioEstado.tsx` (178 líneas), `recursosService.ts` (217) e `historialService.ts` (160) pasan de ~150. En los servicios es más que nada por los comentarios. Se pueden dividir en otra tarea.

**Archivos tocados:** `src/services/historialService.ts`, `src/services/recursosService.ts`, `src/services/cargaDatos.ts`, `src/components/FormularioCambioEstado.tsx`, `src/components/FormularioReponerStock.tsx`, `docs/avance/2026-10-04-J25-J26-firestore-historial.md`.
