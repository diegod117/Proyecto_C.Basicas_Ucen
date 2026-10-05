# 2026-10-03 — M6 a M8: cruces de horario y cálculo de disponibilidad en tiempo real (Martín)

**HU trabajada:** HU-07 (disponibilidad por horario) y RF-03. Rama: `rama-HU-07` (PR #9).

**Qué se hizo:**
- `src/utils/disponibilidad.ts` (M6): implementación de `seCruzanHorarios(fechaA, inicioA, finA, fechaB, inicioB, finB)`. Comprueba si dos reservas coinciden en la misma fecha y si sus intervalos de horas se solapan, evaluando que no termine una antes de que inicie la otra (`finA <= inicioB || finB <= inicioA`).
- `src/utils/disponibilidad.ts` (M7): función `calcularUnidadesDisponibles(recursoId, fecha, horaInicio, horaFin)`. Obtiene el stock físico disponible del recurso mediante `obtenerRecursoPorId()`, recorre las reservas existentes y descuenta las cantidades de aquellas que coincidan en horario. Retorna `Math.max(0, unidadesLibres)` para asegurar que nunca se calculen números negativos.
- `src/components/FormularioReserva.tsx/.css` (M8): cálculo reactivo de disponibilidad en tiempo real. Tan pronto como el usuario selecciona el recurso, la fecha y un horario coherente, el formulario evalúa las unidades libres y despliega un recuadro informativo interactivo:
  - Verde (`.hay-unidades`): `"✔ Disponibles en este horario: X unidad(es)"`.
  - Rojo (`.sin-unidades`): `"✖ Sin unidades disponibles en este horario (todas reservadas)"`.

**Decisiones y pruebas:**
- La comparación de horas se realiza directamente con texto en formato `HH:MM`, lo cual es seguro y exacto bajo la codificación de 24 horas (ej. "08:30" < "10:00").
- Se probó en el navegador: al modificar la fecha o cambiar la hora de inicio/fin, el aviso de disponibilidad se recalcula al instante sin necesidad de apretar ningún botón ni recargar.

**Archivos tocados:** `src/utils/disponibilidad.ts`, `src/components/FormularioReserva.tsx`, `src/components/FormularioReserva.css`.
