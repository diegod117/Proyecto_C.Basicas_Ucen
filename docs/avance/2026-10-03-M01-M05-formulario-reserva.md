# 2026-10-03 — M1 a M5: servicio y formulario de reserva con fecha y horario (Martín)

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
