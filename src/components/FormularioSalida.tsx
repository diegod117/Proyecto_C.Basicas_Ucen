// FormularioSalida.tsx
// Recuadro "Registrar salida" de la ficha: sirve para sacar unidades por
// daño. Un daño reparable las deja "en mantención" y uno irreparable las deja
// "dado de baja". El motivo es obligatorio y queda en el historial.
// Si el recurso tiene unidades (equipos e instrumentos) se marcan por su
// número de serie; si no, se elige el estado de origen y la cantidad.
// Usa los estilos de FormularioCambioEstado.css.
// Cubre: HU-14, RF-13 (CA-14.2 y CA-14.3), HU-06, HU-12, RNF-03

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Recurso, EstadoRecurso } from '../types/Recurso';
import type { TipoSalida } from '../types/CambioEstado';
import { useUsuario } from '../context/ContextoUsuario';
import { registrarSalida } from '../services/movimientosService';
import { validarSalida, textoUnidadesMovimiento } from '../utils/movimientos';
import { textoSubtipo, estadoNuevoDeSalida } from '../utils/historial';
import { textoEstado } from '../utils/inventario';
import { obtenerEstadoOrigenInicial } from '../utils/cambioEstado';
import SelectorUnidades from './SelectorUnidades';
import './FormularioCambioEstado.css';

interface PropsFormularioSalida {
  recurso: Recurso;
  // Se llama después de guardar, para que App redibuje todo con los números nuevos
  onSalidaRegistrada: () => void;
}

// Los dos tipos de salida que pide la línea base (CA-14.2)
const listaTiposSalida: TipoSalida[] = ['dano_reparable', 'dano_irreparable'];

// Estados desde los que pueden salir unidades (una unidad dada de baja no sale de nuevo)
const listaEstadosOrigen: EstadoRecurso[] = ['disponible', 'en_uso', 'danado', 'en_mantencion'];

// Componente FormularioSalida
// Recibe: el recurso y la función para avisar que se guardó.
// El usuario conectado (su nombre queda en el historial) lo lee con useUsuario().
// Devuelve: el formulario "Registrar salida".
function FormularioSalida(props: PropsFormularioSalida) {
  const usuario = useUsuario();
  const recurso = props.recurso;

  const [tipo, setTipo] = useState<TipoSalida>('dano_reparable');
  const [numerosMarcados, setNumerosMarcados] = useState<string[]>([]);
  const [estadoOrigen, setEstadoOrigen] = useState<EstadoRecurso>(obtenerEstadoOrigenInicial(recurso));
  const [cantidadTexto, setCantidadTexto] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  // guardarSalida
  // Recibe el evento del formulario. No devuelve nada.
  // Es "async" porque el servicio guarda en Firestore y hay que esperarlo.
  async function guardarSalida(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    const error = validarSalida(recurso, tipo, numerosMarcados, estadoOrigen, cantidadTexto, motivo);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    // Con unidades se cuentan las marcadas; sin unidades, la cantidad escrita
    let cantidad = Number(cantidadTexto);
    if (recurso.unidades !== undefined) {
      cantidad = numerosMarcados.length;
    }

    // Un daño irreparable da de baja las unidades: pedimos confirmación
    if (tipo === 'dano_irreparable') {
      const confirmado = window.confirm(
        '¿Seguro que quieres dar de baja ' + textoUnidadesMovimiento(cantidad) + ' de "' + recurso.nombre + '"?',
      );
      if (!confirmado) {
        return;
      }
    }

    setGuardando(true);
    const seGuardo = await registrarSalida(
      recurso.id, tipo, numerosMarcados, estadoOrigen, cantidad, motivo, usuario.nombre,
    );
    setGuardando(false);

    if (seGuardo) {
      setMensajeError('');
      setMensajeExito(
        'Salida guardada: ' + textoUnidadesMovimiento(cantidad) + ' pasaron a ' +
          textoEstado(estadoNuevoDeSalida(tipo)) + '.',
      );
      setNumerosMarcados([]);
      setCantidadTexto('1');
      setMotivo('');
      // Si el estado de origen se quedó sin unidades, volvemos a uno que tenga
      if (recurso.cantidades[estadoOrigen] === 0) {
        setEstadoOrigen(obtenerEstadoOrigenInicial(recurso));
      }
      props.onSalidaRegistrada();
    } else {
      setMensajeError('No se pudo registrar la salida. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  return (
    <form className="formulario-cambio-estado" onSubmit={guardarSalida} noValidate>
      <h3 className="formulario-cambio-titulo">Registrar salida</h3>

      <label htmlFor="tipo-salida">Tipo de salida</label>
      <select
        id="tipo-salida"
        value={tipo}
        onChange={(evento) => {
          setTipo(evento.target.value as TipoSalida);
          setMensajeError('');
        }}
      >
        {listaTiposSalida.map((tipoSalida) => (
          <option key={tipoSalida} value={tipoSalida}>
            {textoSubtipo(tipoSalida)} → {textoEstado(estadoNuevoDeSalida(tipoSalida))}
          </option>
        ))}
      </select>

      {/* Con unidades: se marcan por número de serie. Sin unidades: estado de origen y cantidad. */}
      {recurso.unidades !== undefined && (
        <SelectorUnidades
          unidades={recurso.unidades}
          marcados={numerosMarcados}
          estadoBloqueado="dado_de_baja"
          onCambiar={(numeros) => {
            setNumerosMarcados(numeros);
            setMensajeError('');
          }}
        />
      )}
      {recurso.unidades === undefined && (
        <>
          <label htmlFor="origen-salida">Estado actual de las unidades</label>
          <select
            id="origen-salida"
            value={estadoOrigen}
            onChange={(evento) => setEstadoOrigen(evento.target.value as EstadoRecurso)}
          >
            {listaEstadosOrigen.map((estado) => (
              <option key={estado} value={estado}>
                {textoEstado(estado)} ({recurso.cantidades[estado]})
              </option>
            ))}
          </select>

          <label htmlFor="cantidad-salida">Cantidad</label>
          <input
            id="cantidad-salida"
            type="number"
            min="1"
            value={cantidadTexto}
            onChange={(evento) => setCantidadTexto(evento.target.value)}
          />
        </>
      )}

      <label htmlFor="motivo-salida">Motivo</label>
      <input
        id="motivo-salida"
        type="text"
        placeholder="Ej: Se cayó al piso"
        value={motivo}
        onChange={(evento) => setMotivo(evento.target.value)}
      />

      {mensajeError !== '' && <p className="formulario-cambio-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="formulario-cambio-exito">{mensajeExito}</p>}

      <button type="submit" className="formulario-cambio-boton" disabled={guardando}>
        {guardando && 'Guardando...'}
        {!guardando && 'Registrar salida'}
      </button>
    </form>
  );
}

export default FormularioSalida;
