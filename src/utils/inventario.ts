// inventario.ts
// Funciones de ayuda para mostrar los datos del inventario en pantalla.
// Las usan varias páginas (Inventario, Reservas, Incidencias, Alertas),
// por eso están aquí y no repetidas en cada componente.
// Cubre: HU-01, RF-01 (estados), RF-02 (cantidad), RF-08 (categorías)

// ¿Por qué hacen falta estas funciones?
// En el código guardamos los estados y categorías sin tildes ni espacios
// (ej: 'en_mantencion', 'instalacion') para evitar errores al escribirlos.
// Pero al usuario hay que mostrarle un texto bonito ("En mantención").
// Estas funciones hacen esa "traducción" en un solo lugar.

import type { Recurso, EstadoRecurso, CategoriaRecurso } from '../types/Recurso';

// Lista con los 5 estados, en el orden en que queremos mostrarlos.
// Sirve para recorrer todos los estados con un for (por ejemplo, para
// dibujar las etiquetas de una tarjeta o las opciones de un filtro).
export const listaEstadosRecurso: EstadoRecurso[] = [
  'disponible',
  'en_uso',
  'danado',
  'en_mantencion',
  'dado_de_baja',
];

// Lista con las 6 categorías (RF-08). Se usa para las opciones del filtro
// por categoría. Si se agrega una categoría nueva (RNF-05), se suma aquí
// y en el tipo CategoriaRecurso.
export const listaCategoriasRecurso: CategoriaRecurso[] = [
  'instrumento',
  'insumo',
  'equipo',
  'reactivo',
  'mobiliario',
  'instalacion',
];

// textoEstado
// Recibe: un estado del recurso, por ejemplo 'danado'.
// Devuelve: el texto para mostrar en pantalla, por ejemplo "Dañado".
export function textoEstado(estado: EstadoRecurso): string {
  if (estado === 'disponible') {
    return 'Disponible';
  } else if (estado === 'en_uso') {
    return 'En uso';
  } else if (estado === 'danado') {
    return 'Dañado';
  } else if (estado === 'en_mantencion') {
    return 'En mantención';
  } else {
    // Si no fue ninguno de los anteriores, solo puede ser 'dado_de_baja',
    // porque EstadoRecurso no permite otros valores.
    return 'Dado de baja';
  }
}

// textoCategoria
// Recibe: una categoría, por ejemplo 'instalacion'.
// Devuelve: el texto para mostrar en pantalla, por ejemplo "Instalación".
export function textoCategoria(categoria: CategoriaRecurso): string {
  if (categoria === 'instrumento') {
    return 'Instrumento';
  } else if (categoria === 'insumo') {
    return 'Insumo';
  } else if (categoria === 'equipo') {
    return 'Equipo';
  } else if (categoria === 'reactivo') {
    return 'Reactivo';
  } else if (categoria === 'mobiliario') {
    return 'Mobiliario';
  } else {
    // El único valor que queda es 'instalacion'
    return 'Instalación';
  }
}

// calcularCantidadTotal
// Recibe: un recurso.
// Devuelve: cuántas unidades tiene en total, sumando todos sus estados.
// Ejemplo: el multímetro tiene 12 disponibles + 1 dañado + 1 en mantención = 14.
//
// No guardamos el total en el recurso porque podría quedar desactualizado:
// es más seguro calcularlo cada vez a partir de las cantidades por estado.
export function calcularCantidadTotal(recurso: Recurso): number {
  const cantidades = recurso.cantidades;

  const total =
    cantidades.disponible +
    cantidades.en_uso +
    cantidades.danado +
    cantidades.en_mantencion +
    cantidades.dado_de_baja;

  return total;
}

// textoCampoOpcional
// Recibe: el valor de un campo opcional del recurso (marca, proveedor...).
// Devuelve: ese mismo texto, o "No registrado" si el campo no viene.
// El "?" en "valor?: string" indica que el parámetro puede no venir
// (undefined), igual que los campos opcionales de la interface Recurso.
export function textoCampoOpcional(valor?: string): string {
  if (valor === undefined || valor === '') {
    return 'No registrado';
  }
  return valor;
}

// obtenerEstadosConUnidades
// Recibe: un recurso.
// Devuelve: solo los estados que tienen al menos 1 unidad.
// Ejemplo: el Arduino tiene 26 disponibles y 19 en uso, así que
// devuelve ['disponible', 'en_uso'] (no tiene sentido mostrar "Dañado (0)").
export function obtenerEstadosConUnidades(recurso: Recurso): EstadoRecurso[] {
  const estadosConUnidades: EstadoRecurso[] = [];

  for (const estado of listaEstadosRecurso) {
    // recurso.cantidades[estado] lee la propiedad cuyo nombre está en la
    // variable "estado". Ej: si estado es 'en_uso', lee recurso.cantidades.en_uso.
    // Esto funciona porque en Recurso.ts las propiedades de CantidadesPorEstado
    // se llaman igual que los valores de EstadoRecurso.
    if (recurso.cantidades[estado] > 0) {
      estadosConUnidades.push(estado);
    }
  }

  return estadosConUnidades;
}
