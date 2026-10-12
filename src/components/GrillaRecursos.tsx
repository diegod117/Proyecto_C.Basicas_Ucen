// GrillaRecursos.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La "grilla" (cuadrícula) de tarjetas del inventario: una tarjeta por
// cada recurso, ordenadas en filas y columnas como un álbum de láminas.
// Si no hay ningún recurso que mostrar (los filtros no encontraron nada),
// muestra un mensaje con un botón para limpiar los filtros.
// En la guía: paso 3 (listas con .map y key).
// Cubre: HU-01

import type { Recurso } from '../types/Recurso';
import TarjetaRecurso from './TarjetaRecurso';
import MensajeSinResultados from './MensajeSinResultados';
import './GrillaRecursos.css';

interface PropsGrillaRecursos {
  // Los recursos que hay que mostrar (la página ya los pasó por el colador).
  recursos: Recurso[];
  // Una función que se llama al hacer clic en una tarjeta, con el id del recurso.
  onSeleccionarRecurso: (idRecurso: number) => void;
  // Una función que se llama al apretar "Limpiar filtros" (cuando no hay resultados).
  onLimpiarFiltros: () => void;
}

// Componente GrillaRecursos
// Recibe: la lista de recursos y las dos funciones.
// Devuelve: la grilla de tarjetas, o el mensaje si la lista está vacía.
function GrillaRecursos(props: PropsGrillaRecursos) {
  // ¿La lista está vacía (largo 0)? Mostramos el mensaje y TERMINAMOS aquí:
  // el return de más abajo ya no se ejecuta.
  if (props.recursos.length === 0) {
    return <MensajeSinResultados onLimpiarFiltros={props.onLimpiarFiltros} />;
  }

  return (
    <div className="grilla-recursos">
      {/* DIBUJAR UNA LISTA (ver guía, paso 3):
          .map() recorre la lista y, por CADA recurso, devuelve una TarjetaRecurso.
          Es como una fábrica: entran 10 recursos y salen 10 tarjetas.
          (recurso) => ( ... ) es una función flecha: recibe un recurso y
          devuelve el JSX de su tarjeta.
          key={recurso.id}: React necesita un "nombre único" para cada elemento
          de una lista. Así, cuando cambias un filtro, sabe qué tarjetas sacar
          y cuáles dejar, sin redibujar todo. Es como el número de lista en un curso. */}
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
