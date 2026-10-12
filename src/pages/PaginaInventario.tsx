// PaginaInventario.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La página del INVENTARIO. Puede mostrar UNA de tres cosas:
//   1. El LISTADO: los filtros arriba y las tarjetas de los recursos.
//   2. La FICHA de un recurso (cuando haces clic en una tarjeta).
//   3. El formulario "AGREGAR RECURSO" (solo el encargado).
// Es como un álbum: normalmente ves todas las láminas (el listado), y si
// tocas una, la ves en grande (la ficha).
// Esta página es un "papá" que junta componentes más chicos (sus "hijos"):
// EncabezadoInventario, FiltrosInventario, ContadorInventario, GrillaRecursos,
// FichaRecurso y FormularioNuevoRecurso. Cada uno vive en su propio archivo.
// En la guía: paso 3 (componentes papá e hijo) y paso 4 (useState).
// Cubre: HU-01, HU-02, RF-02, RF-08, RNF-03

import { useState } from 'react';
// La página le pide los recursos al SERVICIO (el bodeguero), no a src/data/.
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
import FormularioNuevoRecurso from '../components/FormularioNuevoRecurso';
import EncabezadoInventario from '../components/EncabezadoInventario';
import ContadorInventario from '../components/ContadorInventario';
import type { Usuario } from '../types/Usuario';
import { puedeAgregarRecurso } from '../utils/permisos';
import './PaginaInventario.css';

// Las props que le pasa App.
interface PropsPaginaInventario {
  // Una función de App. La llamamos cuando algo cambia en el inventario,
  // para que App recalcule las alertas del menú y redibuje (HU-02, HU-05).
  onInventarioCambiado: () => void;
  // La persona conectada: decide si se ve el botón "+ Agregar recurso"
  // y se le pasa a la ficha para que decida si muestra sus formularios (RNF-03).
  usuario: Usuario;
}

// Componente PaginaInventario
// Recibe: la función para avisar a App y la persona conectada.
// Devuelve: el listado, la ficha o el formulario, según corresponda.
function PaginaInventario(props: PropsPaginaInventario) {
  // ---------------------------------------------------------------
  // LA MEMORIA DE LA PÁGINA
  // ---------------------------------------------------------------
  // Un useState por cada filtro: lo que la persona eligió en cada uno.
  // Cada vez que uno cambia, React vuelve a ejecutar ESTA función completa,
  // de arriba a abajo, y la lista filtrada se recalcula sola.
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [categoria, setCategoria] = useState(SIN_FILTRO);
  const [laboratorio, setLaboratorio] = useState(SIN_FILTRO);
  const [estado, setEstado] = useState(SIN_FILTRO);

  // El número (id) del recurso cuya ficha está abierta, o null si no hay
  // ninguna abierta (entonces se ve el listado).
  // "number | null" = un número O nada.
  // ¿Por qué guardar solo el id y no el recurso completo? Porque así, cada
  // vez que se dibuja, lo volvemos a buscar y la ficha siempre muestra los
  // datos más nuevos (por ejemplo, justo después de cambiar un estado).
  const [idRecursoSeleccionado, setIdRecursoSeleccionado] = useState<number | null>(null);

  // true mientras se muestra el formulario "Agregar recurso".
  const [agregandoRecurso, setAgregandoRecurso] = useState(false);

  // ---------------------------------------------------------------
  // CÁLCULOS (se repiten cada vez que la página se dibuja)
  // ---------------------------------------------------------------
  const listaRecursos = obtenerRecursos();
  const laboratoriosDisponibles = obtenerLaboratorios(listaRecursos);

  // El "colador" está en utils (filtrarRecursos), no aquí: la página solo
  // le entrega la lista completa y los 4 filtros, y recibe lo que pasó.
  const recursosFiltrados = filtrarRecursos(
    listaRecursos,
    textoBusqueda,
    categoria,
    laboratorio,
    estado,
  );

  const filtrosActivos = hayFiltrosActivos(textoBusqueda, categoria, laboratorio, estado);

  // limpiarFiltros
  // No recibe ni devuelve nada. Vuelve los 4 filtros a como estaban al principio.
  // Al cambiar la memoria, React redibuja y aparecen todos los recursos.
  function limpiarFiltros() {
    setTextoBusqueda('');
    setCategoria(SIN_FILTRO);
    setLaboratorio(SIN_FILTRO);
    setEstado(SIN_FILTRO);
  }

  // abrirFicha
  // Recibe: el id del recurso en que se hizo clic. No devuelve nada.
  function abrirFicha(idRecurso: number) {
    setIdRecursoSeleccionado(idRecurso);
    // window = la ventana del navegador. scrollTo(0, 0) = sube hasta arriba,
    // por si estabas más abajo en la lista.
    window.scrollTo(0, 0);
  }

  // volverAlListado
  // No recibe ni devuelve nada. Cierra la ficha (id = null) y vuelve el listado.
  // Los filtros NO se pierden, porque siguen guardados en la memoria de esta página.
  function volverAlListado() {
    setIdRecursoSeleccionado(null);
  }

  // recursoAgregado
  // Recibe: el id del recurso que se acaba de agregar. No devuelve nada.
  // Cierra el formulario, le avisa a App (por si el recurso nuevo ya tiene
  // pocas unidades y hay que mostrar una alerta) y abre su ficha.
  function recursoAgregado(idRecurso: number) {
    setAgregandoRecurso(false);
    props.onInventarioCambiado();
    abrirFicha(idRecurso);
  }

  // ---------------------------------------------------------------
  // LO QUE SE DIBUJA (3 casos posibles)
  // ---------------------------------------------------------------

  // Caso 3: el formulario "Agregar recurso", en vez del listado.
  if (agregandoRecurso) {
    return (
      <section className="contenido-pagina">
        {/* onCancelar recibe una función flecha que cierra el formulario. */}
        <FormularioNuevoRecurso
          usuario={props.usuario}
          onGuardado={recursoAgregado}
          onCancelar={() => setAgregandoRecurso(false)}
        />
      </section>
    );
  }

  // Caso 2: hay una ficha abierta -> mostramos SOLO la ficha.
  // Buscamos el recurso por su id. Si por alguna razón no existe
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

  // Caso 1 (el normal): el listado.
  return (
    <section className="contenido-pagina">
      {/* El encabezado (D17): el título, la descripción y el botón
          "+ Agregar recurso", que solo ve el encargado (RNF-03). */}
      <EncabezadoInventario
        mostrarBotonAgregar={puedeAgregarRecurso(props.usuario.rol)}
        onAgregar={() => setAgregandoRecurso(true)}
      />

      {/* Los filtros. Le pasamos lo que hay elegido ahora Y las funciones
          "set" para cambiarlo. Cuando la persona cambia un filtro, el hijo
          (FiltrosInventario) llama a la función, y cambia la memoria de
          ESTA página (el papá). Así el papá siempre manda. */}
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

      {/* "Mostrando 3 de 10 recursos" + el botón "Limpiar filtros". */}
      <ContadorInventario
        cantidadMostrada={recursosFiltrados.length}
        cantidadTotal={listaRecursos.length}
        hayFiltrosActivos={filtrosActivos}
        onLimpiarFiltros={limpiarFiltros}
      />

      {/* La grilla de tarjetas. Ella sola decide si muestra las tarjetas o
          el mensaje "no hay resultados". */}
      <GrillaRecursos
        recursos={recursosFiltrados}
        onSeleccionarRecurso={abrirFicha}
        onLimpiarFiltros={limpiarFiltros}
      />
    </section>
  );
}

export default PaginaInventario;
