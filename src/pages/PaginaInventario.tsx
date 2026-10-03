// PaginaInventario.tsx
// Página del inventario: muestra TODOS los recursos en una grilla de tarjetas,
// para que el docente sepa qué hay y en qué cantidad operativa.
// Más adelante se agregan los filtros (J5 y J6).
// Cubre: HU-01 (en progreso), RF-02

// La página pide los recursos al SERVICIO, no directamente a src/data/.
// Así no le importa de dónde vienen los datos (ver recursosService.ts).
import { obtenerRecursos } from '../services/recursosService';
import TarjetaRecurso from '../components/TarjetaRecurso';
import './PaginaInventario.css';

// Componente PaginaInventario
// No recibe props. Devuelve el contenido de la página de inventario.
function PaginaInventario() {
  const listaRecursos = obtenerRecursos();

  return (
    <section className="contenido-pagina">
      <div className="inventario-encabezado">
        <h2>Inventario de laboratorios</h2>
        {/* ".length" es la cantidad de elementos que tiene la lista */}
        <p className="texto-secundario">Mostrando {listaRecursos.length} recursos</p>
      </div>

      <div className="grilla-recursos">
        {/* .map() recorre la lista de recursos y por CADA recurso devuelve
            una TarjetaRecurso. Es como un for que va "fabricando" tarjetas.
            La "key" debe ser única en la lista: usamos el id del recurso,
            que nunca se repite. React la usa para saber qué tarjeta es cuál
            cuando la lista cambie (por ejemplo, al filtrar en J5). */}
        {listaRecursos.map((recurso) => (
          <TarjetaRecurso key={recurso.id} recurso={recurso} />
        ))}
      </div>
    </section>
  );
}

export default PaginaInventario;
