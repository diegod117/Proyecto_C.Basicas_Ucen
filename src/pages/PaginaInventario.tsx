// PaginaInventario.tsx
// Página del inventario: muestra los recursos en una grilla de tarjetas,
// para que el docente sepa qué hay y en qué cantidad operativa.
// Se puede filtrar por nombre, categoría, laboratorio y estado.
// Si ningún recurso cumple los filtros, muestra un mensaje para limpiarlos.
// Al hacer clic en una tarjeta, muestra la ficha completa del recurso.
// Cubre: HU-01, HU-02, RF-02, RF-08

import { useState } from 'react';
// La página pide los recursos al SERVICIO, no directamente a src/data/.
// Así no le importa de dónde vienen los datos (ver recursosService.ts).
import { obtenerRecursos, obtenerRecursoPorId } from '../services/recursosService';
import {
  filtrarRecursos,
  hayFiltrosActivos,
  obtenerLaboratorios,
  SIN_FILTRO,
} from '../utils/filtrosInventario';
import FiltrosInventario from '../components/FiltrosInventario';
import TarjetaRecurso from '../components/TarjetaRecurso';
import FichaRecurso from '../components/FichaRecurso';
import MensajeSinResultados from '../components/MensajeSinResultados';
import './PaginaInventario.css';

// Componente PaginaInventario
// No recibe props. Devuelve el contenido de la página de inventario.
function PaginaInventario() {
  // Un useState por cada filtro. Cada uno guarda lo que el usuario eligió.
  // Cuando cualquiera cambia, React vuelve a ejecutar esta función completa
  // y la lista filtrada de abajo se recalcula sola.
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [categoria, setCategoria] = useState(SIN_FILTRO);
  const [laboratorio, setLaboratorio] = useState(SIN_FILTRO);
  const [estado, setEstado] = useState(SIN_FILTRO);

  // Id del recurso cuya ficha está abierta.
  // "number | null" significa que puede ser un número o null.
  // null = no hay ninguna ficha abierta (se muestra el listado).
  // Guardamos el ID y no el recurso completo: así, cuando el recurso cambie
  // (por ejemplo, al cambiar su estado en J10), lo volvemos a buscar con
  // su id y la ficha siempre muestra los datos actualizados.
  const [idRecursoSeleccionado, setIdRecursoSeleccionado] = useState<number | null>(null);

  const listaRecursos = obtenerRecursos();
  const laboratoriosDisponibles = obtenerLaboratorios(listaRecursos);

  // El filtrado lo hace una función de utils, no el JSX.
  // Le pasamos la lista completa y los 4 filtros elegidos.
  const recursosFiltrados = filtrarRecursos(
    listaRecursos,
    textoBusqueda,
    categoria,
    laboratorio,
    estado,
  );

  const filtrosActivos = hayFiltrosActivos(textoBusqueda, categoria, laboratorio, estado);

  // limpiarFiltros
  // No recibe nada ni devuelve nada: vuelve los 4 filtros a su valor inicial.
  // Al cambiar los estados, React redibuja la página con todos los recursos.
  function limpiarFiltros() {
    setTextoBusqueda('');
    setCategoria(SIN_FILTRO);
    setLaboratorio(SIN_FILTRO);
    setEstado(SIN_FILTRO);
  }

  // abrirFicha
  // Recibe: el id del recurso en que el usuario hizo clic. No devuelve nada.
  function abrirFicha(idRecurso: number) {
    setIdRecursoSeleccionado(idRecurso);
    // Subimos al inicio de la página, por si el usuario estaba más abajo
    window.scrollTo(0, 0);
  }

  // volverAlListado
  // No recibe ni devuelve nada: cierra la ficha y vuelve a mostrar el listado.
  // Los filtros NO se pierden, porque sus useState siguen guardados aquí.
  function volverAlListado() {
    setIdRecursoSeleccionado(null);
  }

  // mostrarResultados
  // No recibe nada. Devuelve lo que va debajo de los filtros:
  //   - si no hay recursos que cumplan los filtros: un mensaje con un botón
  //   - si hay recursos: la grilla de tarjetas
  // Usamos un if/else en una función aparte (como en App.tsx) para que
  // el return de abajo se lea fácil.
  function mostrarResultados() {
    if (recursosFiltrados.length === 0) {
      return <MensajeSinResultados onLimpiarFiltros={limpiarFiltros} />;
    } else {
      return (
        <div className="grilla-recursos">
          {/* .map() recorre la lista FILTRADA y por cada recurso devuelve una
              TarjetaRecurso. La "key" (el id del recurso) le permite a React
              saber qué tarjetas quitar o mantener cuando cambia un filtro. */}
          {recursosFiltrados.map((recurso) => (
            <TarjetaRecurso key={recurso.id} recurso={recurso} onSeleccionar={abrirFicha} />
          ))}
        </div>
      );
    }
  }

  // Si hay una ficha abierta, mostramos SOLO la ficha (en vez del listado).
  // Buscamos el recurso por su id; si por algún motivo no existe
  // (undefined), no entramos al if y se muestra el listado normal.
  if (idRecursoSeleccionado !== null) {
    const recursoSeleccionado = obtenerRecursoPorId(idRecursoSeleccionado);
    if (recursoSeleccionado) {
      return (
        <section className="contenido-pagina">
          <FichaRecurso recurso={recursoSeleccionado} onVolver={volverAlListado} />
        </section>
      );
    }
  }

  return (
    <section className="contenido-pagina">
      <div className="inventario-encabezado">
        <h2>Inventario de laboratorios</h2>
        <div className="inventario-contador">
          {/* ".length" es la cantidad de elementos que tiene la lista */}
          <p className="texto-secundario">
            Mostrando {recursosFiltrados.length} de {listaRecursos.length} recursos
          </p>
          {/* "condición && <elemento>" dibuja el elemento SOLO si la condición
              es true. Aquí: el botón aparece solo si hay algún filtro activo.
              onClick recibe la función limpiarFiltros SIN paréntesis: así
              React la ejecuta recién cuando el usuario hace clic. */}
          {filtrosActivos && (
            <button className="boton-limpiar-pequeno" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Le pasamos a FiltrosInventario los valores actuales y las funciones
          "set" de cada useState. Cuando el usuario cambia un filtro, el
          componente llama a la función y el estado de ESTA página cambia. */}
      <FiltrosInventario
        textoBusqueda={textoBusqueda}
        categoria={categoria}
        laboratorio={laboratorio}
        estado={estado}
        laboratoriosDisponibles={laboratoriosDisponibles}
        onCambiarTexto={setTextoBusqueda}
        onCambiarCategoria={setCategoria}
        onCambiarLaboratorio={setLaboratorio}
        onCambiarEstado={setEstado}
      />

      {mostrarResultados()}
    </section>
  );
}

export default PaginaInventario;
