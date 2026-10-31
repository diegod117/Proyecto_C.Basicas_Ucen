// revisionPlanilla.ts
// Revisa cada fila leída de la planilla Excel: arma el Recurso de las filas
// válidas y escribe los errores de las demás (con su número de fila). También
// calcula qué categorías y salas hay que crear en Configuración antes de
// guardar. Es una función pura: recibe las listas por parámetro y no
// guarda nada (el guardado está en services/importacionService.ts).
// Cubre: HU-16, RF-15 (CA-16.2: filas válidas separadas de filas con error)

import type { Recurso } from '../types/Recurso';
import type { Categoria, Torre, Sala } from '../types/Configuracion';
import type { FilaPlanilla, FilaRevisada, FaltantesCarga, ResultadoRevision } from '../types/Importacion';
import { crearClaveCategoria, claveCategoriaValida } from './configuracion';
import { leerCantidad, partirDescripcion, normalizarNombreCategoria, textoCelda } from './valoresPlanilla';
import { armarRecursoDeFila, mismoRecurso } from './recursoPlanilla';

// usaSeriePorUnidad
// Recibe: una categoría que ya existe. Devuelve: true si cada unidad debe
// tener su número de serie (equipos e instrumentos, HU-12). Es la misma
// regla de utils/unidades.ts, escrita aquí para no depender de los servicios.
function usaSeriePorUnidad(categoria: Categoria): boolean {
  if (categoria.usaNumeroSerie !== undefined) {
    return categoria.usaNumeroSerie;
  }
  return categoria.clave === 'instrumento' || categoria.clave === 'equipo';
}

// revisarCategoria
// Recibe: el nombre y la clave de la categoría de la fila, las categorías
//         que existen y la lista de faltantes (donde se anota la que no exista).
// Devuelve: un mensaje de error, o '' si la categoría sirve.
function revisarCategoria(
  nombreCategoria: string,
  claveCategoria: string,
  categorias: Categoria[],
  faltantes: FaltantesCarga,
): string {
  if (nombreCategoria === '') {
    return 'No tiene categoría.';
  }
  if (!claveCategoriaValida(claveCategoria)) {
    return 'El nombre de la categoría "' + nombreCategoria + '" no es válido.';
  }
  const categoria = categorias.find((c) => c.clave === claveCategoria);
  if (categoria === undefined) {
    if (!faltantes.categorias.some((c) => c.clave === claveCategoria)) {
      faltantes.categorias.push({ clave: claveCategoria, nombre: nombreCategoria });
    }
    return 'La categoría "' + nombreCategoria + '" no existe en Configuración.';
  }
  if (usaSeriePorUnidad(categoria)) {
    return 'La categoría "' + categoria.nombre + '" pide un número de serie por cada unidad y la planilla no los trae.';
  }
  return '';
}

// revisarSala
// Recibe: las salas marcadas en la fila, las torres y salas que existen y la
//         lista de faltantes (donde se anota la sala que no exista).
// Devuelve: un mensaje de error, o '' si hay exactamente una sala válida.
function revisarSala(
  salasMarcadas: string[],
  torres: Torre[],
  salas: Sala[],
  faltantes: FaltantesCarga,
): string {
  if (salasMarcadas.length === 0) {
    return 'No tiene ninguna sala marcada.';
  }
  if (salasMarcadas.length > 1) {
    return 'Está marcada en más de una sala (' + salasMarcadas.join(', ') + ').';
  }
  const codigo = salasMarcadas[0];
  const letraTorre = codigo.charAt(0);
  if (salas.some((s) => s.codigo === codigo)) {
    return '';
  }
  if (!torres.some((t) => t.letra === letraTorre)) {
    return 'La torre ' + letraTorre + ' no existe en Configuración.';
  }
  if (!faltantes.salas.some((s) => s.codigo === codigo)) {
    faltantes.salas.push({ codigo: codigo, torre: letraTorre, numero: codigo.slice(1) });
  }
  return 'La sala ' + codigo + ' no existe en Configuración.';
}

// revisarFilas
// Recibe: las filas de la planilla y los datos actuales de la app (categorías,
//         torres, salas y recursos ya guardados).
// Devuelve: las filas válidas, las filas con error (con todos sus errores) y
//           las categorías y salas que faltan crear.
export function revisarFilas(
  filas: FilaPlanilla[],
  categorias: Categoria[],
  torres: Torre[],
  salas: Sala[],
  existentes: Recurso[],
): ResultadoRevision {
  const resultado: ResultadoRevision = { validas: [], conError: [], faltantes: { categorias: [], salas: [] } };

  for (const fila of filas) {
    const errores: string[] = [];
    const nombre = partirDescripcion(fila.descripcion).nombre;
    const nombreCategoria = normalizarNombreCategoria(fila.categoria);
    const claveCategoria = crearClaveCategoria(nombreCategoria);

    if (nombre === '') {
      errores.push('Falta la descripción.');
    }
    const errorCategoria = revisarCategoria(nombreCategoria, claveCategoria, categorias, resultado.faltantes);
    if (errorCategoria !== '') {
      errores.push(errorCategoria);
    }
    const errorSala = revisarSala(fila.salasMarcadas, torres, salas, resultado.faltantes);
    if (errorSala !== '') {
      errores.push(errorSala);
    }
    const lectura = leerCantidad(fila.cantidad);
    if (lectura.error !== '') {
      errores.push(lectura.error);
    }

    // Con la fila sin errores armamos el recurso y buscamos repetidos: entre
    // los ya guardados y entre las filas válidas anteriores de este archivo
    let recurso: Recurso | null = null;
    if (errores.length === 0) {
      // Si la cantidad traía texto ("4 kit"), se guarda tal cual en la observación
      let notaCantidad = '';
      if (lectura.nota !== '') {
        notaCantidad = textoCelda(fila.cantidad);
      }
      const nuevo = armarRecursoDeFila(fila, claveCategoria, fila.salasMarcadas[0], lectura.cantidad, notaCantidad);
      const guardado = existentes.find((e) => mismoRecurso(e, nuevo));
      const anterior = resultado.validas.find((v) => v.recurso !== null && mismoRecurso(v.recurso, nuevo));
      if (guardado !== undefined) {
        errores.push('Ya está cargado: es igual al recurso "' + guardado.nombre + '" (' + guardado.ubicacion.codigo + ').');
      } else if (anterior !== undefined) {
        errores.push('Está repetida: es igual a la fila ' + anterior.numeroFila + '.');
      } else {
        recurso = nuevo;
      }
    }

    const revisada: FilaRevisada = {
      numeroFila: fila.numeroFila,
      nombre: nombre,
      categoria: nombreCategoria,
      sala: fila.salasMarcadas.length === 1 ? fila.salasMarcadas[0] : '',
      cantidad: lectura.error === '' ? String(lectura.cantidad) : '',
      errores: errores,
      recurso: recurso,
    };
    if (recurso !== null) {
      resultado.validas.push(revisada);
    } else {
      resultado.conError.push(revisada);
    }
  }
  return resultado;
}
