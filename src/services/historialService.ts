// historialService.ts
// Servicio del historial de estados: guarda y entrega los registros de
// cada cambio de estado de los recursos.
// Cubre: HU-06 (historial de cambios de estado), RNF-06

// RNF-06 pide que el historial "no se pierda ni se sobrescriba".
// Por eso este servicio SOLO tiene funciones para AGREGAR y LEER registros.
// No existe ninguna función para borrar ni para modificar un registro:
// si alguien se equivoca, se registra un cambio nuevo que lo corrija.

import type { CambioEstado } from '../types/CambioEstado';
import type { EstadoRecurso } from '../types/Recurso';
import { listaHistorialPrueba } from '../data/historialEstados';
import { obtenerFechaActual } from '../utils/fechas';

// Por ahora no hay inicio de sesión, así que todos los cambios quedan a
// nombre del encargado. Es el mismo texto que usa incidenciasService.
// Cuando exista el login con roles (pendiente, punto 3.4 de los
// requerimientos), aquí irá el nombre de la persona conectada.
const USUARIO_ACTUAL = 'Encargado (usuario actual)';

// La lista del historial que usa toda la aplicación (vive en memoria)
const listaHistorial: CambioEstado[] = listaHistorialPrueba;

// registrarCambioEstado
// Recibe: el id del recurso, los dos estados, la cantidad y el motivo.
// Devuelve: el registro que se guardó (con id, fecha y usuario ya puestos).
// La fecha y el usuario se ponen solos: el encargado no los escribe.
export function registrarCambioEstado(
  recursoId: number,
  estadoAnterior: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
  cantidad: number,
  motivo: string,
): CambioEstado {
  // El id nuevo es uno más que la cantidad de registros. Como nunca se
  // borran registros, este número nunca se repite.
  const nuevoRegistro: CambioEstado = {
    id: listaHistorial.length + 1,
    recursoId: recursoId,
    fecha: obtenerFechaActual(),
    estadoAnterior: estadoAnterior,
    estadoNuevo: estadoNuevo,
    cantidad: cantidad,
    motivo: motivo.trim(), // trim() quita espacios sobrantes al inicio y al final
    usuario: USUARIO_ACTUAL,
  };

  // push() agrega el registro AL FINAL de la lista (no reemplaza nada)
  listaHistorial.push(nuevoRegistro);
  return nuevoRegistro;
}

// obtenerHistorialDeRecurso
// Recibe: el id de un recurso.
// Devuelve: los cambios de ESE recurso, del más reciente al más antiguo.
export function obtenerHistorialDeRecurso(recursoId: number): CambioEstado[] {
  const historialDelRecurso: CambioEstado[] = [];

  // Recorremos la lista DE ATRÁS HACIA ADELANTE: como los registros se
  // agregan al final, los últimos son los más recientes. Así el resultado
  // queda ordenado del más nuevo al más viejo, sin tener que ordenarlo.
  for (let i = listaHistorial.length - 1; i >= 0; i--) {
    const registro = listaHistorial[i];
    if (registro.recursoId === recursoId) {
      historialDelRecurso.push(registro);
    }
  }

  return historialDelRecurso;
}
