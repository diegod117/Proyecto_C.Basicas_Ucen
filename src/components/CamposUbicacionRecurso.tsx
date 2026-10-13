// CamposUbicacionRecurso.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Un pedazo del formulario "Agregar recurso": las cajitas de la UBICACIÓN
// (torre, sala, bodega y mueble). Abajo muestra el código de ubicación que
// se arma SOLO mientras escribes (ej: "B307-B1-M2"), así nadie tiene que
// inventarlo ni escribirlo.
// La torre y la sala ya no se escriben: se ELIGEN de menús. Esas listas
// vienen de la página "Configuración" (colecciones "torres" y "salas" de
// Firestore). Si el encargado agrega una torre o sala nueva, aparece aquí sola.
// Usa los estilos de FormularioNuevoRecurso.css.
// En la guía: paso 4 (props con la "mochila" de datos).
// Cubre: RF-10, HU-11 (ubicación obligatoria con código)

import type { DatosNuevoRecurso } from '../types/Recurso';
import { armarUbicacion } from '../utils/nuevoRecurso';
import { obtenerTorres, obtenerSalasDeTorre } from '../services/configuracionService';

interface PropsCamposUbicacionRecurso {
  // La "mochila" completa del formulario (este componente solo usa los
  // bolsillos de ubicación, pero recibe todo).
  datos: DatosNuevoRecurso;
  // La función del papá para guardar la mochila con un bolsillo cambiado.
  // Recibe la mochila COMPLETA: { ...props.datos, sala: '307' } copia todos
  // los bolsillos y cambia solo "sala".
  onCambiar: (datos: DatosNuevoRecurso) => void;
}

// Componente CamposUbicacionRecurso
// Recibe: la mochila de datos y la función para cambiarla.
// Devuelve: el grupo de cajitas de ubicación.
// No tiene useState: no guarda nada, todo lo guarda el papá (FormularioNuevoRecurso).
function CamposUbicacionRecurso(props: PropsCamposUbicacionRecurso) {
  const datos = props.datos;

  // Solo las salas de la torre elegida. Si elegiste la torre C, no tiene
  // sentido ofrecerte la sala B307.
  const salasDeLaTorre = obtenerSalasDeTorre(datos.torre);

  // El código solo se puede armar cuando ya están la sala y la bodega.
  // Mientras tanto mostramos un texto de ayuda.
  let codigo = 'Se genera al completar la ubicación';
  if (datos.sala.trim() !== '' && datos.bodega.trim() !== '') {
    codigo = armarUbicacion(datos).codigo;
  }

  return (
    <fieldset className="nuevo-recurso-grupo">
      <legend>Ubicación (obligatoria)</legend>

      <div className="nuevo-recurso-fila">
        <label className="nuevo-recurso-campo">
          Torre
          {/* Las opciones salen de obtenerTorres() con .map(): una <option>
              por torre. Al cambiar de torre BORRAMOS la sala elegida
              (sala: ''), porque las salas de la torre anterior ya no sirven.
              { ...datos, torre: ..., sala: '' } = copia la mochila entera y
              cambia esos dos bolsillos. */}
          <select
            value={datos.torre}
            onChange={(evento) => props.onCambiar({ ...datos, torre: evento.target.value, sala: '' })}
          >
            {obtenerTorres().map((torre) => (
              <option key={torre.letra} value={torre.letra}>
                Torre {torre.letra}
              </option>
            ))}
          </select>
        </label>
        <label className="nuevo-recurso-campo">
          Sala
          {/* Un menú con las salas de la torre elegida.
              En "value" va solo el número ('307'), que es lo que se guarda
              en la ubicación; la torre ya está en su propio bolsillo. */}
          <select
            value={datos.sala}
            onChange={(evento) => props.onCambiar({ ...datos, sala: evento.target.value })}
          >
            <option value="">Elige una sala</option>
            {salasDeLaTorre.map((sala) => (
              <option key={sala.codigo} value={sala.numero}>
                Sala {sala.numero}
              </option>
            ))}
          </select>
          {/* Si la torre todavía no tiene salas, le explicamos dónde agregarlas. */}
          {salasDeLaTorre.length === 0 && (
            <span className="texto-secundario">
              Esta torre no tiene salas. Agrégalas en "Configuración".
            </span>
          )}
        </label>
      </div>

      <div className="nuevo-recurso-fila">
        <label className="nuevo-recurso-campo">
          Bodega
          {/* placeholder con comillas simples ' ' porque el texto lleva comillas dobles adentro. */}
          <input
            type="text"
            placeholder='Ej: Bodega 1 (o "Sala")'
            value={datos.bodega}
            onChange={(evento) => props.onCambiar({ ...datos, bodega: evento.target.value })}
          />
        </label>
        <label className="nuevo-recurso-campo">
          Mueble
          <input
            type="text"
            placeholder='Ej: Mueble 2 (o "Sin mueble")'
            value={datos.mueble}
            onChange={(evento) => props.onCambiar({ ...datos, mueble: evento.target.value })}
          />
        </label>
      </div>

      {/* El código se actualiza solo con cada letra, porque cada letra cambia
          la mochila, el papá redibuja, y este componente vuelve a calcularlo. */}
      <p className="nuevo-recurso-codigo">
        Código de ubicación: <strong>{codigo}</strong>
      </p>
    </fieldset>
  );
}

export default CamposUbicacionRecurso;
