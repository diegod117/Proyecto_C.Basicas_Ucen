// FiltrosInventario.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La barra de FILTROS del inventario: un buscador por nombre y tres menús
// desplegables (categoría, laboratorio y estado).
// En la guía: paso 4 (formularios controlados) y paso 3 (props con funciones).
// Cubre: HU-01 (filtros por nombre, categoría, laboratorio y estado), RF-08

import { listaEstadosRecurso, textoEstado } from '../utils/inventario';
// Las categorías ahora se piden al servicio de configuración (Firestore).
import { obtenerCategorias } from '../services/configuracionService';
import { SIN_FILTRO } from '../utils/filtrosInventario';
import './FiltrosInventario.css';

// IDEA IMPORTANTE: este componente NO tiene memoria (no usa useState).
// Lo que está elegido en cada filtro lo guarda la PÁGINA (el papá).
// Este componente solo:
//   - MUESTRA lo que el papá le dice (props con valores), y
//   - AVISA cuando la persona cambia algo (props con funciones).
// "Los datos bajan por props y los avisos suben por funciones."
// Es el mismo patrón que MenuNavegacion. ¡Es EL patrón de React! (ver guía, paso 3)
interface PropsFiltrosInventario {
  // Lo que está elegido ahora en cada filtro.
  textoBusqueda: string;
  categoria: string;
  laboratorio: string;
  estado: string;
  // Los laboratorios que existen (ej: ["B307", "B308", "C210"]), para el menú.
  laboratoriosDisponibles: string[];
  // Las funciones para avisarle a la página que un filtro cambió.
  // "(texto: string) => void" = recibe un texto y no devuelve nada.
  onCambiarTexto: (texto: string) => void;
  onCambiarCategoria: (categoria: string) => void;
  onCambiarLaboratorio: (laboratorio: string) => void;
  onCambiarEstado: (estado: string) => void;
}

// Componente FiltrosInventario
// Recibe: lo elegido en cada filtro, los laboratorios y las 4 funciones.
// Devuelve: la barra con los 4 filtros.
function FiltrosInventario(props: PropsFiltrosInventario) {
  return (
    <div className="filtros-inventario">
      <div className="campo-filtro">
        {/* htmlFor une la etiqueta con su cajita (en HTML normal se escribe "for"). */}
        <label htmlFor="filtro-nombre">Buscar por nombre</label>
        {/* Cajita CONTROLADA:
              value = lo que dice la página que hay escrito,
              onChange = cada letra nueva se la avisamos a la página.
            placeholder = el texto gris de ejemplo que se ve cuando está vacía. */}
        <input
          id="filtro-nombre"
          type="text"
          placeholder="Ej: termómetro, arduino..."
          value={props.textoBusqueda}
          onChange={(evento) => props.onCambiarTexto(evento.target.value)}
        />
      </div>

      <div className="campo-filtro">
        <label htmlFor="filtro-categoria">Categoría</label>
        {/* Un menú desplegable (<select>) se controla igual: value + onChange. */}
        <select
          id="filtro-categoria"
          value={props.categoria}
          onChange={(evento) => props.onCambiarCategoria(evento.target.value)}
        >
          {/* La primera opción: "Todas" = sin filtro. */}
          <option value={SIN_FILTRO}>Todas</option>
          {/* Una <option> por cada categoría, fabricadas con .map().
              Las categorías ya no están escritas a mano: las pedimos a
              obtenerCategorias() (configuracionService), así una categoría
              nueva creada en "Configuración" aparece aquí sola.
              Cada categoría es un objeto { clave, nombre, usaStockMinimo }:
              value = la clave que se guarda por dentro ('instalacion').
              El texto entre las etiquetas = el nombre que ve la persona ("Instalación"). */}
          {obtenerCategorias().map((categoria) => (
            <option key={categoria.clave} value={categoria.clave}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="campo-filtro">
        <label htmlFor="filtro-laboratorio">Laboratorio</label>
        <select
          id="filtro-laboratorio"
          value={props.laboratorio}
          onChange={(evento) => props.onCambiarLaboratorio(evento.target.value)}
        >
          <option value={SIN_FILTRO}>Todos</option>
          {props.laboratoriosDisponibles.map((laboratorio) => (
            <option key={laboratorio} value={laboratorio}>
              {laboratorio}
            </option>
          ))}
        </select>
      </div>

      <div className="campo-filtro">
        <label htmlFor="filtro-estado">Estado</label>
        <select
          id="filtro-estado"
          value={props.estado}
          onChange={(evento) => props.onCambiarEstado(evento.target.value)}
        >
          <option value={SIN_FILTRO}>Todos</option>
          {listaEstadosRecurso.map((estado) => (
            <option key={estado} value={estado}>
              {textoEstado(estado)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FiltrosInventario;
