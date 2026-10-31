// antiguedad.ts
// Funciones para calcular la antigüedad de un recurso a partir de su fecha
// de adquisición, mostrarla en texto y filtrar el inventario por antigüedad.
// Son funciones "puras": reciben la fecha de hoy como parámetro (no la
// leen del reloj), así dan siempre el mismo resultado con los mismos datos.
// Cubre: HU-13, RF-12 (CA-13.2 antigüedad en años y meses, CA-13.3 filtro)

// Valores de las opciones del filtro "Antigüedad" (los que guarda el <select>)
export const ANTIGUEDAD_MENOS_1 = 'menos_1';
export const ANTIGUEDAD_ENTRE_1_2 = 'entre_1_2';
export const ANTIGUEDAD_MAS_2 = 'mas_2';

// Lista de opciones con su texto, para que el <select> las recorra con .map()
export const opcionesAntiguedad = [
  { valor: ANTIGUEDAD_MENOS_1, texto: 'Menos de 1 año' },
  { valor: ANTIGUEDAD_ENTRE_1_2, texto: 'Entre 1 y 2 años' },
  { valor: ANTIGUEDAD_MAS_2, texto: 'Más de 2 años' },
];

// Antigüedad en años y meses completos
export interface Antiguedad {
  anios: number;
  meses: number;
}

// calcularAntiguedad
// Recibe: la fecha de adquisición y la fecha de hoy, ambas como texto
//         "AAAA-MM-DD" (ej: "2025-04-20" y "2026-10-31").
// Devuelve: los años y meses COMPLETOS que han pasado (ej: 1 año y 6 meses).
//
// REGLA PARA DATOS RAROS: "dato raro = antigüedad cero". Si el texto no tiene
// el formato AAAA-MM-DD, o la fecha es posterior a hoy, devuelve 0 años y
// 0 meses (nunca números negativos ni NaN). Una fecha mal escrita (no vacía)
// contaría entonces como antigüedad cero y caería en "Menos de 1 año".
// Por el formulario esto no debería ocurrir, porque el input de fecha
// entrega siempre un formato válido y la validación rechaza las futuras.
//
// Ejemplos de los límites (con hoy = 2026-10-31), anotados en vez de probados en vivo:
//   "2025-10-31" -> 1 año y 0 meses  (1 año justo: cae en "Entre 1 y 2 años")
//   "2025-11-01" -> 0 años y 11 meses (cae en "Menos de 1 año")
//   "2024-10-31" -> 2 años y 0 meses  (2 años justos: cae en "Más de 2 años")
//   "2024-11-01" -> 1 año y 11 meses  (cae en "Entre 1 y 2 años")
//   "2026-12-01" (futura) o "abc" -> 0 años y 0 meses
export function calcularAntiguedad(fechaAdquisicion: string, fechaHoy: string): Antiguedad {
  const partesAdquisicion = fechaAdquisicion.split('-');
  const partesHoy = fechaHoy.split('-');

  // Si alguna fecha no tiene las 3 partes (año, mes, día), es un dato raro
  if (partesAdquisicion.length !== 3 || partesHoy.length !== 3) {
    return { anios: 0, meses: 0 };
  }

  const anioAdquisicion = Number(partesAdquisicion[0]);
  const mesAdquisicion = Number(partesAdquisicion[1]);
  const diaAdquisicion = Number(partesAdquisicion[2]);
  const anioHoy = Number(partesHoy[0]);
  const mesHoy = Number(partesHoy[1]);
  const diaHoy = Number(partesHoy[2]);

  // Number('abc') da NaN ("no es un número"); isNaN lo detecta
  if (
    isNaN(anioAdquisicion) || isNaN(mesAdquisicion) || isNaN(diaAdquisicion) ||
    isNaN(anioHoy) || isNaN(mesHoy) || isNaN(diaHoy)
  ) {
    return { anios: 0, meses: 0 };
  }

  // Meses que pasaron entre las dos fechas
  let mesesTotales = (anioHoy - anioAdquisicion) * 12 + (mesHoy - mesAdquisicion);

  // Si todavía no llega el día del mes de la adquisición, el último mes no está completo
  if (diaHoy < diaAdquisicion) {
    mesesTotales = mesesTotales - 1;
  }

  // Fecha futura: no hay antigüedad negativa
  if (mesesTotales < 0) {
    return { anios: 0, meses: 0 };
  }

  // Math.floor redondea hacia abajo: 18 meses / 12 = 1,5 -> 1 año
  const anios = Math.floor(mesesTotales / 12);
  // % es el resto de la división: 18 % 12 = 6 meses
  const meses = mesesTotales % 12;
  return { anios: anios, meses: meses };
}

// textoAntiguedad
// Recibe: la fecha de adquisición del recurso (puede no venir) y la fecha de hoy.
// Devuelve: el texto para la ficha, ej: "1 año y 6 meses", "8 meses", "2 años",
//           "Menos de 1 mes" o "Sin fecha" si el recurso no tiene fecha.
export function textoAntiguedad(fechaAdquisicion: string | undefined, fechaHoy: string): string {
  if (fechaAdquisicion === undefined || fechaAdquisicion === '') {
    return 'Sin fecha';
  }

  const antiguedad = calcularAntiguedad(fechaAdquisicion, fechaHoy);

  if (antiguedad.anios === 0 && antiguedad.meses === 0) {
    return 'Menos de 1 mes';
  }

  // Armamos las dos partes con su singular o plural
  let textoAnios = '';
  if (antiguedad.anios === 1) {
    textoAnios = '1 año';
  } else if (antiguedad.anios > 1) {
    textoAnios = antiguedad.anios + ' años';
  }

  let textoMeses = '';
  if (antiguedad.meses === 1) {
    textoMeses = '1 mes';
  } else if (antiguedad.meses > 1) {
    textoMeses = antiguedad.meses + ' meses';
  }

  // Si hay ambas se unen con "y"; si solo hay una, se muestra sola
  if (textoAnios !== '' && textoMeses !== '') {
    return textoAnios + ' y ' + textoMeses;
  }
  return textoAnios + textoMeses;
}

// cumpleFiltroAntiguedad
// Recibe: la fecha de adquisición del recurso (puede no venir), una de las
//         opciones del filtro (ANTIGUEDAD_...) y la fecha de hoy.
// Devuelve: true si el recurso entra en ese rango. Se usan AÑOS COMPLETOS:
//   menos de 1 año = 0 años · entre 1 y 2 años = 1 año · más de 2 años = 2 o más.
// Un recurso sin fecha no cumple ningún rango (queda fuera cuando el filtro está activo).
export function cumpleFiltroAntiguedad(
  fechaAdquisicion: string | undefined,
  filtro: string,
  fechaHoy: string,
): boolean {
  if (fechaAdquisicion === undefined || fechaAdquisicion === '') {
    return false;
  }

  const anios = calcularAntiguedad(fechaAdquisicion, fechaHoy).anios;

  if (filtro === ANTIGUEDAD_MENOS_1) {
    return anios === 0;
  } else if (filtro === ANTIGUEDAD_ENTRE_1_2) {
    return anios === 1;
  } else if (filtro === ANTIGUEDAD_MAS_2) {
    return anios >= 2;
  }
  return false;
}
