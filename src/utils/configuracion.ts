// configuracion.ts
// Funciones de ayuda para la página "Configuración": validar las categorías,
// torres y salas nuevas antes de guardarlas, y mostrar la descripción de una categoría.
// Cubre: RF-08 (categorías con descripción breve), RF-10, RNF-05,
//        HU-16 (claves de categoría válidas para Firestore)

import type { Categoria, Torre, Sala } from '../types/Configuracion';
import { prepararTextoParaBuscar } from './filtrosInventario';

// Máximo de caracteres de la descripción de una categoría: tiene que ser "breve" (RF-08)
export const MAXIMO_DESCRIPCION_CATEGORIA = 120;

// crearClaveCategoria
// Recibe: el nombre que escribió el encargado, ej: "Material de vidrio".
// Devuelve: la clave para guardar, ej: "material_de_vidrio"
// (minúsculas, sin tildes y con guion bajo en vez de espacios).
// La clave es el NOMBRE DEL DOCUMENTO en Firestore, y Firestore no acepta una
// "/" en ese nombre (la tomaría como una carpeta). Por eso, y solo por eso,
// la "/" también se cambia por "_". Las claves de las categorías ya guardadas
// no se pueden modificar, así que NO se tocó nada más: cualquier nombre sin
// "/" (con ñ, guiones, paréntesis, comas o espacios dobles) da la misma clave
// que antes y las categorías repetidas se siguen detectando.
export function crearClaveCategoria(nombre: string): string {
  return prepararTextoParaBuscar(nombre).replaceAll(' ', '_').replaceAll('/', '_');
}

// claveCategoriaValida
// Recibe: una clave de categoría (ya creada con crearClaveCategoria).
// Devuelve: true si Firestore la acepta como nombre de documento. Firestore
// rechaza un nombre vacío, "." , ".." y los que empiezan y terminan con "__".
export function claveCategoriaValida(clave: string): boolean {
  if (clave === '' || clave === '.' || clave === '..') {
    return false;
  }
  if (clave.length >= 4 && clave.startsWith('__') && clave.endsWith('__')) {
    return false;
  }
  return true;
}

// validarNuevaCategoria
// Recibe: el nombre escrito, la descripción breve escrita y las categorías que ya existen.
// Devuelve: un mensaje de error, o '' (texto vacío) si se puede agregar.
export function validarNuevaCategoria(
  nombre: string,
  descripcion: string,
  existentes: Categoria[],
): string {
  if (nombre.trim() === '') {
    return 'Escribe el nombre de la categoría.';
  }
  const clave = crearClaveCategoria(nombre);
  if (!claveCategoriaValida(clave)) {
    return 'El nombre no es válido para una categoría. Usa letras o números.';
  }
  for (const categoria of existentes) {
    if (categoria.clave === clave) {
      return 'Ya existe la categoría "' + categoria.nombre + '".';
    }
  }
  // La descripción es obligatoria al crear una categoría (RF-08) y debe ser breve
  const descripcionLimpia = descripcion.trim();
  if (descripcionLimpia === '') {
    return 'Escribe una descripción breve de la categoría.';
  }
  if (descripcionLimpia.length > MAXIMO_DESCRIPCION_CATEGORIA) {
    return (
      'La descripción debe tener máximo ' + MAXIMO_DESCRIPCION_CATEGORIA +
      ' caracteres (tiene ' + descripcionLimpia.length + ').'
    );
  }
  return '';
}

// textoDescripcionCategoria
// Recibe: una categoría.
// Devuelve: su descripción breve, o "Sin descripción" si no tiene (las
// categorías guardadas antes de RF-08 no traen el campo, o viene vacío o
// con solo espacios).
export function textoDescripcionCategoria(categoria: Categoria): string {
  if (categoria.descripcion === undefined || categoria.descripcion.trim() === '') {
    return 'Sin descripción';
  }
  return categoria.descripcion.trim();
}

// validarNuevaTorre
// Recibe: la letra escrita y las torres que ya existen.
// Devuelve: un mensaje de error, o '' si se puede agregar.
// La torre es UNA letra (A-Z), igual que B y C.
export function validarNuevaTorre(letra: string, existentes: Torre[]): string {
  const letraLimpia = letra.trim().toUpperCase();
  if (letraLimpia.length !== 1 || letraLimpia < 'A' || letraLimpia > 'Z') {
    return 'La torre debe ser una sola letra, ej: "D".';
  }
  for (const torre of existentes) {
    if (torre.letra === letraLimpia) {
      return 'La torre ' + letraLimpia + ' ya existe.';
    }
  }
  return '';
}

// validarNuevaSala
// Recibe: la torre elegida, el número escrito y las salas que ya existen.
// Devuelve: un mensaje de error, o '' si se puede agregar.
export function validarNuevaSala(torre: string, numero: string, existentes: Sala[]): string {
  if (torre === '') {
    return 'Elige la torre de la sala.';
  }
  const numeroLimpio = numero.trim();
  // El número de sala son solo dígitos, ej: "307"
  if (numeroLimpio === '' || !Number.isInteger(Number(numeroLimpio)) || numeroLimpio.includes('.')) {
    return 'El número de sala debe ser un número, ej: "305".';
  }
  const codigo = torre + numeroLimpio;
  for (const sala of existentes) {
    if (sala.codigo === codigo) {
      return 'La sala ' + codigo + ' ya existe.';
    }
  }
  return '';
}
