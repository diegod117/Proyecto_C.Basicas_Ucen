// reservasService.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el "bodeguero" de las RESERVAS. Las pantallas le piden aquí ver,
// crear o cancelar reservas; nunca van directo a Firestore ni a src/data/.
// Usa la misma idea de "copia en memoria" que recursosService.ts.
// En la guía: paso 8 (Firebase y los datos).
// Cubre: HU-03 (crear reserva), RF-03 (gestionar y cancelar reservas)
// y RNF-03 (el docente solo ve sus propias reservas)

import type { Reserva } from '../types/Reserva';
import type { Usuario } from '../types/Usuario';
import { listaReservasPrueba } from '../data/reservas';
import { puedeVerTodasLasReservas } from '../utils/permisos';
// deleteDoc = borra una hoja de Firestore (las reservas SÍ se pueden borrar:
// cancelar una reserva = borrarla).
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { baseDatos } from './firebase';

// La copia en memoria. Parte vacía y se llena con cargarReservas() al iniciar sesión.
let listaReservas: Reserva[] = [];

// obtenerReservas
// Recibe: nada.
// Devuelve: TODAS las reservas.
export function obtenerReservas(): Reserva[] {
  return listaReservas;
}

// obtenerReservasVisibles (RNF-03)
// Recibe: la persona conectada.
// Devuelve: solo las reservas que esa persona tiene permiso de ver:
//   - Encargado y departamento: todas.
//   - Docente: solo las que están a su nombre ("Mis reservas").
// La usan la tabla y el contador de la página, así los dos muestran el mismo número.
export function obtenerReservasVisibles(usuario: Usuario): Reserva[] {
  // puedeVerTodasLasReservas viene de utils/permisos.ts: ahí están TODAS
  // las reglas de "quién puede hacer qué".
  if (puedeVerTodasLasReservas(usuario.rol)) {
    return listaReservas;
  }

  // Es docente: armamos una lista nueva solo con SUS reservas.
  // Comparamos por nombre porque el docente siempre reserva a su propio
  // nombre (el campo "Docente" del formulario está bloqueado para él).
  const reservasDelDocente: Reserva[] = [];
  for (const reserva of listaReservas) {
    if (reserva.docente === usuario.nombre) {
      reservasDelDocente.push(reserva);
    }
  }
  return reservasDelDocente;
}

// agregarReserva
// Recibe: una reserva nueva, sin número todavía.
//   Omit<Reserva, 'id'> = "una Reserva, pero SIN el dato id".
// Devuelve: una promesa vacía (Promise<void>) que avisa cuando terminó.
// Si Firestore falla, lanza un error que atrapa el formulario con su try/catch.
export async function agregarReserva(reservaSinId: Omit<Reserva, 'id'>): Promise<void> {
  // Buscamos el número más grande que exista.
  let idMayor = 0;
  for (const reserva of listaReservas) {
    if (reserva.id > idMayor) {
      idMayor = reserva.id;
    }
  }

  // Le toca el siguiente.
  const idNuevo = idMayor + 1;

  // La reserva completa = el número nuevo + todos los datos que llegaron
  // (los "..." copian todos los datos de reservaSinId aquí adentro).
  const reservaCompleta: Reserva = {
    id: idNuevo,
    ...reservaSinId,
  };

  // Primero la guardamos en Firestore.
  const docRef = doc(baseDatos, 'reservas', reservaCompleta.id.toString());
  await setDoc(docRef, reservaCompleta);

  // Firestore dijo "ok": la agregamos también a la copia.
  listaReservas.push(reservaCompleta);
}

// cancelarReserva (RF-03)
// Recibe: el número de la reserva que se quiere cancelar.
// Devuelve: una promesa de true (se borró) o false (no se pudo o no existía).
export async function cancelarReserva(id: number): Promise<boolean> {
  // Primero la borramos de Firestore.
  try {
    const docRef = doc(baseDatos, 'reservas', id.toString());
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al cancelar reserva en Firestore:', error);
    return false;
  }

  // Firestore dijo "ok": la sacamos también de la copia.
  // For clásico: i parte en 0 y sube de 1 en 1 mientras sea menor que el largo.
  for (let i = 0; i < listaReservas.length; i++) {
    if (listaReservas[i].id === id) {
      // splice(i, 1) = "en la posición i, saca 1 elemento".
      listaReservas.splice(i, 1);
      return true;
    }
  }
  return false;
}

// ------------------------------------------------------------------
// cargarReservas (D25)
// ------------------------------------------------------------------
// Trae las reservas desde Firestore y llena la copia.
// Si la carpeta está vacía, primero planta la semilla (data/reservas.ts).
// Funciona igual que cargarIncidencias() de incidenciasService.ts.
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
    // .map transforma cada hoja (d) en sus datos con forma de Reserva.
    listaReservas = nuevoSnapshot.docs.map(d => d.data() as Reserva);
  } else {
    listaReservas = snapshot.docs.map(d => d.data() as Reserva);
  }
}
