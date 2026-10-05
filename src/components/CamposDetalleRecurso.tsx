// CamposDetalleRecurso.tsx
// Parte del formulario "Agregar recurso" con los datos OPCIONALES que hoy
// tiene la planilla Excel: marca, número de serie, proveedor y observación.
// Si se dejan vacíos, la ficha muestra "No registrado".
// Usa los estilos de FormularioNuevoRecurso.css.
// Cubre: datos de la planilla (sección 1.1 de requerimientos)

import type { DatosNuevoRecurso } from '../types/Recurso';

interface PropsCamposDetalleRecurso {
  datos: DatosNuevoRecurso;
  // Igual que en CamposUbicacionRecurso: recibe los datos completos
  // con un campo cambiado
  onCambiar: (datos: DatosNuevoRecurso) => void;
}

// Componente CamposDetalleRecurso
// Recibe: los datos del formulario y la función para cambiarlos.
// Devuelve: el grupo de campos opcionales.
function CamposDetalleRecurso(props: PropsCamposDetalleRecurso) {
  const datos = props.datos;

  return (
    <fieldset className="nuevo-recurso-grupo">
      <legend>Datos de la planilla (opcionales)</legend>

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
