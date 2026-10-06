# 2026-10-06 — Arreglo: campos del formulario de reservas (Johann)

**Trabajado:** diseño del formulario "Nueva reserva" (HU-03). Solo estilos (CSS). Rama: `main`.

**Problema:** en "Reservas de Laboratorio", los campos de la derecha ("Docente" y "Sala") se salían de la tarjeta blanca, y los campos no quedaban alineados entre filas.

**Causa:** cada fila (`.grupo-campos`) es un `display: flex`. Por defecto, flex no deja que un campo sea más angosto que su contenido. El `<select>` de recurso mide lo que mide el nombre de recurso más largo, y los `<input>` tienen un ancho mínimo propio del navegador, así que empujaban a los demás hacia afuera.

**Qué se hizo** (`components/FormularioReserva.css`):
- `.campo { min-width: 0; }`: deja que cada campo se achique para caber en su fila.
- `.campo input, .campo select { width: 100%; }`: cada campo ocupa todo el ancho de su columna, así quedan alineados con los de las otras filas.

**Pruebas (Chrome, cuenta `encargado@prueba.cl`):**
- A 1280px y 900px de ancho, ningún campo se sale de la tarjeta. Recurso/Docente y Hora inicio/Hora fin quedan en dos columnas iguales, y Cantidad/Asignatura/Sala en tres.
- En celular (390px), los campos van uno debajo del otro, a todo el ancho, y la página no se desplaza hacia el lado.
- `npm run build` y `npm run lint` sin errores. Sin errores en la consola.

**Archivos tocados:** `src/components/FormularioReserva.css`, `docs/avance/2026-10-06-fix-campos-formulario-reserva.md`.
