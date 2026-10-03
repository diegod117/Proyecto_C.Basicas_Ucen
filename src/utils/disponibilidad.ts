// disponibilidad.ts
// Funciones de utilidad para validar y calcular la disponibilidad de recursos.
// Separa la lógica de negocio de la interfaz gráfica de usuario.
// Cubre: HU-03 (validación de formulario), HU-07 (cruces de horarios y cálculo de stock), HU-08 (bloqueo por stock)

import { obtenerRecursoPorId } from '../services/recursosService';
import { obtenerReservas } from '../services/reservasService';

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
  // Las horas están en formato "HH:MM" de dos dígitos (ej: "08:30", "10:00").
  // Por el estándar ISO 8601 / formato 24 horas, comparar cadenas de texto
  // con <= respeta el mismo orden cronológico que comparar números o marcas de tiempo.
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
//
// Lógica de cálculo:
// 1. Busca el recurso en el inventario para conocer sus unidades operativas disponibles.
// 2. Obtiene todas las reservas registradas.
// 3. Resta la cantidad de cada reserva que coincida con el mismo recurso y cuyo
//    horario se cruce con el horario solicitado.
// 4. Retorna el remanente (mínimo 0).
export function calcularUnidadesDisponibles(
  recursoId: number,
  fecha: string,
  horaInicio: string,
  horaFin: string
): number {
  // 1. Obtener el recurso desde el servicio
  const recurso = obtenerRecursoPorId(recursoId);
  if (!recurso) {
    return 0;
  }

  // Stock base que el laboratorio tiene en estado 'disponible'
  let unidadesLibres = recurso.cantidades.disponible;

  // 2. Consultar todas las reservas existentes
  const reservas = obtenerReservas();

  // 3. Recorrer las reservas y descontar las que ocupen este recurso en este horario
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

  // 4. No permitir valores negativos por seguridad
  return Math.max(0, unidadesLibres);
}
