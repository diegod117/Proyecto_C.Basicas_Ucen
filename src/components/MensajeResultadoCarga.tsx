// MensajeResultadoCarga.tsx
// Mensaje final de la carga: "X recursos cargados, Y con errores" y los ids
// que se crearon (sirven para encontrarlos en la consola de Firebase si hubiera
// que borrarlos a mano). Si una tanda falló, lo explica.
// Usa los estilos de PaginaCargaExcel.css.
// Cubre: HU-16, RF-15 (CA-16.3)

import { Link } from 'react-router-dom';
import type { ResultadoGuardado } from '../types/Importacion';

// Lo que necesita el mensaje: el resultado de guardar y las filas que no se cargaron
export interface DatosResultadoCarga {
  guardado: ResultadoGuardado;
  conError: number; // filas que tenían error en la vista previa
  sinGuardar: number; // filas válidas que no se alcanzaron a guardar
}

interface PropsMensajeResultadoCarga {
  datos: DatosResultadoCarga;
}

// Componente MensajeResultadoCarga
// Recibe: los datos del resultado.
// Devuelve: el recuadro con el mensaje final.
function MensajeResultadoCarga(props: PropsMensajeResultadoCarga) {
  const datos = props.datos;
  const guardado = datos.guardado;

  return (
    <div className="carga-tarjeta">
      <h3 className="carga-subtitulo">
        {guardado.guardados} recursos cargados, {datos.conError} con errores
      </h3>
      {guardado.guardados > 0 && (
        <p>
          Ids de recursos creados: del {guardado.primerIdRecurso} al {guardado.ultimoIdRecurso}.
          Ids del historial: del {guardado.primerIdHistorial} al {guardado.ultimoIdHistorial}.
        </p>
      )}
      {guardado.fallo && (
        <p className="carga-error">
          La carga se detuvo porque Firestore no aceptó una tanda: quedaron {datos.sinGuardar}{' '}
          recursos sin guardar. Vuelve a subir el archivo: los que ya se guardaron se detectan
          como repetidos y no se duplican.
        </p>
      )}
      <Link to="/inventario">Ver el inventario</Link>
    </div>
  );
}

export default MensajeResultadoCarga;
