// CamposDetalleRecurso.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Otro pedazo del formulario "Agregar recurso": las cajitas OPCIONALES que
// también tenía la planilla Excel: marca, número de serie, proveedor y
// observación. Si se dejan vacías, la ficha muestra "No registrado".
// Usa los estilos de FormularioNuevoRecurso.css.
// *** Para agregar un dato nuevo al formulario, copia un bloque <label>
//     de aquí (ver guía, paso 9). ***
// En la guía: paso 4 (props con la "mochila" de datos).
// Cubre: datos de la planilla (sección 1.1 de requerimientos)

import type { DatosNuevoRecurso } from '../types/Recurso';

interface PropsCamposDetalleRecurso {
  // La mochila completa del formulario.
  datos: DatosNuevoRecurso;
  // Igual que en CamposUbicacionRecurso: recibe la mochila completa con
  // un bolsillo cambiado.
  onCambiar: (datos: DatosNuevoRecurso) => void;
}

// Componente CamposDetalleRecurso
// Recibe: la mochila de datos y la función para cambiarla.
// Devuelve: el grupo de cajitas opcionales.
function CamposDetalleRecurso(props: PropsCamposDetalleRecurso) {
  const datos = props.datos;

  return (
    <fieldset className="nuevo-recurso-grupo">
      <legend>Datos de la planilla (opcionales)</legend>

      {/* Marca y N° de serie lado a lado (en celular, uno abajo del otro). */}
      <div className="nuevo-recurso-fila">
        <label className="nuevo-recurso-campo">
          Marca
          <input
            type="text"
            value={datos.marca}
            onChange={(evento) => props.onCambiar({ ...datos, marca: evento.target.value })}
          />
        </label>
        <label className="nuevo-recurso-campo">
          N° de serie
          <input
            type="text"
            value={datos.numeroSerie}
            onChange={(evento) => props.onCambiar({ ...datos, numeroSerie: evento.target.value })}
          />
        </label>
      </div>

      {/* Proveedor y Observación ocupan todo el ancho. */}
      <label className="nuevo-recurso-campo">
        Proveedor
        <input
          type="text"
          value={datos.proveedor}
          onChange={(evento) => props.onCambiar({ ...datos, proveedor: evento.target.value })}
        />
      </label>

      <label className="nuevo-recurso-campo">
        Observación
        <input
          type="text"
          value={datos.observacion}
          onChange={(evento) => props.onCambiar({ ...datos, observacion: evento.target.value })}
        />
      </label>
    </fieldset>
  );
}

export default CamposDetalleRecurso;
