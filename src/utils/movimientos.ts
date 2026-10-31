// movimientos.ts
// Funciones de ayuda para los formularios de entrada y salida de unidades:
// validar lo que escribe el encargado y armar los mensajes de confirmación.
// Son funciones puras (no guardan nada): solo calculan.
// Cubre: HU-14, RF-13 (CA-14.1 y CA-14.2)

import type { Recurso, EstadoRecurso } from '../types/Recurso';
import type { TipoSalida } from '../types/CambioEstado';
import { textoEstado } from './inventario';
import { obtenerFechaHoy } from './fechas';
import { validarNumerosUnidades } from './unidades';
import { estadoNuevoDeSalida } from './historial';

// validarEntrada
// Recibe: el recurso, la cantidad (como texto, porque así la entrega el
//         <input>), la fecha en que ocurrió la entrada y los números de
//         serie de las unidades nuevas (solo si el recurso tiene unidades).
// Devuelve: un mensaje de error, o '' (texto vacío) si todo está bien.
export function validarEntrada(
  recurso: Recurso,
  cantidadTexto: string,
  fecha: string,
  numerosNuevos: string[],
): string {
  const cantidad = Number(cantidadTexto);
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return 'La cantidad debe ser un número entero mayor que 0.';
  }

  if (fecha === '') {
    return 'Elige la fecha de la entrada.';
  }
  // Las fechas "AAAA-MM-DD" se pueden comparar como texto: la más grande es la más futura
  if (fecha > obtenerFechaHoy()) {
    return 'La fecha de la entrada no puede ser futura.';
  }

  // En equipos e instrumentos con unidades, cada unidad nueva lleva su número,
  // distinto de los que el recurso ya tiene (CA-12.2)
  if (recurso.unidades !== undefined) {
    const numerosExistentes: string[] = [];
    for (const unidad of recurso.unidades) {
      numerosExistentes.push(unidad.numero);
    }
    return validarNumerosUnidades(numerosNuevos, cantidad, numerosExistentes);
  }

  return '';
}

// validarSalida
// Recibe: el recurso, el tipo de salida, los números de serie marcados (si
//         el recurso tiene unidades), el estado de origen y la cantidad
//         (si no tiene unidades) y el motivo.
// Devuelve: un mensaje de error, o '' (texto vacío) si todo está bien.
export function validarSalida(
  recurso: Recurso,
  tipo: TipoSalida,
  numerosMarcados: string[],
  estadoOrigen: EstadoRecurso,
  cantidadTexto: string,
  motivo: string,
): string {
  const estadoNuevo = estadoNuevoDeSalida(tipo);

  if (recurso.unidades !== undefined) {
    // Con unidades: se marcan unidades específicas (CA-02.2)
    if (numerosMarcados.length === 0) {
      return 'Marca al menos una unidad.';
    }
    for (const unidad of recurso.unidades) {
      if (!numerosMarcados.includes(unidad.numero)) {
        continue; // las que no se marcaron no se revisan
      }
      if (unidad.estado === 'dado_de_baja') {
        return 'La unidad ' + unidad.numero + ' ya está dada de baja.';
      }
      if (unidad.estado === estadoNuevo) {
        return 'La unidad ' + unidad.numero + ' ya está en estado "' + textoEstado(estadoNuevo) + '".';
      }
    }
  } else {
    // Sin unidades: se elige un estado de origen y una cantidad
    if (estadoOrigen === estadoNuevo || estadoOrigen === 'dado_de_baja') {
      return 'Elige un estado de origen distinto de "' + textoEstado(estadoNuevo) + '" y de "Dado de baja".';
    }
    const cantidad = Number(cantidadTexto);
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return 'La cantidad debe ser un número entero mayor que 0.';
    }
    if (cantidad > recurso.cantidades[estadoOrigen]) {
      return 'Solo hay ' + recurso.cantidades[estadoOrigen] + ' unidad(es) en estado "' + textoEstado(estadoOrigen) + '".';
    }
  }

  // El motivo es obligatorio: queda en el historial (CA-14.2)
  if (motivo.trim() === '') {
    return 'Escribe el motivo de la salida (ej: "Se cayó al piso").';
  }

  return '';
}

// textoUnidadesMovimiento
// Recibe: cuántas unidades se mueven.
// Devuelve: "1 unidad" o "5 unidades" (singular o plural).
export function textoUnidadesMovimiento(cantidad: number): string {
  if (cantidad === 1) {
    return '1 unidad';
  }
  return cantidad + ' unidades';
}
