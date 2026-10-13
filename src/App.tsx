// App.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Es el COMPONENTE PRINCIPAL: el "director de orquesta" de toda la app.
// Decide qué se ve en la pantalla:
//   - Si nadie ha iniciado sesión -> la pantalla de login (dirección /login).
//   - Si hay sesión -> primero descarga los datos (CargadorDatos) y después
//     muestra el menú y la página que corresponde a la DIRECCIÓN (URL) del
//     navegador: /inventario, /reservas, /incidencias, /alertas o /configuracion.
// También guarda los datos que comparten varias partes de la app, por
// ejemplo quién está conectado, y lo "anuncia" a toda la app con el
// parlante ContextoUsuario.
// En la guía: paso 3 (componentes y props), paso 4 (useState),
// paso 5 (useEffect), paso 6 (useContext) y paso 10 (React Router).
// Cubre: navegación con React Router, inicio de sesión con roles
//        (sección 3.4 de requerimientos), RNF-03 y RNF-06 (datos de Firestore)

// useState y useEffect son "hooks" de React: herramientas especiales que
// le dan superpoderes a un componente (memoria y acciones automáticas).
import { useState, useEffect } from 'react';
// ReactNode = "cualquier cosa que React sabe dibujar" (un componente, un
// texto, etc.). Lo usamos como tipo en paginaSiPuede, más abajo.
import type { ReactNode } from 'react';
// Las piezas de React Router que usamos aquí (ver guía, paso 10):
//   Routes / Route -> el "mapa": qué página va en cada dirección
//   Navigate       -> te manda a otra dirección (como un letrero "desvío")
//   useNavigate    -> para cambiar de dirección desde el código
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { Pagina } from './types/Pagina';
import type { Usuario } from './types/Usuario';
// Los componentes se importan sin llaves porque cada archivo exporta
// su componente "por defecto" (export default al final del archivo).
import MenuNavegacion from './components/MenuNavegacion';
import PaginaInventario from './pages/PaginaInventario';
import PaginaReservas from './pages/PaginaReservas';
import PaginaIncidencias from './pages/PaginaIncidencias';
import PaginaAlertas from './pages/PaginaAlertas';
import PaginaLogin from './pages/PaginaLogin';
import PaginaConfiguracion from './pages/PaginaConfiguracion';
import CargadorDatos from './components/CargadorDatos';
// El "parlante" para anunciar quién está conectado (ver guía, paso 6).
import { ContextoUsuario } from './context/ContextoUsuario';
import { generarAlertas } from './utils/alertas';
import { escucharSesion, cerrarSesion } from './services/authService';
import { puedeVerPagina } from './utils/permisos';

// paginaSiPuede
// Es el GUARDIA de la puerta de cada página (RNF-03).
// Recibe: la persona conectada, qué página es y lo que hay que dibujar.
// Devuelve: la página, si su rol puede verla; si no, un "desvío" al inventario.
// ¿Para qué, si el menú ya esconde los botones prohibidos? Porque alguien
// podría escribir la dirección a mano en el navegador (ej: un docente
// escribe /alertas). El guardia lo manda de vuelta al inventario.
// <Navigate to="/inventario" replace /> = "cuando me dibujes, cámbiate a
// /inventario". "replace" = reemplaza la dirección en el historial, así el
// botón "Atrás" del navegador no lo devuelve a la página prohibida.
function paginaSiPuede(usuario: Usuario, pagina: Pagina, contenido: ReactNode): ReactNode {
  if (puedeVerPagina(usuario.rol, pagina)) {
    return contenido;
  } else {
    return <Navigate to="/inventario" replace />;
  }
}

// Componente App
// Un COMPONENTE es una función que devuelve un pedazo de pantalla (JSX).
// Su nombre empieza con MAYÚSCULA: así React sabe que es un componente.
// No recibe props (es el primero de todos, nadie se las pasa).
// Devuelve: la app completa.
function App() {
  // ---------------------------------------------------------------
  // LA MEMORIA DE APP (useState). Ver guía, paso 4.
  // ---------------------------------------------------------------
  // useState = "React, acuérdate de este dato". Cuando el dato cambia,
  // React vuelve a dibujar la pantalla solo. Es como una pizarra mágica:
  // si borras y escribes algo nuevo, todos los que la miran lo ven al tiro.
  //
  // Siempre se escribe así:  const [dato, setDato] = useState(valorInicial);
  //   - dato    = lo que hay escrito en la pizarra AHORA (solo se lee)
  //   - setDato = la ÚNICA forma de escribir algo nuevo en la pizarra
  //   - los [ ] separan las dos cosas que entrega useState (se llama "desestructurar")
  //
  // ¿Y "qué página se está mirando"? Antes era un useState aquí. Ahora lo
  // sabe la DIRECCIÓN del navegador (/reservas, /alertas...), gracias a
  // React Router. Por eso ya no está.

  // Un contador de "cambios en el inventario" (HU-02).
  // Cuando el encargado cambia un recurso, el servicio cambia los datos,
  // pero React NO se entera solo (los datos del servicio no son useState).
  // Truco: sumamos 1 a este contador. Como ES un useState, React redibuja
  // App completa, y así se recalculan las alertas del menú y los números.
  const [cambiosInventario, setCambiosInventario] = useState(0);

  // QUIÉN está conectado, o null (= nadie) si no hay sesión.
  // "Usuario | null" = puede ser un Usuario O nada.
  // ¡Este es el dato que lleva tu NOMBRE y tu ROL! Desde aquí se anuncia
  // con el parlante (ContextoUsuario, más abajo), y MenuNavegacion lo
  // escucha para dibujarlo arriba a la derecha (ver guía, pasos 6 y 9).
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  // true mientras Firebase revisa si ya había una sesión guardada.
  // Sin esto, al recargar la página se vería el login un instante
  // aunque ya estuvieras conectado.
  const [revisandoSesion, setRevisandoSesion] = useState(true);

  // Cuántos minutos van desde que se abrió la app. NO se muestra en
  // ninguna parte: solo sirve para que App se vuelva a dibujar cada minuto
  // (ver el segundo useEffect, más abajo).
  // [, setMinutosTranscurridos]: la coma al principio = "el dato no lo
  // necesito, solo quiero la función para cambiarlo".
  const [, setMinutosTranscurridos] = useState(0);

  // useNavigate es un hook de React Router: nos entrega una función para
  // CAMBIAR DE PÁGINA desde el código (sin que nadie haga clic en un enlace).
  // La usamos al cerrar sesión. Ej: navegar('/inventario').
  const navegar = useNavigate();

  // ---------------------------------------------------------------
  // ACCIONES AUTOMÁTICAS (useEffect). Ver guía, paso 5.
  // ---------------------------------------------------------------
  // useEffect = "React, haz esto DESPUÉS de dibujar la pantalla".
  // El [] vacío del final dice CUÁNDO repetirlo: con [] vacío, UNA sola vez,
  // cuando la app se abre.
  // Aquí instalamos el "timbre" de la sesión (escucharSesion, en authService):
  // cada vez que alguien entra o sale, suena, y guardamos quién es.
  useEffect(() => {
    // Le pasamos a escucharSesion una función flecha: (usuario) => { ... }.
    // Esa función se ejecuta cada vez que suena el timbre.
    const dejarDeEscuchar = escucharSesion((usuario) => {
      setUsuarioActual(usuario); // escribimos en la pizarra quién entró
      setRevisandoSesion(false); // ya terminamos de revisar
    });

    // Lo que devuelve un useEffect se ejecuta cuando el componente
    // desaparece de la pantalla: desinstalamos el timbre para que no
    // quede sonando solo.
    return dejarDeEscuchar;
  }, []);

  // El RELOJ de la app (pedido del profesor: reservas que terminan solas).
  // El estado de una reserva (Programada / En curso / Realizada) se calcula
  // mirando la hora actual. Pero React solo recalcula cuando redibuja...
  // y si nadie toca nada, no redibuja nunca. Solución: cada 1 minuto
  // sumamos 1 a setMinutosTranscurridos, y como es un useState, App se
  // redibuja. Así, cuando termina una reserva, pasa SOLA al historial y sus
  // unidades vuelven a estar disponibles, sin recargar la página.
  // setInterval(función, 60000) = "repite esta función cada 60000 ms (1 minuto)".
  // Es como una alarma que suena cada minuto.
  useEffect(() => {
    const repeticion = setInterval(() => {
      setMinutosTranscurridos((valorAnterior) => valorAnterior + 1);
    }, 60000);
    // Al desaparecer App, apagamos la alarma (clearInterval) para que no
    // quede sonando para siempre.
    return () => clearInterval(repeticion);
  }, []);

  // registrarCambioInventario
  // No recibe ni devuelve nada. La llaman las pantallas (a través de sus
  // props) cada vez que se guarda un cambio en el inventario.
  // Suma 1 al contador para que React redibuje todo (ver arriba).
  function registrarCambioInventario() {
    setCambiosInventario(cambiosInventario + 1);
  }

  // Cuántas alertas hay ahora (HU-05). Es el numerito rojo del menú.
  // No es useState: es un cálculo que se repite CADA VEZ que App se dibuja.
  // Como App se redibuja cuando cambia cambiosInventario, el número
  // siempre está al día (ej: si un recurso pasa a "dañado", sube en 1).
  // .length = cuántos elementos tiene la lista.
  const totalAlertas = generarAlertas().length;

  // manejarCerrarSesion
  // No recibe ni devuelve nada. La llama el botón "Cerrar sesión" del menú.
  // Primero volvemos a /inventario, para que la próxima persona que entre
  // parta desde el principio. No hace falta mostrar el login a mano: al
  // cerrar sesión suena el timbre, usuarioActual pasa a null y React
  // muestra el login.
  // "async" porque cerrarSesion habla con Firebase por internet.
  async function manejarCerrarSesion() {
    navegar('/inventario');
    await cerrarSesion();
  }

  // ---------------------------------------------------------------
  // LO QUE SE DIBUJA (el "return" con JSX). Ver guía, paso 3.
  // ---------------------------------------------------------------
  // Un componente puede tener varios return: el primero que se cumple gana.

  // 1) Firebase todavía está revisando: mostramos "Cargando...".
  // className es como "class" en HTML (en JSX se escribe className).
  if (revisandoSesion) {
    return <p className="contenido-pagina texto-secundario">Cargando...</p>;
  }

  // 2) No hay nadie conectado: la ÚNICA dirección que existe es /login.
  // <Routes> mira la dirección del navegador y dibuja la <Route> que calza.
  // path="*" = "cualquier otra dirección": la desviamos a /login.
  if (usuarioActual === null) {
    return (
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 3) Hay alguien conectado: la app completa.
  return (
    // EL PARLANTE (useContext, ver guía, paso 6).
    // ContextoUsuario.Provider "anuncia" a la persona conectada a TODOS los
    // componentes que están adentro (o sea, toda la app). Cualquiera de
    // ellos la puede escuchar escribiendo useUsuario(), sin que se la
    // pasemos por props de papá a hijo a nieto...
    // value={usuarioActual} = lo que se anuncia por el parlante.
    <ContextoUsuario.Provider value={usuarioActual}>
      {/* Así se escribe un comentario DENTRO del JSX: entre llaves y con barra-asterisco.
          CargadorDatos trae los datos de Firestore y RECIÉN cuando llegan
          muestra lo que tiene adentro (sus "children", ver CargadorDatos.tsx).
          key={usuarioActual.correo}: si entra otra persona, cambia la key,
          React crea un CargadorDatos nuevo y se vuelven a descargar los datos. */}
      <CargadorDatos key={usuarioActual.correo} onDatosListos={registrarCambioInventario}>
        {/* M17: diseño de pantalla completa. MenuNavegacion dibuja la barra azul
            (fija arriba) y el menú gris (fijo a la izquierda). El <main> tiene la
            clase "app-contenido" para que nada quede tapado (ver MenuNavegacion.css). */}
        <div className="app-layout">
          {/* Al menú le pasamos solo 2 props:
                cantidadAlertas -> el numerito rojo (HU-05)
                onCerrarSesion  -> una FUNCIÓN para el botón "Cerrar sesión"
              ¿Y tu nombre y rol? Ya no van por props: el menú los escucha del
              parlante con useUsuario(). ¿Y qué botón pintar de azul? Los
              enlaces del menú (NavLink) miran la dirección y lo saben solos. */}
          <MenuNavegacion cantidadAlertas={totalAlertas} onCerrarSesion={manejarCerrarSesion} />

          <main className="app-contenido">
            {/* EL MAPA DE LA APP (React Router, ver guía, paso 10).
                <Routes> mira la dirección del navegador y dibuja SOLO la
                <Route> que calza. Es como el índice de un libro:
                "si la página es /reservas, abre el capítulo PaginaReservas".
                  path    = la dirección
                  element = lo que se dibuja en esa dirección
                - "/inventario/*": el * deja que PaginaInventario tenga sus
                  PROPIAS direcciones adentro (/inventario/nuevo y /inventario/5).
                - Las demás pasan por el guardia paginaSiPuede (RNF-03).
                - "*" (al final): cualquier otra dirección (o "/") se desvía
                  al inventario. Siempre va al final, como el "si no" de un if. */}
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

// "export default" = este es EL componente principal de este archivo.
// main.tsx lo importa con: import App from './App.tsx';
export default App;
