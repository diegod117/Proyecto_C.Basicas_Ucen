// AvisoUbicacion.tsx
// Recuadro amarillo que aparece en la ficha SOLO si la ubicación del
// recurso tiene problemas (campos vacíos o un código mal escrito).
// Útil, por ejemplo, cuando se carguen datos desde la planilla Excel.
// Cubre: HU-11, RF-10

import type { Ubicacion } from '../types/Recurso';
import { validarUbicacion } from '../utils/ubicacion';
import './AvisoUbicacion.css';

interface PropsAvisoUbicacion {
  ubicacion: Ubicacion;
}

// Componente AvisoUbicacion
// Recibe: la ubicación de un recurso.
// Devuelve: el aviso con la lista de problemas, o nada si está todo bien.
function AvisoUbicacion(props: PropsAvisoUbicacion) {
  const problemas = validarUbicacion(props.ubicacion);

  // Si no hay problemas, devolvemos null: en React, null significa
  // "no dibujar nada". Así el aviso solo aparece cuando hace falta.
  if (problemas.length === 0) {
    return null;
  }

  return (
    <div className="aviso-ubicacion">
      <strong>Revisar la ubicación de este recurso:</strong>
      <ul>
        {/* Usamos el texto del problema como key porque no se repite */}
        {problemas.map((problema) => (
          <li key={problema}>{problema}</li>
        ))}
      </ul>
    </div>
  );
}

export default AvisoUbicacion;
