// Reserva.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el molde de una RESERVA: cuando un profesor aparta recursos para su clase.
// Es como reservar una mesa en un restaurante: quién, qué día, a qué hora
// y para cuántos.
// En la guía: paso 2 (TypeScript) y paso 8 (reservas).
// Cubre: RF-03, HU-03 (formulario de reserva), y sirve de base para
//        HU-07 (calcular disponibilidad por horario) y HU-08 (evitar choques)

// Una reserva se lee así: "este profesor va a usar X unidades de este
// recurso, tal día, desde tal hora hasta tal hora".
// Juntando todas las reservas, la app puede saber cuántas unidades quedan
// libres a cierta hora (HU-07) y no dejar reservar más de las que hay (HU-08).
export interface Reserva {
  id: number; // el número de la reserva

  // Qué recurso se reserva. Guardamos solo su número (id), no el recurso
  // entero: así, si el recurso cambia de nombre, la reserva sigue apuntando
  // al recurso correcto. (Es como anotar el número de mesa, no la mesa.)
  recursoId: number;

  // El nombre del profesor, ej: 'Prof. Ana Morales'.
  docente: string;

  // Las fechas y horas se guardan como TEXTO (string) porque así nos las
  // entregan las cajitas <input type="date"> y <input type="time">.
  fecha: string; // ej: "2026-10-08" (año-mes-día)
  horaInicio: string; // ej: "10:00"
  horaFin: string; // ej: "11:30"

  cantidad: number; // cuántas unidades se apartan
  asignatura: string; // para qué ramo, ej: "Física I"
  sala: string; // a qué sala se las llevan, ej: "B302"
}
