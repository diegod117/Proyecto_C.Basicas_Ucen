// incidenciasService.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el "bodeguero" de las INCIDENCIAS (accidentes o problemas en el laboratorio).
// Las pantallas le piden a este archivo leer, agregar o cambiar incidencias;
// nunca van a buscarlas a src/data/ ni a Firestore por su cuenta.
// Así, si algún día cambia de dónde vienen los datos, solo se toca este archivo.
// Usa la misma idea de "copia en memoria" que recursosService.ts.
// En la guía: paso 8 (Firebase y los datos).
// Cubre: HU-04 (registrar incidencia), HU-10 (historial con estado)

import type { Incidencia, EstadoIncidencia } from '../types/Incidencia';
import { listaIncidenciasPrueba } from '../data/incidencias';
import { obtenerFechaActual } from '../utils/fechas';
// Herramientas de Firestore:
//   setDoc    = escribe UNA hoja completa
//   updateDoc = cambia solo algunos datos de una hoja que ya existe
import { collection, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { baseDatos } from './firebase';

// ------------------------------------------------------------------
// La copia en memoria
// ------------------------------------------------------------------
// Parte vacía y se llena con cargarIncidencias() al iniciar sesión.
// Es "let" (y no const) porque más abajo se le asigna una lista nueva completa.
let incidencias: Incidencia[] = [];

// ------------------------------------------------------------------
// obtenerIncidencias
// ------------------------------------------------------------------
// No recibe nada. Devuelve una COPIA de la lista de incidencias.
// [...incidencias] = "una lista nueva con los mismos elementos".
// Es como prestar una fotocopia en vez del original: si alguien la raya,
// el original queda intacto.
function obtenerIncidencias(): Incidencia[] {
  return [...incidencias];
}

// ------------------------------------------------------------------
// obtenerIncidenciaPorId
// ------------------------------------------------------------------
// Recibe: el número (id) de una incidencia.
// Devuelve: esa incidencia, o undefined (= nada) si no existe.
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
// Recibe: lo que escribió la persona en el formulario.
// Devuelve: una promesa con la incidencia ya guardada, con todos sus datos.
//
// Omit<Incidencia, 'id' | 'fecha' | 'estado'> se lee:
// "una Incidencia, pero SIN los datos id, fecha y estado".
// (Omit = "omitir", dejar fuera.) Esos tres no los escribe la persona:
// los pone este archivo, porque HU-10 pide que la fecha sea automática
// y que toda incidencia empiece en 'pendiente'.
async function agregarIncidencia(
  datos: Omit<Incidencia, 'id' | 'fecha' | 'estado'>
): Promise<Incidencia> {
  // El número nuevo es el más grande + 1. Si no hay ninguna, será 1.
  let mayorId = 0;
  for (const incidencia of incidencias) {
    if (incidencia.id > mayorId) {
      mayorId = incidencia.id;
    }
  }

  // Armamos la incidencia completa.
  // ...datos = "y agrega aquí todos los datos que vinieron del formulario".
  const nuevaIncidencia: Incidencia = {
    id: mayorId + 1,
    fecha: obtenerFechaActual(), // la fecha la pone la app sola (HU-10)
    estado: 'pendiente',         // toda incidencia nace pendiente (HU-10)
    ...datos,
  };

  // Primero la guardamos en Firestore (en la hoja "incidencias/<número>").
  // toString() convierte el número en texto: 5 -> "5".
  // Si Firestore falla, aquí salta un error y la línea de abajo NO se ejecuta.
  // Ese error lo atrapa el try/catch del formulario (FormularioIncidencia.tsx).
  const docRef = doc(baseDatos, 'incidencias', nuevaIncidencia.id.toString());
  await setDoc(docRef, nuevaIncidencia);

  // Firestore dijo "ok": la agregamos también a la copia.
  incidencias.push(nuevaIncidencia);
  return nuevaIncidencia;
}

// ------------------------------------------------------------------
// cambiarEstadoIncidencia
// ------------------------------------------------------------------
// Avanza el semáforo de una incidencia: pendiente -> en revisión -> resuelta.
// Recibe: el número de la incidencia y su nueva etapa.
// Devuelve: una promesa de true (se cambió) o false (no se pudo).
// Cubre: HU-10
async function cambiarEstadoIncidencia(
  id: number,
  nuevoEstado: EstadoIncidencia
): Promise<boolean> {
  // Primero en Firestore. updateDoc cambia SOLO el dato "estado"
  // (las reglas de Firestore no dejan cambiar ningún otro).
  try {
    const docRef = doc(baseDatos, 'incidencias', id.toString());
    await updateDoc(docRef, { estado: nuevoEstado });
  } catch (error) {
    console.error('Error al actualizar estado en Firestore:', error);
    return false;
  }

  // Firestore dijo "ok": la cambiamos también en la copia.
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
// Trae las incidencias desde Firestore y llena la copia.
// Si la carpeta está vacía, primero planta la semilla (data/incidencias.ts).
export async function cargarIncidencias(): Promise<void> {
  const coleccion = collection(baseDatos, 'incidencias');
  // "snapshot" = una "foto" de cómo estaba la carpeta en ese momento.
  const snapshot = await getDocs(coleccion);

  if (snapshot.empty) {
    // console.log escribe un mensaje en la consola (F12), solo para nosotros.
    console.log('Colección incidencias vacía, subiendo datos de prueba...');
    for (const incidencia of listaIncidenciasPrueba) {
      const docRef = doc(baseDatos, 'incidencias', incidencia.id.toString());
      await setDoc(docRef, incidencia);
    }
    // Volvemos a sacar la foto, ahora con la semilla ya plantada.
    const nuevoSnapshot = await getDocs(coleccion);
    // .map(...) = "transforma cada elemento de la lista y dame la lista nueva".
    // d => d.data() as Incidencia es una "función flecha" cortita:
    // recibe una hoja (d) y devuelve sus datos con forma de Incidencia.
    incidencias = nuevoSnapshot.docs.map(d => d.data() as Incidencia);
  } else {
    incidencias = snapshot.docs.map(d => d.data() as Incidencia);
  }
}

// ------------------------------------------------------------------
// Lo que las pantallas pueden usar
// ------------------------------------------------------------------
// Otra forma de exportar: en vez de poner "export" delante de cada
// función, se juntan todas aquí al final. Hacen lo mismo.
export {
  obtenerIncidencias,
  obtenerIncidenciaPorId,
  agregarIncidencia,
  cambiarEstadoIncidencia,
};
