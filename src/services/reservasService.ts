// reservasService.ts
// Servicio de reservas: es el ÚNICO lugar desde donde las páginas y componentes
// leen y modifican las reservas de recursos del laboratorio.
// Cubre: HU-03 (crear reserva), RF-03 (gestionar y cancelar reservas)
// y RNF-03 (el docente solo ve sus propias reservas)

// ¿Para qué sirve este servicio?
// En lugar de que las pantallas importen directamente de src/data/reservas.ts,
// pasan por este servicio. Hoy los datos viven en la memoria del navegador, pero
// cuando exista un backend, solo se modifica este archivo y las vistas quedan intactas.

import type { Reserva } from '../types/Reserva';
import type { Usuario } from '../types/Usuario';
import { listaReservasPrueba } from '../data/reservas';
import { puedeVerTodasLasReservas } from '../utils/permisos';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { baseDatos } from './firebase';

// Esta lista es la copia en memoria de la base de datos de Firestore.
// Empieza vacía y se llena al llamar a cargarReservas() al iniciar sesión.
let listaReservas: Reserva[] = [];

// obtenerReservas
// Recibe: nada.
// Devuelve: la lista completa de reservas.
export function obtenerReservas(): Reserva[] {
  return listaReservas;
}

// obtenerReservasVisibles (RNF-03)
// Recibe: el usuario conectado.
// Devuelve: las reservas que ese usuario puede ver.
//   - Encargado y departamento: todas.
//   - Docente: solo las que están a su nombre ("Mis reservas").
// La usan la tabla y el contador de la página, así los dos muestran
// siempre el mismo número.
export function obtenerReservasVisibles(usuario: Usuario): Reserva[] {
  if (puedeVerTodasLasReservas(usuario.rol)) {
    return listaReservas;
  }

  // Recorremos todas las reservas y guardamos solo las del docente.
  // Comparamos con su nombre porque así se guarda la reserva: desde J18
  // el docente reserva siempre a su propio nombre (no lo puede cambiar).
  const reservasDelDocente: Reserva[] = [];
  for (const reserva of listaReservas) {
    if (reserva.docente === usuario.nombre) {
      reservasDelDocente.push(reserva);
    }
  }
  return reservasDelDocente;
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

// ------------------------------------------------------------------
// cargarReservas (D25)
// ------------------------------------------------------------------
// Descarga las reservas desde Firestore y las guarda en memoria.
// Si la colección está vacía, sube los datos de prueba automáticamente.
export async function cargarReservas(): Promise<void> {
  const coleccion = collection(baseDatos, 'reservas');
  const snapshot = await getDocs(coleccion);

  if (snapshot.empty) {
    console.log('Colección reservas vacía, subiendo datos de prueba...');
    for (const reserva of listaReservasPrueba) {
      const docRef = doc(baseDatos, 'reservas', reserva.id.toString());
      await setDoc(docRef, reserva);
    }
    const nuevoSnapshot = await getDocs(coleccion);
    listaReservas = nuevoSnapshot.docs.map(d => d.data() as Reserva);
  } else {
    listaReservas = snapshot.docs.map(d => d.data() as Reserva);
  }
}
