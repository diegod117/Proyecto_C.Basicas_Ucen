// cambioEstado.ts
// Funciones de ayuda para el formulario de cambio de estado de un recurso:
// elegir el estado inicial y validar los datos antes de guardar.
// Cubre: HU-02, RF-01, HU-15 (máximo de unidades por operación)

import type { Recurso, EstadoRecurso } from '../types/Recurso';
import { obtenerEstadosConUnidades, textoEstado } from './inventario';
import { validarUnidadesPorOperacion } from './unidades';

// obtenerEstadoOrigenInicial
// Recibe: un recurso.
// Devuelve: el estado que aparece elegido al abrir el formulario.
// Normalmente es "disponible", pero si el recurso no tiene unidades
// disponibles (ej: la campana, que está toda en mantención), elegimos
// el primer estado que sí tenga unidades.
export function obtenerEstadoOrigenInicial(recurso: Recurso): EstadoRecurso {
  if (recurso.cantidades.disponible > 0) {
    return 'disponible';
  }

  const estadosConUnidades = obtenerEstadosConUnidades(recurso);
  if (estadosConUnidades.length > 0) {
    return estadosConUnidades[0]; // [0] = el primer elemento de la lista
  }

  // Si no tiene unidades en ningún estado, dejamos "disponible"
  return 'disponible';
}

// validarCambioEstado
// Recibe: el recurso y los datos que escribió el usuario en el formulario.
//   - cantidadTexto viene como texto porque así lo entrega el <input>.
// Devuelve: un mensaje de error, o '' (texto vacío) si todo está bien.
// Revisamos los errores en orden y devolvemos el PRIMERO que encontremos.
export function validarCambioEstado(
  recurso: Recurso,
  estadoOrigen: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
  cantidadTexto: string,
  motivo: string,
): string {
  // 1) No tiene sentido "cambiar" a el mismo estado
  if (estadoOrigen === estadoNuevo) {
    return 'El estado nuevo debe ser distinto al estado actual.';
  }

  // 2) La cantidad debe ser un número entero mayor que 0.
  //    Number() convierte el texto en número ("3" -> 3, "abc" -> NaN).
  //    Number.isInteger() revisa que sea entero (3 sí, 2.5 no, NaN no).
  const cantidad = Number(cantidadTexto);
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return 'La cantidad debe ser un número entero mayor que 0.';
  }

  // 3) No se pueden mover más unidades de las que hay en el estado de origen.
  //    Ej: si hay 1 multímetro dañado, no se pueden pasar 3 a mantención.
  const unidadesEnOrigen = recurso.cantidades[estadoOrigen];
  if (cantidad > unidadesEnOrigen) {
    return (
      'Solo hay ' + unidadesEnOrigen + ' unidad(es) en estado "' +
      textoEstado(estadoOrigen) + '".'
    );
  }

  // 4) El motivo es obligatorio: queda como registro de por qué se cambió
  if (motivo.trim() === '') {
    return 'Escribe el motivo del cambio (ej: "Punta rota").';
  }

  // Si llegamos hasta aquí, no hubo errores
  return '';
}

// textoResumenCambio
// Recibe: la cantidad y los dos estados del cambio que se guardó.
// Devuelve: un texto para confirmarle al usuario qué se hizo.
// Ejemplo: "Cambio guardado: 1 unidad de Disponible → Dañado."
export function textoResumenCambio(
  cantidad: number,
  estadoOrigen: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
): string {
  let textoUnidades = cantidad + ' unidades';
  if (cantidad === 1) {
    textoUnidades = '1 unidad';
  }

  return (
    'Cambio guardado: ' + textoUnidades + ' de ' +
    textoEstado(estadoOrigen) + ' → ' + textoEstado(estadoNuevo) + '.'
  );
}

// validarCambioEstadoUnidades
// Recibe: el recurso, los números de serie de las unidades marcadas, el
//         estado nuevo y el motivo.
// Devuelve: un mensaje de error, o '' (texto vacío) si todo está bien.
// Es la versión de validarCambioEstado para equipos e instrumentos (CA-02.2,
// CA-02.3): se eligen unidades específicas en vez de una cantidad.
export function validarCambioEstadoUnidades(
  recurso: Recurso,
  numerosMarcados: string[],
  estadoNuevo: EstadoRecurso,
  motivo: string,
): string {
  if (numerosMarcados.length === 0) {
    return 'Marca al menos una unidad.';
  }
  // Cada unidad deja su registro en el historial dentro del mismo lote (ver unidades.ts)
  const errorMaximo = validarUnidadesPorOperacion(numerosMarcados.length);
  if (errorMaximo !== '') {
    return errorMaximo;
  }

  // Ninguna unidad marcada puede estar ya en el estado nuevo
  if (recurso.unidades !== undefined) {
    for (const unidad of recurso.unidades) {
      if (numerosMarcados.includes(unidad.numero) && unidad.estado === estadoNuevo) {
        return 'La unidad ' + unidad.numero + ' ya está en estado "' + textoEstado(estadoNuevo) + '".';
      }
    }
  }

  if (motivo.trim() === '') {
    return 'Escribe el motivo del cambio (ej: "Punta rota").';
  }

  return '';
}

// textoResumenCambioUnidades
// Recibe: los números de serie cambiados y el estado nuevo.
// Devuelve: el mensaje de confirmación (CA-02.4).
export function textoResumenCambioUnidades(numeros: string[], estadoNuevo: EstadoRecurso): string {
  if (numeros.length === 1) {
    return 'Cambio guardado: la unidad ' + numeros[0] + ' pasó a ' + textoEstado(estadoNuevo) + '.';
  }
  return 'Cambio guardado: ' + numeros.length + ' unidades pasaron a ' + textoEstado(estadoNuevo) + '.';
}
