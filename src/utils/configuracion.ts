// configuracion.ts (en utils/)
// ¿QUÉ ES ESTE ARCHIVO?
// Los "revisores" de la página "Configuración": antes de guardar una
// categoría, torre o sala nueva, revisan que esté bien escrita y que no
// exista ya. Si algo está mal, devuelven el mensaje de error.
// Es como el profesor que revisa tu prueba antes de ponerle nota.
// En la guía: paso 13 (Configuración).
// Cubre: RF-08, RF-10, RNF-05

import type { Categoria, Torre, Sala } from '../types/Configuracion';
// prepararTextoParaBuscar pasa un texto a minúsculas y le quita las tildes
// (ya existía para el buscador del inventario: lo reutilizamos).
import { prepararTextoParaBuscar } from './filtrosInventario';

// crearClaveCategoria
// Recibe: el nombre que escribió el encargado, ej: "Material de vidrio".
// Devuelve: la clave para guardar, ej: "material_de_vidrio"
// (minúsculas, sin tildes y con guion bajo en vez de espacios).
// replaceAll(' ', '_') = "cambia TODOS los espacios por guiones bajos".
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
  // Comparamos CLAVES, no nombres: así "Equipo", "equipo" y "Équipo"
  // cuentan como la misma categoría (las tres dan la clave 'equipo').
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
  // toUpperCase() = a MAYÚSCULA, así "d" y "D" son lo mismo.
  const letraLimpia = letra.trim().toUpperCase();
  // Tres formas de estar mal (unidas con || = "o"):
  //   - no es UN solo carácter (ej: "DD" o ""),
  //   - o va antes de la 'A',
  //   - o va después de la 'Z' (ej: "7" o "#" no son letras).
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
  // El número de sala son solo dígitos, ej: "307". Está mal si:
  //   - está vacío, o
  //   - no es un número entero (ej: "abc"), o
  //   - tiene un punto (ej: "3.5"; Number lo aceptaría, pero no es una sala).
  if (numeroLimpio === '' || !Number.isInteger(Number(numeroLimpio)) || numeroLimpio.includes('.')) {
    return 'El número de sala debe ser un número, ej: "305".';
  }
  // El código de la sala = torre + número pegados (ej: "D" + "101" = "D101").
  const codigo = torre + numeroLimpio;
  for (const sala of existentes) {
    if (sala.codigo === codigo) {
      return 'La sala ' + codigo + ' ya existe.';
    }
  }
  return '';
}
