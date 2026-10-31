// valoresPlanilla.ts
// Funciones pequeñas para limpiar los valores de las celdas de la planilla
// Excel: pasar una celda a texto, ignorar "Desconocido" o "SIN SERIE", partir
// "NOMBRE: detalle", leer la cantidad y normalizar el nombre de una categoría.
// Son funciones puras: no guardan nada ni usan Firebase.
// Cubre: HU-16, RF-15

import type { CeldaPlanilla } from '../types/Importacion';

// textoCelda
// Recibe: una celda (texto, número, verdadero/falso o vacía).
// Devuelve: su texto sin espacios sobrantes ('' si la celda está vacía).
export function textoCelda(celda: CeldaPlanilla | undefined): string {
  if (celda === null || celda === undefined) {
    return '';
  }
  return String(celda).trim();
}

// limpiarValorOpcional
// Recibe: el texto de una marca, modelo o número de serie.
// Devuelve: ese mismo texto, o '' si la planilla escribió "Desconocido",
// "Sin marca" o "SIN SERIE" (son formas de decir "no hay dato").
export function limpiarValorOpcional(texto: string): string {
  const minuscula = texto.trim().toLowerCase();
  if (minuscula === 'desconocido' || minuscula === 'sin marca' || minuscula === 'sin serie') {
    return '';
  }
  return texto.trim();
}

// partirDescripcion
// Recibe: la descripción de la planilla, ej: "TERMO:Capacidad 80 litros".
// Devuelve: el nombre (lo que va antes del primer ":") y el detalle (lo que
// va después). Si no hay ":", todo el texto es el nombre y el detalle queda vacío.
export function partirDescripcion(descripcion: string): { nombre: string; detalle: string } {
  const posicion = descripcion.indexOf(':');
  if (posicion === -1) {
    return { nombre: descripcion.trim(), detalle: '' };
  }
  return {
    nombre: descripcion.slice(0, posicion).trim(),
    detalle: descripcion.slice(posicion + 1).trim(),
  };
}

// LecturaCantidad: lo que devuelve leerCantidad
export interface LecturaCantidad {
  cantidad: number; // 0 si hubo error
  nota: string; // lo que sobra después del número, ej: "kit" en "4 kit"
  error: string; // '' si la cantidad está bien
}

// leerCantidad
// Recibe: la celda de la columna CANTIDAD.
// Devuelve: la cantidad como número entero (mínimo 1). Si es texto que
// empieza con un número ("4 kit"), toma ese número y deja el resto como nota.
// Si está vacía, es 0, negativa, decimal o no empieza con un número,
// devuelve un mensaje de error.
export function leerCantidad(celda: CeldaPlanilla): LecturaCantidad {
  const texto = textoCelda(celda);
  if (texto === '') {
    return { cantidad: 0, nota: '', error: 'Falta la cantidad.' };
  }

  // Juntamos los dígitos del comienzo del texto
  let digitos = '';
  for (const caracter of texto) {
    if (caracter >= '0' && caracter <= '9') {
      digitos = digitos + caracter;
    } else {
      break;
    }
  }
  if (digitos === '') {
    return { cantidad: 0, nota: '', error: 'La cantidad "' + texto + '" no es un número.' };
  }

  const resto = texto.slice(digitos.length).trim();
  // "2,5" o "2.5" es un decimal: no sirve para contar unidades
  if (resto.startsWith(',') || resto.startsWith('.')) {
    return { cantidad: 0, nota: '', error: 'La cantidad "' + texto + '" debe ser un número entero.' };
  }

  const cantidad = Number(digitos);
  if (cantidad < 1) {
    return { cantidad: 0, nota: '', error: 'La cantidad debe ser 1 o más.' };
  }
  return { cantidad: cantidad, nota: resto, error: '' };
}

// normalizarNombreCategoria
// Recibe: el nombre de la categoría tal como está en la planilla, ej:
//         "SISTEMAS DE CONTROL DE TEMPERATURA " (con espacio al final).
// Devuelve: el nombre sin espacios sobrantes, en minúsculas y con la primera
// letra en mayúscula: "Sistemas de control de temperatura".
export function normalizarNombreCategoria(nombre: string): string {
  // split(' ') separa por espacios y filter quita los pedazos vacíos
  // (así los espacios dobles se convierten en uno solo)
  const palabras = nombre.split(' ').filter((palabra) => palabra !== '');
  const limpio = palabras.join(' ').toLowerCase();
  if (limpio === '') {
    return '';
  }
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

// codigoDeSala
// Recibe: el texto de un encabezado de sala, ej: "B-206".
// Devuelve: el código de la sala, ej: "B206", o '' si el texto no tiene
// la forma letra + número (una torre y el número de sala).
export function codigoDeSala(texto: string): string {
  const limpio = texto.trim().replaceAll('-', '').replaceAll(' ', '').toUpperCase();
  if (limpio.length < 2) {
    return '';
  }
  const torre = limpio.charAt(0);
  if (torre < 'A' || torre > 'Z') {
    return '';
  }
  for (const caracter of limpio.slice(1)) {
    if (caracter < '0' || caracter > '9') {
      return '';
    }
  }
  return limpio;
}

// armarObservacion
// Recibe: el detalle de la descripción, el modelo, la observación de la
//         planilla y la nota de la cantidad (ej: "4 kit").
// Devuelve: un solo texto con lo que haya, separado por " | ", ej:
// "Detalle: Capacidad 2000 gr | Modelo: PFB2000-2". Si no hay nada, ''.
export function armarObservacion(
  detalle: string,
  modelo: string,
  observacion: string,
  notaCantidad: string,
): string {
  const partes: string[] = [];
  if (detalle !== '') {
    partes.push('Detalle: ' + detalle);
  }
  if (modelo !== '') {
    partes.push('Modelo: ' + modelo);
  }
  if (observacion !== '') {
    partes.push('Observación: ' + observacion);
  }
  if (notaCantidad !== '') {
    partes.push('Cantidad en planilla: ' + notaCantidad);
  }
  return partes.join(' | ');
}
