# 2026-10-04 — J21: el docente ve y cancela solo sus propias reservas (Johann)

**Trabajado:** RF-03 y RNF-03 (fase 2). Rama: `feature/mis-reservas-docente`. El commit de código quedó con el título "reservas".

**Qué se hizo:**
- `reservasService.ts`: función nueva `obtenerReservasVisibles(usuario)`. Al encargado y al departamento les devuelve todas las reservas. Al docente, solo las que están a su nombre: recorre la lista con un `for` y un `if`.
- `TablaReservas.tsx` (archivo de Martín, avisado):
  - usa `obtenerReservasVisibles()`;
  - con el docente, el título dice "Mis reservas" y, si no tiene ninguna, aparece "No tienes reservas registradas.";
  - el botón "Cancelar" aparece solo donde `puedeCancelarReserva(rol, esReservaPropia)` lo permite;
  - el departamento no ve la columna "Acción", igual que en incidencias (J19).
- `PaginaReservas.tsx`: el contador usa la misma función que la tabla, así los dos muestran el mismo número. Con el docente dice "Mis reservas: N".
- El cálculo de disponibilidad (HU-07, HU-08) sigue usando **todas** las reservas: aunque el docente no vea las de otros, esas unidades siguen ocupadas.
- Se probó en el navegador:
  - el docente parte sin reservas, crea una, la ve con su botón "Cancelar" y la cancela;
  - el encargado ve y cancela todas;
  - el departamento ve todas, sin la columna "Acción".

**Archivos tocados:** `src/services/reservasService.ts`, `src/components/TablaReservas.tsx`, `src/pages/PaginaReservas.tsx`, `docs/avance/2026-10-04-J21-mis-reservas.md`.
