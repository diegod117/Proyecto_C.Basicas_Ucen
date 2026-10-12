// AvisoUbicacion.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Un recuadro AMARILLO de "¡ojo!" que aparece en la ficha SOLO si la
// ubicación del recurso tiene problemas (un dato vacío o un código mal
// escrito). Si todo está bien, no aparece nada.
// Sirve, por ejemplo, para detectar errores si algún día se cargan los
// datos desde la planilla Excel.
// En la guía: paso 3 (devolver null para no dibujar nada).
// Cubre: HU-11, RF-10

import type { Ubicacion } from '../types/Recurso';
import { validarUbicacion } from '../utils/ubicacion';
import './AvisoUbicacion.css';

interface PropsAvisoUbicacion {
  ubicacion: Ubicacion;
}

// Componente AvisoUbicacion
// Recibe: la ubicación de un recurso.
// Devuelve: el recuadro con la lista de problemas, o NADA si está todo bien.
function AvisoUbicacion(props: PropsAvisoUbicacion) {
  // Le pedimos a la herramienta de utils la lista de problemas.
  const problemas = validarUbicacion(props.ubicacion);

  // ¿No hay problemas? Devolvemos null. En React, null = "no dibujes nada".
  // Es como un mensajero que, si no hay noticias, no toca el timbre.
  if (problemas.length === 0) {
    return null;
  }

  return (
    <div className="aviso-ubicacion">
      {/* <strong> = texto en negrita. */}
      <strong>Revisar la ubicación de este recurso:</strong>
      {/* <ul> = una lista con puntitos; cada <li> es un punto. */}
      <ul>
        {/* Un punto por cada problema. Usamos el texto del problema como
            key porque nunca se repite. */}
        {problemas.map((problema) => (
          <li key={problema}>{problema}</li>
        ))}
      </ul>
    </div>
  );
}

export default AvisoUbicacion;
