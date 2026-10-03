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
