// PaginaInventario.tsx
// Página del inventario: muestra los recursos en una grilla de tarjetas,
// para que el docente sepa qué hay y en qué cantidad operativa.
// Se puede filtrar por nombre, categoría, laboratorio y estado, y el
// listado se muestra de 9 en 9 (paginación).
// Si ningún recurso cumple los filtros, muestra un mensaje para limpiarlos.
// Tiene sus propias rutas (React Router), dentro de /inventario:
//   /inventario         -> el listado con filtros y paginación
//   /inventario/nuevo   -> el formulario "Agregar recurso" (solo encargado)
//   /inventario/:id     -> la ficha completa de un recurso (ej: /inventario/3)
// Cubre: HU-01, HU-02, RF-02, RF-08, RNF-03

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FiltrosInventario from '../components/FiltrosInventario';
import GrillaRecursos from '../components/GrillaRecursos';
import Paginacion from '../components/Paginacion';
import FichaSegunRuta from '../components/FichaSegunRuta';
import FormularioNuevoRecurso from '../components/FormularioNuevoRecurso';
import EncabezadoInventario from '../components/EncabezadoInventario';
import ContadorInventario from '../components/ContadorInventario';
import { useUsuario } from '../context/ContextoUsuario';
import { useFiltrosInventario } from '../hooks/useFiltrosInventario';
import { puedeAgregarRecurso } from '../utils/permisos';
import './PaginaInventario.css';

interface PropsPaginaInventario {
  // Viene de App. Se llama cuando se guarda un cambio de estado, para que
  // App recalcule las alertas del menú y redibuje la página (HU-02, HU-05).
  onInventarioCambiado: () => void;
}

// Componente PaginaInventario
// Recibe: la función para avisar a App que el inventario cambió.
// Devuelve: el listado, la ficha o el formulario, según la ruta.
function PaginaInventario(props: PropsPaginaInventario) {
  // El usuario conectado viene del contexto: decide si se ve el botón
  // "+ Agregar recurso" (RNF-03).
  const usuario = useUsuario();

  // Función de React Router para cambiar de ruta desde el código.
  const navegar = useNavigate();

  // Hook personalizado con los filtros, la paginación y la lista filtrada
  // (ver hooks/useFiltrosInventario.ts). Sus useState viven en ESTA página,
  // que sigue en pantalla mientras se mira una ficha (la ficha es una ruta
  // de ADENTRO de /inventario): por eso los filtros y la página no se
  // pierden al volver.
  const filtros = useFiltrosInventario();

  // abrirFicha
  // Recibe: el id del recurso en que el usuario hizo clic. No devuelve nada.
  // Cambia la URL a /inventario/<id>; la ruta de abajo dibuja la ficha.
  function abrirFicha(idRecurso: number) {
    navegar('/inventario/' + idRecurso);
    // Subimos al inicio de la página, por si el usuario estaba más abajo
    window.scrollTo(0, 0);
  }

  // volverAlListado
  // No recibe ni devuelve nada: vuelve a /inventario (el listado).
  function volverAlListado() {
    navegar('/inventario');
  }

  // recursoAgregado
  // Recibe: el id del recurso que se acaba de agregar. No devuelve nada.
  // Avisa a App (para recalcular las alertas, por si el recurso nuevo ya
  // está bajo su stock mínimo) y abre su ficha.
  function recursoAgregado(idRecurso: number) {
    props.onInventarioCambiado();
    abrirFicha(idRecurso);
  }

  // Lo que se ve en /inventario/nuevo: el formulario solo para quien puede
  // agregar recursos. Si otro rol escribe la URL a mano, vuelve al listado.
  let contenidoNuevoRecurso = <Navigate to="/inventario" replace />;
  if (puedeAgregarRecurso(usuario.rol)) {
    contenidoNuevoRecurso = (
      <FormularioNuevoRecurso onGuardado={recursoAgregado} onCancelar={volverAlListado} />
    );
  }

  // Lo que se ve en /inventario: el listado con filtros y paginación
  const contenidoListado = (
    <>
      {/* Encabezado de página (D17): título, descripción y el botón
          "+ Agregar recurso", que solo ve el encargado (RNF-03) */}
      <EncabezadoInventario
        mostrarBotonAgregar={puedeAgregarRecurso(usuario.rol)}
        onAgregar={() => navegar('/inventario/nuevo')}
      />

      {/* Le pasamos a FiltrosInventario los valores actuales y las funciones
          para cambiarlos. Cuando el usuario cambia un filtro, el componente
          llama a la función y el estado de ESTA página cambia. */}
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

      <ContadorInventario
        cantidadMostrada={filtros.cantidadFiltrada}
        cantidadTotal={filtros.cantidadTotal}
        hayFiltrosActivos={filtros.hayFiltrosActivos}
        onLimpiarFiltros={filtros.limpiarFiltros}
      />

      {/* La grilla decide sola si muestra las tarjetas o el mensaje vacío.
          Recibe solo los recursos de la página actual. */}
      <GrillaRecursos
        recursos={filtros.recursosDeLaPagina}
        onSeleccionarRecurso={abrirFicha}
        onLimpiarFiltros={filtros.limpiarFiltros}
      />

      <Paginacion
        paginaActual={filtros.paginaActual}
        totalPaginas={filtros.totalPaginas}
        onCambiarPagina={filtros.cambiarPagina}
      />
    </>
  );

  return (
    <section className="contenido-pagina">
      {/* Rutas de ADENTRO de /inventario. Los path son relativos:
          - index      = /inventario (exacto)
          - "nuevo"    = /inventario/nuevo
          - ":idRecurso" = /inventario/3, /inventario/7... El ":" significa
            "esta parte cambia"; FichaSegunRuta la lee con useParams.
          React Router prefiere "nuevo" antes que ":idRecurso", porque un
          texto fijo le gana a uno que cambia. */}
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
