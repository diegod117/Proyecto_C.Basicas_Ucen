// reservas.ts
// Datos de prueba de reservas hechas por docentes (datos INVENTADOS).
// Incluye un caso pensado para probar choques de horario:
// dos docentes reservan TODOS los termómetros disponibles a la misma hora.
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
  // --- Caso de prueba para HU-08 ---
  // Hay 8 termómetros disponibles. Entre estas dos reservas se ocupan
  // los 8 (5 + 3) el mismo día y a la misma hora. Si un tercer docente
  // intenta reservar termómetros en ese horario, el sistema debe impedirlo.
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
