// historialService.ts
// Servicio del historial de estados: guarda y entrega los registros de
// cada cambio de estado de los recursos.
// También guarda las reposiciones de stock.
// Los registros se guardan en la colección "historial" de Firestore.
// Cubre: HU-06 (historial de movimientos), RF-04 (reposición), RF-13 (entradas y salidas),
//        RF-10 (cambio de ubicación), RNF-06

// RNF-06 pide que el historial "no se pierda ni se sobrescriba".
// Por eso este servicio SOLO tiene funciones para AGREGAR y LEER registros.
// No existe ninguna función para borrar ni para modificar un registro:
// si alguien se equivoca, se registra un cambio nuevo que lo corrija.
// (J27 agrega reglas en Firestore para que el servidor tampoco lo permita.)

import type { CambioEstado, TipoEntrada, TipoSalida } from '../types/CambioEstado';
import type { EstadoRecurso } from '../types/Recurso';
import { listaHistorialPrueba } from '../data/historialEstados';
import { obtenerFechaActual } from '../utils/fechas';
import { textoEstado } from '../utils/inventario';
import { estadoNuevoDeSalida } from '../utils/historial';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import type { WriteBatch } from 'firebase/firestore';
import { baseDatos } from './firebase';

// COPIA EN MEMORIA de la colección "historial" (ver docs/plan-fase-3.md).
// Parte vacía y se llena con cargarHistorial() al iniciar sesión.
// Va ordenada del registro más antiguo al más nuevo.
const listaHistorial: CambioEstado[] = [];

// cargarHistorial
// No recibe nada. Descarga el historial desde Firestore y llena la copia
// en memoria. La llama cargarTodosLosDatos() (cargaDatos.ts) al iniciar sesión.
// Funciona igual que cargarRecursos() en recursosService.ts.
export async function cargarHistorial(): Promise<void> {
  const resultado = await getDocs(collection(baseDatos, 'historial'));
  listaHistorial.splice(0, listaHistorial.length);

  if (resultado.empty) {
    // Primera vez: subimos los registros de prueba de data/historialEstados.ts
    const lote = writeBatch(baseDatos);
    for (const registro of listaHistorialPrueba) {
      lote.set(doc(baseDatos, 'historial', String(registro.id)), registro);
      listaHistorial.push(registro);
    }
    await lote.commit();
    return;
  }

  for (const documento of resultado.docs) {
    listaHistorial.push(documento.data() as CambioEstado);
  }

  // Ordenamos por id (del más antiguo al más nuevo). Es importante:
  // obtenerHistorialDeRecurso() cuenta con que los últimos sean los más nuevos.
  listaHistorial.sort(function (a, b) {
    return a.id - b.id;
  });
}

// obtenerSiguienteId
// No recibe nada. Devuelve el id para un registro nuevo: el mayor que
// exista más 1. Si dos personas guardan justo al mismo tiempo podrían
// calcular el mismo id; en ese caso las reglas de J27 rechazan el segundo
// (no se puede sobrescribir un registro) y el formulario muestra un error.
function obtenerSiguienteId(): number {
  let mayorId = 0;
  for (const registro of listaHistorial) {
    if (registro.id > mayorId) {
      mayorId = registro.id;
    }
  }
  return mayorId + 1;
}

// crearRegistroCambioEstado
// Recibe: el id del recurso, los dos estados, la cantidad, el motivo y el
//         nombre del usuario conectado que hizo el cambio. Opcionalmente, el
//         número de serie de la unidad afectada (HU-12).
// Devuelve: el registro listo para guardar (con id, fecha y usuario).
// OJO: solo lo CREA, no lo guarda. Lo guarda recursosService junto con el
// cambio del recurso (ver agregarRegistroAlLote), para que se guarden juntos.
export function crearRegistroCambioEstado(
  recursoId: number,
  estadoAnterior: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
  unidad?: string,
): CambioEstado {
  return {
    id: obtenerSiguienteId(),
    tipo: 'cambio_estado',
    recursoId: recursoId,
    fecha: obtenerFechaActual(),
    estadoAnterior: estadoAnterior,
    estadoNuevo: estadoNuevo,
    cantidad: cantidad,
    motivo: motivo.trim(), // trim() quita espacios sobrantes al inicio y al final
    usuario: nombreUsuario,
    valorAnterior: textoEstado(estadoAnterior),
    valorNuevo: textoEstado(estadoNuevo),
    unidad: unidad,
  };
}

// crearRegistroAlta
// Recibe: el id del recurso nuevo, sus unidades iniciales y el nombre del
//         usuario conectado.
// Devuelve: el registro listo para guardar, con tipo 'alta'. Así el
// historial de cada recurso empieza el día en que se agregó (RNF-06).
export function crearRegistroAlta(
  recursoId: number,
  cantidad: number,
  nombreUsuario: string,
): CambioEstado {
  return {
    id: obtenerSiguienteId(),
    tipo: 'alta',
    recursoId: recursoId,
    fecha: obtenerFechaActual(),
    // Las unidades iniciales entran como "disponible"
    estadoAnterior: 'disponible',
    estadoNuevo: 'disponible',
    cantidad: cantidad,
    motivo: 'Alta del recurso en el inventario',
    usuario: nombreUsuario,
    valorNuevo: textoEstado('disponible'),
  };
}

// crearRegistroEntrada
// Recibe: el id del recurso, el tipo de entrada (adquisición, préstamo o
//         reposición), cuántas unidades llegan, el motivo, el usuario, la
//         fecha en que ocurrió y, si tiene número de serie, el de la unidad.
// Devuelve: el registro listo para guardar, con tipo 'entrada' (HU-14).
// Los registros antiguos de reposición siguen existiendo como 'reposicion'
// porque el historial no se puede modificar.
export function crearRegistroEntrada(
  recursoId: number,
  subtipo: TipoEntrada,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
  fechaMovimiento: string,
  unidad?: string,
): CambioEstado {
  return {
    id: obtenerSiguienteId(),
    tipo: 'entrada',
    recursoId: recursoId,
    fecha: obtenerFechaActual(),
    // Las unidades que entran no vienen de ningún estado: quedan "disponible"
    estadoAnterior: 'disponible',
    estadoNuevo: 'disponible',
    cantidad: cantidad,
    motivo: motivo.trim(),
    usuario: nombreUsuario,
    valorNuevo: textoEstado('disponible'),
    unidad: unidad,
    subtipo: subtipo,
    fechaMovimiento: fechaMovimiento,
  };
}

// crearRegistroSalida
// Recibe: el id del recurso, el tipo de salida (daño reparable o
//         irreparable), el estado desde el que salen las unidades, cuántas,
//         el motivo, el usuario y, si se indicó, el número de serie.
// Devuelve: el registro listo para guardar, con tipo 'salida'. El daño
// reparable deja la unidad "en mantención" y el irreparable "dado de baja".
// La usa registrarSalida (movimientosService, HU-14).
export function crearRegistroSalida(
  recursoId: number,
  subtipo: TipoSalida,
  estadoOrigen: EstadoRecurso,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
  unidad?: string,
): CambioEstado {
  const estadoNuevo = estadoNuevoDeSalida(subtipo);
  return {
    id: obtenerSiguienteId(),
    tipo: 'salida',
    recursoId: recursoId,
    fecha: obtenerFechaActual(),
    estadoAnterior: estadoOrigen,
    estadoNuevo: estadoNuevo,
    cantidad: cantidad,
    motivo: motivo.trim(),
    usuario: nombreUsuario,
    valorAnterior: textoEstado(estadoOrigen),
    valorNuevo: textoEstado(estadoNuevo),
    unidad: unidad,
    subtipo: subtipo,
  };
}

// crearRegistroCambioUbicacion
// Recibe: el id del recurso, el código de la ubicación anterior, el de la
//         nueva, el motivo y el usuario.
// Devuelve: el registro listo para guardar, con tipo 'cambio_ubicacion'.
// Guarda la ubicación anterior y la nueva (CA-11.3). Lo usará HU-11.
export function crearRegistroCambioUbicacion(
  recursoId: number,
  codigoAnterior: string,
  codigoNuevo: string,
  motivo: string,
  nombreUsuario: string,
): CambioEstado {
  return {
    id: obtenerSiguienteId(),
    tipo: 'cambio_ubicacion',
    recursoId: recursoId,
    fecha: obtenerFechaActual(),
    // Cambiar de lugar no cambia el estado de las unidades
    estadoAnterior: 'disponible',
    estadoNuevo: 'disponible',
    cantidad: 0,
    motivo: motivo.trim(),
    usuario: nombreUsuario,
    valorAnterior: codigoAnterior,
    valorNuevo: codigoNuevo,
  };
}

// asignarIdsSeguidos
// Recibe: varios registros recién creados (que todavía no están en la memoria).
// No devuelve nada. Como todos calcularon "el mayor id + 1" sobre la misma
// memoria, tendrían el MISMO id: cada uno toma el siguiente al del anterior
// para que no se pisen al guardarlos juntos.
export function asignarIdsSeguidos(registros: CambioEstado[]): void {
  for (let i = 1; i < registros.length; i++) {
    registros[i].id = registros[i - 1].id + 1;
  }
}

// agregarRegistroAlLote
// Recibe: un lote de escrituras (writeBatch) y un registro.
// No devuelve nada: agrega "guardar este registro" al lote. El lote se
// envía después, en recursosService, junto con el cambio del recurso.
// Así este servicio sigue siendo el único que sabe que la colección se
// llama "historial".
export function agregarRegistroAlLote(lote: WriteBatch, registro: CambioEstado): void {
  lote.set(doc(baseDatos, 'historial', String(registro.id)), registro);
}

// agregarRegistroEnMemoria
// Recibe: un registro que YA se guardó en Firestore.
// Lo agrega al final de la copia en memoria, para que se vea en la ficha
// sin tener que volver a descargar todo.
export function agregarRegistroEnMemoria(registro: CambioEstado): void {
  // push() agrega el registro AL FINAL de la lista (no reemplaza nada)
  listaHistorial.push(registro);
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
