// CamposUbicacionRecurso.tsx
// Campos de la ubicación física: torre, sala, bodega y mueble.
// Los usan el formulario "Agregar recurso" y el recuadro "Cambiar ubicación". Muestra el código de ubicación que se
// genera solo (ej: "B307-B1-M2"), así nadie tiene que escribirlo.
// La torre y la sala se eligen de listas que vienen de la página
// "Configuración" (colecciones "torres" y "salas" de Firestore).
// Usa los estilos de FormularioNuevoRecurso.css.
// Cubre: RF-10, HU-11 (ubicación obligatoria con código y cambio de ubicación)

import type { DatosUbicacion } from '../types/Recurso';
import { armarUbicacion } from '../utils/nuevoRecurso';
import { obtenerTorres, obtenerSalasDeTorre } from '../services/configuracionService';

interface PropsCamposUbicacionRecurso {
  // Los 4 datos de la ubicación que se están escribiendo
  datos: DatosUbicacion;
  // Función del formulario para guardar los datos con un campo cambiado.
  // Recibe los datos de ubicación COMPLETOS: { ...props.datos, sala: '307' }
  // copia todos los campos y cambia solo "sala".
  onCambiar: (datos: DatosUbicacion) => void;
}

// Componente CamposUbicacionRecurso
// Recibe: los datos de ubicación y la función para cambiarlos.
// Devuelve: el grupo de campos de ubicación.
function CamposUbicacionRecurso(props: PropsCamposUbicacionRecurso) {
  const datos = props.datos;

  // Solo las salas de la torre elegida
  const salasDeLaTorre = obtenerSalasDeTorre(datos.torre);

  // El código solo se puede generar cuando la sala y la bodega están escritas
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
          {/* Al cambiar de torre se borra la sala elegida (sala: ''),
              porque las salas de otra torre ya no sirven */}
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
          {/* En "value" va el número ('307'), que es lo que se guarda en la ubicación */}
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

      <p className="nuevo-recurso-codigo">
        Código de ubicación: <strong>{codigo}</strong>
      </p>
    </fieldset>
  );
}

export default CamposUbicacionRecurso;
