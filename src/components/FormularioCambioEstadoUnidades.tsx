// FormularioCambioEstadoUnidades.tsx
// Formulario para que el encargado cambie el estado de unidades específicas
// de un equipo o instrumento, eligiéndolas por su número de serie.
// Ej: marcar la unidad FLK-0003 y pasarla a "Dañado".
// Para insumos y reactivos se usa FormularioCambioEstado (por cantidad).
// Usa los estilos de FormularioCambioEstado.css.
// Cubre: HU-02, RF-01 (CA-02.2 a CA-02.4), HU-12 (unidades)

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Recurso, EstadoRecurso } from '../types/Recurso';
import { listaEstadosRecurso, textoEstado } from '../utils/inventario';
import { validarCambioEstadoUnidades, textoResumenCambioUnidades } from '../utils/cambioEstado';
import { cambiarEstadoUnidades } from '../services/recursosService';
import { useUsuario } from '../context/ContextoUsuario';
import SelectorUnidades from './SelectorUnidades';
import './FormularioCambioEstado.css';

interface PropsFormularioCambioEstadoUnidades {
  // Un recurso que ya tiene sus unidades registradas (recurso.unidades existe)
  recurso: Recurso;
  // Se llama después de guardar, para que la página se redibuje con los datos nuevos
  onEstadoCambiado: () => void;
}

// Componente FormularioCambioEstadoUnidades
// Recibe: el recurso y la función para avisar que se guardó un cambio.
// El usuario conectado (su nombre queda en el historial) lo lee con useUsuario().
// Devuelve: el formulario con la lista de unidades.
function FormularioCambioEstadoUnidades(props: PropsFormularioCambioEstadoUnidades) {
  const usuario = useUsuario();
  const recurso = props.recurso;

  // Los números de serie de las unidades marcadas. Es una lista de textos.
  const [numerosMarcados, setNumerosMarcados] = useState<string[]>([]);
  const [estadoNuevo, setEstadoNuevo] = useState<EstadoRecurso>('danado');
  const [motivo, setMotivo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  // cambiarMarcadas
  // Recibe: la lista nueva de números marcados. No devuelve nada.
  // La llama SelectorUnidades cada vez que se marca o desmarca una unidad.
  function cambiarMarcadas(numeros: string[]) {
    setNumerosMarcados(numeros);
    setMensajeError('');
  }

  // guardarCambio
  // Recibe el evento del formulario. No devuelve nada.
  // Es "async" porque cambiarEstadoUnidades guarda en Firestore.
  async function guardarCambio(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    const error = validarCambioEstadoUnidades(recurso, numerosMarcados, estadoNuevo, motivo);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    // Dar de baja es un cambio importante: pedimos confirmación (CA-02.3).
    // Un daño irreparable se registra pasando la unidad a "Dado de baja".
    if (estadoNuevo === 'dado_de_baja') {
      const confirmado = window.confirm(
        '¿Seguro que quieres dar de baja ' + numerosMarcados.length + ' unidad(es) de "' + recurso.nombre + '"?',
      );
      if (!confirmado) {
        return;
      }
    }

    setGuardando(true);
    const seGuardo = await cambiarEstadoUnidades(
      recurso.id,
      numerosMarcados,
      estadoNuevo,
      motivo,
      usuario.nombre,
    );
    setGuardando(false);

    if (seGuardo) {
      setMensajeError('');
      setMensajeExito(textoResumenCambioUnidades(numerosMarcados, estadoNuevo));
      setNumerosMarcados([]);
      setMotivo('');
      props.onEstadoCambiado(); // avisamos hacia arriba para que App redibuje todo
    } else {
      setMensajeError('No se pudo guardar el cambio. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  // Si por algún motivo no hay unidades, no dibujamos nada
  if (recurso.unidades === undefined) {
    return null;
  }

  return (
    <form className="formulario-cambio-estado" onSubmit={guardarCambio} noValidate>
      <h3 className="formulario-cambio-titulo">Cambiar estado de unidades</h3>

      <SelectorUnidades
        unidades={recurso.unidades}
        marcados={numerosMarcados}
        onCambiar={cambiarMarcadas}
      />

      <label htmlFor="estado-nuevo-unidades">Nuevo estado</label>
      <select
        id="estado-nuevo-unidades"
        value={estadoNuevo}
        onChange={(evento) => setEstadoNuevo(evento.target.value as EstadoRecurso)}
      >
        {listaEstadosRecurso.map((estado) => (
          <option key={estado} value={estado}>
            {textoEstado(estado)}
          </option>
        ))}
      </select>

      <label htmlFor="motivo-cambio-unidades">Motivo</label>
      <input
        id="motivo-cambio-unidades"
        type="text"
        placeholder="Ej: Punta rota"
        value={motivo}
        onChange={(evento) => setMotivo(evento.target.value)}
      />

      {mensajeError !== '' && <p className="formulario-cambio-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="formulario-cambio-exito">{mensajeExito}</p>}

      <button type="submit" className="formulario-cambio-boton" disabled={guardando}>
        {guardando && 'Guardando...'}
        {!guardando && 'Guardar cambio'}
      </button>
    </form>
  );
}

export default FormularioCambioEstadoUnidades;
