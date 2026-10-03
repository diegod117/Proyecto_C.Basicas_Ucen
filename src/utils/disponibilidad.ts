// disponibilidad.ts
// Funciones de utilidad para validar y calcular la disponibilidad de recursos.
// Separa la lógica de negocio de la interfaz gráfica de usuario.
// Cubre: HU-03 (validación de formulario), HU-07 (cruces de horarios), HU-08 (bloqueo por stock)

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
