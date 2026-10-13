// configuracionService.ts
// Servicio de la configuración del sistema: categorías de recursos, torres
// y salas. Igual que los otros servicios, guarda una COPIA EN MEMORIA de
// las colecciones de Firestore "categorias", "torres" y "salas", que se
// llena al iniciar sesión (cargarConfiguracion).
// Las páginas leen la copia (obtener...) y agregan datos con agregar...
// No hay funciones para borrar: un recurso o una reserva podría estar
// usando esa categoría o sala.
// Cubre: RF-08, RF-10, RNF-05 (agregar categorías, torres y salas sin programar)

import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { baseDatos } from './firebase';
import type { Categoria, Torre, Sala } from '../types/Configuracion';
import { listaCategoriasPrueba, listaTorresPrueba, listaSalasPrueba } from '../data/configuracion';

// Copias en memoria (parten vacías)
const listaCategorias: Categoria[] = [];
const listaTorres: Torre[] = [];
const listaSalas: Sala[] = [];

// cargarConfiguracion
// No recibe nada. Descarga las 3 colecciones y llena las copias en memoria.
// Si una colección está vacía (primera vez), sube los datos de
// src/data/configuracion.ts. La llama cargarTodosLosDatos() al iniciar sesión.
export async function cargarConfiguracion(): Promise<void> {
  // --- Categorías ---
  const categorias = await getDocs(collection(baseDatos, 'categorias'));
  listaCategorias.splice(0, listaCategorias.length);
  if (categorias.empty) {
    const lote = writeBatch(baseDatos);
    for (const categoria of listaCategoriasPrueba) {
      lote.set(doc(baseDatos, 'categorias', categoria.clave), categoria);
      listaCategorias.push(categoria);
    }
    await lote.commit();
  } else {
    for (const documento of categorias.docs) {
      listaCategorias.push(documento.data() as Categoria);
    }
  }

  // --- Torres ---
  const torres = await getDocs(collection(baseDatos, 'torres'));
  listaTorres.splice(0, listaTorres.length);
  if (torres.empty) {
    const lote = writeBatch(baseDatos);
    for (const torre of listaTorresPrueba) {
      lote.set(doc(baseDatos, 'torres', torre.letra), torre);
      listaTorres.push(torre);
    }
    await lote.commit();
  } else {
    for (const documento of torres.docs) {
      listaTorres.push(documento.data() as Torre);
    }
  }

  // --- Salas ---
  const salas = await getDocs(collection(baseDatos, 'salas'));
  listaSalas.splice(0, listaSalas.length);
  if (salas.empty) {
    const lote = writeBatch(baseDatos);
    for (const sala of listaSalasPrueba) {
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
// Ordena las 3 listas para mostrarlas siempre igual:
// categorías por nombre, torres por letra y salas por código.
// localeCompare compara textos como un diccionario (respeta las tildes).
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
// No reciben nada. Devuelven la lista completa (copia en memoria).
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
// Recibe: la letra de una torre. Devuelve: solo las salas de esa torre.
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
// Devuelve: la categoría, o undefined si no existe.
export function obtenerCategoriaPorClave(clave: string): Categoria | undefined {
  for (const categoria of listaCategorias) {
    if (categoria.clave === clave) {
      return categoria;
    }
  }
  return undefined;
}

// agregarCategoria / agregarTorre / agregarSala
// Reciben: el dato nuevo, YA VALIDADO (ver utils/configuracion.ts).
// Devuelven: una promesa con true si Firestore lo guardó, o false si falló.
// Igual que en los otros servicios: primero Firestore y, si funcionó,
// recién se agrega a la copia en memoria.
// setDoc usa la clave/letra/código como nombre del documento: si ya
// existiera, sería una modificación y las reglas de Firestore la rechazan.
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
