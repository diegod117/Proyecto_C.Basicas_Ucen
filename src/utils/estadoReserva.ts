// estadoReserva.ts
// Funciones para saber en qué estado está una reserva según la hora, y
// cuántas unidades de un recurso están fuera del laboratorio en este momento.
// Una reserva pasa sola de "Programada" a "En curso" y después a "Realizada":
// no hay que guardar nada, se calcula con la fecha y la hora actuales.
// Cuando termina, sus unidades vuelven a contar como disponibles.
// Cubre: RF-03 (gestión de reservas), HU-07 (disponibilidad por horario)

import type { Reserva, EstadoReserva } from '../types/Reserva';
import { obtenerReservas } from '../services/reservasService';
import { obtenerFechaActual } from './fechas';

// obtenerEstadoReserva
// Recibe: una reserva.
// Devuelve: 'programada', 'en_curso' o 'realizada'.
// Armamos textos "AAAA-MM-DD HH:MM" con el inicio y el fin de la reserva y
// los comparamos con la hora actual. Con este formato, comparar textos es
// lo mismo que comparar fechas: "2026-10-12 10:00" < "2026-10-12 11:30".
export function obtenerEstadoReserva(reserva: Reserva): EstadoReserva {
  const ahora = obtenerFechaActual();
  const inicio = reserva.fecha + ' ' + reserva.horaInicio;
  const fin = reserva.fecha + ' ' + reserva.horaFin;

  if (ahora >= fin) {
    return 'realizada';
  } else if (ahora >= inicio) {
    return 'en_curso';
  } else {
    return 'programada';
  }
}

// textoEstadoReserva
// Recibe: un estado de reserva. Devuelve: el texto para mostrar.
export function textoEstadoReserva(estado: EstadoReserva): string {
  if (estado === 'programada') {
    return 'Programada';
  } else if (estado === 'en_curso') {
    return 'En curso';
  } else {
    return 'Realizada';
  }
}

// calcularUnidadesEnReservaAhora
// Recibe: el id de un recurso.
// Devuelve: cuántas unidades de ese recurso están en una reserva EN CURSO
// (el profesor las tiene en su clase en este momento).
// Ej: si a las 10:30 hay una reserva de 6 multímetros de 10:00 a 11:30,
// devuelve 6. A las 11:30 la reserva queda "realizada" y devuelve 0.
export function calcularUnidadesEnReservaAhora(recursoId: number): number {
  let total = 0;
  for (const reserva of obtenerReservas()) {
    if (reserva.recursoId === recursoId && obtenerEstadoReserva(reserva) === 'en_curso') {
      total = total + reserva.cantidad;
    }
  }
  return total;
}
