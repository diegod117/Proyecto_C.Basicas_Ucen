// SeccionTorres.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Una de las tres tarjetas de la página "Configuración".
// Muestra las torres (edificios) que existen, con cuántas salas tiene cada
// una, y un formulario para agregar una nueva (ej: "D").
// Una torre nueva parte sin salas: después se le agregan en SeccionSalas.
// Usa los estilos de PaginaConfiguracion.css.
// Funciona igual que SeccionCategorias.tsx (míralo primero, tiene más comentarios).
// En la guía: paso 13 (Configuración).
// Cubre: RF-10 (ubicación física), RNF-05 (escalabilidad)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { obtenerTorres, obtenerSalasDeTorre, agregarTorre } from '../services/configuracionService';
import { validarNuevaTorre } from '../utils/configuracion';

// Las props que le pasa PaginaConfiguracion.
interface PropsSeccionTorres {
  // Una función de la página para avisar "¡agregué una torre!".
  onAgregado: () => void;
}

// Componente SeccionTorres
// Recibe: la función para avisar que se agregó algo.
// Devuelve: la tarjeta con la lista de torres y el formulario.
function SeccionTorres(props: PropsSeccionTorres) {
  // La memoria del formulario: la letra escrita, los mensajes y "guardando".
  const [letra, setLetra] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  const torres = obtenerTorres();

  // guardar
  // Se ejecuta al apretar "+ Agregar torre".
  // Recibe el evento del formulario. No devuelve nada.
  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    // Revisar: ¿es UNA letra? ¿ya existe? (utils/configuracion.ts)
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
          // Contamos las salas de esta torre para escribir "· 3 salas".
          // Cuidamos la gramática: "1 sala" en singular, "0 salas" o "3 salas" en plural.
          // Como hay cálculos antes de dibujar, la flecha lleva llaves { } y un return.
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
            maxLength={1} // no deja escribir más de 1 letra
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
