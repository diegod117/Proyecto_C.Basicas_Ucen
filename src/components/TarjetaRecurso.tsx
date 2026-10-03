// TarjetaRecurso.tsx
// Tarjeta que muestra el resumen de UN recurso del inventario:
// nombre, categoría, laboratorio, cantidad total y disponible,
// y una etiqueta de color por cada estado que tenga unidades.
// Al hacer clic en la tarjeta se abre la ficha del recurso (HU-02).
// Cubre: HU-01, HU-02, RF-02 (cantidad operativa), RF-08 (categoría), RF-10 (ubicación)

import type { Recurso } from '../types/Recurso';
import {
  textoEstado,
  textoCategoria,
  calcularCantidadTotal,
  obtenerEstadosConUnidades,
} from '../utils/inventario';
import './TarjetaRecurso.css';

// Props que recibe la tarjeta: el recurso que tiene que mostrar.
// El componente padre (la página de inventario) decide QUÉ recurso;
// la tarjeta solo se encarga de CÓMO se ve.
interface PropsTarjetaRecurso {
  recurso: Recurso;
  // Función que se llama al hacer clic en la tarjeta. Recibe el id del
  // recurso para que la página sepa CUÁL abrir. La tarjeta no abre la
  // ficha por sí sola: solo avisa, y la página decide qué hacer.
  onSeleccionar: (idRecurso: number) => void;
}

// Componente TarjetaRecurso
// Recibe: un recurso y la función para seleccionarlo (por props).
// Devuelve: la tarjeta con el resumen de ese recurso.
function TarjetaRecurso(props: PropsTarjetaRecurso) {
  const recurso = props.recurso;

  // Los cálculos se hacen ANTES del return, usando las funciones de utils.
  // Así el JSX de abajo queda simple: solo muestra los resultados.
  const cantidadTotal = calcularCantidadTotal(recurso);
  const cantidadDisponible = recurso.cantidades.disponible;
  const estadosConUnidades = obtenerEstadosConUnidades(recurso);

  // Texto del laboratorio con el formato torre + sala, ej: "Torre B · Sala 307"
  const textoLaboratorio = 'Torre ' + recurso.ubicacion.torre + ' · Sala ' + recurso.ubicacion.sala;

  // "disponible" o "disponibles" según la cantidad (1 disponible, 12 disponibles)
  let textoDisponibles = 'disponibles';
  if (cantidadDisponible === 1) {
    textoDisponibles = 'disponible';
  }

  return (
    // Al hacer clic en cualquier parte de la tarjeta, avisamos el id del recurso
    <article className="tarjeta-recurso" onClick={() => props.onSeleccionar(recurso.id)}>
      <div className="tarjeta-cabecera">
        <span className="tarjeta-categoria">{textoCategoria(recurso.categoria)}</span>
        <span className="tarjeta-codigo">{recurso.ubicacion.codigo}</span>
      </div>

      <div className="tarjeta-cuerpo">
        <h3 className="tarjeta-nombre">{recurso.nombre}</h3>
        <p className="tarjeta-laboratorio">{textoLaboratorio}</p>
        <p className="tarjeta-cantidad">
          Cantidad: {cantidadTotal} ({cantidadDisponible} {textoDisponibles})
        </p>

        <div className="tarjeta-etiquetas">
          {/* .map() recorre la lista de estados y por cada uno devuelve
              una etiqueta <span>. React necesita una "key" distinta en cada
              elemento de una lista para saber cuál es cuál al redibujar;
              usamos el nombre del estado porque no se repite. */}
          {estadosConUnidades.map((estado) => (
            <span key={estado} className={'etiqueta etiqueta-' + estado}>
              {textoEstado(estado)} ({recurso.cantidades[estado]})
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default TarjetaRecurso;
