// ubicacion.ts
// Funciones para generar y validar la ubicación física de un recurso.
// HU-11 pide que cada recurso tenga una ubicación OBLIGATORIA
// (laboratorio, bodega y mueble) con un código para encontrarlo rápido.
// Cubre: HU-11, RF-10

import type { Ubicacion } from '../types/Recurso';

// Regla del código de ubicación:
//   torre + sala - bodega - mueble
//   Ej: torre B, sala 307, Bodega 1, Mueble 2  ->  "B307-B1-M2"
// Caso especial: recursos que están en la sala misma (mesas, campanas),
// con bodega "Sala" y mueble "Sin mueble"  ->  "B308-SALA"

// abreviarBodega
// Recibe: el nombre de la bodega, ej: "Bodega 1" o "Sala".
// Devuelve: su abreviatura para el código, ej: "B1" o "SALA".
export function abreviarBodega(bodega: string): string {
  const bodegaLimpia = bodega.trim();

  // startsWith revisa si un texto empieza con otro
  if (bodegaLimpia.startsWith('Bodega ')) {
    // "Bodega 1" -> quitamos "Bodega " y queda "1" -> "B1"
    return 'B' + bodegaLimpia.replace('Bodega ', '');
  }

  // Cualquier otro nombre (ej: "Sala") se usa en mayúsculas
  return bodegaLimpia.toUpperCase();
}

// abreviarMueble
// Recibe: el nombre del mueble, ej: "Mueble 2" o "Sin mueble".
// Devuelve: su abreviatura, ej: "M2", o '' (vacío) si no hay mueble.
export function abreviarMueble(mueble: string): string {
  const muebleLimpio = mueble.trim();

  if (muebleLimpio.startsWith('Mueble ')) {
    return 'M' + muebleLimpio.replace('Mueble ', '');
  }

  // "Sin mueble" no aporta nada al código, así que no se agrega
  return '';
}

// generarCodigoUbicacion
// Recibe: una ubicación (se usan torre, sala, bodega y mueble).
// Devuelve: el código que le corresponde, ej: "B307-B1-M2".
// Sirve para crear el código automáticamente en vez de escribirlo a mano.
export function generarCodigoUbicacion(ubicacion: Ubicacion): string {
  let codigo = ubicacion.torre + ubicacion.sala.trim() + '-' + abreviarBodega(ubicacion.bodega);

  const abreviaturaMueble = abreviarMueble(ubicacion.mueble);
  if (abreviaturaMueble !== '') {
    codigo = codigo + '-' + abreviaturaMueble;
  }

  return codigo;
}

// esSoloNumeros
// Recibe: un texto, ej: "307".
// Devuelve: true si tiene al menos un carácter y todos son dígitos (0-9).
function esSoloNumeros(texto: string): boolean {
  if (texto === '') {
    return false;
  }
  // Revisamos carácter por carácter. Los dígitos van de '0' a '9',
  // y en JavaScript se pueden comparar como textos: '3' >= '0' y '3' <= '9'.
  for (const caracter of texto) {
    if (caracter < '0' || caracter > '9') {
      return false;
    }
  }
  return true;
}

// validarUbicacion
// Recibe: una ubicación.
// Devuelve: una LISTA con todos los problemas encontrados.
// Si la lista viene vacía ([]), la ubicación está correcta.
// (A diferencia de validarCambioEstado, aquí juntamos todos los problemas
// y no solo el primero, para mostrarlos todos de una vez en la ficha.)
export function validarUbicacion(ubicacion: Ubicacion): string[] {
  const problemas: string[] = [];

  // 1) Campos obligatorios (HU-11). trim() evita que "   " cuente como lleno.
  if (!esSoloNumeros(ubicacion.sala.trim())) {
    problemas.push('La sala debe ser un número, ej: "307".');
  }
  if (ubicacion.bodega.trim() === '') {
    problemas.push('Falta la bodega.');
  }
  if (ubicacion.mueble.trim() === '') {
    problemas.push('Falta el mueble (si no tiene, escribir "Sin mueble").');
  }

  // 2) El código guardado debe coincidir con el que corresponde a la
  //    ubicación. Ej: si dice Bodega 2 pero el código es "B307-B1-M2",
  //    alguien se equivocó al escribirlo.
  //    Solo lo revisamos si los campos están completos (si no, no se puede
  //    generar un código correcto para comparar).
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
