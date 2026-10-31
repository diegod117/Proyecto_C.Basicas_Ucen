// planillaService.ts
// Servicio que lee el archivo .xlsx que el encargado sube. Es el ÚNICO lugar
// que usa la librería "read-excel-file": si algún día se cambia la librería
// (o el backend), solo se cambia este archivo.
// Devuelve la hoja como una lista de filas con celdas simples; la lógica de
// entender esas filas está en utils/planillaExcel.ts.
// Cubre: HU-16, RF-15 (CA-16.1: acepta un .xlsx)

import { readSheet } from 'read-excel-file/universal';
import type { CeldaPlanilla, ResultadoArchivo } from '../types/Importacion';

// leerArchivoPlanilla
// Recibe: el archivo elegido por el usuario (un File del <input type="file">).
// Devuelve: una Promise con la primera hoja del archivo, o un mensaje de
// error si no es un .xlsx válido. No guarda nada.
export async function leerArchivoPlanilla(archivo: File): Promise<ResultadoArchivo> {
  if (!archivo.name.toLowerCase().endsWith('.xlsx')) {
    return { hoja: [], error: 'El archivo debe ser un .xlsx (Excel).' };
  }

  try {
    // readSheet devuelve una lista de filas; cada fila, una lista de celdas
    const filasLeidas = await readSheet(archivo);

    // Pasamos cada celda a un tipo simple: texto, número, verdadero/falso o vacía
    const hoja: CeldaPlanilla[][] = [];
    for (const filaLeida of filasLeidas) {
      const fila: CeldaPlanilla[] = [];
      for (const celda of filaLeida) {
        if (typeof celda === 'string' || typeof celda === 'number' || typeof celda === 'boolean') {
          fila.push(celda);
        } else {
          fila.push(null);
        }
      }
      hoja.push(fila);
    }
    return { hoja: hoja, error: '' };
  } catch (error) {
    console.error('Error al leer la planilla:', error);
    return { hoja: [], error: 'No se pudo leer el archivo. Revisa que sea un .xlsx válido.' };
  }
}
