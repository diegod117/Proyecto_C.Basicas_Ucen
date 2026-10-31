// AccionesRecurso.tsx
// Columna derecha de la ficha (solo para el encargado): los recuadros para
// cambiar el estado, registrar una entrada y registrar una salida.
// Si el recurso tiene unidades con número de serie, el estado se cambia por
// unidad; si no, por cantidad.
// Se separó de FichaRecurso.tsx para que ese archivo no pasara de ~150 líneas.
// Cubre: HU-02, HU-14, RF-01, RF-13, RNF-03

import type { Recurso } from '../types/Recurso';
import { useUsuario } from '../context/ContextoUsuario';
import { puedeReponerStock } from '../utils/permisos';
import FormularioCambioEstado from './FormularioCambioEstado';
import FormularioCambioEstadoUnidades from './FormularioCambioEstadoUnidades';
import FormularioEntrada from './FormularioEntrada';
import FormularioSalida from './FormularioSalida';

interface PropsAccionesRecurso {
  recurso: Recurso;
  // Se llama después de guardar algo, para que App redibuje todo con los números nuevos
  onCambio: () => void;
}

// Componente AccionesRecurso
// Recibe: el recurso y la función para avisar que se guardó un cambio.
// Devuelve: la columna con los formularios.
function AccionesRecurso(props: PropsAccionesRecurso) {
  const usuario = useUsuario();
  const recurso = props.recurso;

  return (
    <div className="ficha-columna-derecha">
      {recurso.unidades !== undefined && (
        <FormularioCambioEstadoUnidades recurso={recurso} onEstadoCambiado={props.onCambio} />
      )}
      {recurso.unidades === undefined && (
        <FormularioCambioEstado recurso={recurso} onEstadoCambiado={props.onCambio} />
      )}

      {/* Entradas y salidas: también las puede registrar solo el encargado (RNF-03) */}
      {puedeReponerStock(usuario.rol) && (
        <>
          <FormularioEntrada recurso={recurso} onEntradaRegistrada={props.onCambio} />
          <FormularioSalida recurso={recurso} onSalidaRegistrada={props.onCambio} />
        </>
      )}
    </div>
  );
}

export default AccionesRecurso;
