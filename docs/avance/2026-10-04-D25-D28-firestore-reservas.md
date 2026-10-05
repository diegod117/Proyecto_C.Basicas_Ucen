# Registro de avance: Conexión de reservas con Firestore (D25 a D28)

**Módulo:** Reservas
**Responsable:** Diego Cortés

## Qué se hizo
- **D25:** Se implementó `cargarReservas()` para descargar la lista desde la colección `reservas` de Firestore al iniciar sesión, subiendo los datos de prueba (`data/reservas.ts`) si la colección estaba vacía.
- **D26:** Se adaptó `agregarReserva()` a `async` usando `setDoc()`. El `FormularioReserva.tsx` se modificó para usar `await`, mostrar "Guardando..." en el botón y evitar bloqueos si se pierde la conexión.
- **D27:** Se implementó `deleteDoc()` en `cancelarReserva()` y en la `TablaReservas.tsx` para eliminar reservas desde la base de datos de forma permanente.

## Prueba de persistencia (HU-08 / RNF-06)
Se comprobó que los datos se mantienen intactos después de cerrar o recargar el navegador:
1. Se registró una reserva nueva (ej. termómetros el día 09/10 a las 08:30).
2. Se recargó la página (F5).
3. Se verificó que la reserva **seguía en la tabla** y que el formulario **seguía bloqueando** la disponibilidad para ese horario de los termómetros.
4. Se canceló dicha reserva, se recargó la página y se verificó que el horario volvía a estar disponible.

## Siguientes pasos
- Integrar la rama `feature/firestore-reservas` a `main`.
- Realizar el Cierre de la fase 3 (probar con dos navegadores al mismo tiempo junto a Johann).
