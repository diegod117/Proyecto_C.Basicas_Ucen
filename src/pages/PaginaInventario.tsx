// PaginaInventario.tsx
// Página del inventario. Por ahora es solo un borrador:
// muestra cuántos recursos de prueba hay, para comprobar que los datos cargan.
// Aquí se construirá el listado con filtros.
// Cubre: HU-01 (pendiente), RF-02

// La página pide los recursos al SERVICIO, no directamente a src/data/.
// Así no le importa de dónde vienen los datos (ver recursosService.ts).
import { obtenerRecursos } from '../services/recursosService';

// Componente PaginaInventario
// No recibe props. Devuelve el contenido de la página de inventario.
function PaginaInventario() {
  const listaRecursos = obtenerRecursos();

  return (
    <section className="contenido-pagina">
      <h2>Inventario</h2>
      <p>Pendiente: HU-01 (listado del inventario con filtros).</p>
      {/* ".length" es la cantidad de elementos que tiene la lista */}
      <p className="texto-secundario">
        Recursos de prueba cargados: {listaRecursos.length}
      </p>
    </section>
  );
}

export default PaginaInventario;
