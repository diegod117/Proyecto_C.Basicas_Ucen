// TablaIncidencias.tsx
// Tabla que muestra el historial de todas las incidencias registradas (HU-10).
// Cada fila muestra: fecha, recurso afectado, descripción y estado.
// El nombre del recurso se obtiene a partir de su recursoId usando
// obtenerRecursoPorId() del servicio de Johann.
// Cubre: HU-10 (historial de incidencias), RF-05

import { obtenerIncidencias } from '../services/incidenciasService';
import { obtenerRecursoPorId } from '../services/recursosService';
import EtiquetaEstadoIncidencia from './EtiquetaEstadoIncidencia';
import './TablaIncidencias.css';

// nombreDelRecurso
// Recibe: el id de un recurso.
// Devuelve: el nombre del recurso, o "Recurso desconocido" si no lo encuentra.
// Esto es necesario porque la incidencia guarda solo el id (recursoId),
// no el nombre completo. Así evitamos que el nombre quede desactualizado
// si alguien lo cambia en el inventario.
function nombreDelRecurso(recursoId: number): string {
  const recurso = obtenerRecursoPorId(recursoId);
  if (recurso !== undefined) {
    return recurso.nombre;
  }
  return 'Recurso desconocido';
}

// Componente TablaIncidencias
// No recibe props. Devuelve la tabla con todas las incidencias.
function TablaIncidencias() {
  const incidencias = obtenerIncidencias();

  // Si no hay incidencias, mostramos un mensaje en vez de la tabla vacía.
  if (incidencias.length === 0) {
    return (
      <div className="tabla-incidencias-contenedor">
        <h3 className="tabla-incidencias-titulo">Historial de incidencias</h3>
        <p className="tabla-incidencias-vacia">No hay incidencias registradas.</p>
      </div>
    );
  }

  return (
    <div className="tabla-incidencias-contenedor">
      <h3 className="tabla-incidencias-titulo">Historial de incidencias</h3>
      <table className="tabla-incidencias">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Recurso afectado</th>
            <th>Descripción</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {incidencias.map((incidencia) => (
            <tr key={incidencia.id}>
              <td>{incidencia.fecha}</td>
              <td>{nombreDelRecurso(incidencia.recursoId)}</td>
              <td>{incidencia.descripcion}</td>
              <td><EtiquetaEstadoIncidencia estado={incidencia.estado} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaIncidencias;
