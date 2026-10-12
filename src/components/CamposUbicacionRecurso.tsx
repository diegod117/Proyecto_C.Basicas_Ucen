// CamposUbicacionRecurso.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Un pedazo del formulario "Agregar recurso": las cajitas de la UBICACIÓN
// (torre, sala, bodega y mueble). Abajo muestra el código de ubicación que
// se arma SOLO mientras escribes (ej: "B307-B1-M2"), así nadie tiene que
// inventarlo ni escribirlo.
// Usa los estilos de FormularioNuevoRecurso.css.
// En la guía: paso 4 (props con la "mochila" de datos).
// Cubre: RF-10, HU-11 (ubicación obligatoria con código)

import type { DatosNuevoRecurso, Torre } from '../types/Recurso';
import { armarUbicacion } from '../utils/nuevoRecurso';

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
          {/* "as Torre": el <select> entrega texto; le aseguramos a TypeScript
              que es 'B' o 'C' (las únicas opciones que hay). */}
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
          {/* inputMode="numeric" = en el celular aparece el teclado de números. */}
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
