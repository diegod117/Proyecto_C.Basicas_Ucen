// PaginaInventario.tsx
// Página del inventario: muestra los recursos en una grilla de tarjetas,
// para que el docente sepa qué hay y en qué cantidad operativa.
// Se puede filtrar por nombre, categoría, laboratorio y estado.
// Si ningún recurso cumple los filtros, muestra un mensaje para limpiarlos.
// Tiene sus propias rutas (React Router), dentro de /inventario:
//   /inventario         -> el listado con filtros
//   /inventario/nuevo   -> el formulario "Agregar recurso" (solo encargado)
//   /inventario/:id     -> la ficha completa de un recurso (ej: /inventario/3)
// Cubre: HU-01, HU-02, RF-02, RF-08, RNF-03

import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// La página pide los recursos al SERVICIO, no directamente a src/data/.
// Así no le importa de dónde vienen los datos (ver recursosService.ts).
import { obtenerRecursos } from '../services/recursosService';
import {
  filtrarRecursos,
  hayFiltrosActivos,
  obtenerLaboratorios,
  SIN_FILTRO,
} from '../utils/filtrosInventario';
import FiltrosInventario from '../components/FiltrosInventario';
import GrillaRecursos from '../components/GrillaRecursos';
import FichaSegunRuta from '../components/FichaSegunRuta';
import FormularioNuevoRecurso from '../components/FormularioNuevoRecurso';
import EncabezadoInventario from '../components/EncabezadoInventario';
import ContadorInventario from '../components/ContadorInventario';
import { useUsuario } from '../context/ContextoUsuario';
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

  // Un useState por cada filtro. Cada uno guarda lo que el usuario eligió.
  // Cuando cualquiera cambia, React vuelve a ejecutar esta función completa
  // y la lista filtrada de abajo se recalcula sola.
  // Como esta página sigue en pantalla mientras se mira una ficha (la ficha
  // es una ruta de ADENTRO de /inventario), los filtros no se pierden al volver.
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [categoria, setCategoria] = useState(SIN_FILTRO);
  const [laboratorio, setLaboratorio] = useState(SIN_FILTRO);
  const [estado, setEstado] = useState(SIN_FILTRO);

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

  // Lo que se ve en /inventario: el listado con filtros
  const contenidoListado = (
    <>
      {/* Encabezado de página (D17): título, descripción y el botón
          "+ Agregar recurso", que solo ve el encargado (RNF-03) */}
      <EncabezadoInventario
        mostrarBotonAgregar={puedeAgregarRecurso(usuario.rol)}
        onAgregar={() => navegar('/inventario/nuevo')}
      />

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

      <ContadorInventario
        cantidadMostrada={recursosFiltrados.length}
        cantidadTotal={listaRecursos.length}
        hayFiltrosActivos={filtrosActivos}
        onLimpiarFiltros={limpiarFiltros}
      />

      {/* La grilla decide sola si muestra las tarjetas o el mensaje vacío */}
      <GrillaRecursos
        recursos={recursosFiltrados}
        onSeleccionarRecurso={abrirFicha}
        onLimpiarFiltros={limpiarFiltros}
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
