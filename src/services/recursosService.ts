// recursosService.ts
// Servicio de recursos: es el ÚNICO lugar desde donde las páginas
// obtienen los recursos del inventario.
// Cubre: HU-01, RF-02 (consultar el inventario), HU-02, RF-01 (cambiar estados),
//        HU-06 (cada cambio de estado queda en el historial),
//        RNF-06 (los recursos se cargan desde Firestore),
//        agregar recursos nuevos desde la página de inventario,
//        HU-02 / RF-01 (cambiar el estado de unidades específicas),
//        HU-16 (ids y memoria para la carga desde Excel)

// ¿Para qué sirve un "servicio"?
// Las páginas no deberían saber DE DÓNDE vienen los datos.
// Los datos vienen de Firestore (la colección "recursos"), pero las páginas
// no lo saben: siguen pidiéndolos con obtenerRecursos(), igual que antes.
// Además, como todas las páginas leen de aquí, todas ven los mismos datos:
// si alguien cambia el estado de un recurso, todos ven el cambio.

import type { Recurso, EstadoRecurso, CantidadesPorEstado, DatosNuevoRecurso, Unidad } from '../types/Recurso';
import type { CambioEstado } from '../types/CambioEstado';
import { listaRecursosPrueba } from '../data/recursos';
import { armarRecurso } from '../utils/nuevoRecurso';
import { contarUnidadesPorEstado } from '../utils/unidades';
import {
  crearRegistroAlta,
  crearRegistroCambioEstado,
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

  return guardarCambioConHistorial(recurso, nuevasCantidades, [registro]);
}

// guardarCambioConHistorial
// Recibe: el recurso, sus cantidades nuevas, la lista de registros del
//         historial y, si cambió el estado de unidades, la lista de unidades nueva.
// Devuelve: una Promise<boolean>: true si se guardó, false si Firestore falló.
// La usan cambiarEstadoRecurso, cambiarEstadoUnidades y movimientosService
// (entradas y salidas, HU-14), que guardan lo mismo: las cantidades del recurso + registros del historial.
export async function guardarCambioConHistorial(
  recurso: Recurso,
  nuevasCantidades: CantidadesPorEstado,
  registros: CambioEstado[],
  nuevasUnidades?: Unidad[],
): Promise<boolean> {
  // writeBatch ("lote"): las dos escrituras se envían juntas y Firestore
  // guarda LAS DOS o NINGUNA. Así nunca queda un cambio de cantidades sin
  // su registro en el historial, ni un registro sin su cambio.
  const lote = writeBatch(baseDatos);
  // update cambia solo los campos indicados del documento del recurso:
  // siempre "cantidades" y, si se cambió el estado de unidades (HU-02), "unidades"
  const camposNuevos: { cantidades: CantidadesPorEstado; unidades?: Unidad[] } = {
    cantidades: nuevasCantidades,
  };
  if (nuevasUnidades !== undefined) {
    camposNuevos.unidades = nuevasUnidades;
  }
  lote.update(doc(baseDatos, 'recursos', String(recurso.id)), camposNuevos);
  // Un registro del historial por cada unidad que cambió (o uno solo si no hay unidades)
  for (const registro of registros) {
    agregarRegistroAlLote(lote, registro);
  }

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
  if (nuevasUnidades !== undefined) {
    recurso.unidades = nuevasUnidades;
  }
  for (const registro of registros) {
    agregarRegistroEnMemoria(registro);
  }
  return true;
}

// cambiarEstadoUnidades
// Recibe: el id del recurso, los números de serie de las unidades que
//         cambian, el estado nuevo, el motivo y el nombre del usuario conectado.
// Devuelve: una Promise<boolean>: true si se guardó, false si no.
// Es la versión de cambiarEstadoRecurso para equipos e instrumentos (HU-02,
// CA-02.2): en vez de mover una cantidad, cambia el estado de unidades
// específicas. Las cantidades por estado se recalculan contando las
// unidades, y cada unidad deja su propio registro en el historial (con su
// número de serie), todo en un solo lote: se guarda todo o nada.
export async function cambiarEstadoUnidades(
  idRecurso: number,
  numerosUnidades: string[],
  estadoNuevo: EstadoRecurso,
  motivo: string,
  nombreUsuario: string,
): Promise<boolean> {
  const recurso = obtenerRecursoPorId(idRecurso);

  if (recurso === undefined || recurso.unidades === undefined) {
    return false; // no existe, o no tiene unidades registradas
  }
  if (numerosUnidades.length < 1) {
    return false; // no se marcó ninguna unidad
  }

  // Copiamos cada unidad ({ ...unidad }) para no tocar las de la memoria
  // hasta que Firestore acepte el cambio. Las marcadas pasan al estado nuevo.
  const nuevasUnidades: Unidad[] = [];
  const registros: CambioEstado[] = [];
  for (const unidad of recurso.unidades) {
    const copia = { ...unidad };
    if (numerosUnidades.includes(unidad.numero)) {
      if (unidad.estado === estadoNuevo) {
        return false; // ya estaba en ese estado: el formulario no debería permitirlo
      }
      const registro = crearRegistroCambioEstado(
        idRecurso, unidad.estado, estadoNuevo, 1, motivo, nombreUsuario, unidad.numero,
      );
      // Los registros todavía no están en la memoria del historial, así que
      // crearRegistroCambioEstado les da a todos el MISMO id. Cada uno toma
      // el id siguiente al del registro anterior para que no se pisen.
      if (registros.length > 0) {
        registro.id = registros[registros.length - 1].id + 1;
      }
      registros.push(registro);
      copia.estado = estadoNuevo;
    }
    nuevasUnidades.push(copia);
  }

  if (registros.length !== numerosUnidades.length) {
    return false; // alguno de los números no existe en este recurso
  }

  const nuevasCantidades = contarUnidadesPorEstado(nuevasUnidades);
  return guardarCambioConHistorial(recurso, nuevasCantidades, registros, nuevasUnidades);
}

// obtenerSiguienteIdRecurso
// Recibe: nada. Devuelve: el id para un recurso nuevo (el mayor que exista + 1).
// La usa la carga desde Excel (importacionService), que guarda varios
// recursos seguidos y necesita calcular el id al empezar cada tanda.
export function obtenerSiguienteIdRecurso(): number {
  let mayorId = 0;
  for (const recurso of listaRecursos) {
    if (recurso.id > mayorId) {
      mayorId = recurso.id;
    }
  }
  return mayorId + 1;
}

// agregarRecursoEnMemoria
// Recibe: un recurso que YA se guardó en Firestore. No devuelve nada.
// Lo agrega al final de la copia en memoria (los ids van en aumento, así que
// la lista sigue ordenada). Lo usa la carga desde Excel después de cada tanda.
export function agregarRecursoEnMemoria(recurso: Recurso): void {
  listaRecursos.push(recurso);
}

// agregarRecurso
// Recibe: los datos del formulario "Agregar recurso" (ya validados con
//         validarNuevoRecurso) y el nombre del usuario conectado.
// Devuelve: una Promise con el recurso creado, o null si Firestore falló.
// Guarda en un solo lote el recurso nuevo y su registro de "alta" en el
// historial: se guardan los dos o ninguno (igual que guardarCambioConHistorial).
export async function agregarRecurso(
  datos: DatosNuevoRecurso,
  nombreUsuario: string,
): Promise<Recurso | null> {
  // El id nuevo es el mayor que exista + 1. Si dos personas agregan al mismo
  // tiempo con el mismo id, las reglas de Firestore rechazan al segundo
  // (sería modificar un recurso existente, y eso no está permitido).
  let mayorId = 0;
  for (const recurso of listaRecursos) {
    if (recurso.id > mayorId) {
      mayorId = recurso.id;
    }
  }

  const recursoNuevo = armarRecurso(datos, mayorId + 1);
  const registro = crearRegistroAlta(
    recursoNuevo.id,
    recursoNuevo.cantidades.disponible,
    nombreUsuario,
  );

  const lote = writeBatch(baseDatos);
  lote.set(doc(baseDatos, 'recursos', String(recursoNuevo.id)), recursoNuevo);
  agregarRegistroAlLote(lote, registro);

  try {
    await lote.commit();
  } catch (error) {
    console.error('Error al agregar el recurso en Firestore:', error);
    return null; // no se guardó nada
  }

  // Firestore aceptó: recién ahora lo agregamos a la copia en memoria.
  // Como los ids van en aumento, queda al final y la lista sigue ordenada.
  listaRecursos.push(recursoNuevo);
  agregarRegistroEnMemoria(registro);
  return recursoNuevo;
}
