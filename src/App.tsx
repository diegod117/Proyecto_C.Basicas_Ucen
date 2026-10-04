// App.tsx
// Componente principal de la aplicación.
// Si nadie ha iniciado sesión, muestra la pantalla de login.
// Si hay sesión, muestra el menú arriba y, debajo, la página que el usuario eligió.
// Cubre: navegación base e inicio de sesión con roles (sección 3.4 de requerimientos)

import { useState, useEffect } from 'react';
import type { Pagina } from './types/Pagina';
import type { Usuario } from './types/Usuario';
import MenuNavegacion from './components/MenuNavegacion';
import PaginaInventario from './pages/PaginaInventario';
import PaginaReservas from './pages/PaginaReservas';
import PaginaIncidencias from './pages/PaginaIncidencias';
import PaginaAlertas from './pages/PaginaAlertas';
import PaginaLogin from './pages/PaginaLogin';
import { generarAlertas } from './utils/alertas';
import { escucharSesion, cerrarSesion } from './services/authService';

// Componente App
// No recibe props. Devuelve la aplicación completa (menú + página actual).
function App() {
  // useState guarda un dato que, al cambiar, hace que React vuelva a
  // dibujar la pantalla. Aquí guardamos qué página se está mostrando.
  //   - paginaActual: el valor actual (parte en 'inventario')
  //   - setPaginaActual: la función para cambiarlo
  // "<Pagina>" le dice a TypeScript que este dato solo puede ser
  // 'inventario', 'reservas', 'incidencias' o 'alertas' (ver types/Pagina.ts).
  const [paginaActual, setPaginaActual] = useState<Pagina>('inventario');

  // Contador de cambios en el inventario (HU-02).
  // Cuando el encargado cambia el estado de un recurso, el servicio modifica
  // los datos, pero React no se entera solo. Al sumar 1 a este contador,
  // App se vuelve a dibujar completa: recalcula las alertas del menú y
  // también redibuja la página de inventario con los números nuevos.
  const [cambiosInventario, setCambiosInventario] = useState(0);

  // Usuario que inició sesión, o null si no hay nadie conectado.
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  // true mientras Firebase revisa si ya había una sesión guardada.
  // Sin esto, al recargar la página se vería el login por un instante
  // aunque el usuario ya estuviera conectado.
  const [revisandoSesion, setRevisandoSesion] = useState(true);

  // useEffect ejecuta código DESPUÉS de dibujar la pantalla.
  // Con el arreglo vacío [] al final, se ejecuta UNA sola vez, al abrir la app.
  // Aquí empezamos a escuchar los cambios de sesión de Firebase: cada vez
  // que alguien inicia o cierra sesión, se actualiza usuarioActual.
  useEffect(() => {
    const dejarDeEscuchar = escucharSesion((usuario) => {
      setUsuarioActual(usuario);
      setRevisandoSesion(false);
    });

    // Lo que devuelve un useEffect se ejecuta cuando el componente se
    // quita de la pantalla. Así dejamos de escuchar y no queda "colgado".
    return dejarDeEscuchar;
  }, []);

  // registrarCambioInventario
  // No recibe ni devuelve nada. La llama la página de inventario
  // (a través de sus props) cada vez que se guarda un cambio de estado.
  function registrarCambioInventario() {
    setCambiosInventario(cambiosInventario + 1);
  }

  // Cantidad de alertas activas calculadas automáticamente a partir
  // del inventario (HU-05). Se le pasa al menú como prop numérica.
  // Como se calcula en cada dibujo de App, se actualiza sola cuando
  // cambia cambiosInventario (por ejemplo, si un recurso pasa a "dañado").
  const totalAlertas = generarAlertas().length;

  // manejarCerrarSesion
  // No recibe ni devuelve nada. La llama el botón "Cerrar sesión" del menú.
  // Volvemos a la página de inventario para que el próximo usuario
  // parta desde el inicio. App vuelve al login sola gracias a escucharSesion.
  async function manejarCerrarSesion() {
    setPaginaActual('inventario');
    await cerrarSesion();
  }

  // Decide qué página mostrar según el valor de paginaActual.
  // No recibe nada. Devuelve el componente de la página que corresponde.
  function mostrarPaginaActual() {
    if (paginaActual === 'inventario') {
      return <PaginaInventario onInventarioCambiado={registrarCambioInventario} />;
    } else if (paginaActual === 'reservas') {
      return <PaginaReservas />;
    } else if (paginaActual === 'incidencias') {
      return <PaginaIncidencias />;
    } else {
      return <PaginaAlertas />;
    }
  }

  // Mientras Firebase responde, mostramos un aviso simple.
  if (revisandoSesion) {
    return <p className="contenido-pagina texto-secundario">Cargando...</p>;
  }

  // Sin sesión: solo se puede ver la pantalla de login.
  if (usuarioActual === null) {
    return <PaginaLogin />;
  }

  return (
    <div>
      {/* Le pasamos al menú la página actual, la función para cambiarla,
          el contador de alertas (HU-05) y el usuario conectado. */}
      <MenuNavegacion
        paginaActual={paginaActual}
        onCambiarPagina={setPaginaActual}
        cantidadAlertas={totalAlertas}
        usuario={usuarioActual}
        onCerrarSesion={manejarCerrarSesion}
      />

      <main>{mostrarPaginaActual()}</main>
    </div>
  );
}

export default App;
