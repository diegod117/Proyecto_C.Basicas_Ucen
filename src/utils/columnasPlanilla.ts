// columnasPlanilla.ts
// Ubica las columnas de la planilla Excel del inventario a partir de la fila
// de encabezados (categoría, descripción, marca, modelo, serie, cantidad,
// ubicación, observaciones y proveedor) y las columnas de las salas marcadas
// con una "x" (B-206, B-302...). Lo usa planillaExcel.ts.
// Son funciones puras: no guardan nada.
// Cubre: HU-16, RF-15 (CA-16.1)

import type { CeldaPlanilla } from '../types/Importacion';
import { prepararTextoParaBuscar } from './filtrosInventario';
import { textoCelda, codigoDeSala } from './valoresPlanilla';

// Posición (número de columna, desde 0) de cada dato; -1 si no existe
export interface Columnas {
  categoria: number;
  descripcion: number;
  marca: number;
  modelo: number;
  serie: number;
  cantidad: number;
  ubicacion: number;
  observacion: number;
  proveedor: number;
}

// Sala marcada en una columna: ej. columna 7 -> "B206"
export interface ColumnaSala {
  columna: number;
  codigo: string;
}

// buscarColumnas
// Recibe: la fila de encabezados. Devuelve: dónde está cada columna.
// Compara sin tildes ni mayúsculas, con "contiene": "DESCRIPCIÓN DETALLADA"
// contiene "descripci", "N° SERIE" contiene "serie".
export function buscarColumnas(encabezados: CeldaPlanilla[]): Columnas {
  const columnas: Columnas = {
    categoria: -1, descripcion: -1, marca: -1, modelo: -1, serie: -1,
    cantidad: -1, ubicacion: -1, observacion: -1, proveedor: -1,
  };
  for (let i = 0; i < encabezados.length; i++) {
    const titulo = prepararTextoParaBuscar(textoCelda(encabezados[i]));
    if (titulo.includes('categoria')) {
      columnas.categoria = i;
    } else if (titulo.includes('descripci') || titulo.includes('descriptor')) {
      columnas.descripcion = i;
    } else if (titulo.includes('marca')) {
      columnas.marca = i;
    } else if (titulo.includes('modelo')) {
      columnas.modelo = i;
    } else if (titulo.includes('serie')) {
      columnas.serie = i;
    } else if (titulo.includes('cantidad')) {
      columnas.cantidad = i;
    } else if (titulo.includes('ubicaci')) {
      columnas.ubicacion = i;
    } else if (titulo.includes('observaci')) {
      columnas.observacion = i;
    } else if (titulo.includes('proveedor')) {
      columnas.proveedor = i;
    }
  }
  return columnas;
}

// buscarColumnasSalas
// Recibe: la fila de debajo de los encabezados y las columnas.
// Devuelve: las columnas que tienen un código de sala (B-206 -> "B206"),
// desde la de "UBICACIÓN" hacia la derecha (sin la de observaciones).
export function buscarColumnasSalas(subencabezados: CeldaPlanilla[], columnas: Columnas): ColumnaSala[] {
  const salas: ColumnaSala[] = [];
  for (let i = columnas.ubicacion; i < subencabezados.length; i++) {
    if (i === columnas.observacion) {
      continue;
    }
    const codigo = codigoDeSala(textoCelda(subencabezados[i]));
    if (codigo !== '') {
      salas.push({ columna: i, codigo: codigo });
    }
  }
  return salas;
}
