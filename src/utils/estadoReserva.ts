// estadoReserva.ts
// ¿QUÉ ES ESTE ARCHIVO?
// El RELOJ de las reservas (pedido del profesor). Responde dos preguntas:
//   1. ¿En qué momento va una reserva? (Programada, En curso o Realizada)
//   2. ¿Cuántas unidades de un recurso están AHORA en una clase?
// Una reserva pasa sola de "Programada" a "En curso" y después a
// "Realizada", como las clases del horario: nadie la cambia a mano.
// NO se guarda nada en Firestore: se CALCULA cada vez mirando la hora.
// Cuando una reserva termina, sus unidades vuelven a contar como
// disponibles (porque calcularUnidadesEnReservaAhora deja de contarlas).
// En la guía: paso 12 (reservas que pasan solas al historial).
// Cubre: RF-03 (gestión de reservas), HU-07 (disponibilidad por horario)

import type { Reserva, EstadoReserva } from '../types/Reserva';
import { obtenerReservas } from '../services/reservasService';
import { obtenerFechaActual } from './fechas';

// obtenerEstadoReserva
// Recibe: una reserva.
// Devuelve: 'programada', 'en_curso' o 'realizada'.
// ¿Cómo? Armamos dos textos con la forma "AAAA-MM-DD HH:MM":
//   inicio = "2026-10-12 10:00"   fin = "2026-10-12 11:30"
// y los comparamos con la hora de ahora (también "AAAA-MM-DD HH:MM").
// Con este formato, comparar TEXTOS con < y >= da lo mismo que comparar
// fechas, porque va de lo más grande (año) a lo más chico (minuto):
//   "2026-10-12 10:00" < "2026-10-12 11:30"  es true.
export function obtenerEstadoReserva(reserva: Reserva): EstadoReserva {
  const ahora = obtenerFechaActual();
  // Pegamos la fecha y la hora con un espacio al medio.
  const inicio = reserva.fecha + ' ' + reserva.horaInicio;
  const fin = reserva.fecha + ' ' + reserva.horaFin;

  // Preguntamos en orden (el primero que se cumple gana):
  if (ahora >= fin) {
    // Ya pasó la hora de término -> terminó.
    return 'realizada';
  } else if (ahora >= inicio) {
    // No ha terminado, pero ya empezó -> está pasando ahora.
    return 'en_curso';
  } else {
    // Todavía no empieza.
    return 'programada';
  }
}

// textoEstadoReserva
// Recibe: un estado "feo" ('en_curso').
// Devuelve: el texto bonito para la pantalla ("En curso").
// Es el mismo "traductor" que textoEstado en utils/inventario.ts.
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
// Recibe: el id (número) de un recurso.
// Devuelve: cuántas unidades de ese recurso están en una reserva EN CURSO
// (o sea, el profesor las tiene en su clase en este momento).
// Ej: si a las 10:30 hay una reserva de 6 multímetros de 10:00 a 11:30,
// devuelve 6. A las 11:30 la reserva queda "realizada" y devuelve 0:
// ¡así es como las unidades "vuelven" al inventario solas!
export function calcularUnidadesEnReservaAhora(recursoId: number): number {
  // Partimos en 0 y vamos sumando, como contar monedas en una alcancía.
  let total = 0;
  for (const reserva of obtenerReservas()) {
    // Solo cuentan las reservas de ESTE recurso que estén pasando AHORA.
    if (reserva.recursoId === recursoId && obtenerEstadoReserva(reserva) === 'en_curso') {
      total = total + reserva.cantidad;
    }
  }
  return total;
}
