# 2026-10-31 — J33: entradas y salidas de unidades (Johann)

**HU trabajada:** HU-14 (RF-13; CA-14.1 a CA-14.3). Rama: `feature/hu-14-entradas-salidas`.

**Qué se hizo:**
- **Entrada** (`FormularioEntrada`, CA-14.1): tipo (adquisición, préstamo o reposición), cantidad, fecha (no futura) y observación opcional. Suma al disponible. En recursos con unidades pide el número de serie de cada unidad nueva, sin repetir los que ya existen, y deja un registro de historial por unidad. Reemplaza al antiguo "Reponer stock": la reposición ahora es un tipo de entrada, y por eso se eliminaron `FormularioReponerStock`, `utils/reposicion.ts` y `reponerStock`.
- **Salida** (`FormularioSalida`, CA-14.2): tipo (daño reparable → "en mantención"; daño irreparable → "dado de baja") y motivo obligatorio. Con unidades se marcan por número de serie (una unidad dada de baja no se puede marcar); sin unidades se elige el estado de origen y la cantidad. El daño irreparable pide confirmación.
- **Historial** (CA-14.3): quedan como `entrada` y `salida` con su subtipo, usando las funciones de HU-06. Campo nuevo `fechaMovimiento`: la fecha en que ocurrió la entrada (la escribe el encargado), distinta de la fecha y hora automática del registro. La tabla muestra la unidad y esa fecha.
- `services/movimientosService.ts` (nuevo): `registrarEntrada` y `registrarSalida`, para no seguir agrandando `recursosService.ts`. Reutilizan `guardarCambioConHistorial` (ahora exportada), que guarda el recurso y sus registros en un solo lote.
- `historialService.ts`: `asignarIdsSeguidos` evita que registros creados juntos tengan el mismo id. Se eliminó `crearRegistroReposicion`.
- `utils/movimientos.ts` (nuevo): validaciones de entrada y salida. `utils/unidades.ts`: `validarNumerosUnidades` acepta los números que el recurso ya tiene.
- `CamposNumerosSerie` ahora recibe la cantidad y la lista de números (ya no el objeto de "Agregar recurso"), para reutilizarse en la entrada. `SelectorUnidades` (nuevo) es la lista de casillas que estaba dentro de `FormularioCambioEstadoUnidades`; ahora la comparten el cambio de estado y la salida.
- `AccionesRecurso.tsx` (nuevo) es la columna derecha de la ficha con los tres formularios; `FichaRecurso.tsx` baja a 144 líneas y se quita el aviso provisional de HU-02.
- Los registros antiguos de tipo `reposicion` siguen mostrándose igual.
- Las reglas de Firestore **no cambian**.

**Lo que NO incluye:** el acta de baja formal (RF-NEW-04, fuera de la primera versión): el motivo queda en el historial. "Cambiar estado" sigue existiendo para los demás movimientos (por ejemplo, pasar a "En uso" o recuperar una unidad).

**Verificación:** `npm run build` y `npm run lint` sin errores. No se probó en el navegador desde la sesión de Claude.

**Ojo:** `FormularioSalida.tsx` queda en ~184 líneas (por las dos variantes y los comentarios).

**Archivos nuevos:** `src/services/movimientosService.ts`, `src/utils/movimientos.ts`, `src/components/FormularioEntrada.tsx`, `src/components/FormularioSalida.tsx`, `src/components/SelectorUnidades.tsx/.css`, `src/components/AccionesRecurso.tsx`.

**Archivos eliminados:** `src/components/FormularioReponerStock.tsx/.css`, `src/utils/reposicion.ts`, `src/components/FormularioCambioEstadoUnidades.css` (sus estilos pasaron a `SelectorUnidades.css`).

**Archivos modificados:** `src/types/CambioEstado.ts`, `src/services/historialService.ts`, `src/services/recursosService.ts`, `src/utils/unidades.ts`, `src/utils/permisos.ts`, `src/utils/nuevoRecurso.ts`, `src/components/CamposNumerosSerie.tsx`, `src/components/FormularioNuevoRecurso.tsx`, `src/components/FormularioCambioEstadoUnidades.tsx`, `src/components/FormularioCambioEstado.css`, `src/components/DetalleCambioHistorial.tsx`, `src/components/FichaRecurso.tsx/.css`.
