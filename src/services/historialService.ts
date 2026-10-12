// historialService.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el "guardián del diario" de los recursos. El historial es como un diario
// de vida: cada vez que a un recurso le pasa algo (cambia de estado, le llegan
// unidades nuevas o se agrega al inventario), se escribe una línea nueva.
// Las líneas se guardan en la carpeta "historial" de Firestore.
// En la guía: paso 8 (Firebase y los datos).
// Cubre: HU-06 (historial de cambios de estado), RF-04 (reposición), RNF-06

// La regla de oro (RNF-06): el diario NUNCA se borra ni se corrige.
// Por eso aquí solo hay funciones para ESCRIBIR líneas nuevas y para LEER.
// No hay ninguna función para borrar o cambiar una línea. Si alguien se
// equivocó, se escribe una línea NUEVA que lo arregle (como en un diario
// escrito con lápiz pasta: no se borra, se anota la corrección abajo).
// Las reglas de Firestore (docs/firestore.rules) también lo prohíben,
// así que ni siquiera un tramposo podría borrar una línea.

import type { CambioEstado } from '../types/CambioEstado';
import type { EstadoRecurso } from '../types/Recurso';
import { listaHistorialPrueba } from '../data/historialEstados';
import { obtenerFechaActual } from '../utils/fechas';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
// WriteBatch (con mayúscula) es el TIPO de un lote. Lo usamos para decirle
// a TypeScript qué recibe la función agregarRegistroAlLote.
import type { WriteBatch } from 'firebase/firestore';
import { baseDatos } from './firebase';

// LA COPIA EN MEMORIA del diario (igual idea que en recursosService.ts).
// Parte vacía y se llena con cargarHistorial() al iniciar sesión.
// Va ordenada de la línea más antigua a la más nueva.
const listaHistorial: CambioEstado[] = [];

// cargarHistorial
// No recibe nada. Trae el diario desde Firestore y llena la copia.
// La llama cargarTodosLosDatos() (en cargaDatos.ts) al iniciar sesión.
// Funciona igual que cargarRecursos() de recursosService.ts: si quieres
// la explicación paso a paso, léela allá.
export async function cargarHistorial(): Promise<void> {
  const resultado = await getDocs(collection(baseDatos, 'historial'));
  listaHistorial.splice(0, listaHistorial.length);

  if (resultado.empty) {
    // Carpeta vacía: plantamos la semilla (data/historialEstados.ts).
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

  // Ordenamos de la más antigua (id chico) a la más nueva (id grande).
  // ¡Importante! obtenerHistorialDeRecurso() cuenta con que las últimas
  // de la lista sean las más nuevas.
  listaHistorial.sort(function (a, b) {
    return a.id - b.id;
  });
}

// obtenerSiguienteId
// No recibe nada. Devuelve el número para una línea nueva: el más grande + 1.
// Si dos personas guardan justo al mismo tiempo, podrían sacar el mismo número.
// En ese caso Firestore rechaza al segundo (no se puede pisar una línea que
// ya existe) y su formulario le muestra un error para que intente de nuevo.
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
//         nombre de quien hizo el cambio.
// Devuelve: una línea del diario lista para guardar (con número, fecha y persona).
// OJO: solo la ESCRIBE en un papelito, no la guarda. La guarda
// recursosService junto con el cambio del recurso, para que vayan juntas.
export function crearRegistroCambioEstado(
  recursoId: number,
  estadoAnterior: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
): CambioEstado {
  // Devolvemos un objeto nuevo { ... } con todos los datos del molde CambioEstado.
  // "recursoId: recursoId" = el dato llamado recursoId vale lo que trae
  // la variable recursoId.
  return {
    id: obtenerSiguienteId(),
    tipo: 'cambio_estado',
    recursoId: recursoId,
    fecha: obtenerFechaActual(),
    estadoAnterior: estadoAnterior,
    estadoNuevo: estadoNuevo,
    cantidad: cantidad,
    motivo: motivo.trim(), // trim() borra los espacios sobrantes al principio y al final
    usuario: nombreUsuario,
  };
}

// crearRegistroReposicion
// Recibe: el id del recurso, cuántas unidades nuevas llegaron, el motivo
//         (ej: "Compra orden 123") y el nombre de quien lo hace.
// Devuelve: una línea del diario lista para guardar, de tipo 'reposicion'.
export function crearRegistroReposicion(
  recursoId: number,
  cantidad: number,
  motivo: string,
  nombreUsuario: string,
): CambioEstado {
  return {
    id: obtenerSiguienteId(),
    tipo: 'reposicion',
    recursoId: recursoId,
    fecha: obtenerFechaActual(),
    // Las unidades nuevas no vienen de ningún estado: entran directo a "disponible".
    estadoAnterior: 'disponible',
    estadoNuevo: 'disponible',
    cantidad: cantidad,
    motivo: motivo.trim(),
    usuario: nombreUsuario,
  };
}

// crearRegistroAlta
// Recibe: el id del recurso nuevo, cuántas unidades trae y el nombre de
//         quien lo agregó.
// Devuelve: la PRIMERA línea del diario de ese recurso, de tipo 'alta'
// (como el "día en que nació"). Así su historial empieza desde el principio.
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
    // Las unidades iniciales entran como "disponible".
    estadoAnterior: 'disponible',
    estadoNuevo: 'disponible',
    cantidad: cantidad,
    motivo: 'Alta del recurso en el inventario',
    usuario: nombreUsuario,
  };
}

// agregarRegistroAlLote
// Recibe: un lote (writeBatch) y una línea del diario.
// No devuelve nada (": void" = no devuelve nada). Mete "guardar esta línea"
// dentro del lote. El lote se manda después desde recursosService, junto
// con el cambio del recurso.
// ¿Por qué está aquí y no en recursosService? Para que este archivo sea el
// ÚNICO que sabe que la carpeta se llama "historial".
export function agregarRegistroAlLote(lote: WriteBatch, registro: CambioEstado): void {
  lote.set(doc(baseDatos, 'historial', String(registro.id)), registro);
}

// agregarRegistroEnMemoria
// Recibe: una línea que YA se guardó en Firestore.
// La agrega al final de la copia, para que se vea al tiro en la ficha
// sin tener que volver a descargar todo el diario.
export function agregarRegistroEnMemoria(registro: CambioEstado): void {
  // push() = agregar al FINAL de la lista (no reemplaza nada).
  listaHistorial.push(registro);
}

// obtenerHistorialDeRecurso
// Recibe: el id de un recurso.
// Devuelve: solo las líneas de ESE recurso, de la más nueva a la más vieja
// (así la ficha muestra arriba lo último que pasó).
export function obtenerHistorialDeRecurso(recursoId: number): CambioEstado[] {
  const historialDelRecurso: CambioEstado[] = [];

  // Recorremos la lista AL REVÉS, desde la última hasta la primera.
  // Este es un "for clásico" con un contador i:
  //   let i = listaHistorial.length - 1 -> empieza en la última posición
  //                                        (las posiciones parten en 0)
  //   i >= 0                             -> sigue mientras i no sea negativo
  //   i--                                -> después de cada vuelta, i baja en 1
  // Como las líneas nuevas están al final, al recorrer al revés quedan
  // de la más nueva a la más vieja, sin tener que ordenarlas.
  for (let i = listaHistorial.length - 1; i >= 0; i--) {
    // listaHistorial[i] = el elemento que está en la posición i.
    const registro = listaHistorial[i];
    if (registro.recursoId === recursoId) {
      historialDelRecurso.push(registro);
    }
  }

  return historialDelRecurso;
}
