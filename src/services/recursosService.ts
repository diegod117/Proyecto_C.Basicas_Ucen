// recursosService.ts
// Servicio de recursos: es el ÚNICO lugar desde donde las páginas
// obtienen los recursos del inventario.
// Cubre: HU-01, RF-02 (consultar el inventario), HU-02, RF-01 (cambiar estados),
//        HU-06 (cada cambio de estado queda en el historial),
//        RF-04 (reponer stock de un recurso),
//        RNF-06 (los recursos se cargan desde Firestore)

// ¿Para qué sirve un "servicio"?
// Las páginas no deberían saber DE DÓNDE vienen los datos.
// Los datos vienen de Firestore (la colección "recursos"), pero las páginas
// no lo saben: siguen pidiéndolos con obtenerRecursos(), igual que antes.
// Además, como todas las páginas leen de aquí, todas ven los mismos datos:
// si alguien cambia el estado de un recurso, todos ven el cambio.

import type { Recurso, EstadoRecurso, CantidadesPorEstado } from '../types/Recurso';
import type { CambioEstado } from '../types/CambioEstado';
import { listaRecursosPrueba } from '../data/recursos';
import {
  crearRegistroCambioEstado,
  crearRegistroReposicion,
  agregarRegistroAlLote,
  agregarRegistroEnMemoria,
} from './historialService';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { baseDatos } from './firebase';

// La lista de recursos que usa toda la aplicación: es una COPIA EN MEMORIA
// de la colección "recursos" de Firestore (ver docs/plan-fase-3.md).
// Parte vacía y se llena con cargarRecursos() al iniciar sesión.
// Las páginas leen esta copia, así no tienen que esperar a internet.
const listaRecursos: Recurso[] = [];

// cargarRecursos
// No recibe nada. Descarga los recursos desde Firestore y llena la copia
// en memoria. La llama cargarTodosLosDatos() (cargaDatos.ts) al iniciar sesión.
// Devuelve una Promise<void>: "una promesa de que va a terminar", sin valor.
// Si Firestore falla (ej: sin internet), lanza un error que atrapa cargaDatos.ts.
export async function cargarRecursos(): Promise<void> {
  // getDocs pide TODOS los documentos de la colección "recursos".
  // "await" espera la respuesta de internet antes de seguir.
  const resultado = await getDocs(collection(baseDatos, 'recursos'));

  // Vaciamos la copia antes de llenarla. splice(0, largo) borra todos los
  // elementos sin crear una lista nueva, así todos siguen usando la misma.
  listaRecursos.splice(0, listaRecursos.length);

  if (resultado.empty) {
    // Primera vez: la colección está vacía, así que subimos los datos de
    // prueba de src/data/recursos.ts. writeBatch ("lote") junta todas las
    // escrituras y las envía de una sola vez: se guardan todas o ninguna.
    const lote = writeBatch(baseDatos);
    for (const recurso of listaRecursosPrueba) {
      // El nombre del documento es el id como texto: el recurso 7 queda en "recursos/7"
      lote.set(doc(baseDatos, 'recursos', String(recurso.id)), recurso);
      listaRecursos.push(recurso);
    }
    await lote.commit();
    return;
  }

  // Ya había datos: los copiamos a la memoria.
  // documento.data() devuelve un objeto sin tipo; con "as Recurso" le
  // decimos a TypeScript que tiene la forma de un Recurso (así lo guardamos).
  for (const documento of resultado.docs) {
    listaRecursos.push(documento.data() as Recurso);
  }

  // Firestore ordena los documentos por su nombre COMO TEXTO ("1", "10", "2"...).
  // Los ordenamos por id como número para que el listado salga igual que antes.
  // sort recibe una función que compara dos recursos: si el resultado es
  // negativo, "a" va primero; si es positivo, "b" va primero.
  listaRecursos.sort(function (a, b) {
    return a.id - b.id;
  });
}

// obtenerRecursos
// Recibe: nada.
// Devuelve: la lista completa de recursos del inventario.
export function obtenerRecursos(): Recurso[] {
  return listaRecursos;
}

// obtenerRecursoPorId
// Recibe: el id del recurso que se quiere buscar (ej: 6).
// Devuelve: el recurso con ese id, o "undefined" si no existe.
//
// "Recurso | undefined" significa que la función puede devolver
// un Recurso O nada (undefined). Así TypeScript nos obliga a revisar
// con un if si el recurso existe antes de usarlo, y evitamos errores.
export function obtenerRecursoPorId(id: number): Recurso | undefined {
  // Recorremos la lista uno por uno hasta encontrar el id buscado
  for (const recurso of listaRecursos) {
    if (recurso.id === id) {
      return recurso; // lo encontramos: lo devolvemos y la función termina
    }
  }

  // Si el for terminó sin encontrarlo, el recurso no existe
  return undefined;
}

// cambiarEstadoRecurso
// Recibe: el id del recurso, el estado de origen, el estado nuevo,
//         cuántas unidades se mueven de uno a otro, el motivo del cambio
//         y el nombre del usuario conectado (para el historial, HU-06).
// Devuelve: una Promise<boolean>: true si se guardó, false si no.
// Ejemplo: mover 1 multímetro de 'disponible' a 'danado' deja
//          disponible: 12 -> 11 y danado: 1 -> 2. El total no cambia.
//
// Es "async" porque guarda en Firestore (por internet). Quien la llama
// debe usar "await" para esperar el resultado.
//
// El formulario ya valida los datos antes de llamar a esta función, pero
// el servicio vuelve a revisar lo más importante (que el recurso exista y
// que haya unidades suficientes). Así los datos nunca quedan con números
// negativos, aunque alguien llame a esta función desde otra parte.
export async function cambiarEstadoRecurso(
  idRecurso: number,
  estadoOrigen: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
): Promise<boolean> {
  const recurso = obtenerRecursoPorId(idRecurso);

  if (recurso === undefined) {
    return false; // no existe un recurso con ese id
  }
  if (cantidad < 1 || cantidad > recurso.cantidades[estadoOrigen]) {
    return false; // cantidad inválida o no hay suficientes unidades
  }

  // Calculamos las cantidades nuevas en una COPIA ({ ...objeto } copia
  // todos sus campos). Todavía no tocamos el recurso en memoria: primero
  // hay que ver si Firestore acepta el cambio.
  const nuevasCantidades = { ...recurso.cantidades };
  nuevasCantidades[estadoOrigen] = nuevasCantidades[estadoOrigen] - cantidad;
  nuevasCantidades[estadoNuevo] = nuevasCantidades[estadoNuevo] + cantidad;

  // Registro para el historial (HU-06). Se crea AQUÍ, dentro del servicio,
  // y no en el formulario: así es imposible cambiar un estado sin que quede registrado.
  const registro = crearRegistroCambioEstado(
    idRecurso, estadoOrigen, estadoNuevo, cantidad, motivo, nombreUsuario,
  );

  return guardarCambioConHistorial(recurso, nuevasCantidades, registro);
}

// reponerStock
// Recibe: el id del recurso, cuántas unidades NUEVAS llegaron, el motivo
//         (ej: "Compra orden 123") y el nombre del usuario conectado.
// Devuelve: una Promise<boolean>: true si se guardó, false si no.
// Ejemplo: los guantes tienen 2 cajas disponibles y llegan 10:
//          disponible pasa de 2 a 12 y el total sube de 2 a 12.
// A diferencia de cambiarEstadoRecurso, aquí el total SÍ cambia, porque
// entran unidades que antes no estaban en el inventario. Esto es lo que
// resuelve una alerta de reposición (HU-09).
export async function reponerStock(
  idRecurso: number,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
): Promise<boolean> {
  const recurso = obtenerRecursoPorId(idRecurso);

  if (recurso === undefined) {
    return false; // no existe un recurso con ese id
  }
  if (cantidad < 1) {
    return false; // no se puede reponer 0 ni un número negativo
  }

  const nuevasCantidades = { ...recurso.cantidades };
  nuevasCantidades.disponible = nuevasCantidades.disponible + cantidad;

  // Igual que en los cambios de estado, la reposición queda registrada
  // en el historial desde el servicio (RNF-06).
  const registro = crearRegistroReposicion(idRecurso, cantidad, motivo, nombreUsuario);

  return guardarCambioConHistorial(recurso, nuevasCantidades, registro);
}

// guardarCambioConHistorial
// Recibe: el recurso, sus cantidades nuevas y el registro del historial.
// Devuelve: una Promise<boolean>: true si se guardó, false si Firestore falló.
// La usan cambiarEstadoRecurso y reponerStock, que guardan lo mismo:
// las cantidades del recurso + un registro del historial.
async function guardarCambioConHistorial(
  recurso: Recurso,
  nuevasCantidades: CantidadesPorEstado,
  registro: CambioEstado,
): Promise<boolean> {
  // writeBatch ("lote"): las dos escrituras se envían juntas y Firestore
  // guarda LAS DOS o NINGUNA. Así nunca queda un cambio de cantidades sin
  // su registro en el historial, ni un registro sin su cambio.
  const lote = writeBatch(baseDatos);
  // update cambia solo el campo "cantidades" del documento del recurso
  lote.update(doc(baseDatos, 'recursos', String(recurso.id)), { cantidades: nuevasCantidades });
  agregarRegistroAlLote(lote, registro);

  try {
    await lote.commit(); // aquí se envía todo a Firestore
  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    return false; // no se guardó nada: la memoria queda como estaba
  }

  // Firestore aceptó el cambio: recién ahora actualizamos la copia en memoria.
  // Como "recurso" apunta al MISMO objeto que está en listaRecursos, todas
  // las páginas que lean del servicio verán el cambio.
  recurso.cantidades = nuevasCantidades;
  agregarRegistroEnMemoria(registro);
  return true;
}
