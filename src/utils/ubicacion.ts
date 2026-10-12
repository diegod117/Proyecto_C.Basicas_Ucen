// ubicacion.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Herramientas para la UBICACIÓN de un recurso: dónde está guardado
// (torre, sala, bodega y mueble) y su código corto para encontrarlo rápido.
// HU-11 dice que la ubicación es OBLIGATORIA.
// En la guía: paso 2 (funciones y textos).
// Cubre: HU-11, RF-10

import type { Ubicacion } from '../types/Recurso';

// ¿Cómo se arma el código de ubicación?
//   torre + sala - bodega - mueble
//   Ej: torre B, sala 307, Bodega 1, Mueble 2  ->  "B307-B1-M2"
// Caso especial: cosas que están en la sala misma (mesas, campanas), con
// bodega "Sala" y mueble "Sin mueble"  ->  "B308-SALA"
// Es como la dirección de una casa abreviada: calle, número, depto.

// abreviarBodega
// Recibe: el nombre de la bodega, ej: "Bodega 1" o "Sala".
// Devuelve: su versión corta para el código, ej: "B1" o "SALA".
export function abreviarBodega(bodega: string): string {
  // trim() borra espacios sobrantes al principio y al final.
  const bodegaLimpia = bodega.trim();

  // startsWith = "¿este texto EMPIEZA con...?"
  if (bodegaLimpia.startsWith('Bodega ')) {
    // replace('Bodega ', '') = cambia "Bodega " por nada.
    // "Bodega 1" -> "1" -> le pegamos una B adelante -> "B1".
    return 'B' + bodegaLimpia.replace('Bodega ', '');
  }

  // Cualquier otro nombre (ej: "Sala") va completo y en MAYÚSCULAS.
  return bodegaLimpia.toUpperCase();
}

// abreviarMueble
// Recibe: el nombre del mueble, ej: "Mueble 2" o "Sin mueble".
// Devuelve: su versión corta, ej: "M2", o '' (nada) si no hay mueble.
export function abreviarMueble(mueble: string): string {
  const muebleLimpio = mueble.trim();

  if (muebleLimpio.startsWith('Mueble ')) {
    return 'M' + muebleLimpio.replace('Mueble ', '');
  }

  // "Sin mueble" no aporta nada al código, así que devolvemos vacío.
  return '';
}

// generarCodigoUbicacion
// Recibe: una ubicación.
// Devuelve: el código que le corresponde, ej: "B307-B1-M2".
// Así nadie tiene que escribir el código a mano (y equivocarse).
// La usa el formulario "Agregar recurso" para mostrar el código mientras escribes.
export function generarCodigoUbicacion(ubicacion: Ubicacion): string {
  // "let" porque más abajo le podemos pegar el mueble.
  let codigo = ubicacion.torre + ubicacion.sala.trim() + '-' + abreviarBodega(ubicacion.bodega);

  const abreviaturaMueble = abreviarMueble(ubicacion.mueble);
  // !== = "es distinto de". Si el mueble NO es vacío, lo pegamos al final.
  if (abreviaturaMueble !== '') {
    codigo = codigo + '-' + abreviaturaMueble;
  }

  return codigo;
}

// esSoloNumeros
// Recibe: un texto, ej: "307".
// Devuelve: true si tiene al menos una letra y TODAS son dígitos (0 al 9).
// No lleva "export": es un ayudante privado de este archivo.
function esSoloNumeros(texto: string): boolean {
  if (texto === '') {
    return false;
  }
  // Un for...of sobre un texto lo recorre letra por letra.
  // Los dígitos se pueden comparar como textos: '3' está entre '0' y '9'.
  // Si una letra está fuera de ese rango (ej: 'a'), no es un número.
  for (const caracter of texto) {
    if (caracter < '0' || caracter > '9') {
      return false;
    }
  }
  return true;
}

// validarUbicacion
// Recibe: una ubicación.
// Devuelve: una LISTA con todos los problemas que encontró.
// Si la lista viene vacía ([]), la ubicación está perfecta.
// (A diferencia de validarCambioEstado, que avisa solo el primer error,
// aquí juntamos TODOS para mostrarlos de una vez.)
// "string[]" = una lista de textos.
export function validarUbicacion(ubicacion: Ubicacion): string[] {
  const problemas: string[] = [];

  // 1) Los datos obligatorios (HU-11).
  //    trim() evita que alguien "llene" un campo solo con espacios.
  if (!esSoloNumeros(ubicacion.sala.trim())) {
    problemas.push('La sala debe ser un número, ej: "307".');
  }
  if (ubicacion.bodega.trim() === '') {
    problemas.push('Falta la bodega.');
  }
  if (ubicacion.mueble.trim() === '') {
    problemas.push('Falta el mueble (si no tiene, escribir "Sin mueble").');
  }

  // 2) El código guardado tiene que calzar con la ubicación.
  //    Ej: si dice Bodega 2 pero el código es "B307-B1-M2", alguien se equivocó.
  //    Solo lo revisamos si no hubo problemas antes (si falta la bodega,
  //    no podemos calcular el código correcto para comparar).
  if (problemas.length === 0) {
    const codigoCorrecto = generarCodigoUbicacion(ubicacion);
    if (ubicacion.codigo !== codigoCorrecto) {
      problemas.push(
        'El código "' + ubicacion.codigo + '" no coincide con la ubicación (debería ser "' +
          codigoCorrecto + '").',
      );
    }
  }

  return problemas;
}
