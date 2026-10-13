// PaginaInventario.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La página del INVENTARIO. Puede mostrar UNA de tres cosas, según la
// DIRECCIÓN (URL) del navegador:
//   /inventario         -> el LISTADO: los filtros arriba, las tarjetas de
//                          los recursos y los botones de página abajo
//                          (se muestran de 9 en 9: "paginación").
//   /inventario/3       -> la FICHA del recurso número 3 (al hacer clic en
//                          una tarjeta).
//   /inventario/nuevo   -> el formulario "AGREGAR RECURSO" (solo el encargado).
// Es como un álbum: normalmente ves todas las láminas (el listado), y si
// tocas una, la ves en grande (la ficha).
// Esta página es un "papá" que junta componentes más chicos (sus "hijos"):
// EncabezadoInventario, FiltrosInventario, ContadorInventario, GrillaRecursos,
// Paginacion, FichaSegunRuta y FormularioNuevoRecurso. Cada uno vive en su
// propio archivo.
// En la guía: paso 3 (componentes papá e hijo), paso 10 (rutas de adentro)
// y paso 11 (el hook useFiltrosInventario y la paginación).
// Cubre: HU-01, HU-02, RF-02, RF-08, RNF-03

// Piezas de React Router (ver guía, paso 10).
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FiltrosInventario from '../components/FiltrosInventario';
import GrillaRecursos from '../components/GrillaRecursos';
import Paginacion from '../components/Paginacion';
import FichaSegunRuta from '../components/FichaSegunRuta';
import FormularioNuevoRecurso from '../components/FormularioNuevoRecurso';
import EncabezadoInventario from '../components/EncabezadoInventario';
import ContadorInventario from '../components/ContadorInventario';
import { useUsuario } from '../context/ContextoUsuario';
// NUESTRO hook con toda la memoria de los filtros y la paginación (paso 11).
import { useFiltrosInventario } from '../hooks/useFiltrosInventario';
import { puedeAgregarRecurso } from '../utils/permisos';
import './PaginaInventario.css';

// Las props que le pasa App.
interface PropsPaginaInventario {
  // Una función de App. La llamamos cuando algo cambia en el inventario,
  // para que App recalcule las alertas del menú y redibuje (HU-02, HU-05).
  onInventarioCambiado: () => void;
}

// Componente PaginaInventario
// Recibe: la función para avisar a App que el inventario cambió.
// Devuelve: el listado, la ficha o el formulario, según la dirección.
function PaginaInventario(props: PropsPaginaInventario) {
  // useUsuario() = "¿quién está conectado?" (guía, paso 6).
  // Con su rol decidimos si se ve el botón "+ Agregar recurso" (RNF-03).
  const usuario = useUsuario();

  // useNavigate = la función de React Router para cambiar de dirección
  // desde el código (ej: al hacer clic en una tarjeta). Ver guía, paso 10.
  const navegar = useNavigate();

  // ---------------------------------------------------------------
  // LA MEMORIA DE LA PÁGINA (en un hook propio, ver guía, paso 11)
  // ---------------------------------------------------------------
  // Antes aquí había 4 useState (uno por filtro) y los cálculos del colador.
  // Ahora están todos guardados en UN hook nuestro: useFiltrosInventario.
  // Es como guardar los útiles en un estuche en vez de tenerlos sueltos.
  // "filtros" es un objeto con todo: filtros.categoria, filtros.cambiarPagina,
  // filtros.recursosDeLaPagina, etc.
  // ¿Por qué no se pierden los filtros al abrir una ficha y volver? Porque
  // la ficha es una dirección de ADENTRO de /inventario: esta página nunca
  // desaparece, así que su memoria (la del hook) sigue ahí.
  const filtros = useFiltrosInventario();

  // abrirFicha
  // Recibe: el id del recurso en que se hizo clic. No devuelve nada.
  // Cambia la dirección a /inventario/<id> (ej: /inventario/3), y la
  // <Route path=":idRecurso"> de más abajo dibuja la ficha.
  function abrirFicha(idRecurso: number) {
    navegar('/inventario/' + idRecurso);
    // window = la ventana del navegador. scrollTo(0, 0) = sube hasta arriba,
    // por si estabas más abajo en la lista.
    window.scrollTo(0, 0);
  }

  // volverAlListado
  // No recibe ni devuelve nada. Vuelve a /inventario (el listado).
  function volverAlListado() {
    navegar('/inventario');
  }

  // recursoAgregado
  // Recibe: el id del recurso que se acaba de agregar. No devuelve nada.
  // Le avisa a App (por si el recurso nuevo ya tiene pocas unidades y hay
  // que mostrar una alerta) y abre su ficha.
  function recursoAgregado(idRecurso: number) {
    props.onInventarioCambiado();
    abrirFicha(idRecurso);
  }

  // ---------------------------------------------------------------
  // LO QUE SE VE EN CADA DIRECCIÓN
  // ---------------------------------------------------------------
  // Preparamos cada pedazo de pantalla en una variable, y al final el
  // <Routes> elige cuál dibujar.

  // En /inventario/nuevo: el formulario, SOLO si el rol puede agregar.
  // Partimos con un "desvío" al listado (por si un docente escribe la
  // dirección a mano) y, si el rol puede, lo cambiamos por el formulario.
  let contenidoNuevoRecurso = <Navigate to="/inventario" replace />;
  if (puedeAgregarRecurso(usuario.rol)) {
    contenidoNuevoRecurso = (
      <FormularioNuevoRecurso onGuardado={recursoAgregado} onCancelar={volverAlListado} />
    );
  }

  // En /inventario: el listado con filtros y paginación.
  // <> ... </> = una caja invisible para juntar varios componentes.
  const contenidoListado = (
    <>
      {/* El encabezado (D17): el título, la descripción y el botón
          "+ Agregar recurso", que solo ve el encargado (RNF-03).
          Al apretarlo, vamos a la dirección /inventario/nuevo. */}
      <EncabezadoInventario
        mostrarBotonAgregar={puedeAgregarRecurso(usuario.rol)}
        onAgregar={() => navegar('/inventario/nuevo')}
      />

      {/* Los filtros. Le pasamos lo que hay elegido ahora Y las funciones
          para cambiarlo (todo sale del hook). Cuando la persona cambia un
          filtro, el hijo (FiltrosInventario) llama a la función, y cambia
          la memoria del hook. Así el papá siempre manda. */}
      <FiltrosInventario
        textoBusqueda={filtros.textoBusqueda}
        categoria={filtros.categoria}
        laboratorio={filtros.laboratorio}
        estado={filtros.estado}
        laboratoriosDisponibles={filtros.laboratoriosDisponibles}
        onCambiarTexto={filtros.cambiarTexto}
        onCambiarCategoria={filtros.cambiarCategoria}
        onCambiarLaboratorio={filtros.cambiarLaboratorio}
        onCambiarEstado={filtros.cambiarEstado}
      />

      {/* "Mostrando 3 de 10 recursos" + el botón "Limpiar filtros". */}
      <ContadorInventario
        cantidadMostrada={filtros.cantidadFiltrada}
        cantidadTotal={filtros.cantidadTotal}
        hayFiltrosActivos={filtros.hayFiltrosActivos}
        onLimpiarFiltros={filtros.limpiarFiltros}
      />

      {/* La grilla de tarjetas. Ella sola decide si muestra las tarjetas o
          el mensaje "no hay resultados". OJO: recibe solo los recursos de
          la PÁGINA actual (máximo 9), no todos. */}
      <GrillaRecursos
        recursos={filtros.recursosDeLaPagina}
        onSeleccionarRecurso={abrirFicha}
        onLimpiarFiltros={filtros.limpiarFiltros}
      />

      {/* Los botones "← Anterior  1 2  Siguiente →" (pedido del profesor). */}
      <Paginacion
        paginaActual={filtros.paginaActual}
        totalPaginas={filtros.totalPaginas}
        onCambiarPagina={filtros.cambiarPagina}
      />
    </>
  );

  return (
    <section className="contenido-pagina">
      {/* Las direcciones de ADENTRO de /inventario (rutas anidadas, paso 10).
          Se escriben SIN "/inventario" adelante, porque App ya lo puso:
          - index        = /inventario justo (sin nada más)
          - "nuevo"      = /inventario/nuevo
          - ":idRecurso" = /inventario/3, /inventario/7... Los dos puntos ":"
            significan "esta parte cambia, y se llama idRecurso".
            FichaSegunRuta la lee con useParams.
          ¿Y si escriben /inventario/nuevo, no confunde "nuevo" con un id?
          No: React Router prefiere el texto FIJO ("nuevo") antes que el que
          cambia (":idRecurso"). */}
      <Routes>
        <Route index element={contenidoListado} />
        <Route path="nuevo" element={contenidoNuevoRecurso} />
        <Route
          path=":idRecurso"
          element={
            <FichaSegunRuta onVolver={volverAlListado} onEstadoCambiado={props.onInventarioCambiado} />
          }
        />
      </Routes>
    </section>
  );
}

export default PaginaInventario;
