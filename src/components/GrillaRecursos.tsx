// GrillaRecursos.tsx
// Muestra los recursos (ya filtrados) en una grilla de tarjetas.
// Si la lista viene vacía, muestra el mensaje para limpiar los filtros.
// Cubre: HU-01

import type { Recurso } from '../types/Recurso';
import TarjetaRecurso from './TarjetaRecurso';
import MensajeSinResultados from './MensajeSinResultados';
import './GrillaRecursos.css';

interface PropsGrillaRecursos {
  // Los recursos que hay que mostrar (la página ya los filtró)
  recursos: Recurso[];
  // Se llama al hacer clic en una tarjeta, con el id del recurso
  onSeleccionarRecurso: (idRecurso: number) => void;
  // Se llama al hacer clic en "Limpiar filtros" (cuando no hay resultados)
  onLimpiarFiltros: () => void;
}

// Componente GrillaRecursos
// Recibe: la lista de recursos y las funciones para seleccionar y limpiar.
// Devuelve: la grilla de tarjetas, o el mensaje si no hay recursos.
function GrillaRecursos(props: PropsGrillaRecursos) {
  // Si no hay recursos que mostrar, devolvemos el mensaje y la función
  // termina aquí (no se ejecuta el return de más abajo).
  if (props.recursos.length === 0) {
    return <MensajeSinResultados onLimpiarFiltros={props.onLimpiarFiltros} />;
  }

  return (
    <div className="grilla-recursos">
      {/* .map() recorre la lista y por cada recurso devuelve una TarjetaRecurso.
          La "key" (el id del recurso) le permite a React saber qué tarjetas
          quitar o mantener cuando cambia un filtro. */}
      {props.recursos.map((recurso) => (
        <TarjetaRecurso
          key={recurso.id}
          recurso={recurso}
          onSeleccionar={props.onSeleccionarRecurso}
        />
      ))}
    </div>
  );
}

export default GrillaRecursos;
