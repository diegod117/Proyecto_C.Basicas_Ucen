// reservasService.ts
// Servicio de reservas: es el ÚNICO lugar desde donde las páginas y componentes
// leen y modifican las reservas de recursos del laboratorio.
// Cubre: HU-03 (crear reserva), RF-03 (gestionar y cancelar reservas)

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

// cancelarReserva (RF-03)
// Recibe: el ID de la reserva a cancelar.
// Devuelve: true si se encontró y eliminó, o false si no existía.
export function cancelarReserva(id: number): boolean {
  for (let i = 0; i < listaReservas.length; i++) {
    if (listaReservas[i].id === id) {
      // splice(posicion, cantidadAEliminar) elimina el elemento del arreglo in-place
      listaReservas.splice(i, 1);
      return true;
    }
  }
  return false;
}
