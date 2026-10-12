// reservas.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Son reservas de PRUEBA (inventadas). También son "semilla" para Firestore.
// Tiene una trampa a propósito para probar los choques de horario:
// dos profesores reservan TODOS los termómetros a la misma hora, así que
// un tercero que intente reservar a esa hora no debería poder.
// Cubre: datos de apoyo para HU-03, HU-07 y HU-08

import type { Reserva } from '../types/Reserva';

export const listaReservasPrueba: Reserva[] = [
  {
    id: 1,
    recursoId: 1, // Multímetro Fluke 87V (ver recursos.ts)
    docente: 'Prof. Ana Morales',
    fecha: '2026-10-08',
    horaInicio: '10:00',
    horaFin: '11:30',
    cantidad: 6,
    asignatura: 'Física I',
    sala: 'B302',
  },
  {
    id: 2,
    recursoId: 2, // Osciloscopio Rigol
    docente: 'Prof. Carlos Fuentes',
    fecha: '2026-10-08',
    horaInicio: '14:00',
    horaFin: '15:30',
    cantidad: 2,
    asignatura: 'Electrónica Básica',
    sala: 'B307',
  },
  // --- La trampa para probar HU-08 ---
  // Hay 8 termómetros disponibles. Estas dos reservas se llevan 5 + 3 = 8,
  // el mismo día y a la misma hora. No queda ninguno.
  // Si un tercer profesor intenta reservar termómetros a esa hora,
  // la app tiene que decirle que no.
  {
    id: 3,
    recursoId: 6, // Termómetro digital
    docente: 'Prof. Ana Morales',
    fecha: '2026-10-09',
    horaInicio: '08:30',
    horaFin: '10:00',
    cantidad: 5,
    asignatura: 'Física II',
    sala: 'C210',
  },
  {
    id: 4,
    recursoId: 6, // Termómetro digital
    docente: 'Prof. Jorge Paredes',
    fecha: '2026-10-09',
    horaInicio: '08:30',
    horaFin: '10:00',
    cantidad: 3,
    asignatura: 'Termodinámica',
    sala: 'C205',
  },
];
