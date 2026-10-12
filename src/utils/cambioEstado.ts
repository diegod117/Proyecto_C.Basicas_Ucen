// cambioEstado.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Herramientas para el recuadro "Cambiar estado" de la ficha de un recurso
// (por ejemplo, pasar 1 multímetro de Disponible a Dañado):
//   1. elegir qué estado aparece marcado al abrir el recuadro,
//   2. revisar que lo que se escribió tenga sentido,
//   3. armar el mensaje de "listo, cambio guardado".
// En la guía: paso 4 (formularios y validación).
// Cubre: HU-02, RF-01

import type { Recurso, EstadoRecurso } from '../types/Recurso';
import { obtenerEstadosConUnidades, textoEstado } from './inventario';

// obtenerEstadoOrigenInicial
// Recibe: un recurso.
// Devuelve: el estado que aparece elegido al abrir el recuadro.
// Casi siempre es "disponible". Pero si el recurso no tiene ninguna unidad
// disponible (ej: la campana, que está toda en mantención), elegimos el
// primer estado que SÍ tenga unidades. Si no, el recuadro partiría en un
// estado con 0 unidades, que no sirve para nada.
export function obtenerEstadoOrigenInicial(recurso: Recurso): EstadoRecurso {
  if (recurso.cantidades.disponible > 0) {
    return 'disponible';
  }

  const estadosConUnidades = obtenerEstadosConUnidades(recurso);
  // .length = cuántos elementos tiene la lista.
  if (estadosConUnidades.length > 0) {
    // [0] = el PRIMER elemento (en programación se cuenta desde 0).
    return estadosConUnidades[0];
  }

  // No tiene unidades en ningún estado: dejamos "disponible".
  return 'disponible';
}

// validarCambioEstado
// Recibe: el recurso y lo que se escribió en el recuadro.
//   - cantidadTexto es TEXTO porque las cajitas <input> siempre entregan texto.
// Devuelve: un mensaje de error, o '' (texto vacío) si todo está bien.
// Revisa los errores EN ORDEN y devuelve el PRIMERO que encuentra,
// como un guardia que revisa tu mochila: a la primera cosa prohibida, te para.
export function validarCambioEstado(
  recurso: Recurso,
  estadoOrigen: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
  cantidadTexto: string,
  motivo: string,
): string {
  // 1) No tiene sentido "cambiar" al mismo estado (de Dañado a Dañado).
  if (estadoOrigen === estadoNuevo) {
    return 'El estado nuevo debe ser distinto al estado actual.';
  }

  // 2) La cantidad tiene que ser un número entero mayor que 0.
  //    Number() convierte texto en número: "3" -> 3, "abc" -> NaN (no es número).
  //    Number.isInteger() revisa que sea entero: 3 sí, 2.5 no, NaN no.
  //    El ! significa "NO": "si NO es entero, O es menor que 1...".
  const cantidad = Number(cantidadTexto);
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return 'La cantidad debe ser un número entero mayor que 0.';
  }

  // 3) No se pueden mover más unidades de las que hay.
  //    Ej: si hay 1 multímetro dañado, no puedes pasar 3 a mantención.
  //    recurso.cantidades[estadoOrigen] = "abre el cajón del estado de origen".
  const unidadesEnOrigen = recurso.cantidades[estadoOrigen];
  if (cantidad > unidadesEnOrigen) {
    // Un mensaje armado pegando textos con +.
    // \" no se usa aquí: las comillas dobles van dentro de comillas simples sin problema.
    return (
      'Solo hay ' + unidadesEnOrigen + ' unidad(es) en estado "' +
      textoEstado(estadoOrigen) + '".'
    );
  }

  // 4) El motivo es obligatorio: queda anotado en el historial.
  if (motivo.trim() === '') {
    return 'Escribe el motivo del cambio (ej: "Punta rota").';
  }

  // Pasó todas las revisiones: no hay errores.
  return '';
}

// textoResumenCambio
// Recibe: la cantidad y los dos estados del cambio que se guardó.
// Devuelve: el mensaje para contarle a la persona qué se hizo.
// Ejemplo: "Cambio guardado: 1 unidad de Disponible → Dañado."
export function textoResumenCambio(
  cantidad: number,
  estadoOrigen: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
): string {
  // Plural por defecto, singular si es 1.
  let textoUnidades = cantidad + ' unidades';
  if (cantidad === 1) {
    textoUnidades = '1 unidad';
  }

  return (
    'Cambio guardado: ' + textoUnidades + ' de ' +
    textoEstado(estadoOrigen) + ' → ' + textoEstado(estadoNuevo) + '.'
  );
}
