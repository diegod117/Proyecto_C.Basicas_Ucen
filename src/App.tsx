// App.tsx
// Componente principal de la aplicación.
// Si nadie ha iniciado sesión, muestra la pantalla de login (ruta /login).
// Si hay sesión, primero descarga los datos desde Firestore (CargadorDatos)
// y luego muestra el menú y la página que corresponde a la ruta (URL):
//   /inventario (y /inventario/nuevo, /inventario/:id), /reservas,
//   /incidencias, /alertas y /configuracion.
// El usuario conectado se comparte con toda la app con ContextoUsuario.
// Cubre: navegación base con React Router, inicio de sesión con roles
//        (sección 3.4 de requerimientos), RNF-03 y RNF-06 (datos de Firestore)

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { Pagina } from './types/Pagina';
import type { Usuario } from './types/Usuario';
import MenuNavegacion from './components/MenuNavegacion';
import PaginaInventario from './pages/PaginaInventario';
import PaginaReservas from './pages/PaginaReservas';
import PaginaIncidencias from './pages/PaginaIncidencias';
import PaginaAlertas from './pages/PaginaAlertas';
import PaginaLogin from './pages/PaginaLogin';
import PaginaConfiguracion from './pages/PaginaConfiguracion';
import CargadorDatos from './components/CargadorDatos';
import { ContextoUsuario } from './context/ContextoUsuario';
import { generarAlertas } from './utils/alertas';
import { escucharSesion, cerrarSesion } from './services/authService';
import { puedeVerPagina } from './utils/permisos';

// paginaSiPuede
// Recibe: el usuario conectado, la página y lo que hay que mostrar.
// Devuelve: la página si su rol puede verla (RNF-03), o una redirección al
// inventario si no puede. Así, aunque un docente escriba /alertas a mano en
// la barra del navegador, no entra.
// <Navigate> es un componente de React Router que, al dibujarse, cambia la
// URL. "replace" reemplaza la URL en el historial (el botón "Atrás" del
// navegador no vuelve a la página prohibida).
function paginaSiPuede(usuario: Usuario, pagina: Pagina, contenido: ReactNode): ReactNode {
  if (puedeVerPagina(usuario.rol, pagina)) {
    return contenido;
  } else {
    return <Navigate to="/inventario" replace />;
  }
}

// Componente App
// No recibe props. Devuelve la aplicación completa (menú + página de la ruta).
function App() {
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

  // Minutos desde que se abrió la app. No se muestra en pantalla: solo
  // sirve para que App se vuelva a dibujar cada minuto (ver useEffect de abajo).
  const [, setMinutosTranscurridos] = useState(0);

  // useNavigate es un hook de React Router: devuelve una función para
  // cambiar de ruta desde el código (por ejemplo, después de cerrar sesión).
  const navegar = useNavigate();

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

  // Cada minuto volvemos a dibujar la app. Los estados de las reservas
  // (Programada / En curso / Realizada) se calculan con la hora actual:
  // así, cuando termina la hora de una reserva, pasa sola al historial y
  // sus unidades vuelven a contar como disponibles, sin recargar la página.
  // setInterval repite una función cada cierto tiempo (60000 ms = 1 minuto).
  // Lo que devuelve el useEffect (clearInterval) detiene la repetición si
  // App desaparece, para que no quede corriendo.
  useEffect(() => {
    const repeticion = setInterval(() => {
      setMinutosTranscurridos((valorAnterior) => valorAnterior + 1);
    }, 60000);
    return () => clearInterval(repeticion);
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
  // Volvemos a /inventario para que el próximo usuario parta desde el inicio.
  // App muestra el login sola gracias a escucharSesion.
  async function manejarCerrarSesion() {
    navegar('/inventario');
    await cerrarSesion();
  }

  // Mientras Firebase responde, mostramos un aviso simple.
  if (revisandoSesion) {
    return <p className="contenido-pagina texto-secundario">Cargando...</p>;
  }

  // Sin sesión: la única ruta es /login. Cualquier otra URL redirige ahí.
  if (usuarioActual === null) {
    return (
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    // ContextoUsuario.Provider "publica" el usuario conectado: cualquier
    // componente de adentro lo lee con useUsuario(), sin recibirlo por props.
    <ContextoUsuario.Provider value={usuarioActual}>
      {/* CargadorDatos descarga los datos desde Firestore y recién entonces
          muestra lo que tiene adentro. key={correo}: si cambia el usuario,
          React crea un CargadorDatos nuevo y se vuelven a descargar los datos. */}
      <CargadorDatos key={usuarioActual.correo} onDatosListos={registrarCambioInventario}>
        {/* M17: layout de pantalla completa. MenuNavegacion devuelve el header
            (fijo arriba) y el sidebar (fijo a la izquierda). El <main> tiene la
            clase "app-contenido" para no quedar tapado (ver MenuNavegacion.css). */}
        <div className="app-layout">
          {/* El menú ya no necesita la página actual: sus enlaces (NavLink)
              saben solos cuál es la ruta activa. */}
          <MenuNavegacion cantidadAlertas={totalAlertas} onCerrarSesion={manejarCerrarSesion} />

          <main className="app-contenido">
            {/* <Routes> mira la URL y dibuja SOLO la <Route> que coincide.
                - "/inventario/*": el * deja que PaginaInventario tenga sus
                  propias rutas adentro (/inventario/nuevo y /inventario/:id).
                - "/login" con sesión iniciada: ya no hace falta, va al inventario.
                - "*": cualquier otra URL (o "/") redirige al inventario. */}
            <Routes>
              <Route
                path="/inventario/*"
                element={<PaginaInventario onInventarioCambiado={registrarCambioInventario} />}
              />
              <Route
                path="/reservas"
                element={paginaSiPuede(usuarioActual, 'reservas', <PaginaReservas />)}
              />
              <Route
                path="/incidencias"
                element={paginaSiPuede(usuarioActual, 'incidencias', <PaginaIncidencias />)}
              />
              <Route
                path="/alertas"
                element={paginaSiPuede(usuarioActual, 'alertas', <PaginaAlertas />)}
              />
              <Route
                path="/configuracion"
                element={paginaSiPuede(usuarioActual, 'configuracion', <PaginaConfiguracion />)}
              />
              <Route path="*" element={<Navigate to="/inventario" replace />} />
            </Routes>
          </main>
        </div>
      </CargadorDatos>
    </ContextoUsuario.Provider>
  );
}

export default App;
