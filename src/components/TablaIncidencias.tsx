// TablaIncidencias.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La tabla con TODAS las incidencias (HU-10). Cada fila muestra: la fecha,
// el recurso, qué pasó, quién la anotó, su etapa (el semáforo) y un botón
// para avanzar la etapa: pendiente -> en revisión -> resuelta.
// La columna "Acción" (los botones) solo la ve el encargado; el departamento
// solo mira.
// En la guía: paso 4 (useState) y paso 8 (incidencias).
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
// Recibe: el número (id) de un recurso.
// Devuelve: su nombre, o "Recurso desconocido" si no lo encuentra.
// Hace falta porque la incidencia guarda solo el NÚMERO del recurso, no su
// nombre. Así, si alguien le cambia el nombre al recurso, la tabla muestra
// el nombre nuevo.
// Está FUERA del componente porque no necesita nada de él (ni props ni memoria).
function nombreDelRecurso(recursoId: number): string {
  const recurso = obtenerRecursoPorId(recursoId);
  if (recurso !== undefined) {
    return recurso.nombre;
  }
  return 'Recurso desconocido';
}

// Las props que le pasa PaginaIncidencias.
interface PropsTablaIncidencias {
  // La persona conectada: decide si se ven los botones de acción (RNF-03).
  usuario: Usuario;
}

// Componente TablaIncidencias
// Recibe: la persona conectada.
// Devuelve: la tabla con las incidencias (y los botones, si el rol puede).
function TablaIncidencias(props: PropsTablaIncidencias) {
  // ¿Esta persona puede avanzar el semáforo? Lo preguntamos UNA vez y lo
  // usamos en la cabeza de la tabla y en cada fila.
  const mostrarAcciones = puedeGestionarIncidencias(props.usuario.rol);

  // Guardamos la lista de incidencias en la memoria de React (useState).
  // Así, cuando cambiemos una etapa, le entregamos la lista nueva a React
  // y él redibuja la tabla al tiro, sin recargar la página.
  const [incidencias, setIncidencias] = useState(obtenerIncidencias());

  // manejarCambiarEstado
  // Se ejecuta al apretar un botón de la columna "Acción".
  // Recibe: el número de la incidencia y su nueva etapa.
  async function manejarCambiarEstado(id: number, nuevoEstado: EstadoIncidencia) {
    const exito = await cambiarEstadoIncidencia(id, nuevoEstado);
    if (exito) {
      // Le pedimos al servicio la lista actualizada y se la damos a React.
      setIncidencias(obtenerIncidencias());
    } else {
      alert('Hubo un error al guardar el nuevo estado. Revise su conexión.');
    }
  }

  // Si no hay ninguna incidencia, mostramos un mensaje en vez de una tabla vacía.
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
            {/* La columna "Acción" solo existe si el rol puede gestionar. */}
            {mostrarAcciones && <th>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {/* Una fila por cada incidencia. key = su número, que no se repite. */}
          {incidencias.map((incidencia) => (
            <tr key={incidencia.id}>
              <td>{incidencia.fecha}</td>
              <td>{nombreDelRecurso(incidencia.recursoId)}</td>
              <td>{incidencia.descripcion}</td>
              {/* El nombre de quien estaba conectado al anotarla (HU-10). */}
              <td>{incidencia.registradaPor}</td>
              {/* La etiqueta de color del semáforo, en su propio componente. */}
              <td><EtiquetaEstadoIncidencia estado={incidencia.estado} /></td>
              {mostrarAcciones && (
                <td>
                  {/* Según la etapa, mostramos UN botón distinto (o ninguno). */}

                  {/* Pendiente -> botón para pasarla a "en revisión". */}
                  {incidencia.estado === 'pendiente' && (
                    <button
                      type="button"
                      className="boton-accion-incidencia boton-accion-revision"
                      onClick={() => manejarCambiarEstado(incidencia.id, 'en_revision')}
                    >
                      Pasar a en revisión
                    </button>
                  )}

                  {/* En revisión -> botón para marcarla "resuelta". */}
                  {incidencia.estado === 'en_revision' && (
                    <button
                      type="button"
                      className="boton-accion-incidencia boton-accion-resuelta"
                      onClick={() => manejarCambiarEstado(incidencia.id, 'resuelta')}
                    >
                      Marcar como resuelta
                    </button>
                  )}

                  {/* Resuelta -> ya no hay nada más que hacer: una rayita. */}
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
