// unidades.ts
// Funciones de ayuda para las unidades con número de serie de equipos e
// instrumentos: saber si una categoría las usa, validar los números que
// escribe el encargado y contar las unidades por estado.
// Son funciones puras (no guardan nada): solo calculan.
// Cubre: HU-12, RF-11 (CA-12.1 y CA-12.2), HU-15 (máximo de unidades por operación)

import type { Unidad, CantidadesPorEstado } from '../types/Recurso';
import { obtenerCategoriaPorClave } from '../services/configuracionService';

// Máximo de unidades con número de serie al AGREGAR un recurso (evita
// formularios gigantes por un error de tipeo, ej: escribir 1000 sin querer).
// Ahí mandan los 100: el recurso se guarda en un solo documento (2 escrituras).
export const MAXIMO_UNIDADES_CON_SERIE = 100;

// Máximo de unidades en UNA operación sobre un recurso que ya existe: cambiar el
// estado de varias unidades, una entrada con números de serie o una salida con
// unidades marcadas (HU-02, HU-14). En esas operaciones se guarda en un solo
// lote 1 recurso + 1 registro de historial POR UNIDAD (1 + 18 = 19 escrituras).
// Las reglas de seguridad de Firestore (HU-15) consultan el documento del
// usuario con un get() en cada escritura y Firebase permite como máximo 20
// consultas por lote, así que más de 18 unidades haría fallar el lote entero.
// Se limita en vez de partir el lote para que el cambio siga siendo atómico
// (se guarda todo o no se guarda nada). Aquí manda el 18, no el 100.
export const MAXIMO_UNIDADES_POR_OPERACION = 18;

// validarUnidadesPorOperacion
// Recibe: cuántas unidades se quieren mover en una sola operación.
// Devuelve: un mensaje de error, o '' si no pasa del máximo.
export function validarUnidadesPorOperacion(cantidad: number): string {
  if (cantidad > MAXIMO_UNIDADES_POR_OPERACION) {
    return (
      'Máximo ' + MAXIMO_UNIDADES_POR_OPERACION +
      ' unidades por operación. Divide el cambio en dos operaciones.'
    );
  }
  return '';
}

// categoriaUsaNumeroSerie
// Recibe: la clave de una categoría (ej: 'equipo').
// Devuelve: true si las unidades de esa categoría se identifican por número
// de serie o de inventario.
// Las categorías guardadas antes de HU-12 no tienen el campo "usaNumeroSerie"
// y las reglas de Firestore no dejan modificarlas, así que para 'instrumento'
// y 'equipo' (lo que dice la línea base) se asume que sí lo usan.
export function categoriaUsaNumeroSerie(claveCategoria: string): boolean {
  const categoria = obtenerCategoriaPorClave(claveCategoria);
  if (categoria === undefined) {
    return false;
  }
  if (categoria.usaNumeroSerie !== undefined) {
    return categoria.usaNumeroSerie;
  }
  return categoria.clave === 'instrumento' || categoria.clave === 'equipo';
}

// validarNumerosUnidades
// Recibe: los números escritos en el formulario y la cantidad de unidades.
// Devuelve: un texto con el error, o '' si todo está bien.
// Revisa: que la cantidad no sea demasiado grande, que no falte ningún
// número (CA-12.1) y que no haya repetidos dentro del mismo recurso (CA-12.2).
// Al agregar unidades a un recurso que ya existe (HU-14), "numerosExistentes"
// son los números que ya tiene, para que los nuevos tampoco los repitan.
export function validarNumerosUnidades(
  numeros: string[],
  cantidad: number,
  numerosExistentes: string[] = [],
): string {
  if (cantidad > MAXIMO_UNIDADES_CON_SERIE) {
    return 'Los equipos e instrumentos se agregan de a ' + MAXIMO_UNIDADES_CON_SERIE + ' unidades como máximo.';
  }

  const vistos: string[] = [];
  for (const existente of numerosExistentes) {
    vistos.push(existente.trim().toLowerCase());
  }
  for (let i = 0; i < cantidad; i++) {
    // Si el encargado no escribió esa posición, el valor es undefined: lo tratamos como vacío
    let numero = '';
    if (numeros[i] !== undefined) {
      numero = numeros[i].trim();
    }

    if (numero === '') {
      return 'Escribe el número de serie o de inventario de la unidad ' + (i + 1) + '.';
    }

    // Comparamos en minúsculas para que "abc-1" y "ABC-1" cuenten como repetidos
    const numeroMinuscula = numero.toLowerCase();
    if (vistos.includes(numeroMinuscula)) {
      return 'El número "' + numero + '" está repetido. Cada unidad debe tener un número distinto.';
    }
    vistos.push(numeroMinuscula);
  }

  return '';
}

// armarUnidades
// Recibe: los números ya validados.
// Devuelve: una lista de unidades, todas "disponible" (igual que las
// cantidades iniciales de un recurso nuevo).
export function armarUnidades(numeros: string[]): Unidad[] {
  const unidades: Unidad[] = [];
  for (const numero of numeros) {
    unidades.push({ numero: numero.trim(), estado: 'disponible' });
  }
  return unidades;
}

// contarUnidadesPorEstado
// Recibe: la lista de unidades de un recurso.
// Devuelve: cuántas unidades hay en cada estado (la forma de "cantidades").
export function contarUnidadesPorEstado(unidades: Unidad[]): CantidadesPorEstado {
  const cantidades: CantidadesPorEstado = {
    disponible: 0,
    en_uso: 0,
    danado: 0,
    en_mantencion: 0,
    dado_de_baja: 0,
  };
  for (const unidad of unidades) {
    cantidades[unidad.estado] = cantidades[unidad.estado] + 1;
  }
  return cantidades;
}
