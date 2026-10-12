// recursosService.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el "bodeguero" de los recursos. Si una pantalla quiere ver, cambiar,
// reponer o agregar recursos, se lo pide a este archivo. Nunca va a buscar
// los datos por su cuenta.
// En la guía: paso 8 (Firebase y los datos).
// Cubre: HU-01, RF-02 (consultar el inventario), HU-02, RF-01 (cambiar estados),
//        HU-06 (cada cambio de estado queda en el historial),
//        RF-04 (reponer stock de un recurso),
//        RNF-06 (los recursos se cargan desde Firestore),
//        agregar recursos nuevos desde la página de inventario

// ¿Para qué sirve tener un "bodeguero" (un servicio)?
// 1. Las pantallas no necesitan saber DE DÓNDE vienen los datos. Hoy vienen
//    de Firestore; mañana podrían venir de otro lado, y las pantallas ni se enteran.
// 2. Todas las pantallas leen de la MISMA lista. Si alguien cambia un recurso,
//    todas ven el cambio.
//
// La idea más importante de este archivo: la COPIA EN MEMORIA.
// Ir a internet es lento. Por eso, al iniciar sesión, traemos todos los
// recursos de Firestore UNA vez y los guardamos en una lista aquí
// (listaRecursos). Las pantallas leen esa lista al tiro, sin esperar.
// Cuando algo cambia, primero se guarda en Firestore y, si Firestore dice
// "ok", recién ahí se cambia también la copia.
// Es como tener una fotocopia del cuaderno en tu mochila: lees la
// fotocopia (rápido), pero cuando escribes algo, lo escribes primero
// en el cuaderno original y después en la fotocopia.

import type { Recurso, EstadoRecurso, CantidadesPorEstado, DatosNuevoRecurso } from '../types/Recurso';
import type { CambioEstado } from '../types/CambioEstado';
import { listaRecursosPrueba } from '../data/recursos';
import { armarRecurso } from '../utils/nuevoRecurso';
import {
  crearRegistroAlta,
  crearRegistroCambioEstado,
  crearRegistroReposicion,
  agregarRegistroAlLote,
  agregarRegistroEnMemoria,
} from './historialService';
// Herramientas de Firestore:
//   collection = una "carpeta" de Firestore (ej: la carpeta "recursos")
//   getDocs    = trae todos los documentos (hojas) de una carpeta
//   doc        = apunta a UNA hoja específica (ej: "recursos/7")
//   writeBatch = un "lote": varias escrituras que se mandan juntas
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { baseDatos } from './firebase';

// LA COPIA EN MEMORIA. Parte vacía ([] = lista vacía) y se llena con
// cargarRecursos() cuando alguien inicia sesión.
// No lleva "export": nadie la toca directo. Para leerla se usa obtenerRecursos().
const listaRecursos: Recurso[] = [];

// cargarRecursos
// No recibe nada. Trae los recursos desde Firestore y llena la copia.
// La llama cargarTodosLosDatos() (en cargaDatos.ts) al iniciar sesión.
// Devuelve Promise<void> = "te prometo avisarte cuando termine" (sin entregar nada).
// Si Firestore falla (ej: sin internet), el error sube hasta cargaDatos.ts,
// que lo atrapa con su try/catch.
export async function cargarRecursos(): Promise<void> {
  // "Firestore, dame todas las hojas de la carpeta 'recursos'".
  // await = espera aquí hasta que llegue la respuesta de internet.
  const resultado = await getDocs(collection(baseDatos, 'recursos'));

  // Vaciamos la copia antes de llenarla (por si tenía datos de otra sesión).
  // splice(0, largo) = "saca todos los elementos desde la posición 0".
  // Se vacía la MISMA lista, no se crea otra: así los demás archivos que
  // ya la estaban mirando siguen mirando la correcta.
  listaRecursos.splice(0, listaRecursos.length);

  if (resultado.empty) {
    // ¿La carpeta está vacía? Es la primera vez (o alguien la borró).
    // Plantamos la "semilla": subimos los recursos de prueba de src/data/recursos.ts.
    // writeBatch = un lote: juntamos todas las escrituras y las mandamos de
    // una vez. Firestore guarda TODAS o NINGUNA (nunca la mitad).
    const lote = writeBatch(baseDatos);
    for (const recurso of listaRecursosPrueba) {
      // Cada recurso es una hoja cuyo nombre es su id como texto.
      // String(7) convierte el número 7 en el texto "7" -> hoja "recursos/7".
      lote.set(doc(baseDatos, 'recursos', String(recurso.id)), recurso);
      // push = agregar al final de la lista.
      listaRecursos.push(recurso);
    }
    // commit = "¡ahora sí, manda el lote!"
    await lote.commit();
    // return en una función sin valor = "listo, termina aquí".
    return;
  }

  // Ya había datos: copiamos cada hoja a nuestra lista.
  // documento.data() entrega los datos, pero TypeScript no sabe de qué tipo son.
  // "as Recurso" = "confía en mí, TypeScript: esto tiene forma de Recurso".
  for (const documento of resultado.docs) {
    listaRecursos.push(documento.data() as Recurso);
  }

  // Firestore ordena las hojas por su nombre como TEXTO: "1", "10", "2"...
  // (igual que un diccionario: "10" va antes que "2" porque empieza con "1").
  // Las ordenamos por número para que el listado salga 1, 2, 3... 10.
  // sort recibe una función que compara dos recursos (a y b):
  //   si a.id - b.id da negativo -> "a" va primero
  //   si da positivo             -> "b" va primero
  listaRecursos.sort(function (a, b) {
    return a.id - b.id;
  });
}

// obtenerRecursos
// Recibe: nada.
// Devuelve: la lista completa de recursos (la copia en memoria).
// Es la función que más usan las pantallas. Es instantánea: no va a internet.
export function obtenerRecursos(): Recurso[] {
  return listaRecursos;
}

// obtenerRecursoPorId
// Recibe: el número (id) del recurso que buscas, ej: 6.
// Devuelve: ese recurso, o undefined (= nada) si no existe.
//
// "Recurso | undefined" obliga a quien la usa a preguntar con un if
// "¿lo encontraste?" antes de usarlo. Así evitamos usar algo que no existe.
export function obtenerRecursoPorId(id: number): Recurso | undefined {
  // Revisamos la lista uno por uno, como buscar un libro en un estante.
  for (const recurso of listaRecursos) {
    if (recurso.id === id) {
      return recurso; // ¡lo encontramos! lo entregamos y la función termina
    }
  }

  // Revisamos todo el estante y no estaba.
  return undefined;
}

// cambiarEstadoRecurso
// Mueve unidades de un estado a otro. Ejemplo: 1 multímetro de "disponible"
// a "danado" deja disponible 12 -> 11 y danado 1 -> 2. El total NO cambia
// (es como pasar una pelota de una caja a otra: siguen siendo las mismas pelotas).
// Recibe: el id del recurso, el estado de origen, el estado nuevo,
//         cuántas unidades, el motivo y el nombre de quien lo hace.
// Devuelve: una promesa de true (se guardó) o false (no se guardó).
//
// Es "async" porque guarda en Firestore. Quien la llama usa "await".
//
// El formulario ya revisa los datos antes, pero aquí se vuelven a revisar
// las cosas importantes. ¿Por qué dos veces? Como el cinturón de seguridad
// y el airbag: si una falla, la otra te protege. Así nunca quedan números negativos.
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
    return false; // no existe ese recurso
  }
  // recurso.cantidades[estadoOrigen] = "el cajón del estado de origen".
  // Los corchetes con una variable adentro sirven para elegir el cajón
  // según lo que diga la variable (ej: si estadoOrigen es 'danado',
  // es lo mismo que escribir recurso.cantidades.danado).
  if (cantidad < 1 || cantidad > recurso.cantidades[estadoOrigen]) {
    return false; // pidió 0, un negativo, o más de las que hay
  }

  // Hacemos los cálculos en una COPIA. { ...objeto } = "copia todos los
  // datos de este objeto en uno nuevo" (los "..." se llaman spread).
  // No tocamos el recurso de verdad todavía: primero Firestore tiene que aceptar.
  const nuevasCantidades = { ...recurso.cantidades };
  nuevasCantidades[estadoOrigen] = nuevasCantidades[estadoOrigen] - cantidad;
  nuevasCantidades[estadoNuevo] = nuevasCantidades[estadoNuevo] + cantidad;

  // Preparamos la línea para el diario (historial, HU-06).
  // Se hace AQUÍ y no en el formulario: así es IMPOSIBLE cambiar un estado
  // sin que quede anotado.
  const registro = crearRegistroCambioEstado(
    idRecurso, estadoOrigen, estadoNuevo, cantidad, motivo, nombreUsuario,
  );

  return guardarCambioConHistorial(recurso, nuevasCantidades, registro);
}

// reponerStock
// Suma unidades NUEVAS que llegaron (ej: se compraron guantes).
// Ejemplo: hay 2 cajas de guantes y llegan 10 -> disponible pasa de 2 a 12.
// A diferencia de cambiarEstadoRecurso, aquí el total SÍ sube, porque
// entran pelotas nuevas a la caja. Esto es lo que apaga una alerta de reposición.
// Recibe: el id del recurso, cuántas llegaron, el motivo (ej: "Compra orden 123")
//         y el nombre de quien lo hace.
// Devuelve: una promesa de true (se guardó) o false (no se guardó).
export async function reponerStock(
  idRecurso: number,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
): Promise<boolean> {
  const recurso = obtenerRecursoPorId(idRecurso);

  if (recurso === undefined) {
    return false; // no existe ese recurso
  }
  if (cantidad < 1) {
    return false; // no se puede reponer 0 ni un número negativo
  }

  const nuevasCantidades = { ...recurso.cantidades };
  nuevasCantidades.disponible = nuevasCantidades.disponible + cantidad;

  // También queda anotado en el diario, desde aquí (RNF-06).
  const registro = crearRegistroReposicion(idRecurso, cantidad, motivo, nombreUsuario);

  return guardarCambioConHistorial(recurso, nuevasCantidades, registro);
}

// guardarCambioConHistorial
// Ayudante que comparten cambiarEstadoRecurso y reponerStock, porque los dos
// guardan lo mismo: las cantidades nuevas + una línea en el diario.
// Recibe: el recurso, sus cantidades nuevas y la línea del diario.
// Devuelve: una promesa de true (se guardó) o false (Firestore falló).
// No lleva "export": es un ayudante privado de este archivo.
async function guardarCambioConHistorial(
  recurso: Recurso,
  nuevasCantidades: CantidadesPorEstado,
  registro: CambioEstado,
): Promise<boolean> {
  // Un lote con DOS escrituras que se guardan juntas: las dos o ninguna.
  // Así nunca queda un número cambiado sin su línea en el diario, ni al revés.
  const lote = writeBatch(baseDatos);
  // update = cambia SOLO el dato "cantidades" de la hoja del recurso.
  lote.update(doc(baseDatos, 'recursos', String(recurso.id)), { cantidades: nuevasCantidades });
  agregarRegistroAlLote(lote, registro);

  try {
    await lote.commit(); // aquí se manda todo a Firestore
  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    return false; // no se guardó nada, y la copia queda como estaba
  }

  // Firestore dijo "ok": recién ahora cambiamos la copia en memoria.
  // "recurso" es el MISMO objeto que está dentro de listaRecursos (no una copia),
  // así que al cambiarlo aquí, cambia en la lista, y todas las pantallas lo ven.
  recurso.cantidades = nuevasCantidades;
  agregarRegistroEnMemoria(registro);
  return true;
}

// agregarRecurso
// Crea un recurso nuevo en el inventario (botón "+ Agregar recurso").
// Recibe: lo que se escribió en el formulario (ya revisado con
//         validarNuevoRecurso) y el nombre de quien lo agrega.
// Devuelve: una promesa con el recurso creado, o null (= nada) si falló.
// Guarda en un solo lote el recurso + su línea de "alta" en el diario.
export async function agregarRecurso(
  datos: DatosNuevoRecurso,
  nombreUsuario: string,
): Promise<Recurso | null> {
  // ¿Qué número le toca? El más grande que exista + 1.
  // "let" = una caja cuyo contenido SÍ puede cambiar (a diferencia de const).
  // Si dos personas agregan a la vez con el mismo número, las reglas de
  // Firestore rechazan al segundo (no se puede pisar un recurso que ya existe).
  let mayorId = 0;
  for (const recurso of listaRecursos) {
    if (recurso.id > mayorId) {
      mayorId = recurso.id;
    }
  }

  // armarRecurso convierte los textos del formulario en un Recurso de verdad.
  const recursoNuevo = armarRecurso(datos, mayorId + 1);
  const registro = crearRegistroAlta(
    recursoNuevo.id,
    recursoNuevo.cantidades.disponible,
    nombreUsuario,
  );

  const lote = writeBatch(baseDatos);
  // set = escribe una hoja NUEVA completa.
  lote.set(doc(baseDatos, 'recursos', String(recursoNuevo.id)), recursoNuevo);
  agregarRegistroAlLote(lote, registro);

  try {
    await lote.commit();
  } catch (error) {
    console.error('Error al agregar el recurso en Firestore:', error);
    return null; // no se guardó nada
  }

  // Firestore dijo "ok": lo agregamos a la copia.
  // Como su número es el más grande, va al final y la lista sigue ordenada.
  listaRecursos.push(recursoNuevo);
  agregarRegistroEnMemoria(registro);
  return recursoNuevo;
}
