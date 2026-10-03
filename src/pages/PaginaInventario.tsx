// PaginaInventario.tsx
// Página del inventario. Por ahora muestra una VISTA PREVIA de la
// tarjeta de un recurso, para probar el componente TarjetaRecurso.
// En J4 se reemplaza por el listado completo, y luego se agregan los filtros.
// Cubre: HU-01 (en progreso), RF-02

// La página pide los recursos al SERVICIO, no directamente a src/data/.
// Así no le importa de dónde vienen los datos (ver recursosService.ts).
import { obtenerRecursos, obtenerRecursoPorId } from '../services/recursosService';
import TarjetaRecurso from '../components/TarjetaRecurso';
import './PaginaInventario.css';

// Componente PaginaInventario
// No recibe props. Devuelve el contenido de la página de inventario.
function PaginaInventario() {
  const listaRecursos = obtenerRecursos();

  // Recurso de ejemplo para la vista previa: el Arduino (id 4),
  // porque tiene dos estados con unidades (disponible y en uso).
  const recursoEjemplo = obtenerRecursoPorId(4);

  return (
    <section className="contenido-pagina">
      <h2>Inventario</h2>
      <p>Pendiente: HU-01 (listado del inventario con filtros).</p>
      {/* ".length" es la cantidad de elementos que tiene la lista */}
      <p className="texto-secundario">
        Recursos de prueba cargados: {listaRecursos.length}
      </p>

      {/* obtenerRecursoPorId puede devolver undefined (si no existe el id).
          Con "recursoEjemplo &&" la tarjeta solo se dibuja si el recurso
          existe. Si es undefined, React no muestra nada. */}
      <div className="vista-previa-tarjeta">
        {recursoEjemplo && <TarjetaRecurso recurso={recursoEjemplo} />}
      </div>
    </section>
  );
}

export default PaginaInventario;
