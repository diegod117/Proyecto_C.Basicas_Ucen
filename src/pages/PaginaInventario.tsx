// PaginaInventario.tsx
// Página del inventario: muestra los recursos en una grilla de tarjetas,
// para que el docente sepa qué hay y en qué cantidad operativa.
// Tiene un buscador por nombre; los demás filtros se agregan en J6.
// Cubre: HU-01 (en progreso), RF-02

import { useState } from 'react';
// La página pide los recursos al SERVICIO, no directamente a src/data/.
// Así no le importa de dónde vienen los datos (ver recursosService.ts).
import { obtenerRecursos } from '../services/recursosService';
import { filtrarPorNombre } from '../utils/inventario';
import TarjetaRecurso from '../components/TarjetaRecurso';
import './PaginaInventario.css';

// Componente PaginaInventario
// No recibe props. Devuelve el contenido de la página de inventario.
function PaginaInventario() {
  // useState guarda lo que el usuario escribe en el buscador.
  //   - textoBusqueda: lo escrito hasta ahora (parte vacío: '')
  //   - setTextoBusqueda: función para cambiarlo
  // Cada vez que cambia, React vuelve a ejecutar esta función completa,
  // así que la lista filtrada de abajo se recalcula sola.
  const [textoBusqueda, setTextoBusqueda] = useState('');

  const listaRecursos = obtenerRecursos();

  // El filtrado lo hace una función de utils, no el JSX.
  // Aquí solo le pasamos la lista completa y el texto buscado.
  const recursosFiltrados = filtrarPorNombre(listaRecursos, textoBusqueda);

  return (
    <section className="contenido-pagina">
      <div className="inventario-encabezado">
        <h2>Inventario de laboratorios</h2>
        {/* ".length" es la cantidad de elementos que tiene la lista */}
        <p className="texto-secundario">
          Mostrando {recursosFiltrados.length} de {listaRecursos.length} recursos
        </p>
      </div>

      <div className="inventario-filtros">
        {/* htmlFor conecta el texto del label con el input (en HTML se
            escribe "for", pero en React es "htmlFor"). Al hacer clic en
            el label, el cursor se pone en el input. */}
        <label htmlFor="buscador-nombre">Buscar por nombre</label>
        {/* Este es un "input controlado":
            - value: lo que se ve en el input viene del estado (textoBusqueda)
            - onChange: cada vez que el usuario escribe una letra, guardamos
              el texto nuevo en el estado. "evento.target.value" es el texto
              que hay en el input en ese momento. */}
        <input
          id="buscador-nombre"
          type="text"
          placeholder="Ej: termómetro, arduino..."
          value={textoBusqueda}
          onChange={(evento) => setTextoBusqueda(evento.target.value)}
        />
      </div>

      <div className="grilla-recursos">
        {/* .map() recorre la lista de recursos y por CADA recurso devuelve
            una TarjetaRecurso. Ahora recorremos la lista FILTRADA, así que
            solo se dibujan los recursos que coinciden con la búsqueda.
            La "key" (el id del recurso) le permite a React saber qué
            tarjetas quitar o mantener cuando cambia el filtro. */}
        {recursosFiltrados.map((recurso) => (
          <TarjetaRecurso key={recurso.id} recurso={recurso} />
        ))}
      </div>
    </section>
  );
}

export default PaginaInventario;
