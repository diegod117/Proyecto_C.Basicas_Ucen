// SeccionTorres.tsx
// Parte de la página "Configuración": lista las torres (edificios) y tiene
// un formulario para agregar una nueva (ej: "D"). Después de agregarla,
// se le pueden agregar salas en SeccionSalas.
// Usa los estilos de PaginaConfiguracion.css.
// Cubre: RF-10 (ubicación física), RNF-05 (escalabilidad)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { obtenerTorres, obtenerSalasDeTorre, agregarTorre } from '../services/configuracionService';
import { validarNuevaTorre } from '../utils/configuracion';

interface PropsSeccionTorres {
  // Función de la página para avisar que se agregó una torre
  onAgregado: () => void;
}

// Componente SeccionTorres
// Recibe: la función para avisar que se agregó algo.
// Devuelve: la tarjeta con la lista de torres y el formulario.
function SeccionTorres(props: PropsSeccionTorres) {
  const [letra, setLetra] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  const torres = obtenerTorres();

  // guardar
  // Recibe el evento del formulario. No devuelve nada.
  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    const error = validarNuevaTorre(letra, torres);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    setMensajeError('');
    setGuardando(true);
    // Las torres se guardan en mayúscula: "d" -> "D"
    const letraLimpia = letra.trim().toUpperCase();
    const seGuardo = await agregarTorre({ letra: letraLimpia });
    setGuardando(false);

    if (seGuardo) {
      setMensajeExito('Torre ' + letraLimpia + ' agregada. Ahora agrégale salas.');
      setLetra('');
      props.onAgregado();
    } else {
      setMensajeError('No se pudo guardar la torre. Revisa tu conexión.');
    }
  }

  return (
    <article className="configuracion-tarjeta">
      <h3 className="configuracion-titulo">Torres ({torres.length})</h3>

      <ul className="configuracion-lista">
        {torres.map((torre) => {
          // "1 sala" en singular, "0 salas" o "3 salas" en plural
          const cantidadSalas = obtenerSalasDeTorre(torre.letra).length;
          let textoSalas = cantidadSalas + ' salas';
          if (cantidadSalas === 1) {
            textoSalas = '1 sala';
          }
          return (
            <li key={torre.letra} className="configuracion-item">
              Torre {torre.letra}
              <span className="configuracion-nota"> · {textoSalas}</span>
            </li>
          );
        })}
      </ul>

      <form className="configuracion-formulario" onSubmit={guardar} noValidate>
        <label className="configuracion-campo">
          Nueva torre (una letra)
          <input
            type="text"
            maxLength={1}
            placeholder="Ej: D"
            value={letra}
            onChange={(evento) => {
              setLetra(evento.target.value);
              setMensajeError('');
            }}
          />
        </label>
        <button type="submit" className="boton-principal" disabled={guardando}>
          + Agregar torre
        </button>
      </form>

      {mensajeError !== '' && <p className="configuracion-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="configuracion-exito">{mensajeExito}</p>}
    </article>
  );
}

export default SeccionTorres;
