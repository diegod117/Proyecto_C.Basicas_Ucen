// Reserva.ts
// Define cómo es una reserva que hace un docente sobre un recurso.
// Cubre: RF-03, HU-03 (formulario de reserva), y sirve de base para
//        HU-07 (calcular disponibilidad por horario) y HU-08 (evitar choques)

// ------------------------------------------------------------------
// Reserva
// ------------------------------------------------------------------
// Una reserva dice: "este docente usará X unidades de este recurso,
// tal día, entre tal hora y tal hora".
// Con la lista de reservas podremos calcular cuántas unidades quedan
// libres en un horario (HU-07) y bloquear reservas que se pasen (HU-08).
export interface Reserva {
  id: number;

  // En vez de copiar todo el recurso dentro de la reserva,
  // guardamos solo su "id". Así, si el recurso cambia de nombre o ubicación,
  // la reserva sigue apuntando al recurso correcto.
  recursoId: number;

  // Por ahora es el nombre del docente. Cuando exista el inicio de sesión
  // con roles (pendiente en el punto 3.4 de los requerimientos) podría cambiar.
  docente: string;

  // Fechas y horas como texto (string) porque así las entregan los
  // <input type="date"> y <input type="time"> del navegador.
  fecha: string; // formato "AAAA-MM-DD", ej: "2026-10-08"
  horaInicio: string; // formato "HH:MM", ej: "10:00"
  horaFin: string; // formato "HH:MM", ej: "11:30"

  cantidad: number; // cuántas unidades se reservan
  asignatura: string; // ej: "Física I"
  sala: string; // ej: "B302"
}
