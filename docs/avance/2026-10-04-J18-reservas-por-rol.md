# 2026-10-04 — J18: reservas según el rol (Johann)

**Trabajado:** RNF-03 (fase 2). Rama: `feature/rnf-03-reservas`.

**Qué se hizo:**
- `utils/permisos.ts`: permiso nuevo `puedeReservarAOtroDocente(rol)`, que solo devuelve true para el encargado.
- `FormularioReserva.tsx` (archivo de Martín, avisado):
  - El campo "Docente" ya no tiene "Prof. Martín Zepeda" fijo.
  - El docente reserva siempre a su nombre: el campo sale bloqueado con el nombre del usuario conectado.
  - El encargado puede escribir el nombre del profesor; el campo parte vacío y es obligatorio.
- `PaginaReservas.tsx`: recibe el usuario. Si el rol no puede reservar (departamento), muestra un aviso en vez del formulario.
- `App.tsx`: le pasa el usuario a `PaginaReservas`.
- Se probó en el navegador:
  - el docente reserva con su nombre bloqueado;
  - el encargado recibe un error si deja el docente vacío, y la reserva se guarda al escribirlo;
  - el departamento ve el aviso y la tabla, sin formulario.

**Pendiente (J21):** el botón "Cancelar" de la tabla todavía lo ven todos los roles.

**Archivos tocados:** `src/utils/permisos.ts`, `src/components/FormularioReserva.tsx`, `src/pages/PaginaReservas.tsx`, `src/App.tsx`, `docs/avance.md`.
