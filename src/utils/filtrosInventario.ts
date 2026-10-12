// filtrosInventario.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Herramientas para los FILTROS del inventario: el buscador por nombre y
// los menús de categoría, laboratorio y estado.
// Funciona como un colador: entra la lista completa de recursos y sale
// solo la que cumple con lo que elegiste.
// En la guía: paso 4 (estado y filtros).
// Cubre: HU-01 (filtros por nombre, categoría, laboratorio y estado), RF-02

import type { Recurso } from '../types/Recurso';

// El valor especial que significa "no estoy filtrando nada" en los menús.
// Se guarda en una constante con nombre en MAYÚSCULAS (así se marcan los
// valores que nunca cambian). Si escribiéramos 'todos' a mano en varios
// archivos y en uno pusiéramos 'Todos', el filtro fallaría sin avisar.
export const SIN_FILTRO = 'todos';

// prepararTextoParaBuscar
// Recibe: un texto, ej: "Termómetro Digital".
// Devuelve: el mismo texto en minúsculas y sin tildes: "termometro digital".
// Así da igual si la persona escribe "TERMÓMETRO" o "termometro":
// los dos se convierten en lo mismo y se pueden comparar.
export function prepararTextoParaBuscar(texto: string): string {
  // toLowerCase() = todo a minúsculas.
  let resultado = texto.toLowerCase();

  // replaceAll('á', 'a') = cambia TODAS las 'á' por 'a'.
  resultado = resultado.replaceAll('á', 'a');
  resultado = resultado.replaceAll('é', 'e');
  resultado = resultado.replaceAll('í', 'i');
  resultado = resultado.replaceAll('ó', 'o');
  resultado = resultado.replaceAll('ú', 'u');
  resultado = resultado.replaceAll('ü', 'u');

  // trim() borra los espacios sobrantes al principio y al final.
  return resultado.trim();
}

// obtenerCodigoLaboratorio
// Recibe: un recurso.
// Devuelve: su laboratorio = torre + sala. Ej: 'B' + '307' = "B307".
export function obtenerCodigoLaboratorio(recurso: Recurso): string {
  return recurso.ubicacion.torre + recurso.ubicacion.sala;
}

// obtenerLaboratorios
// Recibe: la lista de recursos.
// Devuelve: los laboratorios que existen, SIN repetir y ordenados.
// Ej: ["B307", "B308", "C210"]. Son las opciones del menú "Laboratorio".
// Se calcula mirando los recursos: si mañana agregas un recurso en un
// laboratorio nuevo, aparece solo en el menú, sin tocar código.
export function obtenerLaboratorios(listaRecursos: Recurso[]): string[] {
  const laboratorios: string[] = [];

  for (const recurso of listaRecursos) {
    const codigo = obtenerCodigoLaboratorio(recurso);

    // includes = "¿la lista ya tiene este código?". Con el ! = "si NO lo tiene".
    // Solo lo agregamos si es nuevo, para no repetir.
    if (!laboratorios.includes(codigo)) {
      laboratorios.push(codigo);
    }
  }

  // sort() ordena textos en orden alfabético: B307, B308, C210.
  laboratorios.sort();
  return laboratorios;
}

// hayFiltrosActivos
// Recibe: los 4 filtros elegidos.
// Devuelve: true si la persona está usando AL MENOS un filtro;
// false si todo está en "Todos" y el buscador está vacío.
// Sirve para mostrar el botón "Limpiar filtros" solo cuando hace falta.
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
// EL COLADOR. Recibe la lista de recursos y los 4 filtros:
//   - textoBuscado: lo escrito en el buscador ('' = no busca nada)
//   - categoria, laboratorio, estado: lo elegido en cada menú
//     (SIN_FILTRO = en ese menú dice "Todos")
// Devuelve: una lista NUEVA solo con los recursos que pasan TODOS los filtros.
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
    // Partimos creyendo que el recurso pasa (true) y lo revisamos filtro
    // por filtro. Si falla UNO solo, ya no pasa (false). Es como una
    // carrera de obstáculos: si botas una valla, quedas fuera.
    let cumpleFiltros = true;

    // Obstáculo 1) Nombre: ¿el nombre contiene lo que se buscó?
    //    includes = "¿contiene?". Ej: "arduino uno r3".includes("ard") -> true.
    if (textoPreparado !== '') {
      const nombrePreparado = prepararTextoParaBuscar(recurso.nombre);
      if (!nombrePreparado.includes(textoPreparado)) {
        cumpleFiltros = false;
      }
    }

    // Obstáculo 2) Categoría: si se eligió una, tiene que ser esa.
    //    && = "y": "si hay filtro de categoría Y el recurso es de otra...".
    if (categoria !== SIN_FILTRO && recurso.categoria !== categoria) {
      cumpleFiltros = false;
    }

    // Obstáculo 3) Laboratorio: si se eligió uno (ej: "B307"), tiene que estar ahí.
    if (laboratorio !== SIN_FILTRO && obtenerCodigoLaboratorio(recurso) !== laboratorio) {
      cumpleFiltros = false;
    }

    // Obstáculo 4) Estado: el recurso tiene que tener AL MENOS 1 unidad
    //    en ese estado. Ej: con "Dañado" aparecen el multímetro (1) y los termómetros (2).
    if (estado !== SIN_FILTRO) {
      // "estado" llega como texto desde el menú, así que preguntamos
      // uno por uno cuál es y si el recurso tiene unidades en ese cajón.
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

    // ¿Pasó todos los obstáculos? Entonces entra a la lista de resultados.
    if (cumpleFiltros) {
      recursosEncontrados.push(recurso);
    }
  }

  return recursosEncontrados;
}
