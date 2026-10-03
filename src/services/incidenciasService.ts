// incidenciasService.ts
// Servicio que centraliza el acceso a las incidencias.
// Las páginas y componentes SIEMPRE usan este servicio para leer o
// modificar incidencias; nunca importan directamente src/data/.
// Así, cuando exista un backend, solo se cambia este archivo.
// Cubre: HU-04 (registrar incidencia), HU-10 (historial con estado)

import type { Incidencia } from '../types/Incidencia';
import { listaIncidenciasPrueba } from '../data/incidencias';

// ------------------------------------------------------------------
// Lista en memoria
// ------------------------------------------------------------------
// Copiamos los datos de prueba a una lista que se puede modificar.
// Al recargar el navegador, los datos vuelven a los originales
// (para el MVP está bien, ver nota en plan-implementacion.md).
const incidencias: Incidencia[] = [...listaIncidenciasPrueba];

// ------------------------------------------------------------------
// obtenerIncidencias
// ------------------------------------------------------------------
// No recibe nada. Devuelve una copia de la lista completa de incidencias.
// Se devuelve una copia ([...]) para que nadie modifique la lista
// original por accidente desde afuera del servicio.
function obtenerIncidencias(): Incidencia[] {
  return [...incidencias];
}

// ------------------------------------------------------------------
// obtenerIncidenciaPorId
// ------------------------------------------------------------------
// Recibe el id de una incidencia.
// Devuelve la incidencia si la encuentra, o undefined si no existe.
// Útil para mostrar el detalle de una incidencia específica.
function obtenerIncidenciaPorId(id: number): Incidencia | undefined {
  for (const incidencia of incidencias) {
    if (incidencia.id === id) {
      return incidencia;
    }
  }
  return undefined;
}

// ------------------------------------------------------------------
// agregarIncidencia
// ------------------------------------------------------------------
// Recibe una incidencia SIN id (el servicio le asigna uno automático).
// Devuelve la incidencia ya guardada con su id.
// Omit<Incidencia, 'id'> significa "una Incidencia pero sin el campo id".
function agregarIncidencia(datos: Omit<Incidencia, 'id'>): Incidencia {
  // Generamos un id nuevo: tomamos el mayor id que exista y le sumamos 1.
  // Si la lista está vacía, el id será 1.
  let mayorId = 0;
  for (const incidencia of incidencias) {
    if (incidencia.id > mayorId) {
      mayorId = incidencia.id;
    }
  }

  const nuevaIncidencia: Incidencia = {
    id: mayorId + 1,
    ...datos,
  };

  incidencias.push(nuevaIncidencia);
  return nuevaIncidencia;
}

// ------------------------------------------------------------------
// Exportamos las funciones para que las usen las páginas
// ------------------------------------------------------------------
export { obtenerIncidencias, obtenerIncidenciaPorId, agregarIncidencia };
