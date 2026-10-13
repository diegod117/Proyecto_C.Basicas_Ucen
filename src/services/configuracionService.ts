// configuracionService.ts
// ¿QUÉ ES ESTE ARCHIVO?
// El "bodeguero" de la CONFIGURACIÓN: categorías de recursos, torres y salas.
// Funciona igual que los otros servicios (recursosService, reservasService...):
//   - Guarda una COPIA EN MEMORIA de las colecciones de Firestore
//     "categorias", "torres" y "salas".
//   - Esa copia se llena al iniciar sesión (cargarConfiguracion).
//   - Las páginas LEEN la copia (obtener...) y AGREGAN cosas (agregar...).
// No hay funciones para BORRAR, a propósito: un recurso o una reserva
// podría estar usando esa categoría o sala, y quedaría "huérfano".
// En la guía: paso 8 (la copia en memoria) y paso 13 (Configuración).
// Cubre: RF-08, RF-10, RNF-05 (agregar categorías, torres y salas sin programar)

// Herramientas de Firestore:
//   collection = una colección (como una carpeta del cuaderno en la nube)
//   getDocs    = traer TODOS los documentos de una colección
//   doc        = apuntar a UN documento por su nombre
//   setDoc     = guardar un documento con ese nombre
//   writeBatch = un "lote": varias escrituras que se mandan JUNTAS
import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { baseDatos } from './firebase';
import type { Categoria, Torre, Sala } from '../types/Configuracion';
// Las "semillas": con qué datos parte la app si Firestore está vacío.
import { listaCategoriasPrueba, listaTorresPrueba, listaSalasPrueba } from '../data/configuracion';

// Las copias en memoria. Parten vacías y se llenan al iniciar sesión.
// Son "const" porque la LISTA es siempre la misma (no la cambiamos por
// otra); lo que cambia es lo que tiene adentro (push, splice, sort).
const listaCategorias: Categoria[] = [];
const listaTorres: Torre[] = [];
const listaSalas: Sala[] = [];

// cargarConfiguracion
// No recibe nada. Descarga las 3 colecciones y llena las copias en memoria.
// Si una colección está vacía (la primera vez que se usa la app), sube los
// datos de src/data/configuracion.ts (las "siembra").
// La llama cargarTodosLosDatos() (cargaDatos.ts) al iniciar sesión.
// "Promise<void>" = una promesa que, cuando termina, no entrega nada.
export async function cargarConfiguracion(): Promise<void> {
  // Las tres partes son iguales; solo cambia la colección.

  // --- Categorías ---
  // await = esperamos a que lleguen de internet.
  const categorias = await getDocs(collection(baseDatos, 'categorias'));
  // splice(0, largo) = vaciar la copia, por si quedaba algo de antes
  // (ej: si otra persona había iniciado sesión antes en este computador).
  listaCategorias.splice(0, listaCategorias.length);
  if (categorias.empty) {
    // Vacía: sembramos las 6 categorías iniciales.
    // Usamos un LOTE para mandarlas todas JUNTAS: o se guardan todas, o
    // ninguna. Así nunca queda la mitad guardada si se corta internet.
    const lote = writeBatch(baseDatos);
    for (const categoria of listaCategoriasPrueba) {
      // El nombre del documento es la clave (ej: 'insumo').
      lote.set(doc(baseDatos, 'categorias', categoria.clave), categoria);
      listaCategorias.push(categoria);
    }
    // commit = "manda el lote ahora".
    await lote.commit();
  } else {
    // Ya había categorías: las copiamos a la memoria, una por una.
    // "as Categoria" = le aseguramos a TypeScript que lo que viene de
    // Firestore tiene la forma de una Categoria.
    for (const documento of categorias.docs) {
      listaCategorias.push(documento.data() as Categoria);
    }
  }

  // --- Torres --- (igual que las categorías)
  const torres = await getDocs(collection(baseDatos, 'torres'));
  listaTorres.splice(0, listaTorres.length);
  if (torres.empty) {
    const lote = writeBatch(baseDatos);
    for (const torre of listaTorresPrueba) {
      // El nombre del documento es la letra (ej: 'B').
      lote.set(doc(baseDatos, 'torres', torre.letra), torre);
      listaTorres.push(torre);
    }
    await lote.commit();
  } else {
    for (const documento of torres.docs) {
      listaTorres.push(documento.data() as Torre);
    }
  }

  // --- Salas --- (igual que las categorías)
  const salas = await getDocs(collection(baseDatos, 'salas'));
  listaSalas.splice(0, listaSalas.length);
  if (salas.empty) {
    const lote = writeBatch(baseDatos);
    for (const sala of listaSalasPrueba) {
      // El nombre del documento es el código (ej: 'B307').
      lote.set(doc(baseDatos, 'salas', sala.codigo), sala);
      listaSalas.push(sala);
    }
    await lote.commit();
  } else {
    for (const documento of salas.docs) {
      listaSalas.push(documento.data() as Sala);
    }
  }

  ordenarListas();
}

// ordenarListas
// Ordena las 3 listas para mostrarlas siempre en el mismo orden:
// categorías por nombre, torres por letra y salas por código.
// localeCompare compara textos como un diccionario (y respeta las tildes:
// "Instalación" queda bien ordenada). Devuelve -1, 0 o 1, justo lo que sort necesita.
// Sin "export": solo se usa aquí adentro.
function ordenarListas(): void {
  listaCategorias.sort(function (a, b) {
    return a.nombre.localeCompare(b.nombre);
  });
  listaTorres.sort(function (a, b) {
    return a.letra.localeCompare(b.letra);
  });
  listaSalas.sort(function (a, b) {
    return a.codigo.localeCompare(b.codigo);
  });
}

// obtenerCategorias / obtenerTorres / obtenerSalas
// No reciben nada. Devuelven la lista completa (la copia en memoria).
// No van a internet: son instantáneas.
export function obtenerCategorias(): Categoria[] {
  return listaCategorias;
}

export function obtenerTorres(): Torre[] {
  return listaTorres;
}

export function obtenerSalas(): Sala[] {
  return listaSalas;
}

// obtenerSalasDeTorre
// Recibe: la letra de una torre (ej: 'B').
// Devuelve: solo las salas de esa torre (ej: B302, B307, B308).
// Partimos con una lista vacía y metemos (push) las que calzan.
export function obtenerSalasDeTorre(letraTorre: string): Sala[] {
  const salasDeTorre: Sala[] = [];
  for (const sala of listaSalas) {
    if (sala.torre === letraTorre) {
      salasDeTorre.push(sala);
    }
  }
  return salasDeTorre;
}

// obtenerCategoriaPorClave
// Recibe: la clave de una categoría (ej: 'insumo').
// Devuelve: la categoría completa, o undefined (= nada) si no existe.
// "Categoria | undefined" = una Categoria O nada.
export function obtenerCategoriaPorClave(clave: string): Categoria | undefined {
  for (const categoria of listaCategorias) {
    if (categoria.clave === clave) {
      // La encontramos: return la entrega y corta el for.
      return categoria;
    }
  }
  // Revisamos todas y no estaba.
  return undefined;
}

// agregarCategoria / agregarTorre / agregarSala
// Reciben: el dato nuevo, YA REVISADO (ver utils/configuracion.ts).
// Devuelven: una promesa con true si Firestore lo guardó, o false si falló.
// El orden importa, igual que en los otros servicios:
//   1. PRIMERO se guarda en Firestore (la nube).
//   2. Si funcionó, RECIÉN se agrega a la copia en memoria.
// Así la pantalla nunca muestra algo que en realidad no se guardó.
// setDoc usa la clave/letra/código como NOMBRE del documento. Si ya
// existiera uno con ese nombre, sería "modificarlo", y las reglas de
// Firestore no dejan modificar (ver docs/firestore.rules).
export async function agregarCategoria(categoria: Categoria): Promise<boolean> {
  try {
    await setDoc(doc(baseDatos, 'categorias', categoria.clave), categoria);
  } catch (error) {
    console.error('Error al agregar la categoría:', error);
    return false;
  }
  listaCategorias.push(categoria);
  ordenarListas();
  return true;
}

export async function agregarTorre(torre: Torre): Promise<boolean> {
  try {
    await setDoc(doc(baseDatos, 'torres', torre.letra), torre);
  } catch (error) {
    console.error('Error al agregar la torre:', error);
    return false;
  }
  listaTorres.push(torre);
  ordenarListas();
  return true;
}

export async function agregarSala(sala: Sala): Promise<boolean> {
  try {
    await setDoc(doc(baseDatos, 'salas', sala.codigo), sala);
  } catch (error) {
    console.error('Error al agregar la sala:', error);
    return false;
  }
  listaSalas.push(sala);
  ordenarListas();
  return true;
}
