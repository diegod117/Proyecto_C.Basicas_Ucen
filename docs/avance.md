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

## 2026-10-03 — M1 a M5: servicio y formulario de reserva con fecha y horario (Martín)

**HU trabajada:** HU-03 (solicitar reserva de recursos) y RF-03. Rama: `rama-martin` (PR #5).

**Qué se hizo:**
- `src/services/reservasService.ts` (M1): creación del servicio de reservas en memoria utilizando `[...listaReservasPrueba]` para no mutar el archivo original. Se implementaron las funciones `obtenerReservas()` y `agregarReserva()`, generando automáticamente el siguiente `id` correlativo mediante un recorrido con `for` sobre el arreglo (`idMayor + 1`).
- `src/components/FormularioReserva.tsx/.css` (M2, M3): creación del formulario controlado con `useState` para fecha (`type="date"`), hora de inicio y fin (`type="time"`). Incorporación del selector `<select>` poblado dinámicamente con `obtenerRecursos()` de `recursosService` mostrando el nombre del recurso y su código de ubicación, junto con los campos de docente, cantidad numérica (`min="1"`), asignatura y sala de destino.
- `src/utils/disponibilidad.ts` (M4): función `validarCamposReserva(...)` que centraliza la validación de los datos. Comprueba campos obligatorios, cantidad mínima positiva y verifica la coherencia horaria (rechaza solicitudes donde `horaFin <= horaInicio`).
- `src/pages/PaginaReservas.tsx/.css` y `FormularioReserva.tsx` (M5): captura del evento `onSubmit` con `preventDefault()`, ejecución de validaciones y almacenamiento con `agregarReserva()`. Despliegue de avisos visuales de error (`.mensaje-error`) o confirmación (`.mensaje-exito`), limpieza automática de campos al guardar y notificación a la página para actualizar el contador de reservas registradas.

**Decisiones y pruebas:**
- Las páginas nunca acceden directo a `src/data/reservas.ts`: todo pasa por `reservasService` para que el desacople facilite integrar una base de datos o API en el futuro.
- Se probó en el navegador: validación ante campos incompletos, detección de horario invertido (ej: inicio 11:00 y fin 09:00), y guardado exitoso de una reserva que aparece reflejada en el contador superior.

**Archivos tocados:** `src/services/reservasService.ts`, `src/utils/disponibilidad.ts`, `src/components/FormularioReserva.tsx`, `src/components/FormularioReserva.css`, `src/pages/PaginaReservas.tsx`, `src/pages/PaginaReservas.css`.

## 2026-10-03 — M6 a M8: cruces de horario y cálculo de disponibilidad en tiempo real (Martín)

**HU trabajada:** HU-07 (disponibilidad por horario) y RF-03. Rama: `rama-HU-07` (PR #9).

**Qué se hizo:**
- `src/utils/disponibilidad.ts` (M6): implementación de `seCruzanHorarios(fechaA, inicioA, finA, fechaB, inicioB, finB)`. Comprueba si dos reservas coinciden en la misma fecha y si sus intervalos de horas se solapan, evaluando que no termine una antes de que inicie la otra (`finA <= inicioB || finB <= inicioA`).
- `src/utils/disponibilidad.ts` (M7): función `calcularUnidadesDisponibles(recursoId, fecha, horaInicio, horaFin)`. Obtiene el stock físico disponible del recurso mediante `obtenerRecursoPorId()`, recorre las reservas existentes y descuenta las cantidades de aquellas que coincidan en horario. Retorna `Math.max(0, unidadesLibres)` para asegurar que nunca se calculen números negativos.
- `src/components/FormularioReserva.tsx/.css` (M8): cálculo reactivo de disponibilidad en tiempo real. Tan pronto como el usuario selecciona el recurso, la fecha y un horario coherente, el formulario evalúa las unidades libres y despliega un recuadro informativo interactivo:
  - Verde (`.hay-unidades`): `"✔ Disponibles en este horario: X unidad(es)"`.
  - Rojo (`.sin-unidades`): `"✖ Sin unidades disponibles en este horario (todas reservadas)"`.

**Decisiones y pruebas:**
- La comparación de horas se realiza directamente con texto en formato `HH:MM`, lo cual es seguro y exacto bajo la codificación de 24 horas (ej. "08:30" < "10:00").
- Se probó en el navegador: al modificar la fecha o cambiar la hora de inicio/fin, el aviso de disponibilidad se recalcula al instante sin necesidad de apretar ningún botón ni recargar.

**Archivos tocados:** `src/utils/disponibilidad.ts`, `src/components/FormularioReserva.tsx`, `src/components/FormularioReserva.css`.

## 2026-10-03 — M9 y M10: validación de stock disponible y bloqueo de reservas (Martín)

**HU trabajada:** HU-08 (validar disponibilidad al reservar) y RF-03. Rama: `rama-HU-07` (PR #9 / PR #14).

**Qué se hizo:**
- `src/utils/disponibilidad.ts` (M9): función `validarDisponibilidadReserva(...)`. Comprueba si la cantidad requerida excede las unidades libres en ese tramo horario y genera mensajes de error detallados (ej: `"No se puede reservar: solicitó X unidad(es), pero solo quedan Y disponible(s) en ese horario."` o si no quedan unidades). Se integró como paso de validación previo a `agregarReserva()`.
- `src/components/FormularioReserva.tsx/.css` (M10): bloqueo reactivo del botón de confirmación (`.boton-confirmar`). Si `unidadesDisponibles === 0` o la cantidad solicitada supera las unidades disponibles, el botón recibe el atributo `disabled={bloqueoPorDisponibilidad}`, cambia su texto a `"Sin disponibilidad suficiente"` y adopta estilos grises inactivos (`cursor: not-allowed`).

**Decisiones y pruebas:**
- Se probó el caso de prueba real de la exposición: los Termómetros digitales (recurso ID 3, con 8 unidades disponibles en stock) tienen una reserva de prueba el `2026-10-09` de `08:30` a `10:00` por 8 unidades. Al seleccionar ese mismo recurso, fecha y rango en el formulario, el sistema muestra el aviso rojo de 0 unidades, desactiva el botón y previene el registro duplicado (el problema exacto reportado por los docentes). Al cambiar a un horario posterior (ej: 10:30 a 12:00), el botón se reactiva inmediatamente.

**Archivos tocados:** `src/utils/disponibilidad.ts`, `src/components/FormularioReserva.tsx`, `src/components/FormularioReserva.css`.

## 2026-10-03 — M11 a M13: listado cronológico de reservas, cancelación y diseño móvil (Martín)

**HU trabajada:** RF-03 (gestión de reservas / "Mis reservas") y RNF-01 (diseño responsivo para móviles). Ramas: `martin-rf-03` y `martin-RNF-01` (PR #12 / PR #15).

**Qué se hizo:**
- `src/components/TablaReservas.tsx/.css` (M11): componente de tabla que muestra el listado de reservas programadas. Implementa ordenamiento cronológico con `.sort()` evaluando fecha y hora de inicio (`a.fecha` vs `b.fecha`, y `a.horaInicio` vs `b.horaInicio`). Resuelve el nombre del recurso y su código de ubicación usando `obtenerRecursoPorId()`. Si la lista queda vacía, presenta el aviso `"No hay reservas registradas en este momento."`.
- `src/services/reservasService.ts` y `TablaReservas.tsx` (M12): incorporación de la función `cancelarReserva(id)` que localiza el índice de la reserva y la elimina del arreglo en memoria con `.splice(i, 1)`. En la tabla se añadió el botón `"Cancelar"` (`.boton-cancelar-reserva`) que solicita confirmación explícita mediante `window.confirm()` mostrando los datos de la reserva antes de proceder, refrescando la vista y notificando a `PaginaReservas` mediante `onReservaModificada`.
- `src/components/FormularioReserva.css`, `TablaReservas.css` y `PaginaReservas.css` (M13): adaptación para dispositivos móviles según RNF-01:
  - En `@media (max-width: 768px)`, los campos del formulario se apilan en columna (`flex-direction: column`) para facilitar la interacción táctil.
  - Se fijó el tamaño de fuente de inputs y selectores en `16px` para evitar el molesto zoom automático que ejecutan los navegadores de celulares.
  - La tabla se encapsuló en un contenedor `.tabla-scroll` con `overflow-x: auto; -webkit-overflow-scrolling: touch;` y ancho mínimo de 620px, permitiendo desplazamiento horizontal fluido sin desarmar la pantalla.
  - Botones y controles ampliados con áreas de pulsación táctil optimizadas.

**Decisiones y pruebas:**
- Se comprobó la reactividad cruzada: al crear una reserva desde el formulario, aparece inmediatamente en la tabla en su orden cronológico correspondiente. Al cancelar una reserva, se actualiza la tabla, el contador de la página disminuye y ese cupo queda liberado al momento en el cálculo de disponibilidad horaria del formulario.
- Se probó la interfaz en vista móvil (resoluciones de 375px y 412px): el formulario se manipula con comodidad con una mano y la tabla se desplaza horizontalmente sin desbordes.

**Archivos tocados:** `src/services/reservasService.ts`, `src/components/TablaReservas.tsx`, `src/components/TablaReservas.css`, `src/components/FormularioReserva.css`, `src/pages/PaginaReservas.tsx`, `src/pages/PaginaReservas.css`, `docs/avance.md`.

