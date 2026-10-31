// FiltrosInventario.tsx
// Barra de filtros del inventario: buscador por nombre y listas
// desplegables para categoría, laboratorio, estado y antigüedad.
// Cubre: HU-01 (filtros por nombre, categoría, laboratorio y estado), RF-08,
//        RF-12 y HU-13 (filtro por antigüedad)

import { listaEstadosRecurso, textoEstado } from '../utils/inventario';
import { obtenerCategorias } from '../services/configuracionService';
import { SIN_FILTRO } from '../utils/filtrosInventario';
import { opcionesAntiguedad } from '../utils/antiguedad';
import './FiltrosInventario.css';

// Este componente NO guarda los filtros: los guarda la página (con useState).
// El componente solo los MUESTRA (props con los valores) y AVISA cuando el
// usuario cambia algo (props con funciones). Es el mismo patrón que usamos
// en MenuNavegacion: los datos bajan por props y los cambios suben por funciones.
interface PropsFiltrosInventario {
  // Valores actuales de cada filtro
  textoBusqueda: string;
  categoria: string;
  laboratorio: string;
  estado: string;
  antiguedad: string;
  // Laboratorios que existen (ej: ["B307", "B308", "C210"]), para las opciones
  laboratoriosDisponibles: string[];
  // Funciones para avisarle a la página que un filtro cambió
  onCambiarTexto: (texto: string) => void;
  onCambiarCategoria: (categoria: string) => void;
  onCambiarLaboratorio: (laboratorio: string) => void;
  onCambiarEstado: (estado: string) => void;
  onCambiarAntiguedad: (antiguedad: string) => void;
}

// Componente FiltrosInventario
// Recibe: los valores de los filtros, los laboratorios y las funciones de cambio.
// Devuelve: la barra con los 5 filtros.
function FiltrosInventario(props: PropsFiltrosInventario) {
  return (
    <div className="filtros-inventario">
      <div className="campo-filtro">
        {/* htmlFor conecta el label con el input (en HTML es "for") */}
        <label htmlFor="filtro-nombre">Buscar por nombre</label>
        {/* Input controlado: el valor viene de las props y cada letra
            escrita se avisa a la página con onCambiarTexto */}
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
        {/* Un <select> también se controla con value + onChange */}
        <select
          id="filtro-categoria"
          value={props.categoria}
          onChange={(evento) => props.onCambiarCategoria(evento.target.value)}
        >
          <option value={SIN_FILTRO}>Todas</option>
          {/* Una <option> por cada categoría. El "value" es lo que se guarda
              ('instalacion') y el texto es lo que ve el usuario ("Instalación") */}
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

      <div className="campo-filtro">
        <label htmlFor="filtro-antiguedad">Antigüedad</label>
        {/* Las opciones salen de utils/antiguedad.ts (HU-13) */}
        <select
          id="filtro-antiguedad"
          value={props.antiguedad}
          onChange={(evento) => props.onCambiarAntiguedad(evento.target.value)}
        >
          <option value={SIN_FILTRO}>Todas</option>
          {opcionesAntiguedad.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FiltrosInventario;
