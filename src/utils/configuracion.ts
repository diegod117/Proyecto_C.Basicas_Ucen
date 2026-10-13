// configuracion.ts
// Funciones de ayuda para la página "Configuración": validar las categorías,
// torres y salas nuevas antes de guardarlas.
// Cubre: RF-08, RF-10, RNF-05

import type { Categoria, Torre, Sala } from '../types/Configuracion';
import { prepararTextoParaBuscar } from './filtrosInventario';

// crearClaveCategoria
// Recibe: el nombre que escribió el encargado, ej: "Material de vidrio".
// Devuelve: la clave para guardar, ej: "material_de_vidrio"
// (minúsculas, sin tildes y con guion bajo en vez de espacios).
export function crearClaveCategoria(nombre: string): string {
  return prepararTextoParaBuscar(nombre).replaceAll(' ', '_');
}

// validarNuevaCategoria
// Recibe: el nombre escrito y las categorías que ya existen.
// Devuelve: un mensaje de error, o '' (texto vacío) si se puede agregar.
export function validarNuevaCategoria(nombre: string, existentes: Categoria[]): string {
  if (nombre.trim() === '') {
    return 'Escribe el nombre de la categoría.';
  }
  const clave = crearClaveCategoria(nombre);
  for (const categoria of existentes) {
    if (categoria.clave === clave) {
      return 'Ya existe la categoría "' + categoria.nombre + '".';
    }
  }
  return '';
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
