// CampoUnidadIncidencia.tsx
// Campo opcional del formulario de incidencias para indicar CUÁL unidad
// del recurso se afectó (por su número de serie o de inventario).
// Solo aparece si el recurso elegido tiene unidades (equipos e instrumentos).
// Es opcional para no pasar de las 5 acciones de RNF-02.
// Usa los estilos de FormularioIncidencia.css (.campo-formulario).
// Cubre: HU-04, RF-05, HU-12 (CA-12.4)

import type { Recurso } from '../types/Recurso';
import { textoEstado } from '../utils/inventario';

interface PropsCampoUnidadIncidencia {
  // El recurso elegido en el formulario (undefined si todavía no se elige ninguno)
  recurso: Recurso | undefined;
  // Número de serie elegido, o '' si no se indicó ninguna unidad
  valor: string;
  onCambiar: (numero: string) => void;
}

// Componente CampoUnidadIncidencia
// Recibe: el recurso elegido, la unidad elegida y la función para cambiarla.
// Devuelve: la lista desplegable de unidades, o nada si el recurso no tiene unidades.
function CampoUnidadIncidencia(props: PropsCampoUnidadIncidencia) {
  // Devolver null hace que React no dibuje nada
  if (props.recurso === undefined || props.recurso.unidades === undefined) {
    return null;
  }

  return (
    <div className="campo-formulario">
      <label htmlFor="campo-unidad">Unidad afectada (opcional)</label>
      <select
        id="campo-unidad"
        value={props.valor}
        onChange={(evento) => props.onCambiar(evento.target.value)}
      >
        <option value="">-- Sin indicar --</option>
        {props.recurso.unidades.map((unidad) => (
          <option key={unidad.numero} value={unidad.numero}>
            {unidad.numero} ({textoEstado(unidad.estado)})
          </option>
        ))}
      </select>
    </div>
  );
}

export default CampoUnidadIncidencia;
