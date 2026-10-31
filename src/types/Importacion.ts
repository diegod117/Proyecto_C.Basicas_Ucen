// Importacion.ts
// Tipos de la carga del inventario desde la planilla Excel: lo que se lee de
// cada fila, el resultado de revisarla y el resultado de guardar.
// Son solo "moldes" de datos, sin lógica (ver utils/planillaExcel.ts y
// utils/revisionPlanilla.ts).
// Cubre: HU-16, RF-15

import type { Recurso } from './Recurso';
import type { Sala } from './Configuracion';

// Valor de una celda de la hoja. Las celdas vacías llegan como null.
export type CeldaPlanilla = string | number | boolean | null;

// Resultado de leer el archivo: la hoja como lista de filas (cada fila es
// una lista de celdas) o un mensaje de error si no se pudo leer.
export interface ResultadoArchivo {
  hoja: CeldaPlanilla[][];
  error: string; // '' si se leyó bien
}

// Una fila de datos de la planilla, ya ordenada por columnas.
export interface FilaPlanilla {
  numeroFila: number; // número de fila en Excel (la primera fila es la 1)
  categoria: string; // categoría del grupo (rellenada hacia abajo), '' si no hay
  descripcion: string; // "NOMBRE: detalle"
  marca: string;
  modelo: string;
  serie: string;
  proveedor: string; // la planilla actual no trae esta columna
  cantidad: CeldaPlanilla;
  salasMarcadas: string[]; // códigos de las salas con "x", ej: ["B206"]
  observacion: string;
}

// Resultado de leer la estructura de la hoja
export interface ResultadoLectura {
  filas: FilaPlanilla[];
  error: string; // '' si la hoja tiene el formato esperado
}

// Una fila ya revisada: o es válida (trae su recurso) o trae sus errores.
export interface FilaRevisada {
  numeroFila: number;
  nombre: string;
  categoria: string; // nombre normalizado de la categoría
  sala: string; // código de la sala marcada, ej: "B206" ('' si no hay)
  cantidad: string; // cantidad tal como se muestra en la vista previa
  errores: string[];
  recurso: Recurso | null; // null si la fila tiene errores
}

// Categoría que la planilla usa y todavía no existe en Configuración
export interface CategoriaFaltante {
  clave: string;
  nombre: string;
}

// Lo que hay que crear en Configuración antes de guardar los recursos
export interface FaltantesCarga {
  categorias: CategoriaFaltante[];
  salas: Sala[];
}

// Resultado de revisar todas las filas
export interface ResultadoRevision {
  validas: FilaRevisada[];
  conError: FilaRevisada[];
  faltantes: FaltantesCarga;
}

// Resultado de guardar los recursos por tandas
export interface ResultadoGuardado {
  guardados: number; // recursos que quedaron en Firestore
  primerIdRecurso: number; // 0 si no se guardó ninguno
  ultimoIdRecurso: number;
  primerIdHistorial: number;
  ultimoIdHistorial: number;
  fallo: boolean; // true si una tanda no se pudo guardar y se detuvo
}
