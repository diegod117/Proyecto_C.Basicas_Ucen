// TarjetaRecurso.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// UNA tarjeta del inventario: el resumen de un recurso, como una lámina de
// un álbum. Muestra el nombre, la categoría, el laboratorio, cuántas
// unidades hay y una etiqueta de color por cada estado con unidades.
// Al hacer clic en la tarjeta se abre la ficha completa del recurso (HU-02).
// *** Para cambiar qué dice la tarjeta (ej: "Cantidad:"), cámbialo aquí abajo,
//     en el return. Los colores están en TarjetaRecurso.css. ***
// En la guía: paso 3 (props, .map y key).
// Cubre: HU-01, HU-02, RF-02 (cantidad operativa), RF-08 (categoría), RF-10 (ubicación)

import type { Recurso } from '../types/Recurso';
import {
  textoEstado,
  textoCategoria,
  calcularCantidadTotal,
  obtenerEstadosConUnidades,
} from '../utils/inventario';
import { calcularUnidadesEnReservaAhora } from '../utils/estadoReserva';
import './TarjetaRecurso.css';

// Las props de la tarjeta.
// El papá (GrillaRecursos) decide QUÉ recurso mostrar; la tarjeta solo se
// preocupa de CÓMO se ve.
interface PropsTarjetaRecurso {
  recurso: Recurso;
  // La función que se llama al hacer clic. Recibe el id del recurso para
  // que la página sepa CUÁL abrir. La tarjeta no abre la ficha ella sola:
  // solo avisa "me tocaron, soy la número 6", y la página decide.
  onSeleccionar: (idRecurso: number) => void;
}

// Componente TarjetaRecurso
// Recibe: un recurso y la función para avisar el clic.
// Devuelve: la tarjeta con el resumen de ese recurso.
function TarjetaRecurso(props: PropsTarjetaRecurso) {
  // Guardamos props.recurso en una variable con nombre corto, para no
  // escribir "props.recurso." a cada rato.
  const recurso = props.recurso;

  // Los cálculos se hacen ANTES del return, con las herramientas de utils.
  // Así el JSX de abajo queda limpio: solo muestra resultados.
  const cantidadTotal = calcularCantidadTotal(recurso);
  // Las unidades que están en una reserva EN CURSO (la clase está pasando
  // ahora) no están en el laboratorio: están en la sala del profesor.
  // Por eso las restamos de las disponibles. Cuando la clase termina,
  // este número vuelve a 0 y las unidades "vuelven" solas, sin que nadie
  // toque nada (ver utils/estadoReserva.ts y guía, paso 12).
  // "let" (y no "const") porque abajo lo podemos cambiar.
  const enReservaAhora = calcularUnidadesEnReservaAhora(recurso.id);
  let cantidadDisponible = recurso.cantidades.disponible - enReservaAhora;
  // Protección: nunca mostrar números negativos (ej: si alguien dañó
  // unidades que estaban reservadas).
  if (cantidadDisponible < 0) {
    cantidadDisponible = 0;
  }
  const estadosConUnidades = obtenerEstadosConUnidades(recurso);

  // El laboratorio escrito bonito, ej: "Torre B · Sala 307".
  const textoLaboratorio = 'Torre ' + recurso.ubicacion.torre + ' · Sala ' + recurso.ubicacion.sala;

  // Gramática: "1 disponible" pero "12 disponibles".
  let textoDisponibles = 'disponibles';
  if (cantidadDisponible === 1) {
    textoDisponibles = 'disponible';
  }

  return (
    // <article> es una etiqueta de HTML para "un contenido que se entiende solo".
    // onClick con función flecha: al hacer clic en CUALQUIER parte de la
    // tarjeta, avisamos el id del recurso.
    <article className="tarjeta-recurso" onClick={() => props.onSeleccionar(recurso.id)}>
      {/* Arriba: la categoría a la izquierda y el código a la derecha. */}
      <div className="tarjeta-cabecera">
        <span className="tarjeta-categoria">{textoCategoria(recurso.categoria)}</span>
        <span className="tarjeta-codigo">{recurso.ubicacion.codigo}</span>
      </div>

      <div className="tarjeta-cuerpo">
        <h3 className="tarjeta-nombre">{recurso.nombre}</h3>
        <p className="tarjeta-laboratorio">{textoLaboratorio}</p>
        <p className="tarjeta-cantidad">
          Cantidad: {cantidadTotal} ({cantidadDisponible} {textoDisponibles}
          {enReservaAhora > 0 && ' · ' + enReservaAhora + ' en reserva ahora'})
        </p>

        <div className="tarjeta-etiquetas">
          {/* Una etiqueta de color por cada estado con unidades.
              .map() recorre los estados y por cada uno devuelve un <span>.
              key={estado}: el nombre único de cada etiqueta (no se repiten).
              className={'etiqueta etiqueta-' + estado}: armamos la clase
              pegando textos. Si el estado es 'danado', la clase queda
              "etiqueta etiqueta-danado", y el CSS la pinta de rojo. */}
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
