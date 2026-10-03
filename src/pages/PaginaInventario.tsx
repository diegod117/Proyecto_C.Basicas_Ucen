// PaginaInventario.tsx
// Página del inventario: muestra los recursos en una grilla de tarjetas,
// para que el docente sepa qué hay y en qué cantidad operativa.
// Se puede filtrar por nombre, categoría, laboratorio y estado.
// Cubre: HU-01, RF-02, RF-08

import { useState } from 'react';
// La página pide los recursos al SERVICIO, no directamente a src/data/.
// Así no le importa de dónde vienen los datos (ver recursosService.ts).
import { obtenerRecursos } from '../services/recursosService';
import { filtrarRecursos, obtenerLaboratorios, SIN_FILTRO } from '../utils/filtrosInventario';
import FiltrosInventario from '../components/FiltrosInventario';
import TarjetaRecurso from '../components/TarjetaRecurso';
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

  return (
    <section className="contenido-pagina">
      <div className="inventario-encabezado">
        <h2>Inventario de laboratorios</h2>
        {/* ".length" es la cantidad de elementos que tiene la lista */}
        <p className="texto-secundario">
          Mostrando {recursosFiltrados.length} de {listaRecursos.length} recursos
        </p>
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

      <div className="grilla-recursos">
        {/* .map() recorre la lista FILTRADA y por cada recurso devuelve una
            TarjetaRecurso. La "key" (el id del recurso) le permite a React
            saber qué tarjetas quitar o mantener cuando cambia un filtro. */}
        {recursosFiltrados.map((recurso) => (
          <TarjetaRecurso key={recurso.id} recurso={recurso} />
        ))}
      </div>
    </section>
  );
}

export default PaginaInventario;
