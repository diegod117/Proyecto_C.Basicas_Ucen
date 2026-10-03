// FormularioIncidencia.tsx
// Formulario para registrar una incidencia en el laboratorio (HU-04).
// Campos: recurso afectado, docente presente, descripción y personas afectadas.
// El campo de detalle de afectación solo aparece si se marca el checkbox.
// Cubre: HU-04 (formulario de incidencia), RF-05 (registro de incidencia)

import { useState } from 'react';
import { obtenerRecursos } from '../services/recursosService';
import './FormularioIncidencia.css';

// Props que recibe el formulario desde la página.
// onIncidenciaRegistrada se llama cuando el formulario se envía con éxito,
// para que la página pueda mostrar un mensaje o actualizar la vista.
interface PropsFormularioIncidencia {
  onIncidenciaRegistrada: () => void;
}

// Componente FormularioIncidencia
// Recibe: onIncidenciaRegistrada (función que avisa a la página que se registró).
// Devuelve: el formulario con los campos de la incidencia.
function FormularioIncidencia(_props: PropsFormularioIncidencia) {
  // Obtenemos la lista de recursos para llenar el <select>.
  // Viene del servicio de Johann (recursosService).
  const recursos = obtenerRecursos();

  // Estado de cada campo del formulario (formulario controlado).
  // "Controlado" significa que React guarda el valor actual de cada campo
  // con useState, y el campo siempre muestra ese valor.
  const [recursoId, setRecursoId] = useState<string>('');
  const [docentePresente, setDocentePresente] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Estado del checkbox: ¿hubo personas afectadas? (true o false)
  // Parte en false porque la mayoría de incidencias no afectan personas.
  const [hayPersonasAfectadas, setHayPersonasAfectadas] = useState(false);

  // Detalle de la afectación: solo se usa si hayPersonasAfectadas es true.
  // Es el campo opcional ("?") del tipo Incidencia.
  const [detalleAfectacion, setDetalleAfectacion] = useState('');

  return (
    <form className="formulario-incidencia">
      <h3 className="formulario-incidencia-titulo">Registrar incidencia</h3>
      <p className="formulario-incidencia-subtitulo">
        Registre un accidente o problema ocurrido en el laboratorio.
      </p>

      {/* Campo 1: Recurso afectado (select con los recursos del inventario) */}
      <div className="campo-formulario">
        <label htmlFor="campo-recurso">Recurso afectado</label>
        <select
          id="campo-recurso"
          value={recursoId}
          onChange={(evento) => setRecursoId(evento.target.value)}
        >
          <option value="">-- Seleccione un recurso --</option>
          {recursos.map((recurso) => (
            <option key={recurso.id} value={recurso.id}>
              {recurso.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Campo 2: Docente presente en el momento de la incidencia */}
      <div className="campo-formulario">
        <label htmlFor="campo-docente">Docente presente</label>
        <input
          id="campo-docente"
          type="text"
          placeholder="Nombre del docente que estaba en la clase"
          value={docentePresente}
          onChange={(evento) => setDocentePresente(evento.target.value)}
        />
      </div>

      {/* Campo 3: Descripción de lo que ocurrió (textarea) */}
      <div className="campo-formulario">
        <label htmlFor="campo-descripcion">Descripción</label>
        <textarea
          id="campo-descripcion"
          placeholder="Describa qué ocurrió..."
          rows={4}
          value={descripcion}
          onChange={(evento) => setDescripcion(evento.target.value)}
        />
      </div>

      {/* Campo 4: ¿Hubo personas afectadas? (checkbox) */}
      {/* Un checkbox usa "checked" en vez de "value", y el evento
          entrega true o false en "evento.target.checked". */}
      <div className="campo-formulario campo-checkbox">
        <label>
          <input
            type="checkbox"
            checked={hayPersonasAfectadas}
            onChange={(evento) => setHayPersonasAfectadas(evento.target.checked)}
          />
          ¿Hubo personas afectadas?
        </label>
      </div>

      {/* Campo 5: Detalle de la afectación (solo si se marcó el checkbox) */}
      {/* "hayPersonasAfectadas && ..." es renderizado condicional:
          React solo muestra lo que viene después del && si la condición es true. */}
      {hayPersonasAfectadas && (
        <div className="campo-formulario">
          <label htmlFor="campo-detalle-afectacion">Detalle de la afectación</label>
          <textarea
            id="campo-detalle-afectacion"
            placeholder="Describa cómo fueron afectadas las personas..."
            rows={3}
            value={detalleAfectacion}
            onChange={(evento) => setDetalleAfectacion(evento.target.value)}
          />
        </div>
      )}
    </form>
  );
}

export default FormularioIncidencia;
