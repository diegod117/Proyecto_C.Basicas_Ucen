// TablaIncidencias.tsx
// Tabla que muestra el historial de todas las incidencias registradas (HU-10).
// Cada fila muestra: fecha, recurso afectado, descripción, quién la registró,
// estado y una acción para avanzar el estado:
// de 'pendiente' -> 'en_revision' -> 'resuelta'.
// El nombre del recurso se obtiene a partir de su recursoId usando
// obtenerRecursoPorId() del servicio de Johann.
// La columna "Acción" solo la ve el encargado; el departamento solo consulta.
// Cubre: HU-10 (historial de incidencias y avance de estado), RF-05, RNF-03

import { useState } from 'react';
import {
  obtenerIncidencias,
  cambiarEstadoIncidencia,
} from '../services/incidenciasService';
import { obtenerRecursoPorId } from '../services/recursosService';
import type { EstadoIncidencia } from '../types/Incidencia';
import type { Usuario } from '../types/Usuario';
import { puedeGestionarIncidencias } from '../utils/permisos';
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

// Props que recibe la tabla desde PaginaIncidencias
interface PropsTablaIncidencias {
  // Usuario conectado: decide si se muestran los botones de acción (RNF-03)
  usuario: Usuario;
}

// Componente TablaIncidencias
// Recibe el usuario conectado. Devuelve la tabla con todas las incidencias
// y, si el rol lo permite, los botones para avanzar su estado.
function TablaIncidencias(props: PropsTablaIncidencias) {
  // true si el usuario puede avanzar el estado de las incidencias.
  // Lo calculamos una vez y lo usamos en el encabezado y en cada fila.
  const mostrarAcciones = puedeGestionarIncidencias(props.usuario.rol);

  // Guardamos las incidencias en el estado local de React.
  // Así, cuando cambiemos el estado de una incidencia, React volverá a dibujar
  // la tabla mostrando el cambio inmediatamente sin recargar la página.
  const [incidencias, setIncidencias] = useState(obtenerIncidencias());

  // Función que se llama al hacer clic en un botón para avanzar el estado.
  // Recibe el id de la incidencia y el nuevo estado al que pasa.
  function manejarCambiarEstado(id: number, nuevoEstado: EstadoIncidencia) {
    const exito = cambiarEstadoIncidencia(id, nuevoEstado);
    if (exito) {
      // Le pedimos de nuevo la lista al servicio y actualizamos el estado de React
      setIncidencias(obtenerIncidencias());
    }
  }

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
            <th>Registrada por</th>
            <th>Estado</th>
            {/* La columna "Acción" solo existe si el rol puede gestionar */}
            {mostrarAcciones && <th>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {incidencias.map((incidencia) => (
            <tr key={incidencia.id}>
              <td>{incidencia.fecha}</td>
              <td>{nombreDelRecurso(incidencia.recursoId)}</td>
              <td>{incidencia.descripcion}</td>
              {/* Nombre del usuario que inició sesión al registrarla (HU-10) */}
              <td>{incidencia.registradaPor}</td>
              <td><EtiquetaEstadoIncidencia estado={incidencia.estado} /></td>
              {mostrarAcciones && (
                <td>
                  {/* Si está pendiente, permite pasarla a 'en_revision' */}
                  {incidencia.estado === 'pendiente' && (
                    <button
                      type="button"
                      className="boton-accion-incidencia boton-accion-revision"
                      onClick={() => manejarCambiarEstado(incidencia.id, 'en_revision')}
                    >
                      Pasar a en revisión
                    </button>
                  )}

                  {/* Si está en revisión, permite pasarla a 'resuelta' */}
                  {incidencia.estado === 'en_revision' && (
                    <button
                      type="button"
                      className="boton-accion-incidencia boton-accion-resuelta"
                      onClick={() => manejarCambiarEstado(incidencia.id, 'resuelta')}
                    >
                      Marcar como resuelta
                    </button>
                  )}

                  {/* Si ya está resuelta, no hay más acciones por realizar */}
                  {incidencia.estado === 'resuelta' && (
                    <span className="texto-accion-finalizada">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaIncidencias;
