# 2026-10-03 — M11 a M13: listado cronológico de reservas, cancelación y diseño móvil (Martín)

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
