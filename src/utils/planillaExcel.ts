// planillaExcel.ts
// Lee la ESTRUCTURA de la planilla Excel del inventario: busca la fila de
// encabezados, ubica cada columna, detecta las salas (columnas "B-206",
// "B-302"... marcadas con una "x" en cada ítem; la búsqueda de columnas está
// en columnasPlanilla.ts) y rellena la categoría hacia abajo.
// No valida los datos ni guarda nada: eso lo hace revisionPlanilla.ts.
// Es una función pura: recibe la hoja ya leída.
// Cubre: HU-16, RF-15 (CA-16.1, la planilla real difiere de la línea base:
//        categoría por grupos, ubicación por marcas "x" y sin proveedor)

import type { CeldaPlanilla, FilaPlanilla, ResultadoLectura } from '../types/Importacion';
import { textoCelda } from './valoresPlanilla';
import { buscarColumnas, buscarColumnasSalas } from './columnasPlanilla';

// filaVacia: true si todas las celdas de la fila están vacías
function filaVacia(fila: CeldaPlanilla[]): boolean {
  for (const celda of fila) {
    if (textoCelda(celda) !== '') {
      return false;
    }
  }
  return true;
}

// textoDeColumna: el texto de una columna, o '' si la planilla no la tiene
function textoDeColumna(fila: CeldaPlanilla[], columna: number): string {
  if (columna === -1) {
    return '';
  }
  return textoCelda(fila[columna]);
}

// leerFilasPlanilla
// Recibe: la hoja completa (lista de filas; cada fila, una lista de celdas).
// Devuelve: las filas de datos ordenadas por columna, o un mensaje de error
// si la hoja no tiene el formato esperado (sin encabezados, sin columna de
// descripción, de cantidad o de salas).
export function leerFilasPlanilla(hoja: CeldaPlanilla[][]): ResultadoLectura {
  // 1) Fila de encabezados: la primera que tenga "descripci..." y "cantidad"
  let filaEncabezado = -1;
  for (let i = 0; i < hoja.length && filaEncabezado === -1; i++) {
    const columnas = buscarColumnas(hoja[i]);
    if (columnas.descripcion !== -1 && columnas.cantidad !== -1) {
      filaEncabezado = i;
    }
  }
  if (filaEncabezado === -1) {
    return { filas: [], error: 'No se encontró la fila de encabezados (columnas "Descripción" y "Cantidad").' };
  }

  const columnas = buscarColumnas(hoja[filaEncabezado]);
  if (columnas.ubicacion === -1) {
    return { filas: [], error: 'No se encontró la columna "Ubicación".' };
  }

  // 2) Salas: están en la fila de debajo de los encabezados
  const subencabezados = hoja[filaEncabezado + 1];
  if (subencabezados === undefined) {
    return { filas: [], error: 'La planilla no tiene filas de datos.' };
  }
  const columnasSalas = buscarColumnasSalas(subencabezados, columnas);
  if (columnasSalas.length === 0) {
    return { filas: [], error: 'No se encontraron las salas bajo "Ubicación" (ej: B-206).' };
  }

  // 3) Filas de datos. La categoría solo viene en la primera fila de cada
  //    grupo (las celdas combinadas), así que se rellena hacia abajo.
  const filas: FilaPlanilla[] = [];
  let categoriaActual = '';
  for (let i = filaEncabezado + 2; i < hoja.length; i++) {
    const fila = hoja[i];
    if (filaVacia(fila)) {
      continue;
    }
    const categoriaDeLaFila = textoDeColumna(fila, columnas.categoria);
    if (categoriaDeLaFila !== '') {
      categoriaActual = categoriaDeLaFila;
    }
    // Salas con una marca ("x" o "X") en esta fila
    const salasMarcadas: string[] = [];
    for (const sala of columnasSalas) {
      if (textoCelda(fila[sala.columna]) !== '') {
        salasMarcadas.push(sala.codigo);
      }
    }
    filas.push({
      numeroFila: i + 1, // el índice empieza en 0 y las filas de Excel en 1
      categoria: categoriaActual,
      descripcion: textoDeColumna(fila, columnas.descripcion),
      marca: textoDeColumna(fila, columnas.marca),
      modelo: textoDeColumna(fila, columnas.modelo),
      serie: textoDeColumna(fila, columnas.serie),
      proveedor: textoDeColumna(fila, columnas.proveedor),
      cantidad: fila[columnas.cantidad] === undefined ? null : fila[columnas.cantidad],
      salasMarcadas: salasMarcadas,
      observacion: textoDeColumna(fila, columnas.observacion),
    });
  }
  return { filas: filas, error: '' };
}
