// FormularioEntrada.tsx
// Recuadro "Registrar entrada" de la ficha: sirve para sumar unidades que
// llegan al laboratorio (una adquisición, un préstamo o una reposición).
// Las unidades entran como "disponible". Si el recurso es un equipo o
// instrumento con unidades, se pide el número de serie de cada unidad nueva.
// Así se resuelven también las alertas de reposición (HU-09).
// Reemplaza al antiguo "Reponer stock": la reposición ahora es un tipo de entrada.
// Usa los estilos de FormularioCambioEstado.css.
// Cubre: HU-14, RF-13 (CA-14.1 y CA-14.3), RF-04, HU-06, HU-12, RNF-03

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Recurso } from '../types/Recurso';
import type { TipoEntrada } from '../types/CambioEstado';
import { useUsuario } from '../context/ContextoUsuario';
import { registrarEntrada } from '../services/movimientosService';
import { validarEntrada, textoUnidadesMovimiento } from '../utils/movimientos';
import { textoSubtipo } from '../utils/historial';
import { obtenerFechaHoy } from '../utils/fechas';
import CamposNumerosSerie from './CamposNumerosSerie';
import { MAXIMO_UNIDADES_POR_OPERACION } from '../utils/unidades';
import './FormularioCambioEstado.css';

interface PropsFormularioEntrada {
  recurso: Recurso;
  // Se llama después de guardar, para que App redibuje todo
  // (así la alerta de reposición desaparece si ya se llegó al mínimo)
  onEntradaRegistrada: () => void;
}

// Los tres tipos de entrada que pide la línea base (CA-14.1)
const listaTiposEntrada: TipoEntrada[] = ['adquisicion', 'prestamo', 'reposicion'];

// Componente FormularioEntrada
// Recibe: el recurso y la función para avisar que se guardó.
// El usuario conectado (su nombre queda en el historial) lo lee con useUsuario().
// Devuelve: el formulario "Registrar entrada".
function FormularioEntrada(props: PropsFormularioEntrada) {
  const usuario = useUsuario();
  const recurso = props.recurso;

  const [tipo, setTipo] = useState<TipoEntrada>('reposicion');
  const [cantidadTexto, setCantidadTexto] = useState('1');
  const [fecha, setFecha] = useState(obtenerFechaHoy());
  const [observacion, setObservacion] = useState('');
  const [numerosNuevos, setNumerosNuevos] = useState<string[]>([]);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  // true mientras se espera a Firestore: desactiva el botón para no guardar dos veces
  const [guardando, setGuardando] = useState(false);

  // guardarEntrada
  // Recibe el evento del formulario. No devuelve nada.
  // Es "async" porque el servicio guarda en Firestore y hay que esperarlo.
  async function guardarEntrada(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    const error = validarEntrada(recurso, cantidadTexto, fecha, numerosNuevos);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    const cantidad = Number(cantidadTexto);
    setGuardando(true);
    const seGuardo = await registrarEntrada(
      recurso.id, tipo, cantidad, fecha, observacion, numerosNuevos, usuario.nombre,
    );
    setGuardando(false);

    if (seGuardo) {
      setMensajeError('');
      setMensajeExito(
        'Entrada guardada: ' + textoUnidadesMovimiento(cantidad) + ' (' + textoSubtipo(tipo) +
          '). Ahora hay ' + recurso.cantidades.disponible + ' disponibles.',
      );
      setCantidadTexto('1');
      setObservacion('');
      setNumerosNuevos([]);
      props.onEntradaRegistrada();
    } else {
      setMensajeError('No se pudo registrar la entrada. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  // Texto de ayuda: cuántas hay disponibles y, si tiene, el stock mínimo
  let textoStockActual = 'Disponibles: ' + recurso.cantidades.disponible;
  if (recurso.stockMinimo !== undefined) {
    textoStockActual = textoStockActual + ' · Mínimo: ' + recurso.stockMinimo;
  }

  return (
    <form className="formulario-cambio-estado" onSubmit={guardarEntrada} noValidate>
      <h3 className="formulario-cambio-titulo">Registrar entrada</h3>
      <p className="formulario-movimiento-ayuda">{textoStockActual}</p>

      <label htmlFor="tipo-entrada">Tipo de entrada</label>
      <select
        id="tipo-entrada"
        value={tipo}
        onChange={(evento) => setTipo(evento.target.value as TipoEntrada)}
      >
        {listaTiposEntrada.map((tipoEntrada) => (
          <option key={tipoEntrada} value={tipoEntrada}>
            {textoSubtipo(tipoEntrada)}
          </option>
        ))}
      </select>

      <label htmlFor="cantidad-entrada">Unidades que llegaron</label>
      <input
        id="cantidad-entrada"
        type="number"
        min="1"
        value={cantidadTexto}
        onChange={(evento) => {
          setCantidadTexto(evento.target.value);
          setMensajeError('');
        }}
      />

      {/* Equipos e instrumentos con unidades: el número de serie de cada unidad nueva */}
      {recurso.unidades !== undefined && (
        <CamposNumerosSerie
          maximo={MAXIMO_UNIDADES_POR_OPERACION}
          cantidadTexto={cantidadTexto}
          numeros={numerosNuevos}
          onCambiar={(numeros) => {
            setNumerosNuevos(numeros);
            setMensajeError('');
          }}
        />
      )}

      <label htmlFor="fecha-entrada">Fecha de la entrada</label>
      <input
        id="fecha-entrada"
        type="date"
        max={obtenerFechaHoy()}
        value={fecha}
        onChange={(evento) => setFecha(evento.target.value)}
      />

      <label htmlFor="observacion-entrada">Observación (opcional)</label>
      <input
        id="observacion-entrada"
        type="text"
        placeholder="Ej: Compra orden 123"
        value={observacion}
        onChange={(evento) => setObservacion(evento.target.value)}
      />

      {mensajeError !== '' && <p className="formulario-cambio-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="formulario-cambio-exito">{mensajeExito}</p>}

      <button type="submit" className="formulario-cambio-boton" disabled={guardando}>
        {guardando && 'Guardando...'}
        {!guardando && 'Registrar entrada'}
      </button>
    </form>
  );
}

export default FormularioEntrada;
