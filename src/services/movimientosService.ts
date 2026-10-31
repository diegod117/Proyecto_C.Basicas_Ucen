// movimientosService.ts
// Servicio de entradas, salidas y cambios de ubicación de un recurso: guarda
// en Firestore el cambio del recurso y sus registros del historial.
// Cubre: HU-14, RF-13 (entradas y salidas), HU-06 (quedan en el historial),
//        HU-12 (las unidades nuevas llevan número de serie),
//        HU-11, RF-10 (cambiar la ubicación)
//
// Está separado de recursosService.ts para que ese archivo no siga creciendo.
// Igual que allá, primero se guarda en Firestore y, si salió bien, se
// actualiza la copia en memoria (ver docs/plan-fase-3.md).

import type { Unidad, Ubicacion } from '../types/Recurso';
import type { CambioEstado, TipoEntrada, TipoSalida } from '../types/CambioEstado';
import type { EstadoRecurso } from '../types/Recurso';
import { obtenerRecursoPorId, guardarCambioConHistorial } from './recursosService';
import {
  crearRegistroEntrada,
  crearRegistroSalida,
  crearRegistroCambioUbicacion,
  asignarIdsSeguidos,
  agregarRegistroAlLote,
  agregarRegistroEnMemoria,
} from './historialService';
import { doc, writeBatch } from 'firebase/firestore';
import { baseDatos } from './firebase';
import { armarUnidades, contarUnidadesPorEstado } from '../utils/unidades';
import { estadoNuevoDeSalida, textoSubtipo } from '../utils/historial';

// registrarEntrada
// Recibe: el id del recurso, el tipo de entrada, la cantidad, la fecha en que
//         ocurrió, la observación (puede ir vacía), los números de serie de
//         las unidades nuevas (solo si el recurso tiene unidades) y el
//         nombre del usuario conectado.
// Devuelve: una Promise<boolean>: true si se guardó, false si no.
// Las unidades nuevas entran como "disponible" y suman al disponible (CA-14.1).
// Si el recurso tiene unidades, deja un registro por cada una, con su número.
export async function registrarEntrada(
  idRecurso: number,
  tipo: TipoEntrada,
  cantidad: number,
  fechaMovimiento: string,
  observacion: string,
  numerosNuevos: string[],
  nombreUsuario: string,
): Promise<boolean> {
  const recurso = obtenerRecursoPorId(idRecurso);
  if (recurso === undefined || cantidad < 1) {
    return false;
  }

  // Si no escribió observación, el motivo del historial es el tipo ("Préstamo")
  let motivo = observacion.trim();
  if (motivo === '') {
    motivo = textoSubtipo(tipo);
  }

  const registros: CambioEstado[] = [];

  if (recurso.unidades !== undefined) {
    // Con unidades: se agrega una unidad por cada número y se recalculan las cantidades
    const unidadesNuevas = armarUnidades(numerosNuevos.slice(0, cantidad));
    const todasLasUnidades: Unidad[] = [];
    for (const unidad of recurso.unidades) {
      todasLasUnidades.push({ ...unidad });
    }
    for (const unidad of unidadesNuevas) {
      todasLasUnidades.push(unidad);
      registros.push(
        crearRegistroEntrada(idRecurso, tipo, 1, motivo, nombreUsuario, fechaMovimiento, unidad.numero),
      );
    }
    asignarIdsSeguidos(registros);
    return guardarCambioConHistorial(
      recurso,
      contarUnidadesPorEstado(todasLasUnidades),
      registros,
      todasLasUnidades,
    );
  }

  // Sin unidades: solo sube la cantidad disponible
  const nuevasCantidades = { ...recurso.cantidades };
  nuevasCantidades.disponible = nuevasCantidades.disponible + cantidad;
  registros.push(crearRegistroEntrada(idRecurso, tipo, cantidad, motivo, nombreUsuario, fechaMovimiento));
  return guardarCambioConHistorial(recurso, nuevasCantidades, registros);
}

// registrarSalida
// Recibe: el id del recurso, el tipo de salida, los números de serie marcados
//         (si el recurso tiene unidades), el estado de origen y la cantidad
//         (si no tiene unidades), el motivo y el nombre del usuario conectado.
// Devuelve: una Promise<boolean>: true si se guardó, false si no.
// El daño reparable deja las unidades "en mantención" y el irreparable
// "dado de baja" (CA-14.2). Cada salida queda en el historial (CA-14.3).
export async function registrarSalida(
  idRecurso: number,
  tipo: TipoSalida,
  numerosMarcados: string[],
  estadoOrigen: EstadoRecurso,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
): Promise<boolean> {
  const recurso = obtenerRecursoPorId(idRecurso);
  if (recurso === undefined) {
    return false;
  }
  const estadoNuevo = estadoNuevoDeSalida(tipo);
  const registros: CambioEstado[] = [];

  if (recurso.unidades !== undefined) {
    // Copiamos las unidades; las marcadas pasan al estado nuevo, cada una con su registro
    const nuevasUnidades: Unidad[] = [];
    for (const unidad of recurso.unidades) {
      const copia = { ...unidad };
      if (numerosMarcados.includes(unidad.numero)) {
        registros.push(
          crearRegistroSalida(idRecurso, tipo, unidad.estado, 1, motivo, nombreUsuario, unidad.numero),
        );
        copia.estado = estadoNuevo;
      }
      nuevasUnidades.push(copia);
    }
    if (registros.length === 0 || registros.length !== numerosMarcados.length) {
      return false; // no se marcó nada, o algún número no existe en este recurso
    }
    asignarIdsSeguidos(registros);
    return guardarCambioConHistorial(
      recurso,
      contarUnidadesPorEstado(nuevasUnidades),
      registros,
      nuevasUnidades,
    );
  }

  // Sin unidades: se mueve una cantidad del estado de origen al estado nuevo
  if (cantidad < 1 || cantidad > recurso.cantidades[estadoOrigen]) {
    return false;
  }
  const nuevasCantidades = { ...recurso.cantidades };
  nuevasCantidades[estadoOrigen] = nuevasCantidades[estadoOrigen] - cantidad;
  nuevasCantidades[estadoNuevo] = nuevasCantidades[estadoNuevo] + cantidad;
  registros.push(crearRegistroSalida(idRecurso, tipo, estadoOrigen, cantidad, motivo, nombreUsuario));
  return guardarCambioConHistorial(recurso, nuevasCantidades, registros);
}

// cambiarUbicacion
// Recibe: el id del recurso, la ubicación nueva (ya validada y con su código),
//         el motivo (puede ir vacío) y el nombre del usuario conectado.
// Devuelve: una Promise<boolean>: true si se guardó, false si no.
// Guarda en un solo lote la ubicación nueva del recurso y su registro del
// historial con la ubicación anterior y la nueva (CA-11.3): se guardan los
// dos o ninguno. Las cantidades, las unidades y las reservas no cambian.
export async function cambiarUbicacion(
  idRecurso: number,
  nuevaUbicacion: Ubicacion,
  motivo: string,
  nombreUsuario: string,
): Promise<boolean> {
  const recurso = obtenerRecursoPorId(idRecurso);
  if (recurso === undefined) {
    return false;
  }

  // Si no escribió motivo, el historial dice "Cambio de ubicación"
  let motivoFinal = motivo.trim();
  if (motivoFinal === '') {
    motivoFinal = 'Cambio de ubicación';
  }

  const registro = crearRegistroCambioUbicacion(
    idRecurso, recurso.ubicacion.codigo, nuevaUbicacion.codigo, motivoFinal, nombreUsuario,
  );

  // Las dos escrituras van juntas: update cambia solo el campo "ubicacion" del recurso
  const lote = writeBatch(baseDatos);
  lote.update(doc(baseDatos, 'recursos', String(idRecurso)), { ubicacion: nuevaUbicacion });
  agregarRegistroAlLote(lote, registro);

  try {
    await lote.commit();
  } catch (error) {
    console.error('Error al cambiar la ubicación en Firestore:', error);
    return false; // no se guardó nada: la memoria queda como estaba
  }

  // Firestore aceptó: recién ahora actualizamos la copia en memoria
  recurso.ubicacion = nuevaUbicacion;
  agregarRegistroEnMemoria(registro);
  return true;
}
