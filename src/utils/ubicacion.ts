// ubicacion.ts
// Funciones para generar y validar la ubicación física de un recurso.
// HU-11 pide que cada recurso tenga una ubicación OBLIGATORIA
// (laboratorio, bodega y mueble) con un código para encontrarlo rápido.
// También valida el cambio de ubicación de un recurso que ya existe.
// Cubre: HU-11, RF-10 (CA-11.1 y CA-11.2)

import type { Recurso, Ubicacion } from '../types/Recurso';

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

// buscarRecursoRepetido
// Recibe: un nombre, un código de ubicación, la lista de recursos y el id de
//         un recurso que se debe ignorar (el que se está modificando).
// Devuelve: el recurso que ya tiene ese mismo nombre en ese mismo código, o
// undefined si no hay ninguno. No distingue mayúsculas de minúsculas.
// La usan "Agregar recurso" y "Cambiar ubicación" para no repetir la regla.
export function buscarRecursoRepetido(
  nombre: string,
  codigo: string,
  existentes: Recurso[],
  idIgnorado: number,
): Recurso | undefined {
  const nombreBuscado = nombre.trim().toLowerCase();
  for (const recurso of existentes) {
    if (
      recurso.id !== idIgnorado &&
      recurso.nombre.toLowerCase() === nombreBuscado &&
      recurso.ubicacion.codigo === codigo
    ) {
      return recurso;
    }
  }
  return undefined;
}

// validarCambioUbicacion
// Recibe: el recurso, la ubicación nueva (ya armada con su código) y la lista
//         de todos los recursos.
// Devuelve: un mensaje de error, o '' (texto vacío) si el cambio se puede guardar.
// Revisa en orden y devuelve el PRIMER problema que encuentra (CA-11.2).
export function validarCambioUbicacion(
  recurso: Recurso,
  nuevaUbicacion: Ubicacion,
  existentes: Recurso[],
): string {
  // La sala se elige de una lista, así que lo único que puede fallar es no elegir ninguna
  if (nuevaUbicacion.sala === '') {
    return 'Elige la sala donde queda el recurso.';
  }

  // Bodega y mueble no pueden quedar vacíos (reutiliza la validación de HU-11)
  const problemas = validarUbicacion(nuevaUbicacion);
  if (problemas.length > 0) {
    return problemas[0];
  }

  // Tiene que ser distinta a la que ya tiene
  const actual = recurso.ubicacion;
  if (
    actual.torre === nuevaUbicacion.torre &&
    actual.sala === nuevaUbicacion.sala &&
    actual.bodega === nuevaUbicacion.bodega &&
    actual.mueble === nuevaUbicacion.mueble
  ) {
    return 'La ubicación nueva es igual a la actual. Cambia algún dato para moverlo.';
  }

  // No puede chocar con otro recurso del mismo nombre en esa ubicación
  const repetido = buscarRecursoRepetido(recurso.nombre, nuevaUbicacion.codigo, existentes, recurso.id);
  if (repetido !== undefined) {
    return 'Ya existe "' + repetido.nombre + '" en ' + nuevaUbicacion.codigo + '.';
  }

  return '';
}
