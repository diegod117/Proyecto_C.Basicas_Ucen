// disponibilidad.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Herramientas para las RESERVAS. Responden tres preguntas:
//   1. ¿El formulario de reserva está bien llenado?
//   2. ¿Dos horarios chocan?
//   3. ¿Cuántas unidades quedan libres a esa hora?
// Están aquí (y no dentro del formulario) para separar el "pensar" del
// "dibujar": el formulario dibuja, y este archivo piensa.
// En la guía: paso 8 (reservas).
// Cubre: HU-03 (validación de formulario), HU-07 (cruces de horarios y cálculo de stock), HU-08 (bloqueo por stock)

import { obtenerRecursoPorId } from '../services/recursosService';
import { obtenerReservas } from '../services/reservasService';

// ------------------------------------------------------------------
// validarCamposReserva
// ------------------------------------------------------------------
// Recibe: lo que se escribió en el formulario de reserva.
// Devuelve: el mensaje del PRIMER error que encuentre, o '' si todo está bien.
export function validarCamposReserva(
  recursoId: string,
  fecha: string,
  horaInicio: string,
  horaFin: string,
  cantidad: number,
  asignatura: string,
  sala: string
): string {
  // --- 1. ¿Están todos los datos obligatorios? ---
  // Revisamos uno por uno. Si alguno está vacío (''), avisamos cuál.
  if (recursoId === '') {
    return 'Debe seleccionar un recurso de la lista.';
  }
  if (fecha === '') {
    return 'Debe ingresar la fecha de la reserva.';
  }
  if (horaInicio === '') {
    return 'Debe ingresar la hora de inicio.';
  }
  if (horaFin === '') {
    return 'Debe ingresar la hora de fin.';
  }
  if (cantidad < 1) {
    return 'La cantidad a reservar debe ser al menos 1 unidad.';
  }
  if (asignatura.trim() === '') {
    return 'Debe ingresar el nombre de la asignatura.';
  }
  if (sala.trim() === '') {
    return 'Debe indicar la sala de destino.';
  }

  // --- 2. ¿Las horas tienen sentido? ---
  // Las horas son textos como "10:00" y "11:30". Comparar textos de este
  // formato funciona igual que comparar horas: "11:30" > "10:00".
  // <= se lee "menor o igual". Una clase no puede terminar antes de empezar.
  if (horaFin <= horaInicio) {
    return 'La hora de fin debe ser posterior a la hora de inicio.';
  }

  // Pasó todas las revisiones.
  return '';
}

// ------------------------------------------------------------------
// seCruzanHorarios
// ------------------------------------------------------------------
// Recibe: el día y las horas de dos reservas (la A y la B).
// Devuelve: true si chocan (se pisan), false si no.
// Piensa en dos clases en la misma sala: chocan si son el mismo día
// y una empieza antes de que la otra termine.
export function seCruzanHorarios(
  fechaA: string,
  inicioA: string,
  finA: string,
  fechaB: string,
  inicioB: string,
  finB: string
): boolean {
  // 1. ¿Días distintos? Entonces no pueden chocar.
  if (fechaA !== fechaB) {
    return false;
  }

  // 2. ¿Una termina antes (o justo cuando) empieza la otra? No chocan.
  //    Ej: A de 08:30 a 10:00 y B de 10:00 a 11:30 -> no chocan
  //    (A termina justo cuando B empieza).
  if (finA <= inicioB || finB <= inicioA) {
    return false;
  }

  // 3. En cualquier otro caso, se pisan.
  return true;
}

// ------------------------------------------------------------------
// calcularUnidadesDisponibles
// ------------------------------------------------------------------
// Recibe: el id del recurso, el día y el horario que se quiere reservar.
// Devuelve: cuántas unidades quedan libres en ese horario.
// La cuenta es: unidades disponibles - unidades ya reservadas a esa hora.
// Ej: hay 8 termómetros y a esa hora ya reservaron 5 + 3 -> quedan 0.
export function calcularUnidadesDisponibles(
  recursoId: number,
  fecha: string,
  horaInicio: string,
  horaFin: string
): number {
  const recurso = obtenerRecursoPorId(recursoId);
  // !recurso = "si NO hay recurso" (si llegó undefined).
  if (!recurso) {
    return 0;
  }

  // Partimos con todas las disponibles y vamos restando.
  let unidadesLibres = recurso.cantidades.disponible;
  const reservas = obtenerReservas();

  for (const reserva of reservas) {
    // Solo nos importan las reservas de ESTE mismo recurso.
    if (reserva.recursoId === recursoId) {
      const hayChoque = seCruzanHorarios(
        fecha,
        horaInicio,
        horaFin,
        reserva.fecha,
        reserva.horaInicio,
        reserva.horaFin
      );

      // Si esa reserva choca con nuestro horario, sus unidades están ocupadas.
      if (hayChoque) {
        unidadesLibres = unidadesLibres - reserva.cantidad;
      }
    }
  }

  // Math.max(0, x) = el mayor entre 0 y x. Así nunca devolvemos un número
  // negativo (no existen "-2 termómetros libres").
  return Math.max(0, unidadesLibres);
}

// ------------------------------------------------------------------
// validarDisponibilidadReserva (HU-08)
// ------------------------------------------------------------------
// Recibe: el id del recurso, el día, el horario y cuántas unidades se piden.
// Devuelve: un mensaje de error si no alcanzan, o '' si sí alcanzan.
export function validarDisponibilidadReserva(
  recursoId: number,
  fecha: string,
  horaInicio: string,
  horaFin: string,
  cantidadSolicitada: number
): string {
  const disponibles = calcularUnidadesDisponibles(
    recursoId,
    fecha,
    horaInicio,
    horaFin
  );

  if (disponibles === 0) {
    return 'No hay unidades disponibles de este recurso para el horario seleccionado.';
  }

  if (cantidadSolicitada > disponibles) {
    // Este texto usa comillas invertidas ` ` (se llaman "template string").
    // Permiten meter variables dentro del texto con ${...}, sin usar +.
    // Es lo mismo que: 'No se puede reservar: solicitó ' + cantidadSolicitada + ...
    return `No se puede reservar: solicitó ${cantidadSolicitada} unidad(es), pero solo quedan ${disponibles} disponible(s) en ese horario.`;
  }

  return '';
}
