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
