// FormularioCambioUbicacion.tsx
// Recuadro "Cambiar ubicación" de la ficha (solo para el encargado): muestra
// dónde está el recurso y permite moverlo a otra torre, sala, bodega o mueble.
// La torre y la sala se eligen de las listas de "Configuración". El motivo es
// opcional: si queda vacío, el historial guarda "Cambio de ubicación".
// Usa los estilos de FormularioCambioEstado.css y FormularioCambioUbicacion.css.
// Cubre: HU-11, RF-10 (CA-11.2 y CA-11.3), HU-06, RNF-03

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Recurso, DatosUbicacion } from '../types/Recurso';
import { useUsuario } from '../context/ContextoUsuario';
import { cambiarUbicacion } from '../services/movimientosService';
import { obtenerRecursos } from '../services/recursosService';
import { armarUbicacion } from '../utils/nuevoRecurso';
import { validarCambioUbicacion } from '../utils/ubicacion';
import CamposUbicacionRecurso from './CamposUbicacionRecurso';
import './FormularioNuevoRecurso.css';
import './FormularioCambioEstado.css';
import './FormularioCambioUbicacion.css';

interface PropsFormularioCambioUbicacion {
  recurso: Recurso;
  // Se llama después de guardar, para que App redibuje todo con la ubicación nueva
  onUbicacionCambiada: () => void;
}

// Componente FormularioCambioUbicacion
// Recibe: el recurso y la función para avisar que se guardó.
// El usuario conectado (su nombre queda en el historial) lo lee con useUsuario().
// Devuelve: el formulario "Cambiar ubicación".
function FormularioCambioUbicacion(props: PropsFormularioCambioUbicacion) {
  const usuario = useUsuario();
  const recurso = props.recurso;

  // Los campos parten con la ubicación actual, para cambiar solo lo que haga falta
  const [datos, setDatos] = useState<DatosUbicacion>({
    torre: recurso.ubicacion.torre,
    sala: recurso.ubicacion.sala,
    bodega: recurso.ubicacion.bodega,
    mueble: recurso.ubicacion.mueble,
  });
  const [motivo, setMotivo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  // cambiarDatos
  // Recibe: los datos de ubicación con algún campo cambiado. No devuelve nada.
  // Borra los mensajes anteriores porque ya no corresponden a lo que se ve.
  function cambiarDatos(nuevosDatos: DatosUbicacion) {
    setDatos(nuevosDatos);
    setMensajeError('');
    setMensajeExito('');
  }

  // guardarUbicacion
  // Recibe el evento del formulario. No devuelve nada.
  // Es "async" porque el servicio guarda en Firestore y hay que esperarlo.
  async function guardarUbicacion(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    const nuevaUbicacion = armarUbicacion(datos);
    const error = validarCambioUbicacion(recurso, nuevaUbicacion, obtenerRecursos());
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    setMensajeError('');
    setGuardando(true);
    const seGuardo = await cambiarUbicacion(recurso.id, nuevaUbicacion, motivo, usuario.nombre);
    setGuardando(false);

    if (seGuardo) {
      setMensajeExito('Ubicación guardada: ahora está en ' + nuevaUbicacion.codigo + '.');
      setMotivo('');
      props.onUbicacionCambiada();
    } else {
      setMensajeError('No se pudo cambiar la ubicación. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  return (
    <form className="formulario-cambio-estado formulario-cambio-ubicacion" onSubmit={guardarUbicacion} noValidate>
      <h3 className="formulario-cambio-titulo">Cambiar ubicación</h3>
      <p className="formulario-movimiento-ayuda">
        Ubicación actual: <strong>{recurso.ubicacion.codigo}</strong>
      </p>

      <CamposUbicacionRecurso datos={datos} onCambiar={cambiarDatos} />

      <label htmlFor="motivo-ubicacion">Motivo (opcional)</label>
      <input
        id="motivo-ubicacion"
        type="text"
        placeholder="Ej: Se reorganizó la bodega"
        value={motivo}
        onChange={(evento) => setMotivo(evento.target.value)}
      />

      {mensajeError !== '' && <p className="formulario-cambio-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="formulario-cambio-exito">{mensajeExito}</p>}

      <button type="submit" className="formulario-cambio-boton" disabled={guardando}>
        {guardando && 'Guardando...'}
        {!guardando && 'Cambiar ubicación'}
      </button>
    </form>
  );
}

export default FormularioCambioUbicacion;
