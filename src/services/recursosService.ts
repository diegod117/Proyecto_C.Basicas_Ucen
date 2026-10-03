// recursosService.ts
// Servicio de recursos: es el ÚNICO lugar desde donde las páginas
// obtienen los recursos del inventario.
// Cubre: HU-01, RF-02 (consultar el inventario), HU-02, RF-01 (cambiar estados)

// ¿Para qué sirve un "servicio"?
// Las páginas no deberían saber DE DÓNDE vienen los datos.
// Hoy vienen de una lista de prueba (src/data/recursos.ts), pero en el
// futuro podrían venir de un backend. Cuando eso pase, solo se cambia
// este archivo y las páginas siguen funcionando igual.
// Además, como todas las páginas leen de aquí, todas ven los mismos datos:
// si alguien cambia el estado de un recurso, todos ven el cambio.

import type { Recurso, EstadoRecurso } from '../types/Recurso';
import { listaRecursosPrueba } from '../data/recursos';

// La lista de recursos que usa toda la aplicación.
// Por ahora parte con los datos de prueba y vive en la memoria
// del navegador (si se recarga la página, vuelve a los datos de prueba).
const listaRecursos: Recurso[] = listaRecursosPrueba;

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
// Recibe: el id del recurso, el estado de origen, el estado nuevo y
//         cuántas unidades se mueven de uno a otro.
// Devuelve: true si se pudo hacer el cambio, false si no.
// Ejemplo: mover 1 multímetro de 'disponible' a 'danado' deja
//          disponible: 12 -> 11 y danado: 1 -> 2. El total no cambia.
//
// El formulario ya valida los datos antes de llamar a esta función, pero
// el servicio vuelve a revisar lo más importante (que el recurso exista y
// que haya unidades suficientes). Así los datos nunca quedan con números
// negativos, aunque alguien llame a esta función desde otra parte.
export function cambiarEstadoRecurso(
  idRecurso: number,
  estadoOrigen: EstadoRecurso,
  estadoNuevo: EstadoRecurso,
  cantidad: number,
): boolean {
  const recurso = obtenerRecursoPorId(idRecurso);

  if (recurso === undefined) {
    return false; // no existe un recurso con ese id
  }
  if (cantidad < 1 || cantidad > recurso.cantidades[estadoOrigen]) {
    return false; // cantidad inválida o no hay suficientes unidades
  }

  // Restamos en el estado de origen y sumamos en el estado nuevo.
  // Como "recurso" apunta al MISMO objeto que está en listaRecursos,
  // al modificarlo aquí se modifica en la lista, y todas las páginas
  // que lean del servicio verán el cambio.
  recurso.cantidades[estadoOrigen] = recurso.cantidades[estadoOrigen] - cantidad;
  recurso.cantidades[estadoNuevo] = recurso.cantidades[estadoNuevo] + cantidad;

  return true;
}
