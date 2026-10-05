# 2026-10-03 — M9 y M10: validación de stock disponible y bloqueo de reservas (Martín)

**HU trabajada:** HU-08 (validar disponibilidad al reservar) y RF-03. Rama: `rama-HU-07` (PR #9 / PR #14).

**Qué se hizo:**
- `src/utils/disponibilidad.ts` (M9): función `validarDisponibilidadReserva(...)`. Comprueba si la cantidad requerida excede las unidades libres en ese tramo horario y genera mensajes de error detallados (ej: `"No se puede reservar: solicitó X unidad(es), pero solo quedan Y disponible(s) en ese horario."` o si no quedan unidades). Se integró como paso de validación previo a `agregarReserva()`.
- `src/components/FormularioReserva.tsx/.css` (M10): bloqueo reactivo del botón de confirmación (`.boton-confirmar`). Si `unidadesDisponibles === 0` o la cantidad solicitada supera las unidades disponibles, el botón recibe el atributo `disabled={bloqueoPorDisponibilidad}`, cambia su texto a `"Sin disponibilidad suficiente"` y adopta estilos grises inactivos (`cursor: not-allowed`).

**Decisiones y pruebas:**
- Se probó el caso de prueba real de la exposición: los Termómetros digitales (recurso ID 3, con 8 unidades disponibles en stock) tienen una reserva de prueba el `2026-10-09` de `08:30` a `10:00` por 8 unidades. Al seleccionar ese mismo recurso, fecha y rango en el formulario, el sistema muestra el aviso rojo de 0 unidades, desactiva el botón y previene el registro duplicado (el problema exacto reportado por los docentes). Al cambiar a un horario posterior (ej: 10:30 a 12:00), el botón se reactiva inmediatamente.

**Archivos tocados:** `src/utils/disponibilidad.ts`, `src/components/FormularioReserva.tsx`, `src/components/FormularioReserva.css`.
