# 2026-10-12 — React Router, useContext y arreglos para la EVA1 (Johann)

**Trabajado:** requisitos de la rúbrica de la EVA1 ("Múltiples rutas, usando React Router" y "useContext, y hooks personalizados"), más dos errores encontrados en las pruebas (HU-03 y HU-04). Rama: `feature/react-router-contexto`.

**Por qué:**
- Antes la app cambiaba de pantalla con un `useState` (`paginaActual`), sin rutas.
- El usuario conectado se pasaba como prop por 3 o 4 niveles de componentes.
- La rúbrica pide React Router y `useContext`, así que se actualizó CLAUDE.md para permitirlos.

**Qué se hizo:**

- **React Router** (`react-router-dom` 7):
  - `main.tsx` envuelve la app en `<BrowserRouter>`.
  - `App.tsx` usa `<Routes>`. Sin sesión, la única ruta es `/login`. Con sesión, las rutas son `/inventario`, `/reservas`, `/incidencias` y `/alertas`, y cualquier otra URL lleva a `/inventario`.
  - Las páginas que el rol no puede ver redirigen al inventario aunque se escriba la URL a mano (`paginaSiPuede`, RNF-03).
  - `PaginaInventario.tsx` tiene rutas propias: `/inventario` (el listado), `/inventario/nuevo` (agregar recurso, solo el encargado) y `/inventario/:idRecurso` (la ficha).
  - Los filtros se conservan al volver de una ficha, porque la página sigue montada.
  - `components/FichaSegunRuta.tsx` (nuevo): lee el id con `useParams` y muestra la ficha. Si el id no existe, vuelve al listado.
  - `MenuNavegacion.tsx`: los botones ahora son `NavLink`, que marcan solos la página activa. Ya no recibe `paginaActual` ni `onCambiarPagina`.
  - Se eliminó el truco de la `key` (`vecesMenuInventario`): el enlace "Inventario" lleva a `/inventario` y eso ya muestra el listado.
  - `MenuNavegacion.css`: `text-decoration: none`, porque ahora son enlaces.
- **useContext + hook personalizado**:
  - `context/ContextoUsuario.ts` (carpeta nueva) tiene `ContextoUsuario` (con `createContext`) y el hook `useUsuario()`.
  - `App.tsx` publica el usuario con `ContextoUsuario.Provider`.
  - Estos 12 componentes dejaron de recibir la prop `usuario` y la leen con `useUsuario()`: `MenuNavegacion`, `PaginaInventario`, `FichaRecurso`, `FormularioCambioEstado`, `FormularioReponerStock`, `FormularioNuevoRecurso`, `PaginaReservas`, `FormularioReserva`, `TablaReservas`, `PaginaIncidencias`, `FormularioIncidencia` y `TablaIncidencias`.
- **Arreglos**:
  - `FormularioIncidencia.tsx` (HU-04): si se marca "¿Hubo personas afectadas?", el detalle es obligatorio.
  - `utils/disponibilidad.ts` (HU-03): no se puede reservar en una fecha anterior a hoy. Se agregó `obtenerFechaHoy()` en `utils/fechas.ts`.
- **CLAUDE.md**: ahora permite React Router y `useContext` (solo para el usuario conectado), y agrega `src/context/` a la estructura de carpetas.

**Pruebas (Chrome, las tres cuentas de prueba):**
- **Sin sesión:** `/` y `/alertas` llevan a `/login`. Al entrar se llega a `/inventario`, y "Cerrar sesión" vuelve a `/login`.
- **Encargado:**
  - Clic en una tarjeta → `/inventario/1` con la ficha. El enlace "Inventario" sigue marcado.
  - El botón "Atrás" del navegador vuelve al listado con el filtro "Instrumento" conservado.
  - "Inventario" en el menú, desde la ficha, vuelve al listado.
  - Abrir `/inventario/6` directo (recargando) muestra la ficha del termómetro. `/inventario/999` vuelve al listado.
  - `/inventario/nuevo` muestra el formulario; "Cancelar" vuelve, y "+ Agregar recurso" lleva ahí.
  - Una reserva con fecha 2026-10-01 da "La fecha de la reserva no puede ser anterior a hoy." y no se guarda.
  - Una incidencia con afectados y sin detalle da "Debe describir cómo fueron afectadas las personas." y no se guarda.
- **Docente:** el menú muestra solo Inventario y Reservas. `/alertas`, `/incidencias` e `/inventario/nuevo` escritas a mano llevan a `/inventario`. El campo "Docente" sale bloqueado con su nombre (viene del contexto).
- **Departamento:** ve todo, sin formularios ni botones de acción.
- **Celular (390 px):** el menú queda en fila y no hay desplazamiento hacia el lado.
- **Revisión:** `npm run build` y `npm run lint` sin errores, y la consola sin errores.

**Ojo:** quien baje esta rama tiene que correr `npm install` (hay una librería nueva). `App.tsx` (167 líneas) y `PaginaInventario.tsx` (182) pasan de ~150 líneas, casi todo por comentarios.

**Archivos tocados:** `package.json`, `package-lock.json`, `CLAUDE.md`, `src/main.tsx`, `src/App.tsx`, `src/context/ContextoUsuario.ts`, `src/components/FichaSegunRuta.tsx`, `src/components/MenuNavegacion.tsx`, `src/components/MenuNavegacion.css`, `src/pages/PaginaInventario.tsx`, `src/pages/PaginaReservas.tsx`, `src/pages/PaginaIncidencias.tsx`, `src/components/FichaRecurso.tsx`, `src/components/FormularioCambioEstado.tsx`, `src/components/FormularioReponerStock.tsx`, `src/components/FormularioNuevoRecurso.tsx`, `src/components/FormularioReserva.tsx`, `src/components/TablaReservas.tsx`, `src/components/FormularioIncidencia.tsx`, `src/components/TablaIncidencias.tsx`, `src/utils/disponibilidad.ts`, `src/utils/fechas.ts`, `docs/avance/2026-10-12-react-router-y-contexto.md`.
