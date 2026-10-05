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
import GrillaRecursos from '../components/GrillaRecursos';
import FichaRecurso from '../components/FichaRecurso';
import type { Usuario } from '../types/Usuario';
import './PaginaInventario.css';

interface PropsPaginaInventario {
  // Viene de App. Se llama cuando se guarda un cambio de estado, para que
  // App recalcule las alertas del menú y redibuje la página (HU-02, HU-05).
  onInventarioCambiado: () => void;
  // Usuario conectado. La página no lo usa: solo se lo pasa a la ficha,
  // que decide si muestra el formulario de cambio de estado (RNF-03).
  usuario: Usuario;
}

// Componente PaginaInventario
// Recibe: la función para avisar a App que el inventario cambió y el usuario conectado.
// Devuelve: el contenido de la página de inventario.
function PaginaInventario(props: PropsPaginaInventario) {
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

  // Si hay una ficha abierta, mostramos SOLO la ficha (en vez del listado).
  // Buscamos el recurso por su id; si por algún motivo no existe
  // (undefined), no entramos al if y se muestra el listado normal.
  if (idRecursoSeleccionado !== null) {
    const recursoSeleccionado = obtenerRecursoPorId(idRecursoSeleccionado);
    if (recursoSeleccionado) {
      return (
        <section className="contenido-pagina">
          <FichaRecurso
            recurso={recursoSeleccionado}
            onVolver={volverAlListado}
            onEstadoCambiado={props.onInventarioCambiado}
            usuario={props.usuario}
          />
        </section>
      );
    }
  }

  return (
    <section className="contenido-pagina">
      {/* Encabezado de página (D17): título grande y una línea de descripción
          en gris. Las demás páginas usan las mismas clases (encabezado-pagina). */}
      <header className="encabezado-pagina">
        <h2 className="encabezado-pagina-titulo">Inventario</h2>
        <p className="encabezado-pagina-descripcion">
          Recursos de los laboratorios de las torres B y C
        </p>
      </header>

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

      {/* La grilla decide sola si muestra las tarjetas o el mensaje vacío */}
      <GrillaRecursos
        recursos={recursosFiltrados}
        onSeleccionarRecurso={abrirFicha}
        onLimpiarFiltros={limpiarFiltros}
      />
    </section>
  );
}

export default PaginaInventario;
