// paginacion.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Herramientas para mostrar una lista larga POR PÁGINAS (pedido del profesor).
// En vez de mostrar 50 recursos de una vez, mostramos de 9 en 9, como las
// páginas de un libro: página 1 = recursos 1 al 9, página 2 = 10 al 18...
// En la guía: paso 11 (paginación).
// Cubre: HU-01 (listado del inventario con paginación)

import type { Recurso } from '../types/Recurso';

// Cuántos recursos se muestran en cada página del inventario.
// 9 = una grilla de 3 x 3 tarjetas en el computador.
// Está en MAYÚSCULAS porque es una "constante": un número fijo que no
// cambia nunca. ¿Quieres 12 por página? Cambia SOLO este número.
export const RECURSOS_POR_PAGINA = 9;

// calcularTotalPaginas
// Recibe: cuántos elementos hay y cuántos caben por página.
// Devuelve: cuántas páginas hacen falta (al menos 1, aunque la lista esté vacía).
// Ej: 10 recursos de 9 en 9 -> 10 / 9 = 1,1 -> 2 páginas.
// Math.ceil redondea SIEMPRE hacia arriba (1,1 -> 2), porque ese último
// recurso solito igual necesita su propia página.
export function calcularTotalPaginas(cantidad: number, porPagina: number): number {
  const paginas = Math.ceil(cantidad / porPagina);
  // Con 0 recursos daría 0 páginas; decimos que hay 1 (vacía), para que
  // nunca se vea "página 1 de 0".
  if (paginas < 1) {
    return 1;
  }
  return paginas;
}

// obtenerRecursosDePagina
// Recibe: la lista completa de recursos, el número de página (parte en 1)
// y cuántos van por página.
// Devuelve: solo los recursos de esa página.
// Ej: página 2 de 9 en 9 -> inicio = (2 - 1) * 9 = 9.
// Las listas cuentan desde 0, así que la posición 9 es el DÉCIMO recurso.
export function obtenerRecursosDePagina(lista: Recurso[], pagina: number, porPagina: number): Recurso[] {
  const inicio = (pagina - 1) * porPagina;
  // slice(inicio, fin) = "córtame un pedazo de la lista, desde inicio hasta
  // fin (sin incluir fin)". Es como cortar una tajada de pan: el pan entero
  // (la lista original) no cambia, solo sacas una copia de ese pedazo.
  return lista.slice(inicio, inicio + porPagina);
}
