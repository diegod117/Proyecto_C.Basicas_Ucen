// disponibilidad.ts
// Funciones de utilidad para validar y calcular la disponibilidad de recursos.
// Separa la lógica de negocio de la interfaz gráfica de usuario.
// Cubre: HU-03 (validación de formulario), HU-07 (cruces de horarios y cálculo de stock), HU-08 (bloqueo por stock)

import { obtenerRecursoPorId } from '../services/recursosService';
import { obtenerReservas } from '../services/reservasService';
import { obtenerFechaHoy } from './fechas';
import { obtenerSalas } from '../services/configuracionService';
import type { Sala } from '../types/Configuracion';

// ------------------------------------------------------------------
// validarCamposReserva
// ------------------------------------------------------------------
// Recibe: los datos capturados en el formulario de reserva.
// Devuelve: un string con el mensaje de error para el usuario, o '' si todo es válido.
export function validarCamposReserva(
  recursoId: string,
  fecha: string,
  horaInicio: string,
  horaFin: string,
  cantidad: number,
  asignatura: string,
  sala: string
): string {
  // --- 1. Validación de campos obligatorios ---
  if (recursoId === '') {
    return 'Debe seleccionar un recurso de la lista.';
  }
  if (fecha === '') {
    return 'Debe ingresar la fecha de la reserva.';
  }
  // No se puede reservar en un día que ya pasó. Las fechas "AAAA-MM-DD"
  // se pueden comparar como texto porque van de año a día.
  if (fecha < obtenerFechaHoy()) {
    return 'La fecha de la reserva no puede ser anterior a hoy.';
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

  // --- 2. Validación de coherencia horaria ---
  if (horaFin <= horaInicio) {
    return 'La hora de fin debe ser posterior a la hora de inicio.';
  }

  // Si pasa todas las comprobaciones, no hay error
  return '';
}

// ------------------------------------------------------------------
// seCruzanHorarios
// ------------------------------------------------------------------
// Recibe: fecha y horas de dos intervalos de tiempo (A y B).
// Devuelve: true si ambos horarios chocan o se solapan en el mismo día,
//           false si son en días distintos o están separados en el tiempo.
export function seCruzanHorarios(
  fechaA: string,
  inicioA: string,
  finA: string,
  fechaB: string,
  inicioB: string,
  finB: string
): boolean {
  // 1. Si son días diferentes, no hay cruce
  if (fechaA !== fechaB) {
    return false;
  }

  // 2. Si uno termina antes de que empiece el otro, no hay cruce
  if (finA <= inicioB || finB <= inicioA) {
    return false;
  }

  // 3. En caso contrario, se solapan
  return true;
}

// ------------------------------------------------------------------
// calcularUnidadesDisponibles
// ------------------------------------------------------------------
// Recibe: ID del recurso, fecha y rango de horas solicitado.
// Devuelve: la cantidad neta de unidades que quedan libres para ese horario.
export function calcularUnidadesDisponibles(
  recursoId: number,
  fecha: string,
  horaInicio: string,
  horaFin: string
): number {
  const recurso = obtenerRecursoPorId(recursoId);
  if (!recurso) {
    return 0;
  }

  let unidadesLibres = recurso.cantidades.disponible;
  const reservas = obtenerReservas();

  for (const reserva of reservas) {
    if (reserva.recursoId === recursoId) {
      const hayChoque = seCruzanHorarios(
        fecha,
        horaInicio,
        horaFin,
        reserva.fecha,
        reserva.horaInicio,
        reserva.horaFin
      );

      if (hayChoque) {
        unidadesLibres = unidadesLibres - reserva.cantidad;
      }
    }
  }

  return Math.max(0, unidadesLibres);
}

// ------------------------------------------------------------------
// validarDisponibilidadReserva (HU-08)
// ------------------------------------------------------------------
// Recibe: ID del recurso, fecha, horario y la cantidad solicitada.
// Devuelve: mensaje de error si la cantidad solicitada excede el stock libre,
//           o '' si hay suficiente disponibilidad.
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
    return `No se puede reservar: solicitó ${cantidadSolicitada} unidad(es), pero solo quedan ${disponibles} disponible(s) en ese horario.`;
  }

  return '';
}


// ------------------------------------------------------------------
// salaEstaLibre / obtenerSalasLibres
// ------------------------------------------------------------------
// Una sala está OCUPADA si OTRO docente la tiene reservada en un horario
// que se cruza. Si es el mismo docente, la sala sigue libre para él: así
// puede reservar varios materiales distintos para su misma clase.
// Recibe: el código de la sala (ej: 'B302'), la fecha, el horario y el
//         nombre del docente que quiere reservar.
// Devuelve: true si la sala está libre para ese docente en ese horario.
export function salaEstaLibre(
  codigoSala: string,
  fecha: string,
  horaInicio: string,
  horaFin: string,
  docente: string
): boolean {
  for (const reserva of obtenerReservas()) {
    if (reserva.sala === codigoSala && reserva.docente !== docente) {
      const hayChoque = seCruzanHorarios(
        fecha,
        horaInicio,
        horaFin,
        reserva.fecha,
        reserva.horaInicio,
        reserva.horaFin
      );
      if (hayChoque) {
        return false;
      }
    }
  }
  return true;
}

// Recibe: la fecha, el horario y el docente.
// Devuelve: solo las salas (de "Configuración") libres en ese horario.
export function obtenerSalasLibres(
  fecha: string,
  horaInicio: string,
  horaFin: string,
  docente: string
): Sala[] {
  const salasLibres: Sala[] = [];
  for (const sala of obtenerSalas()) {
    if (salaEstaLibre(sala.codigo, fecha, horaInicio, horaFin, docente)) {
      salasLibres.push(sala);
    }
  }
  return salasLibres;
}
