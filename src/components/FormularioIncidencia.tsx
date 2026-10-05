// FormularioIncidencia.tsx
// Formulario para registrar una incidencia en el laboratorio (HU-04).
// Campos: recurso afectado, docente presente, descripción y personas afectadas.
// Valida que los campos obligatorios estén llenos antes de guardar.
// RNF-02: el registro se completa en 5 pasos como máximo.
// Cubre: HU-04 (formulario de incidencia), RF-05 (registro de incidencia),
// HU-10 (la incidencia guarda quién la registró)

import { useState } from 'react';
import { obtenerRecursos } from '../services/recursosService';
import { agregarIncidencia } from '../services/incidenciasService';
import type { Usuario } from '../types/Usuario';
import './FormularioIncidencia.css';

// Props que recibe el formulario desde la página.
// onIncidenciaRegistrada se llama cuando el formulario se envía con éxito,
// para que la página pueda mostrar un mensaje o actualizar la vista.
interface PropsFormularioIncidencia {
  onIncidenciaRegistrada: () => void;
  // Usuario conectado: su nombre queda como "registrada por" (HU-10)
  usuario: Usuario;
}

// Componente FormularioIncidencia
// Recibe: onIncidenciaRegistrada (función que avisa a la página que se registró)
// y el usuario conectado.
// Devuelve: el formulario con los campos de la incidencia.
function FormularioIncidencia(props: PropsFormularioIncidencia) {
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

  // Mensaje de error que se muestra si falta algún campo obligatorio.
  // Si es un texto vacío, no se muestra nada.
  const [mensajeError, setMensajeError] = useState('');

  // manejarEnvio
  // Se ejecuta cuando el usuario hace clic en "Registrar".
  // Recibe el evento del formulario. No devuelve nada.
  function manejarEnvio(evento: React.FormEvent) {
    // preventDefault evita que el navegador recargue la página
    // (comportamiento por defecto de un <form>).
    evento.preventDefault();

    // Validación: los 3 campos obligatorios deben estar llenos.
    // .trim() quita espacios al inicio y al final.
    if (recursoId === '') {
      setMensajeError('Debe seleccionar un recurso afectado.');
      return;
    }
    if (docentePresente.trim() === '') {
      setMensajeError('Debe indicar el docente presente.');
      return;
    }
    if (descripcion.trim() === '') {
      setMensajeError('Debe escribir una descripción de lo ocurrido.');
      return;
    }

    // Si llegamos aquí, todo está bien. Limpiamos el error.
    setMensajeError('');

    // Guardamos la incidencia usando el servicio (D1).
    // El servicio se encarga de asignar la fecha automática y el estado
    // "pendiente" (D5), así que solo enviamos los datos del formulario.
    agregarIncidencia({
      recursoId: Number(recursoId),
      docentePresente: docentePresente.trim(),
      descripcion: descripcion.trim(),
      hayPersonasAfectadas,
      detalleAfectacion: hayPersonasAfectadas ? detalleAfectacion.trim() : undefined,
      // Antes era un texto fijo; ahora es el nombre de quien inició sesión
      registradaPor: props.usuario.nombre,
    });

    // Limpiamos todos los campos para que el formulario quede listo
    // para registrar otra incidencia.
    setRecursoId('');
    setDocentePresente('');
    setDescripcion('');
    setHayPersonasAfectadas(false);
    setDetalleAfectacion('');

    // Avisamos a la página que se registró una incidencia.
    props.onIncidenciaRegistrada();
  }

  return (
    <form className="formulario-incidencia" onSubmit={manejarEnvio}>
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

      {/* Mensaje de error: solo se muestra si hay texto en mensajeError */}
      {mensajeError !== '' && (
        <p className="mensaje-error">{mensajeError}</p>
      )}

      {/* Botón para registrar la incidencia */}
      <button type="submit" className="boton-registrar">
        Registrar incidencia
      </button>
    </form>
  );
}

export default FormularioIncidencia;
