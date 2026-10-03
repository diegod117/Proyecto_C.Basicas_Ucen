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
