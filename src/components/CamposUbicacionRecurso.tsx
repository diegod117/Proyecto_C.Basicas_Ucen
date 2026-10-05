// CamposUbicacionRecurso.tsx
// Parte del formulario "Agregar recurso" con la ubicación física:
// torre, sala, bodega y mueble. Muestra el código de ubicación que se
// genera solo (ej: "B307-B1-M2"), así nadie tiene que escribirlo.
// Usa los estilos de FormularioNuevoRecurso.css.
// Cubre: RF-10, HU-11 (ubicación obligatoria con código)

import type { DatosNuevoRecurso, Torre } from '../types/Recurso';
import { armarUbicacion } from '../utils/nuevoRecurso';

interface PropsCamposUbicacionRecurso {
  // Todos los datos del formulario (este componente usa solo los de ubicación)
  datos: DatosNuevoRecurso;
  // Función del formulario para guardar los datos con un campo cambiado.
  // Recibe los datos COMPLETOS: { ...props.datos, sala: '307' } copia todos
  // los campos y cambia solo "sala".
  onCambiar: (datos: DatosNuevoRecurso) => void;
}

// Componente CamposUbicacionRecurso
// Recibe: los datos del formulario y la función para cambiarlos.
// Devuelve: el grupo de campos de ubicación.
function CamposUbicacionRecurso(props: PropsCamposUbicacionRecurso) {
  const datos = props.datos;

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
          <select
            value={datos.torre}
            onChange={(evento) => props.onCambiar({ ...datos, torre: evento.target.value as Torre })}
          >
            <option value="B">Torre B</option>
            <option value="C">Torre C</option>
          </select>
        </label>
        <label className="nuevo-recurso-campo">
          Sala
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ej: 307"
            value={datos.sala}
            onChange={(evento) => props.onCambiar({ ...datos, sala: evento.target.value })}
          />
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
