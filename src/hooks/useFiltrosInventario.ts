// useFiltrosInventario.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Un HOOK PERSONALIZADO (hecho por nosotros) con TODO lo de los filtros y
// la paginación del inventario:
//   - lo que eligió la persona en cada filtro,
//   - en qué página está,
//   - la lista ya filtrada y cortada en páginas,
//   - y las funciones para cambiar todo eso.
// Antes esto estaba dentro de PaginaInventario.tsx. Lo sacamos para acá
// para que esa página no pasara de ~150 líneas y quedara solo con lo que
// se DIBUJA. Es como sacar los útiles de la mochila y meterlos en un estuche:
// siguen siendo los mismos, pero más ordenados.
//
// ¿Qué es un hook personalizado? Una función que:
//   1. empieza con "use" (así React sabe que es un hook), y
//   2. usa otros hooks adentro (aquí, useState).
// OJO: la memoria (los useState) NO vive en este archivo. Vive en el
// componente que llama al hook (PaginaInventario), igual que si estuvieran
// escritos allá. El hook solo es una forma ordenada de escribirlos.
//
// En la guía: paso 11 (hooks propios y paginación).
// Cubre: HU-01 (filtros por nombre, categoría, laboratorio y estado, y paginación)

import { useState } from 'react';
import type { Recurso } from '../types/Recurso';
import { obtenerRecursos } from '../services/recursosService';
import {
  filtrarRecursos,
  hayFiltrosActivos,
  obtenerLaboratorios,
  SIN_FILTRO,
} from '../utils/filtrosInventario';
import { RECURSOS_POR_PAGINA, calcularTotalPaginas, obtenerRecursosDePagina } from '../utils/paginacion';

// DatosFiltrosInventario
// El molde de lo que DEVUELVE el hook: un objeto con datos para mostrar
// y funciones para cambiarlos. PaginaInventario lo guarda en "filtros" y
// usa, por ejemplo, filtros.categoria o filtros.cambiarPagina(2).
export interface DatosFiltrosInventario {
  textoBusqueda: string;
  categoria: string;
  laboratorio: string;
  estado: string;
  laboratoriosDisponibles: string[]; // las opciones del filtro "Laboratorio"
  cantidadTotal: number; // todos los recursos del inventario
  cantidadFiltrada: number; // los que pasan por el colador de los filtros
  hayFiltrosActivos: boolean;
  recursosDeLaPagina: Recurso[]; // solo los de la página actual (máximo 9)
  paginaActual: number;
  totalPaginas: number;
  // Las funciones. "(texto: string) => void" = recibe un texto y no devuelve nada.
  cambiarTexto: (texto: string) => void;
  cambiarCategoria: (valor: string) => void;
  cambiarLaboratorio: (valor: string) => void;
  cambiarEstado: (valor: string) => void;
  cambiarPagina: (pagina: number) => void;
  limpiarFiltros: () => void;
}

// useFiltrosInventario
// No recibe nada.
// Devuelve: un objeto con los filtros, la página y sus funciones (ver arriba).
export function useFiltrosInventario(): DatosFiltrosInventario {
  // ---------------------------------------------------------------
  // LA MEMORIA: un useState por cada filtro, más la página.
  // ---------------------------------------------------------------
  // SIN_FILTRO = el valor de "Todas" en los menús (ver utils/filtrosInventario.ts).
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [categoria, setCategoria] = useState(SIN_FILTRO);
  const [laboratorio, setLaboratorio] = useState(SIN_FILTRO);
  const [estado, setEstado] = useState(SIN_FILTRO);
  // La página que se está viendo. Parte en 1 (la primera).
  const [paginaActual, setPaginaActual] = useState(1);

  // ---------------------------------------------------------------
  // LOS CÁLCULOS (se repiten cada vez que la página se dibuja)
  // ---------------------------------------------------------------
  const listaRecursos = obtenerRecursos();

  // El "colador" está en utils (filtrarRecursos): le entregamos la lista
  // completa y los 4 filtros, y nos devuelve los que pasaron.
  const recursosFiltrados = filtrarRecursos(listaRecursos, textoBusqueda, categoria, laboratorio, estado);

  // PAGINACIÓN: ¿cuántas páginas hacen falta para los que pasaron el colador?
  const totalPaginas = calcularTotalPaginas(recursosFiltrados.length, RECURSOS_POR_PAGINA);
  // Protección: si estábamos en la página 2 y ahora solo hay 1 página
  // (ej: se dañó un recurso y ya no pasa el filtro), mostramos la última
  // que existe en vez de una página vacía.
  let paginaMostrada = paginaActual;
  if (paginaMostrada > totalPaginas) {
    paginaMostrada = totalPaginas;
  }

  // ---------------------------------------------------------------
  // LAS FUNCIONES PARA CAMBIAR LOS FILTROS
  // ---------------------------------------------------------------
  // Cada vez que cambia un filtro, volvemos a la página 1. ¿Por qué?
  // Porque la lista cambió: si estabas en la página 3 y ahora solo hay
  // 1 página de resultados, la página 3 ya no existe.
  function cambiarTexto(texto: string) {
    setTextoBusqueda(texto);
    setPaginaActual(1);
  }
  function cambiarCategoria(valor: string) {
    setCategoria(valor);
    setPaginaActual(1);
  }
  function cambiarLaboratorio(valor: string) {
    setLaboratorio(valor);
    setPaginaActual(1);
  }
  function cambiarEstado(valor: string) {
    setEstado(valor);
    setPaginaActual(1);
  }

  // cambiarPagina
  // Recibe: el número de la página a la que se quiere ir.
  // La muestra y sube hasta arriba, para ver la grilla desde el principio.
  function cambiarPagina(pagina: number) {
    setPaginaActual(pagina);
    window.scrollTo(0, 0);
  }

  // limpiarFiltros
  // Vuelve los 4 filtros y la página a como estaban al principio.
  function limpiarFiltros() {
    setTextoBusqueda('');
    setCategoria(SIN_FILTRO);
    setLaboratorio(SIN_FILTRO);
    setEstado(SIN_FILTRO);
    setPaginaActual(1);
  }

  // ---------------------------------------------------------------
  // LO QUE ENTREGA EL HOOK: todo junto en un objeto.
  // ---------------------------------------------------------------
  // A la izquierda de los ":" va el nombre del dato (el de la interface);
  // a la derecha, la variable o el cálculo que tiene su valor.
  return {
    textoBusqueda: textoBusqueda,
    categoria: categoria,
    laboratorio: laboratorio,
    estado: estado,
    laboratoriosDisponibles: obtenerLaboratorios(listaRecursos),
    cantidadTotal: listaRecursos.length,
    cantidadFiltrada: recursosFiltrados.length,
    hayFiltrosActivos: hayFiltrosActivos(textoBusqueda, categoria, laboratorio, estado),
    // De los que pasaron el colador, cortamos solo el pedazo de esta página.
    recursosDeLaPagina: obtenerRecursosDePagina(recursosFiltrados, paginaMostrada, RECURSOS_POR_PAGINA),
    paginaActual: paginaMostrada,
    totalPaginas: totalPaginas,
    cambiarTexto: cambiarTexto,
    cambiarCategoria: cambiarCategoria,
    cambiarLaboratorio: cambiarLaboratorio,
    cambiarEstado: cambiarEstado,
    cambiarPagina: cambiarPagina,
    limpiarFiltros: limpiarFiltros,
  };
}
