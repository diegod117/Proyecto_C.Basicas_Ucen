// SeccionSalas.tsx
// Parte de la página "Configuración": lista las salas y tiene un formulario
// para agregar una nueva (elegir la torre y escribir el número).
// Las salas nuevas aparecen en la ubicación de "Agregar recurso" y en la
// lista de salas de las reservas.
// Usa los estilos de PaginaConfiguracion.css.
// Cubre: RF-10 (ubicación física), RF-03 (sala de la reserva), RNF-05

import { useState } from 'react';
import type { FormEvent } from 'react';
import { obtenerTorres, obtenerSalas, agregarSala } from '../services/configuracionService';
import { validarNuevaSala } from '../utils/configuracion';

interface PropsSeccionSalas {
  // Función de la página para avisar que se agregó una sala
  onAgregado: () => void;
}

// Componente SeccionSalas
// Recibe: la función para avisar que se agregó algo.
// Devuelve: la tarjeta con la lista de salas y el formulario.
function SeccionSalas(props: PropsSeccionSalas) {
  const [torre, setTorre] = useState('');
  const [numero, setNumero] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  const salas = obtenerSalas();

  // guardar
  // Recibe el evento del formulario. No devuelve nada.
  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    const error = validarNuevaSala(torre, numero, salas);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    setMensajeError('');
    setGuardando(true);
    const numeroLimpio = numero.trim();
    const codigo = torre + numeroLimpio;
    const seGuardo = await agregarSala({ codigo: codigo, torre: torre, numero: numeroLimpio });
    setGuardando(false);

    if (seGuardo) {
      setMensajeExito('Sala ' + codigo + ' agregada.');
      setNumero('');
      props.onAgregado();
    } else {
      setMensajeError('No se pudo guardar la sala. Revisa tu conexión.');
    }
  }

  return (
    <article className="configuracion-tarjeta">
      <h3 className="configuracion-titulo">Salas ({salas.length})</h3>

      <ul className="configuracion-lista">
        {salas.map((sala) => (
          <li key={sala.codigo} className="configuracion-item">
            {sala.codigo}
          </li>
        ))}
      </ul>

      <form className="configuracion-formulario" onSubmit={guardar} noValidate>
        <label className="configuracion-campo">
          Torre
          <select
            value={torre}
            onChange={(evento) => {
              setTorre(evento.target.value);
              setMensajeError('');
            }}
          >
            <option value="">Elige</option>
            {obtenerTorres().map((torreDeLista) => (
              <option key={torreDeLista.letra} value={torreDeLista.letra}>
                Torre {torreDeLista.letra}
              </option>
            ))}
          </select>
        </label>
        <label className="configuracion-campo">
          Número de sala
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ej: 305"
            value={numero}
            onChange={(evento) => {
              setNumero(evento.target.value);
              setMensajeError('');
            }}
          />
        </label>
        <button type="submit" className="boton-principal" disabled={guardando}>
          + Agregar sala
        </button>
      </form>

      {mensajeError !== '' && <p className="configuracion-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="configuracion-exito">{mensajeExito}</p>}
    </article>
  );
}

export default SeccionSalas;
