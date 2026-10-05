// incidenciasService.ts
// Servicio que centraliza el acceso a las incidencias.
// Las páginas y componentes SIEMPRE usan este servicio para leer o
// modificar incidencias; nunca importan directamente src/data/.
// Así, cuando exista un backend, solo se cambia este archivo.
// Cubre: HU-04 (registrar incidencia), HU-10 (historial con estado)

import type { Incidencia, EstadoIncidencia } from '../types/Incidencia';
import { listaIncidenciasPrueba } from '../data/incidencias';
import { obtenerFechaActual } from '../utils/fechas';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { baseDatos } from './firebase';

// ------------------------------------------------------------------
// Lista en memoria
// ------------------------------------------------------------------
// Esta es la copia local de los datos. Empieza vacía y se llena al
// llamar a cargarIncidencias() al iniciar sesión.
let incidencias: Incidencia[] = [];

// ------------------------------------------------------------------
// obtenerIncidencias
// ------------------------------------------------------------------
// No recibe nada. Devuelve una copia de la lista completa de incidencias.
// Se devuelve una copia ([...]) para que nadie modifique la lista
// original por accidente desde afuera del servicio.
function obtenerIncidencias(): Incidencia[] {
  return [...incidencias];
}

// ------------------------------------------------------------------
// obtenerIncidenciaPorId
// ------------------------------------------------------------------
// Recibe el id de una incidencia.
// Devuelve la incidencia si la encuentra, o undefined si no existe.
// Útil para mostrar el detalle de una incidencia específica.
function obtenerIncidenciaPorId(id: number): Incidencia | undefined {
  for (const incidencia of incidencias) {
    if (incidencia.id === id) {
      return incidencia;
    }
  }
  return undefined;
}

// ------------------------------------------------------------------
// agregarIncidencia
// ------------------------------------------------------------------
// Recibe los datos que escribe el usuario en el formulario (sin id,
// sin fecha y sin estado, porque esos los pone el servicio).
// Devuelve la incidencia ya guardada con todos sus campos.
//
// Omit<Incidencia, 'id' | 'fecha' | 'estado'> significa:
// "una Incidencia pero sin los campos id, fecha ni estado".
// HU-10 pide que la fecha sea automática y el estado empiece en 'pendiente'.
async function agregarIncidencia(
  datos: Omit<Incidencia, 'id' | 'fecha' | 'estado'>
): Promise<Incidencia> {
  // Generamos un id nuevo: tomamos el mayor id que exista y le sumamos 1.
  // Si la lista está vacía, el id será 1.
  let mayorId = 0;
  for (const incidencia of incidencias) {
    if (incidencia.id > mayorId) {
      mayorId = incidencia.id;
    }
  }

  const nuevaIncidencia: Incidencia = {
    id: mayorId + 1,
    fecha: obtenerFechaActual(), // fecha automática (HU-10)
    estado: 'pendiente',         // toda incidencia nace como pendiente (HU-10)
    ...datos,
  };

  // Guardamos en Firestore primero
  const docRef = doc(baseDatos, 'incidencias', nuevaIncidencia.id.toString());
  await setDoc(docRef, nuevaIncidencia);

  // Si Firestore no falló, actualizamos la copia local en memoria
  incidencias.push(nuevaIncidencia);
  return nuevaIncidencia;
}

// ------------------------------------------------------------------
// cambiarEstadoIncidencia
// ------------------------------------------------------------------
// Recibe el id de una incidencia y el nuevo estado al que debe pasar
// ('pendiente', 'en_revision' o 'resuelta').
// Busca la incidencia en la lista y le actualiza el estado.
// Devuelve true si la encontró y la actualizó, o false si no existía.
// Cubre: HU-10 (avanzar incidencia de pendiente -> en_revision -> resuelta)
function cambiarEstadoIncidencia(
  id: number,
  nuevoEstado: EstadoIncidencia
): boolean {
  for (const incidencia of incidencias) {
    if (incidencia.id === id) {
      incidencia.estado = nuevoEstado;
      return true;
    }
  }
  return false;
}

// ------------------------------------------------------------------
// cargarIncidencias (D22)
// ------------------------------------------------------------------
// Descarga las incidencias desde Firestore y las guarda en memoria.
// Si la colección está vacía, sube los datos de prueba automáticamente.
export async function cargarIncidencias(): Promise<void> {
  const coleccion = collection(baseDatos, 'incidencias');
  const snapshot = await getDocs(coleccion);

  if (snapshot.empty) {
    console.log('Colección incidencias vacía, subiendo datos de prueba...');
    for (const incidencia of listaIncidenciasPrueba) {
      const docRef = doc(baseDatos, 'incidencias', incidencia.id.toString());
      await setDoc(docRef, incidencia);
    }
    const nuevoSnapshot = await getDocs(coleccion);
    incidencias = nuevoSnapshot.docs.map(d => d.data() as Incidencia);
  } else {
    incidencias = snapshot.docs.map(d => d.data() as Incidencia);
  }
}

// ------------------------------------------------------------------
// Exportamos las funciones para que las usen las páginas
// ------------------------------------------------------------------
export {
  obtenerIncidencias,
  obtenerIncidenciaPorId,
  agregarIncidencia,
  cambiarEstadoIncidencia,
};
