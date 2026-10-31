// importacionService.ts
// Servicio que guarda en Firestore los recursos leídos de la planilla Excel,
// por tandas. Cada recurso queda con su registro de "alta" en el historial.
// Cubre: HU-16, RF-15 (CA-16.3: se guardan solo las filas válidas; CA-16.4:
//        los recursos quedan "disponibles")

import { doc, writeBatch } from 'firebase/firestore';
import { baseDatos } from './firebase';
import type { Recurso } from '../types/Recurso';
import type { CambioEstado } from '../types/CambioEstado';
import type { ResultadoGuardado } from '../types/Importacion';
import { obtenerSiguienteIdRecurso, agregarRecursoEnMemoria } from './recursosService';
import {
  crearRegistroAlta,
  asignarIdsSeguidos,
  agregarRegistroAlLote,
  agregarRegistroEnMemoria,
} from './historialService';

// Recursos por tanda. Cada recurso son 2 escrituras (el recurso y su alta en
// el historial) y Firestore acepta como máximo 500 en un lote: 200 x 2 = 400.
export const RECURSOS_POR_TANDA = 200;

// Motivo que queda escrito en el historial de cada recurso importado
const MOTIVO_CARGA = 'Carga inicial desde la planilla Excel';

// guardarRecursosImportados
// Recibe: los recursos ya revisados (con id 0, el servicio pone los ids) y el
//         nombre del usuario conectado.
// Devuelve: una Promise con cuántos se guardaron y los rangos de ids creados.
// Guarda de a RECURSOS_POR_TANDA recursos; cada tanda es un writeBatch, así
// que se guarda completa o no se guarda. Si una tanda falla, se detiene (no
// sigue con las otras) y el resultado dice cuántos alcanzaron a guardarse.
export async function guardarRecursosImportados(
  recursos: Recurso[],
  nombreUsuario: string,
): Promise<ResultadoGuardado> {
  const resultado: ResultadoGuardado = {
    guardados: 0,
    primerIdRecurso: 0,
    ultimoIdRecurso: 0,
    primerIdHistorial: 0,
    ultimoIdHistorial: 0,
    fallo: false,
  };

  for (let inicio = 0; inicio < recursos.length; inicio += RECURSOS_POR_TANDA) {
    const tanda = recursos.slice(inicio, inicio + RECURSOS_POR_TANDA);

    // Los ids se calculan al empezar CADA tanda, con la memoria ya actualizada
    // por la tanda anterior: el id de cada recurso es el siguiente + su posición.
    const primerId = obtenerSiguienteIdRecurso();
    const recursosConId: Recurso[] = [];
    const altas: CambioEstado[] = [];
    for (let i = 0; i < tanda.length; i++) {
      const recurso = { ...tanda[i], id: primerId + i };
      recursosConId.push(recurso);
      altas.push(crearRegistroAlta(recurso.id, recurso.cantidades.disponible, nombreUsuario, MOTIVO_CARGA));
    }
    // Todas las altas calcularon el MISMO id (la memoria del historial aún no
    // las tiene): cada una toma el siguiente al de la anterior.
    asignarIdsSeguidos(altas);

    const lote = writeBatch(baseDatos);
    for (let i = 0; i < tanda.length; i++) {
      lote.set(doc(baseDatos, 'recursos', String(recursosConId[i].id)), recursosConId[i]);
      agregarRegistroAlLote(lote, altas[i]);
    }

    try {
      await lote.commit();
    } catch (error) {
      console.error('Error al guardar una tanda de la planilla en Firestore:', error);
      resultado.fallo = true;
      return resultado; // las tandas anteriores ya quedaron guardadas
    }

    // Firestore aceptó la tanda: recién ahora la pasamos a la memoria
    for (let i = 0; i < tanda.length; i++) {
      agregarRecursoEnMemoria(recursosConId[i]);
      agregarRegistroEnMemoria(altas[i]);
    }
    if (resultado.guardados === 0) {
      resultado.primerIdRecurso = recursosConId[0].id;
      resultado.primerIdHistorial = altas[0].id;
    }
    resultado.guardados = resultado.guardados + tanda.length;
    resultado.ultimoIdRecurso = recursosConId[tanda.length - 1].id;
    resultado.ultimoIdHistorial = altas[tanda.length - 1].id;
  }
  return resultado;
}
