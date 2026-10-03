// filtrosInventario.ts
// Funciones para filtrar el inventario por nombre, categoría,
// laboratorio y estado. Las usa la página de inventario.
// Cubre: HU-01 (filtros por nombre, categoría, laboratorio y estado), RF-02

import type { Recurso } from '../types/Recurso';

// Valor especial que usamos en los <select> para decir "sin filtro".
// Lo guardamos en una constante para no escribir 'todos' a mano en
// varios archivos (si nos equivocamos en una letra, el filtro fallaría).
export const SIN_FILTRO = 'todos';

// prepararTextoParaBuscar
// Recibe: un texto cualquiera, por ejemplo "Termómetro Digital".
// Devuelve: el mismo texto en minúsculas y sin tildes: "termometro digital".
// Sirve para comparar textos sin que importen las mayúsculas ni las tildes,
// porque los usuarios muchas veces escriben "termometro" sin tilde.
export function prepararTextoParaBuscar(texto: string): string {
  let resultado = texto.toLowerCase();

  // replaceAll reemplaza TODAS las apariciones de una letra por otra
  resultado = resultado.replaceAll('á', 'a');
  resultado = resultado.replaceAll('é', 'e');
  resultado = resultado.replaceAll('í', 'i');
  resultado = resultado.replaceAll('ó', 'o');
  resultado = resultado.replaceAll('ú', 'u');
  resultado = resultado.replaceAll('ü', 'u');

  // trim() quita los espacios sobrantes al inicio y al final
  return resultado.trim();
}

// obtenerCodigoLaboratorio
// Recibe: un recurso.
// Devuelve: el laboratorio donde está, con el formato torre + sala.
// Ejemplo: torre 'B' y sala '307' devuelve "B307".
export function obtenerCodigoLaboratorio(recurso: Recurso): string {
  return recurso.ubicacion.torre + recurso.ubicacion.sala;
}

// obtenerLaboratorios
// Recibe: la lista de recursos.
// Devuelve: los laboratorios que existen, SIN repetir y ordenados.
// Ejemplo: ["B307", "B308", "C210"].
// Se calcula a partir de los recursos, así si mañana se agrega un recurso
// en un laboratorio nuevo, aparece solo en el filtro.
export function obtenerLaboratorios(listaRecursos: Recurso[]): string[] {
  const laboratorios: string[] = [];

  for (const recurso of listaRecursos) {
    const codigo = obtenerCodigoLaboratorio(recurso);

    // Solo lo agregamos si todavía no está en la lista (para no repetir)
    if (!laboratorios.includes(codigo)) {
      laboratorios.push(codigo);
    }
  }

  // sort() ordena los textos alfabéticamente: B307, B308, C210
  laboratorios.sort();
  return laboratorios;
}

// hayFiltrosActivos
// Recibe: los 4 filtros elegidos por el usuario.
// Devuelve: true si el usuario está usando AL MENOS un filtro,
// false si está todo en "Todos" y el buscador vacío.
// Sirve para mostrar el botón "Limpiar filtros" solo cuando tiene sentido.
export function hayFiltrosActivos(
  textoBuscado: string,
  categoria: string,
  laboratorio: string,
  estado: string,
): boolean {
  if (prepararTextoParaBuscar(textoBuscado) !== '') {
    return true;
  }
  if (categoria !== SIN_FILTRO || laboratorio !== SIN_FILTRO || estado !== SIN_FILTRO) {
    return true;
  }
  return false;
}

// filtrarRecursos
// Recibe: la lista de recursos y los 4 filtros elegidos por el usuario.
//   - textoBuscado: lo escrito en el buscador ('' = sin filtro)
//   - categoria, laboratorio, estado: lo elegido en cada <select>
//     (SIN_FILTRO = el usuario no eligió nada en ese filtro)
// Devuelve: una lista NUEVA solo con los recursos que cumplen TODOS los filtros.
export function filtrarRecursos(
  listaRecursos: Recurso[],
  textoBuscado: string,
  categoria: string,
  laboratorio: string,
  estado: string,
): Recurso[] {
  const textoPreparado = prepararTextoParaBuscar(textoBuscado);
  const recursosEncontrados: Recurso[] = [];

  for (const recurso of listaRecursos) {
    // Partimos suponiendo que el recurso cumple todo, y revisamos
    // filtro por filtro. Si falla uno, ya no se muestra.
    let cumpleFiltros = true;

    // 1) Nombre: el nombre debe contener el texto buscado.
    //    Ej: "arduino uno r3".includes("ard") es true.
    if (textoPreparado !== '') {
      const nombrePreparado = prepararTextoParaBuscar(recurso.nombre);
      if (!nombrePreparado.includes(textoPreparado)) {
        cumpleFiltros = false;
      }
    }

    // 2) Categoría: debe ser exactamente la elegida
    if (categoria !== SIN_FILTRO && recurso.categoria !== categoria) {
      cumpleFiltros = false;
    }

    // 3) Laboratorio: debe estar en el laboratorio elegido (ej: "B307")
    if (laboratorio !== SIN_FILTRO && obtenerCodigoLaboratorio(recurso) !== laboratorio) {
      cumpleFiltros = false;
    }

    // 4) Estado: el recurso debe tener AL MENOS 1 unidad en ese estado.
    //    Ej: con "danado" aparecen el multímetro (1) y los termómetros (2).
    if (estado !== SIN_FILTRO) {
      // "estado" es un texto (viene de un <select>), así que revisamos
      // uno por uno cuál es y si el recurso tiene unidades en él
      let tieneUnidadesEnEseEstado = false;
      if (estado === 'disponible' && recurso.cantidades.disponible > 0) {
        tieneUnidadesEnEseEstado = true;
      } else if (estado === 'en_uso' && recurso.cantidades.en_uso > 0) {
        tieneUnidadesEnEseEstado = true;
      } else if (estado === 'danado' && recurso.cantidades.danado > 0) {
        tieneUnidadesEnEseEstado = true;
      } else if (estado === 'en_mantencion' && recurso.cantidades.en_mantencion > 0) {
        tieneUnidadesEnEseEstado = true;
      } else if (estado === 'dado_de_baja' && recurso.cantidades.dado_de_baja > 0) {
        tieneUnidadesEnEseEstado = true;
      }

      if (!tieneUnidadesEnEseEstado) {
        cumpleFiltros = false;
      }
    }

    if (cumpleFiltros) {
      recursosEncontrados.push(recurso);
    }
  }

  return recursosEncontrados;
}
