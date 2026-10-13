// useFiltrosInventario.ts
// Hook personalizado con TODO lo de los filtros y la paginación del
// inventario: lo que eligió el usuario en cada filtro, la página actual,
// la lista filtrada y las funciones para cambiarlos.
// Antes esto estaba dentro de PaginaInventario.tsx; se movió aquí para que
// esa página no pasara de ~150 líneas y quedara solo con lo que se dibuja.
// Un hook personalizado es una función que empieza con "use" y usa otros
// hooks adentro (aquí, useState). La memoria (los useState) queda en el
// componente que lo llama, igual que si estuvieran escritos ahí.
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

// Lo que devuelve el hook: valores para mostrar y funciones para cambiarlos
export interface DatosFiltrosInventario {
  textoBusqueda: string;
  categoria: string;
  laboratorio: string;
  estado: string;
  laboratoriosDisponibles: string[]; // opciones del filtro "Laboratorio"
  cantidadTotal: number; // todos los recursos del inventario
  cantidadFiltrada: number; // los que cumplen los filtros
  hayFiltrosActivos: boolean;
  recursosDeLaPagina: Recurso[]; // solo los de la página actual
  paginaActual: number;
  totalPaginas: number;
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
  // Un useState por cada filtro, más la página que se está viendo
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [categoria, setCategoria] = useState(SIN_FILTRO);
  const [laboratorio, setLaboratorio] = useState(SIN_FILTRO);
  const [estado, setEstado] = useState(SIN_FILTRO);
  const [paginaActual, setPaginaActual] = useState(1);

  const listaRecursos = obtenerRecursos();

  // El filtrado lo hace una función de utils: lista completa + 4 filtros
  const recursosFiltrados = filtrarRecursos(listaRecursos, textoBusqueda, categoria, laboratorio, estado);

  // Paginación: de los recursos filtrados mostramos solo los de la página
  // actual. Si la página quedó fuera de rango (ej: había 2 páginas y
  // ahora 1), mostramos la última que existe.
  const totalPaginas = calcularTotalPaginas(recursosFiltrados.length, RECURSOS_POR_PAGINA);
  let paginaMostrada = paginaActual;
  if (paginaMostrada > totalPaginas) {
    paginaMostrada = totalPaginas;
  }

  // Cada vez que cambia un filtro volvemos a la página 1: el resultado es
  // otra lista y la página en que estábamos podría no existir.
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

  // cambiarPagina: muestra otra página y sube al inicio para ver la grilla
  function cambiarPagina(pagina: number) {
    setPaginaActual(pagina);
    window.scrollTo(0, 0);
  }

  // limpiarFiltros: vuelve los 4 filtros y la página a su valor inicial
  function limpiarFiltros() {
    setTextoBusqueda('');
    setCategoria(SIN_FILTRO);
    setLaboratorio(SIN_FILTRO);
    setEstado(SIN_FILTRO);
    setPaginaActual(1);
  }

  return {
    textoBusqueda: textoBusqueda,
    categoria: categoria,
    laboratorio: laboratorio,
    estado: estado,
    laboratoriosDisponibles: obtenerLaboratorios(listaRecursos),
    cantidadTotal: listaRecursos.length,
    cantidadFiltrada: recursosFiltrados.length,
    hayFiltrosActivos: hayFiltrosActivos(textoBusqueda, categoria, laboratorio, estado),
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
