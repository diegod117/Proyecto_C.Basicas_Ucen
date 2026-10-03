// reservasService.ts
// Servicio de reservas: es el ÚNICO lugar desde donde las páginas y componentes
// leen y modifican las reservas de recursos del laboratorio.
// Cubre: HU-03 (crear reserva), RF-03 (gestionar reservas)

// ¿Para qué sirve este servicio?
// En lugar de que las pantallas importen directamente de src/data/reservas.ts,
// pasan por este servicio. Hoy los datos viven en la memoria del navegador, pero
// cuando exista un backend, solo se modifica este archivo y las vistas quedan intactas.

import type { Reserva } from '../types/Reserva';
import { listaReservasPrueba } from '../data/reservas';

// Copiamos la lista de prueba a un arreglo en memoria usando el operador spread (...)
// para poder agregar o modificar elementos sin alterar el archivo original.
const listaReservas: Reserva[] = [...listaReservasPrueba];

// obtenerReservas
// Recibe: nada.
// Devuelve: la lista completa de reservas.
export function obtenerReservas(): Reserva[] {
  return listaReservas;
}

// agregarReserva
// Recibe: una reserva nueva sin su id.
// Devuelve: nada.
//
// Omit<Reserva, 'id'> le indica a TypeScript que quien llama a esta función
// debe pasar todos los datos de la reserva excepto el 'id', ya que este se genera automáticamente aquí.
export function agregarReserva(reservaSinId: Omit<Reserva, 'id'>): void {
  // Buscamos el ID más alto que exista actualmente
  let idMayor = 0;
  for (const reserva of listaReservas) {
    if (reserva.id > idMayor) {
      idMayor = reserva.id;
    }
  }

  // Asignamos el siguiente ID correlativo
  const idNuevo = idMayor + 1;

  // Creamos la reserva completa incorporando el nuevo ID generado
  const reservaCompleta: Reserva = {
    id: idNuevo,
    ...reservaSinId,
  };

  // La guardamos en el arreglo en memoria
  listaReservas.push(reservaCompleta);
}
