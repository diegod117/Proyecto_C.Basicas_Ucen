# Bitácora de avance

## 2026-10-02 — Proyecto base y tipos principales

**HU trabajada:** ninguna en específico (configuración inicial). Los tipos preparan RF-01, RF-02, RF-03, RF-05, RF-08 y RF-10.

**Qué se hizo:**
- Se creó el proyecto con Vite (plantilla React + TypeScript) y se borró el ejemplo que trae por defecto.
- Se creó la estructura de carpetas definida en `CLAUDE.md`.
- Se movió `requerimientos_sistema_inventario.md` a `docs/requerimientos.md` (sin cambiar su contenido).
- Se guardó el mockup HTML en `docs/mockup-sgil.html` como referencia visual. Usa Tailwind, pero el proyecto usará CSS simple.
- Se definieron los tipos en `src/types/`:
  - `Recurso.ts`: categorías (RF-08), estados operativos (RF-01), ubicación obligatoria (RF-10, HU-11), cantidades por estado y stock mínimo opcional (HU-09).
  - `Reserva.ts`: reserva por fecha, horario y cantidad (RF-03, HU-03).
  - `Incidencia.ts`: campos de RF-05 y estados `pendiente`, `en_revision` y `resuelta` (HU-10).

**Decisiones:**
- "Reservado" y "Prestado" (del mockup) no son estados del recurso. Se usan los 5 estados de RF-01, y las reservas se guardan aparte.
- No se guarda la cantidad total del recurso, porque se calcula sumando las cantidades de cada estado.
- Todavía no hay un tipo `Usuario`: el login con roles está pendiente (punto 3.4 de los requerimientos).

**Archivos tocados:** `package.json`, `package-lock.json`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`, `.gitignore`, `README.md`, `src/main.tsx`, `src/App.tsx`, `src/styles/global.css`, `src/types/Recurso.ts`, `src/types/Reserva.ts`, `src/types/Incidencia.ts`, `docs/requerimientos.md`, `docs/mockup-sgil.html`, `docs/avance.md`.

## 2026-10-03 — Ronda 1: datos de prueba y menú de navegación

**HU trabajada:** ninguna en específico (base común para la ronda 2). Prepara HU-01, HU-03, HU-04, HU-05, HU-08 y HU-09.

**Qué se hizo:**
- Ubicación con formato torre + sala (ej: B307 = torre B, sala 307). En `Recurso.ts` se reemplazó `laboratorio` por `torre` (`'B' | 'C'`) y `sala`.
- Datos de prueba inventados en `src/data/`:
  - `recursos.ts`: 10 recursos que cubren las 6 categorías y los 5 estados, en B307, B308 y C210. Los guantes de nitrilo están bajo su stock mínimo, para probar las alertas.
  - `reservas.ts`: 4 reservas. Los 8 termómetros quedan ocupados el 09/10 a las 08:30, para probar HU-08.
  - `incidencias.ts`: 3 incidencias, una en cada estado.
- Menú de navegación con `useState` en `App.tsx` (sin librerías de rutas) y tres páginas borrador: Inventario, Reservas e Incidencias.
- Plan de implementación por integrante en `docs/plan-implementacion.md`.

**Archivos tocados:** `src/types/Recurso.ts`, `src/types/Pagina.ts`, `src/data/recursos.ts`, `src/data/reservas.ts`, `src/data/incidencias.ts`, `src/components/MenuNavegacion.tsx`, `src/components/MenuNavegacion.css`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaReservas.tsx`, `src/pages/PaginaIncidencias.tsx`, `src/App.tsx`, `src/styles/global.css`, `docs/plan-implementacion.md`, `docs/avance.md`, `README.md`.

## 2026-10-03 — J1 y J2: servicio de recursos y funciones de ayuda (Johann)

**HU trabajada:** HU-01 (base). Prepara los formularios de HU-03 y HU-04.

**Qué se hizo:**
- `src/services/recursosService.ts` (J1): `obtenerRecursos()` y `obtenerRecursoPorId(id)`. Desde ahora, las páginas piden los recursos al servicio y no importan `src/data/` directamente. `PaginaInventario` ya usa el servicio.
- `src/utils/inventario.ts` (J2): `textoEstado()`, `textoCategoria()` y `calcularCantidadTotal()`.

**Para Martín y Diego:** en sus formularios usen `obtenerRecursos()` para el selector de recurso, y `textoEstado()`/`textoCategoria()` para mostrar textos legibles.

**Archivos tocados:** `src/services/recursosService.ts`, `src/utils/inventario.ts`, `src/pages/PaginaInventario.tsx`, `docs/avance.md`.

## 2026-10-03 — D1 a D4: servicio y formulario de incidencias (Diego)

**HU trabajada:** HU-04 (registrar incidencia) y RF-05.

**Qué se hizo:**
- `src/services/incidenciasService.ts` (D1): creación del servicio con `obtenerIncidencias()`, `obtenerIncidenciaPorId()` y `agregarIncidencia()`.
- `src/components/FormularioIncidencia.tsx/.css` (D2, D3, D4): formulario controlado para ingresar incidencias con selección de recurso afectado, docente presente, descripción, checkbox condicional de personas afectadas con detalle opcional, y validación de campos obligatorios en un máximo de 5 pasos (RNF-02).
- `src/pages/PaginaIncidencias.tsx/.css` (D4): mensaje temporal de confirmación tras registrar con éxito y actualización reactiva de la vista.

**Archivos tocados:** `src/services/incidenciasService.ts`, `src/components/FormularioIncidencia.tsx`, `src/components/FormularioIncidencia.css`, `src/pages/PaginaIncidencias.tsx`, `src/pages/PaginaIncidencias.css`.

## 2026-10-03 — D5 a D8: historial de incidencias y avance de estado (Diego)

**HU trabajada:** HU-10 (historial de incidencias con estado) y RF-05.

**Qué se hizo:**
- `src/utils/fechas.ts` (D5): función `obtenerFechaActual()` en formato `AAAA-MM-DD HH:MM`. Toda incidencia nace con fecha automática y estado `pendiente`.
- `src/components/TablaIncidencias.tsx/.css` (D6, D8): tabla con historial de incidencias que muestra fecha, nombre de recurso (resuelto por `recursoId`), descripción, etiqueta de estado y columna de acciones.
- `src/components/EtiquetaEstadoIncidencia.tsx/.css` (D7): componente reutilizable con colores distintivos por estado (`pendiente`: amarillo, `en_revision`: azul, `resuelta`: verde).
- `src/services/incidenciasService.ts` (D8): función `cambiarEstadoIncidencia(id, nuevoEstado)` que permite avanzar el ciclo `pendiente` ➔ `en_revision` ➔ `resuelta`.

**Archivos tocados:** `src/utils/fechas.ts`, `src/services/incidenciasService.ts`, `src/components/TablaIncidencias.tsx`, `src/components/TablaIncidencias.css`, `src/components/EtiquetaEstadoIncidencia.tsx`, `src/components/EtiquetaEstadoIncidencia.css`.

## 2026-10-03 — D9 y D10: generación de alertas automáticas (Diego)

**HU trabajada:** HU-09 (alertas de mantención, reparación y reposición) y RF-04.

**Qué se hizo:**
- `src/types/Alerta.ts` (D9): definición del tipo unión `TipoAlerta` (`'mantencion' | 'reparacion' | 'reposicion'`) y la interface `Alerta`.
- `src/utils/alertas.ts` (D10): función `generarAlertas(recursos)` que evalúa recursos dañados (reparación), recursos en mantención (mantención) y recursos cuyo stock disponible cae bajo el `stockMinimo` (reposición, como los guantes de nitrilo). Incluye función `textoTipoAlerta()`.

**Archivos tocados:** `src/types/Alerta.ts`, `src/utils/alertas.ts`.

## 2026-10-03 — D11 a D13: panel de alertas y contador en menú (Diego)

**HU trabajada:** HU-05 (panel de alertas) y RF-04.

**Qué se hizo:**
- `src/types/Pagina.ts`, `src/App.tsx`, `src/components/MenuNavegacion.tsx/.css` (D11): incorporación de la página `'alertas'` en la navegación y menú superior.
- `src/components/TarjetaAlerta.tsx/.css` (D12): tarjetas visuales con diseño distintivo y bordes/etiquetas por color según el tipo de alerta, mostrando mensaje, fecha y ubicación física del recurso.
- `src/pages/PaginaAlertas.tsx/.css` (D12): panel con grilla responsiva de tarjetas, contador total de alertas y botones interactivos de filtrado por tipo.
- `src/components/MenuNavegacion.tsx/.css`, `src/App.tsx` (D13): badge/campana numérico con contador de alertas pendientes en el botón de navegación superior.

**Archivos tocados:** `src/types/Pagina.ts`, `src/App.tsx`, `src/components/MenuNavegacion.tsx`, `src/components/MenuNavegacion.css`, `src/components/TarjetaAlerta.tsx`, `src/components/TarjetaAlerta.css`, `src/pages/PaginaAlertas.tsx`, `src/pages/PaginaAlertas.css`, `docs/avance.md`.

## 2026-10-03 — J3: componente TarjetaRecurso (Johann)

**HU trabajada:** HU-01 (en progreso). Rama: `feature/hu-01-listado-inventario`.

**Qué se hizo:**
- `src/components/TarjetaRecurso.tsx` y `.css`: tarjeta que recibe un `Recurso` por props y muestra la categoría, el código de ubicación, la torre y la sala, la cantidad total y disponible, y una etiqueta de color por cada estado que tenga unidades.
- `src/utils/inventario.ts`: se agregaron `listaEstadosRecurso` (los 5 estados en orden, para recorrerlos con un for) y `obtenerEstadosConUnidades()`. Así la tarjeta no muestra etiquetas como "Dañado (0)".
- `PaginaInventario` muestra una vista previa temporal con la tarjeta del Arduino (id 4). En J4 se reemplaza por el listado completo.

**Archivos tocados:** `src/components/TarjetaRecurso.tsx`, `src/components/TarjetaRecurso.css`, `src/utils/inventario.ts`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `docs/avance.md`.

## 2026-10-03 — J4: listado de recursos en grilla (Johann)

**HU trabajada:** HU-01 (en progreso). Rama: `feature/hu-01-listado-inventario`.

**Qué se hizo:**
- `PaginaInventario` muestra los 10 recursos con `.map()`, una `TarjetaRecurso` por cada uno, usando `recurso.id` como `key`. Se quitó la vista previa de J3.
- `PaginaInventario.css`: grilla con `repeat(auto-fill, minmax(240px, 1fr))`. Muestra 4 columnas en computador y 1 en celular, sin reglas especiales (RNF-01).

**Archivos tocados:** `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `docs/avance.md`.

## 2026-10-03 — J5: filtro por nombre (Johann)

**HU trabajada:** HU-01 (en progreso). Rama: `feature/hu-01-listado-inventario`.

**Qué se hizo:**
- `PaginaInventario`: buscador por nombre con `useState` (input controlado con `value` + `onChange`). El contador muestra "Mostrando X de 10 recursos".
- `src/utils/inventario.ts`: se agregaron `prepararTextoParaBuscar()`, que pasa el texto a minúsculas y le quita las tildes, y `filtrarPorNombre()`. La búsqueda ignora mayúsculas y tildes: "termometro" encuentra "Termómetro digital".
- Se probó con texto vacío, solo espacios, sin tildes, en mayúsculas, con coincidencia parcial ("ard") y sin resultados.

**Archivos tocados:** `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/utils/inventario.ts`, `docs/avance.md`.

## 2026-10-03 — J6: filtros por categoría, laboratorio y estado (Johann)

**HU trabajada:** HU-01 (en progreso). Rama: `feature/hu-01-listado-inventario`.

**Qué se hizo:**
- Componente nuevo `src/components/FiltrosInventario.tsx` y `.css`. Reúne el buscador por nombre (antes estaba en la página) y tres `<select>`: categoría, laboratorio (B307, B308, C210) y estado. El componente no guarda los filtros: los recibe por props y avisa los cambios con funciones, igual que `MenuNavegacion`.
- `PaginaInventario`: un `useState` por filtro (4 en total).
- Archivo nuevo `src/utils/filtrosInventario.ts`. Se separó de `inventario.ts` para no pasar las ~150 líneas. Contiene:
  - `SIN_FILTRO`: la opción "Todos".
  - `prepararTextoParaBuscar()`: movida desde `inventario.ts`.
  - `obtenerCodigoLaboratorio()`: arma el código con torre + sala, ej: "B307".
  - `obtenerLaboratorios()`: lista los laboratorios sin repetir.
  - `filtrarRecursos()`: aplica los 4 filtros juntos. Reemplaza a `filtrarPorNombre()`.
- `src/utils/inventario.ts`: se agregó `listaCategoriasRecurso`.
- El filtro de estado muestra los recursos con al menos 1 unidad en ese estado. Ej: "Dañado" muestra el multímetro y los termómetros.
- Se probaron 10 combinaciones de filtros, incluida una sin resultados (reactivo en B307).

**Archivos tocados:** `src/components/FiltrosInventario.tsx`, `src/components/FiltrosInventario.css`, `src/utils/filtrosInventario.ts`, `src/utils/inventario.ts`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `docs/avance.md`.

## 2026-10-03 — J7: mensaje sin resultados y botón "Limpiar filtros" (Johann)

**HU trabajada:** HU-01 (cierre). Rama: `feature/hu-01-sin-resultados`. El resto de HU-01 ya se integró a `main` con el PR #7.

**Qué se hizo:**
- `PaginaInventario`: si ningún recurso cumple los filtros, en vez de la grilla vacía muestra el mensaje "No hay recursos que coincidan con los filtros" con un botón "Limpiar filtros". Para elegir qué mostrar se usa un `if/else` dentro de `mostrarResultados()`.
- Junto al contador "Mostrando X de 10" aparece un enlace "Limpiar filtros", solo si hay algún filtro activo (`condición && <elemento>`).
- `limpiarFiltros()` vuelve los 4 `useState` a su valor inicial.
- `src/utils/filtrosInventario.ts`: se agregó `hayFiltrosActivos()`.
- Se probó en el navegador: con reactivo + B307 aparece el mensaje (0 recursos), y al hacer clic en "Limpiar filtros" vuelven los 10 recursos y los 3 `<select>` vuelven a "Todos".

**Archivos tocados:** `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/utils/filtrosInventario.ts`, `docs/avance.md`.

## 2026-10-03 — J8: ficha del recurso (Johann)

**HU trabajada:** HU-02 (en progreso). Rama: `feature/hu-02-cambiar-estado`.

**Qué se hizo:**
- Componente nuevo `src/components/FichaRecurso.tsx` y `.css`. Muestra:
  - la ruta "← Inventario / Nombre";
  - la ubicación completa: torre, sala, bodega, mueble y código (RF-10);
  - los datos de la planilla, con "No registrado" si faltan;
  - el stock mínimo, solo si el recurso lo tiene;
  - una tabla con las unidades de los 5 estados y el total (RF-01).
- `TarjetaRecurso`: nueva prop `onSeleccionar(idRecurso)`. Toda la tarjeta se puede cliquear y se resalta al pasar el mouse.
- `PaginaInventario`: `useState<number | null>` guarda el id del recurso abierto (`null` = ninguno). Si hay uno, muestra la ficha en vez del listado. Al volver, los filtros se mantienen.
- Componente nuevo `src/components/MensajeSinResultados.tsx` y `.css`. Se separó de `PaginaInventario` para que la página no pasara las ~150 líneas.
- `src/utils/inventario.ts`: se agregó `textoCampoOpcional()`.
- `src/styles/global.css` (archivo compartido): se movieron ahí los colores de las etiquetas de estado (`.etiqueta-*`), porque ahora los usan `TarjetaRecurso` y `FichaRecurso`.
- Se probó en el navegador:
  - filtrar "Dañado" → abrir el multímetro → volver: el filtro sigue en "Dañado";
  - la mesa (sin datos opcionales) muestra "No registrado";
  - los guantes muestran su stock mínimo.

**Archivos tocados:** `src/components/FichaRecurso.tsx`, `src/components/FichaRecurso.css`, `src/components/MensajeSinResultados.tsx`, `src/components/MensajeSinResultados.css`, `src/components/TarjetaRecurso.tsx`, `src/components/TarjetaRecurso.css`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/utils/inventario.ts`, `src/styles/global.css`, `docs/avance.md`.

## 2026-10-03 — J9: formulario para cambiar el estado de un recurso (Johann)

**HU trabajada:** HU-02 (en progreso). Rama: `feature/hu-02-cambiar-estado`.

**Qué se hizo:**
- Componente nuevo `src/components/FormularioCambioEstado.tsx` y `.css`, a la derecha de la ficha como en el mockup. Campos: estado actual (muestra cuántas unidades hay en cada uno), nuevo estado, cantidad y motivo.
- Archivo nuevo `src/utils/cambioEstado.ts`:
  - `obtenerEstadoOrigenInicial()`: si el recurso no tiene unidades disponibles, parte en el primer estado que sí tenga.
  - `validarCambioEstado()`: estados distintos, cantidad entera mayor que 0, que no supere las unidades del estado de origen, y motivo obligatorio.
- `src/services/recursosService.ts`: nueva función `cambiarEstadoRecurso()`. Resta en el estado de origen y suma en el nuevo, y vuelve a revisar las unidades para que nunca queden números negativos.
- `FichaRecurso`: dos columnas (datos y formulario). Un `useState` contador la redibuja después de guardar, porque React no detecta solo que el servicio cambió los números.
- El formulario usa `noValidate` para que todos los errores salgan con nuestros mensajes en español.
- El motivo se pide y se valida, pero se guardará recién con el historial (HU-06, J11).
- Se probó en el navegador:
  - las 5 validaciones (mismo estado, cantidad 0, cantidad 2.5, 3 desde "Dañado" con solo 1 unidad, y sin motivo);
  - un cambio válido (1 multímetro de Disponible a Dañado): la tabla quedó 11 / 2 y la tarjeta y el filtro "Dañado" se actualizaron;
  - la campana parte con "En mantención" como estado inicial.

**Archivos tocados:** `src/components/FormularioCambioEstado.tsx`, `src/components/FormularioCambioEstado.css`, `src/components/FichaRecurso.tsx`, `src/components/FichaRecurso.css`, `src/utils/cambioEstado.ts`, `src/services/recursosService.ts`, `docs/avance.md`.

## 2026-10-03 — J10: alertas al momento, confirmaciones y cierre de HU-02 (Johann)

**HU trabajada:** HU-02 (cierre), integrada con HU-05 de Diego. Rama: `feature/hu-02-cambiar-estado`.

**Qué se hizo:**
- Se trajo `main` a la rama (merge sin conflictos) para tener el panel y el contador de alertas.
- `src/App.tsx` (archivo compartido):
  - nuevo `useState` `cambiosInventario` con su función `registrarCambioInventario()`, que se pasa a `PaginaInventario`;
  - al guardar un cambio de estado, el aviso sube formulario → ficha → página → App;
  - App se redibuja y recalcula las alertas, así que el contador del menú se actualiza sin cambiar de página.
- `FichaRecurso`: se quitó el contador local de J9. Ahora recibe `onEstadoCambiado` desde la página y se lo pasa al formulario.
- `FormularioCambioEstado`:
  - mensaje verde de confirmación, ej: "Cambio guardado: 1 unidad de Disponible → Dañado.";
  - antes de pasar unidades a "Dado de baja" pide confirmación con `window.confirm`.
- `src/utils/cambioEstado.ts`: nueva función `textoResumenCambio()`.
- Componente nuevo `src/components/GrillaRecursos.tsx` y `.css`: la grilla (o el mensaje vacío) sale de `PaginaInventario`, para que la página no pase las ~150 líneas.
- Se probó en el navegador:
  - soldador 1 Disponible → Dañado: el contador sube de 6 a 7 al momento y aparece el mensaje verde;
  - dar de baja con "Cancelar": no cambia nada;
  - dar de baja con "Aceptar": se guarda, el contador vuelve a 6 (una unidad dada de baja no necesita reparación) y el soldador ya no aparece en Alertas.
- Pendiente de decidir con el equipo: si una unidad "Dado de baja" puede volver a otro estado. Hoy se permite.

**Archivos tocados:** `src/App.tsx`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaInventario.css`, `src/components/GrillaRecursos.tsx`, `src/components/GrillaRecursos.css`, `src/components/FichaRecurso.tsx`, `src/components/FormularioCambioEstado.tsx`, `src/components/FormularioCambioEstado.css`, `src/utils/cambioEstado.ts`, `docs/avance.md`.

## 2026-10-03 — Resolución de conflictos de merge en PR de reservas (Copilot)

**HU trabajada:** HU-03 (mantenimiento del PR).

**Qué se hizo:**
- Se hizo merge de `main` en `rama-HU-07` para dejar el PR sin conflictos.
- Se resolvieron conflictos en `TablaReservas.tsx`, `TablaReservas.css` y `PaginaReservas.tsx`.
- Se mantuvo el orden cronológico de reservas, la resolución del nombre del recurso y la cancelación de reservas.
- Se validó con `npm run lint` y `npm run build`.

**Archivos tocados:** `src/components/TablaReservas.tsx`, `src/components/TablaReservas.css`, `src/pages/PaginaReservas.tsx`, `docs/avance.md`.

## 2026-10-03 — J11: registro del historial de cambios de estado (Johann)

**HU trabajada:** HU-06 (en progreso). Rama: `feature/hu-06-historial-estados`.

**Qué se hizo:**
- Tipo nuevo `src/types/CambioEstado.ts`: id, recurso, fecha, estado anterior, estado nuevo, cantidad, motivo y usuario.
- Datos de prueba nuevos `src/data/historialEstados.ts`: 3 registros (los 2 del multímetro del mockup y 1 de los termómetros), ordenados del más antiguo al más nuevo.
- Servicio nuevo `src/services/historialService.ts`:
  - `registrarCambioEstado()` pone sola la fecha (`obtenerFechaActual()` de Diego) y el usuario ('Encargado (usuario actual)', el mismo texto que usan las incidencias).
  - `obtenerHistorialDeRecurso()` devuelve los cambios de un recurso, del más reciente al más antiguo.
  - No hay funciones para borrar ni modificar registros (RNF-06).
- `recursosService.cambiarEstadoRecurso()` ahora recibe el motivo y registra el cambio en el historial. Así es imposible cambiar un estado sin que quede registrado. `FormularioCambioEstado` le pasa el motivo.
- Probado con un script: un cambio válido queda registrado primero con fecha y usuario; los cambios rechazados (99 unidades, un recurso que no existe) no dejan registro; los demás recursos no se ven afectados.
- El historial todavía no se ve en pantalla: la tabla se agrega en J12.

**Archivos tocados:** `src/types/CambioEstado.ts`, `src/data/historialEstados.ts`, `src/services/historialService.ts`, `src/services/recursosService.ts`, `src/components/FormularioCambioEstado.tsx`, `docs/avance.md`.

## 2026-10-03 — J12: tabla del historial de estados en la ficha (Johann)

**HU trabajada:** HU-06 (cierre). Rama: `feature/hu-06-historial-estados`.

**Qué se hizo:**
- Componente nuevo `src/components/TablaHistorial.tsx` y `.css`, con las columnas Fecha | Cambio | Motivo | Usuario, como en el mockup más el motivo. El cambio se muestra con las etiquetas de color de los estados. Si no hay cambios, muestra un aviso. En celular la tabla se desliza hacia el lado.
- `FichaRecurso`: nueva columna izquierda con los datos y, debajo, el historial (`obtenerHistorialDeRecurso()`). Como App redibuja todo al guardar, el cambio nuevo aparece arriba al instante.
- Corrección en `FormularioCambioEstado` (HU-02): si el estado de origen queda sin unidades después de guardar (ej: "Dañado (0)"), el formulario elige solo otro estado que tenga unidades.
- Se probó en el navegador:
  - el multímetro muestra sus 2 cambios del mockup;
  - al guardar uno nuevo aparece primero;
  - un error no agrega filas;
  - el soldador muestra el aviso de historial vacío;
  - al salir y volver a la ficha, el historial se mantiene.

**Archivos tocados:** `src/components/TablaHistorial.tsx`, `src/components/TablaHistorial.css`, `src/components/FichaRecurso.tsx`, `src/components/FichaRecurso.css`, `src/components/FormularioCambioEstado.tsx`, `docs/avance.md`.

## 2026-10-03 — J13: generar y validar el código de ubicación (Johann)

**HU trabajada:** HU-11. Rama: `feature/hu-11-ubicacion`, creada desde `feature/hu-06-historial-estados` porque ese PR aún no estaba en `main` y las dos tocan `FichaRecurso`.

**Qué se hizo:**
- Archivo nuevo `src/utils/ubicacion.ts`:
  - `generarCodigoUbicacion()` sigue la regla torre + sala - bodega - mueble ("B307-B1-M2"). Los recursos en la sala misma quedan como "B308-SALA". Usa `abreviarBodega()` y `abreviarMueble()`.
  - `validarUbicacion()` devuelve la lista de problemas: sala que no es un número, bodega o mueble vacíos, o un código que no coincide con la ubicación.
- Componente nuevo `src/components/AvisoUbicacion.tsx` y `.css`: un recuadro amarillo en la ficha, debajo de la ubicación, que aparece solo si hay problemas (devuelve `null` si está todo bien). Servirá para detectar errores al migrar la planilla Excel.
- Se mantuvo el campo `codigo` en los datos porque lo usan Reservas (Martín) y Alertas (Diego).
- Se probó:
  - el código generado coincide con el de los 10 recursos de prueba;
  - se detectan código mal escrito, sala vacía, sala con letras, y bodega y mueble vacíos;
  - los espacios extra no cuentan como error;
  - con un código roto a propósito (y luego restaurado), el aviso aparece en la ficha del multímetro y no en la de los demás.

**Archivos tocados:** `src/utils/ubicacion.ts`, `src/components/AvisoUbicacion.tsx`, `src/components/AvisoUbicacion.css`, `src/components/FichaRecurso.tsx`, `docs/avance.md`.

## 2026-10-04 — Inicio de sesión con Firebase (Johann)

**Trabajado:** inicio de sesión con roles (sección 3.4 de requerimientos), base para RNF-03. No tiene HU propia. Rama: `feature/login-roles`.

**Qué se hizo:**
- Se instaló el paquete `firebase` (v12) y se creó el proyecto `ucen-gestiondelaboratorio` en Firebase, con el inicio de sesión por correo y contraseña activado.
- `src/services/firebase.ts`: conecta la app con el proyecto. La configuración queda en el repo porque no es secreta (identifica el proyecto, no da permisos), así nadie del equipo tiene que configurar nada.
- `src/types/Usuario.ts`: `Usuario` (correo, nombre, rol) y `RolUsuario` ('encargado' | 'docente' | 'departamento').
- `src/data/usuarios.ts`: tres usuarios de prueba, uno por rol. Firebase revisa la contraseña; el rol se saca de esta lista. Cada correo de la lista también debe estar creado en Firebase (Authentication > Usuarios).
- `src/services/authService.ts`: `iniciarSesion()` (devuelve '' o el error en español), `cerrarSesion()` y `escucharSesion()`. Si una cuenta de Firebase no está en la lista, no puede entrar.
- `src/pages/PaginaLogin.tsx/.css`: formulario de correo y contraseña. El botón se desactiva mientras Firebase responde.
- `App.tsx`: sin sesión muestra el login. Un `useEffect` escucha a Firebase, así la sesión se mantiene al recargar la página. Mientras revisa, muestra "Cargando...".
- `MenuNavegacion`: muestra el nombre y el rol del usuario y el botón "Cerrar sesión".
- Se probó en el navegador: contraseña mala, login con los tres roles, recargar sin perder la sesión y cerrar sesión.

**Pendiente:** ocultar acciones según el rol (RNF-03) y cambiar el texto fijo "Encargado (usuario actual)" de incidencias e historial por el usuario real.

**Archivos tocados:** `package.json`, `package-lock.json`, `src/services/firebase.ts`, `src/services/authService.ts`, `src/types/Usuario.ts`, `src/data/usuarios.ts`, `src/pages/PaginaLogin.tsx`, `src/pages/PaginaLogin.css`, `src/App.tsx`, `src/components/MenuNavegacion.tsx`, `src/components/MenuNavegacion.css`, `docs/avance.md`.

## 2026-10-04 — J15: funciones de permisos por rol (Johann)

**Trabajado:** RNF-03 (fase 2, ver `docs/plan-fase-2.md`). Rama: `feature/rnf-03-permisos-rol`.

**Qué se hizo:**
- Archivo nuevo `src/utils/permisos.ts`: la tabla de permisos de la sección 1 del plan, pasada a funciones con `if/else`:
  - `puedeVerPagina(rol, pagina)`: el docente no ve Incidencias ni Alertas.
  - `puedeCambiarEstado(rol)`: solo el encargado.
  - `puedeReservar(rol)`: el docente y el encargado.
  - `puedeVerTodasLasReservas(rol)`: todos menos el docente, que verá solo las suyas.
  - `puedeCancelarReserva(rol, esReservaPropia)`: el encargado cualquiera, el docente solo las suyas y el departamento ninguna.
  - `puedeGestionarIncidencias(rol)`: solo el encargado registra y avanza incidencias.
- Se probó con un script que llama a cada función con los tres roles: los resultados coinciden con la tabla del plan.
- Todavía no cambia nada en pantalla: las funciones se empiezan a usar en J16 (menú) y J17 a J19 (páginas).

**Archivos tocados:** `src/utils/permisos.ts`, `docs/avance.md`.

## 2026-10-04 — J16: menú según el rol (Johann)

**Trabajado:** RNF-03 (fase 2). Rama: `feature/rnf-03-permisos-rol` (PR #19).

**Qué se hizo:**
- `MenuNavegacion.tsx`: cada botón del menú se dibuja solo si `puedeVerPagina(rol, pagina)` lo permite. Se aplicó a los cuatro botones, así un cambio de permisos se hace solo en `utils/permisos.ts`.
- `App.tsx`: protección extra. Si la página actual no está permitida para el rol, se muestra el inventario.
- Se probó en el navegador: el docente ve solo Inventario y Reservas; el encargado y el departamento ven las cuatro páginas.
- Nota: al principio el docente seguía viendo Incidencias y Alertas porque el `main` local estaba atrasado. Después de cada PR integrado hay que hacer **Pull** en GitHub Desktop.

**Archivos tocados:** `src/App.tsx`, `src/components/MenuNavegacion.tsx`, `docs/avance.md`.

## 2026-10-04 — J18: reservas según el rol (Johann)

**Trabajado:** RNF-03 (fase 2). Rama: `feature/rnf-03-reservas`.

**Qué se hizo:**
- `utils/permisos.ts`: permiso nuevo `puedeReservarAOtroDocente(rol)`, que solo devuelve true para el encargado.
- `FormularioReserva.tsx` (archivo de Martín, avisado):
  - El campo "Docente" ya no tiene "Prof. Martín Zepeda" fijo.
  - El docente reserva siempre a su nombre: el campo sale bloqueado con el nombre del usuario conectado.
  - El encargado puede escribir el nombre del profesor; el campo parte vacío y es obligatorio.
- `PaginaReservas.tsx`: recibe el usuario. Si el rol no puede reservar (departamento), muestra un aviso en vez del formulario.
- `App.tsx`: le pasa el usuario a `PaginaReservas`.
- Se probó en el navegador:
  - el docente reserva con su nombre bloqueado;
  - el encargado recibe un error si deja el docente vacío, y la reserva se guarda al escribirlo;
  - el departamento ve el aviso y la tabla, sin formulario.

**Pendiente (J21):** el botón "Cancelar" de la tabla todavía lo ven todos los roles.

**Archivos tocados:** `src/utils/permisos.ts`, `src/components/FormularioReserva.tsx`, `src/pages/PaginaReservas.tsx`, `src/App.tsx`, `docs/avance.md`.
