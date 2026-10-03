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
