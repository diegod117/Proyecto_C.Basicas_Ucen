// SeccionSalas.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Una de las tres tarjetas de la página "Configuración".
// Muestra las salas que existen (B302, B307...) y un formulario para
// agregar una nueva: eliges la torre en un menú y escribes el número.
// Las salas nuevas aparecen SOLAS en la ubicación de "Agregar recurso" y
// en el menú de salas de las reservas.
// Usa los estilos de PaginaConfiguracion.css.
// Funciona igual que SeccionCategorias.tsx (míralo primero, tiene más comentarios).
// En la guía: paso 13 (Configuración).
// Cubre: RF-10 (ubicación física), RF-03 (sala de la reserva), RNF-05

import { useState } from 'react';
import type { FormEvent } from 'react';
import { obtenerTorres, obtenerSalas, agregarSala } from '../services/configuracionService';
import { validarNuevaSala } from '../utils/configuracion';

// Las props que le pasa PaginaConfiguracion.
interface PropsSeccionSalas {
  // Una función de la página para avisar "¡agregué una sala!".
  onAgregado: () => void;
}

// Componente SeccionSalas
// Recibe: la función para avisar que se agregó algo.
// Devuelve: la tarjeta con la lista de salas y el formulario.
function SeccionSalas(props: PropsSeccionSalas) {
  // La memoria del formulario: la torre elegida ('' = ninguna todavía),
  // el número escrito, los mensajes y "guardando".
  const [torre, setTorre] = useState('');
  const [numero, setNumero] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  const salas = obtenerSalas();

  // guardar
  // Se ejecuta al apretar "+ Agregar sala".
  // Recibe el evento del formulario. No devuelve nada.
  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    // Revisar: ¿eligió torre? ¿el número es un número? ¿ya existe? (utils/configuracion.ts)
    const error = validarNuevaSala(torre, numero, salas);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    setMensajeError('');
    setGuardando(true);
    const numeroLimpio = numero.trim();
    // El código es torre + número pegados: "D" + "101" = "D101".
    const codigo = torre + numeroLimpio;
    // { codigo: codigo, ... } = armamos el objeto Sala con sus 3 datos.
    const seGuardo = await agregarSala({ codigo: codigo, torre: torre, numero: numeroLimpio });
    setGuardando(false);

    if (seGuardo) {
      setMensajeExito('Sala ' + codigo + ' agregada.');
      // Borramos solo el número; la torre queda elegida por si quieres
      // agregar otra sala en la misma torre.
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
            {/* Una opción por torre. Se llama torreDeLista (y no "torre")
                para no confundirla con el useState "torre" de arriba. */}
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
            inputMode="numeric" // en el celular aparece el teclado de números
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
