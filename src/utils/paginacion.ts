// paginacion.ts
// Funciones de ayuda para mostrar una lista larga por páginas
// (ej: el inventario de 9 en 9), en vez de todo de una vez.
// Cubre: HU-01 (listado del inventario con paginación)

import type { Recurso } from '../types/Recurso';

// Cuántos recursos se muestran en cada página del inventario.
// 9 = una grilla de 3 x 3 tarjetas en el computador.
export const RECURSOS_POR_PAGINA = 9;

// calcularTotalPaginas
// Recibe: cuántos elementos hay y cuántos caben por página.
// Devuelve: cuántas páginas hacen falta (al menos 1, aunque la lista esté vacía).
// Ej: 10 recursos de 9 en 9 -> 2 páginas (Math.ceil redondea hacia arriba: 1,1 -> 2).
export function calcularTotalPaginas(cantidad: number, porPagina: number): number {
  const paginas = Math.ceil(cantidad / porPagina);
  if (paginas < 1) {
    return 1;
  }
  return paginas;
}

// obtenerRecursosDePagina
// Recibe: la lista completa de recursos, el número de página (parte en 1)
// y cuántos van por página.
// Devuelve: solo los recursos de esa página.
// Ej: página 2 de 9 en 9 -> desde la posición 9 hasta la 17.
export function obtenerRecursosDePagina(lista: Recurso[], pagina: number, porPagina: number): Recurso[] {
  const inicio = (pagina - 1) * porPagina;
  // slice(inicio, fin) copia una parte de la lista, sin cambiar la original
  return lista.slice(inicio, inicio + porPagina);
}
