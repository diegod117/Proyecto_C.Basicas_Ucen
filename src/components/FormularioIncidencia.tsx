// FormularioIncidencia.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// El formulario para ANOTAR UNA INCIDENCIA (un accidente o problema en el
// laboratorio), como la antigua hoja de papel (HU-04).
// Cajitas: qué recurso, qué profesor estaba, qué pasó, y si hubo personas
// afectadas (y en ese caso, cómo).
// Revisa que las cajitas obligatorias estén llenas antes de guardar.
// RNF-02 pide que se pueda registrar en 5 pasos o menos.
// En la guía: paso 4 (formularios, checkbox) y paso 8 (incidencias).
// Cubre: HU-04 (formulario de incidencia), RF-05 (registro de incidencia),
// HU-10 (la incidencia guarda quién la registró)

import { useState } from 'react';
import { obtenerRecursos } from '../services/recursosService';
import { agregarIncidencia } from '../services/incidenciasService';
import { useUsuario } from '../context/ContextoUsuario';
import './FormularioIncidencia.css';

// Las props que le pasa PaginaIncidencias.
interface PropsFormularioIncidencia {
  // Se llama cuando la incidencia se guardó bien, para que la página
  // muestre el mensaje verde y actualice la tabla.
  onIncidenciaRegistrada: () => void;
}

// Componente FormularioIncidencia
// Recibe: la función de "listo" (onIncidenciaRegistrada).
// ¿Y la persona conectada? La sacamos con useUsuario() (guía, paso 6).
// Su nombre queda como "registrada por" (HU-10).
// Devuelve: el formulario de la incidencia.
function FormularioIncidencia(props: PropsFormularioIncidencia) {
  // useUsuario() = "¿quién está conectado?" (ver context/ContextoUsuario.ts).
  const usuario = useUsuario();
  // Los recursos, para las opciones del menú "Recurso afectado".
  const recursos = obtenerRecursos();

  // ---------------------------------------------------------------
  // LA MEMORIA DEL FORMULARIO (formulario controlado).
  // ---------------------------------------------------------------
  // "Controlado" = React guarda lo que hay en cada cajita con useState,
  // y la cajita siempre muestra lo que React tiene guardado.
  // useState<string>('') = "guarda un texto, que parte vacío".
  const [recursoId, setRecursoId] = useState<string>('');
  const [docentePresente, setDocentePresente] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // El cuadradito para marcar (checkbox): ¿hubo personas afectadas?
  // Guarda true (marcado) o false (sin marcar). Parte sin marcar.
  const [hayPersonasAfectadas, setHayPersonasAfectadas] = useState(false);

  // El detalle de la afectación: solo se usa si el cuadradito está marcado.
  const [detalleAfectacion, setDetalleAfectacion] = useState('');

  // El mensaje rojo de error ('' = no se muestra).
  const [mensajeError, setMensajeError] = useState('');

  // true mientras esperamos a Firestore.
  const [guardando, setGuardando] = useState(false);

  // manejarEnvio
  // Se ejecuta al apretar "Registrar incidencia".
  // Recibe: el evento del formulario. No devuelve nada.
  // React.FormEvent es el mismo tipo que FormEvent de los otros formularios,
  // solo que escrito con su "apellido" (React.) en vez de importarlo aparte.
  async function manejarEnvio(evento: React.FormEvent) {
    // Que el navegador no recargue la página (lo que hace un <form> por defecto).
    evento.preventDefault();

    // Revisamos las 3 cajitas obligatorias, una por una.
    // .trim() borra los espacios: así "   " cuenta como vacío.
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
    // Si marcaron "hubo personas afectadas", el detalle es OBLIGATORIO:
    // si no, quedaría anotado que alguien se lastimó, pero no cómo (RF-05).
    // && = "y": las DOS cosas tienen que ser verdad para mostrar el error.
    if (hayPersonasAfectadas && detalleAfectacion.trim() === '') {
      setMensajeError('Debe describir cómo fueron afectadas las personas.');
      return;
    }

    // Todo bien: borramos el error y prendemos "guardando".
    setMensajeError('');
    setGuardando(true);

    try {
      // Le pedimos al servicio (el bodeguero) que la guarde.
      // El servicio pone solo la fecha y el estado "pendiente", así que
      // aquí mandamos solo lo que escribió la persona.
      await agregarIncidencia({
        recursoId: Number(recursoId),
        docentePresente: docentePresente.trim(),
        descripcion: descripcion.trim(),
        // Atajo: "hayPersonasAfectadas," = "hayPersonasAfectadas: hayPersonasAfectadas".
        hayPersonasAfectadas,
        // Ternario: si está marcado, mandamos el detalle; si no, undefined (nada).
        detalleAfectacion: hayPersonasAfectadas ? detalleAfectacion.trim() : undefined,
        // El nombre de quien está conectado (lo dio useUsuario, arriba).
        registradaPor: usuario.nombre,
      });

      // Dejamos todas las cajitas vacías para la próxima incidencia.
      setRecursoId('');
      setDocentePresente('');
      setDescripcion('');
      setHayPersonasAfectadas(false);
      setDetalleAfectacion('');

      // Le avisamos a la página: "¡listo!".
      props.onIncidenciaRegistrada();
    } catch (error) {
      // Algo falló (ej: sin internet).
      console.error('Error al guardar incidencia:', error);
      setMensajeError('Error al guardar la incidencia. Revise su conexión.');
    } finally {
      // finally se ejecuta SIEMPRE, haya salido bien o mal: apagamos "guardando".
      setGuardando(false);
    }
  }

  return (
    <form className="formulario-incidencia" onSubmit={manejarEnvio}>
      <h3 className="formulario-incidencia-titulo">Registrar incidencia</h3>
      <p className="formulario-incidencia-subtitulo">
        Registre un accidente o problema ocurrido en el laboratorio.
      </p>

      {/* Cajita 1: qué recurso (menú con todos los recursos del inventario). */}
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

      {/* Cajita 2: qué profesor estaba en la sala. */}
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

      {/* Cajita 3: qué pasó. <textarea> es una cajita GRANDE para textos largos.
          rows={4} = se ve con 4 líneas de alto. */}
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

      {/* Cajita 4: el cuadradito "¿Hubo personas afectadas?".
          Un checkbox es distinto a las otras cajitas:
            usa "checked" (en vez de "value") para saber si está marcado,
            y el evento trae true/false en evento.target.checked. */}
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

      {/* Cajita 5: el detalle. SOLO aparece si el cuadradito está marcado.
          "hayPersonasAfectadas && (...)" = si es true, dibuja lo de la derecha. */}
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

      {/* El mensaje rojo, solo si hay error. */}
      {mensajeError !== '' && (
        <p className="mensaje-error">{mensajeError}</p>
      )}

      {/* El botón. Su texto cambia con un ternario mientras guarda. */}
      <button type="submit" className="boton-registrar" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Registrar incidencia'}
      </button>
    </form>
  );
}

export default FormularioIncidencia;
