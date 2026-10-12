// App.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Es el COMPONENTE PRINCIPAL: el "director de orquesta" de toda la app.
// Decide qué se ve en la pantalla:
//   - Si nadie ha iniciado sesión -> la pantalla de login.
//   - Si hay sesión -> primero descarga los datos (CargadorDatos) y después
//     muestra el menú (arriba y a la izquierda) y la página elegida.
// También guarda los datos que comparten varias partes de la app:
// quién está conectado y qué página se está mirando.
// En la guía: paso 3 (componentes y props), paso 4 (useState),
// paso 5 (useEffect) y paso 6 (por qué no usamos useContext).
// Cubre: navegación base, inicio de sesión con roles (sección 3.4 de requerimientos)
//        y RNF-06 (los datos vienen de Firestore)

// useState y useEffect son "hooks" de React: herramientas especiales que
// le dan superpoderes a un componente (memoria y acciones automáticas).
import { useState, useEffect } from 'react';
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
import CargadorDatos from './components/CargadorDatos';
import { generarAlertas } from './utils/alertas';
import { escucharSesion, cerrarSesion } from './services/authService';
import { puedeVerPagina } from './utils/permisos';

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
  // Qué página se está mirando. Parte en 'inventario'.
  // "<Pagina>" le dice a TypeScript que solo puede ser una de las 4 páginas.
  const [paginaActual, setPaginaActual] = useState<Pagina>('inventario');

  // Un contador de "cambios en el inventario" (HU-02).
  // Cuando el encargado cambia un recurso, el servicio cambia los datos,
  // pero React NO se entera solo (los datos del servicio no son useState).
  // Truco: sumamos 1 a este contador. Como ES un useState, React redibuja
  // App completa, y así se recalculan las alertas del menú y los números.
  const [cambiosInventario, setCambiosInventario] = useState(0);

  // Cuántas veces se apretó "Inventario" en el menú.
  // Se usa como "key" de PaginaInventario (ver cambiarPagina más abajo).
  const [vecesMenuInventario, setVecesMenuInventario] = useState(0);

  // QUIÉN está conectado, o null (= nadie) si no hay sesión.
  // "Usuario | null" = puede ser un Usuario O nada.
  // ¡Este es el dato que lleva tu NOMBRE y tu ROL! Desde aquí viaja,
  // como prop, hasta MenuNavegacion, que lo dibuja arriba a la derecha.
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  // true mientras Firebase revisa si ya había una sesión guardada.
  // Sin esto, al recargar la página se vería el login un instante
  // aunque ya estuvieras conectado.
  const [revisandoSesion, setRevisandoSesion] = useState(true);

  // ---------------------------------------------------------------
  // UNA ACCIÓN AUTOMÁTICA (useEffect). Ver guía, paso 5.
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

  // cambiarPagina
  // Recibe: la página que se eligió en el menú. No devuelve nada.
  // Problema: si ya estás en el inventario (mirando la ficha de un recurso)
  // y aprietas "Inventario", poner 'inventario' en la pizarra no cambia
  // nada (¡ya decía 'inventario'!), y seguirías viendo la ficha.
  // Solución: también sumamos 1 a vecesMenuInventario. Ese número es la
  // "key" de PaginaInventario. Cuando la key cambia, React tira la página
  // vieja a la basura y crea una nueva desde cero, que parte en el listado.
  // (Es como el número de una camiseta: si cambia, React cree que es otro jugador.)
  function cambiarPagina(pagina: Pagina) {
    if (pagina === 'inventario') {
      setVecesMenuInventario(vecesMenuInventario + 1);
    }
    setPaginaActual(pagina);
  }

  // manejarCerrarSesion
  // No recibe ni devuelve nada. La llama el botón "Cerrar sesión" del menú.
  // Dejamos la página en 'inventario' para que la próxima persona parta
  // desde el principio. No hace falta mostrar el login a mano: al cerrar
  // sesión suena el timbre, usuarioActual pasa a null y React muestra el login.
  // "async" porque cerrarSesion habla con Firebase por internet.
  async function manejarCerrarSesion() {
    setPaginaActual('inventario');
    await cerrarSesion();
  }

  // mostrarPaginaActual
  // Recibe: la persona conectada.
  // Devuelve: el componente de la página que hay que mostrar.
  // ¿Por qué recibe al usuario si ya está en usuarioActual? Porque
  // usuarioActual puede ser null, y TypeScript no sabe que esta función
  // solo se usa cuando SÍ hay alguien. Pasándolo como Usuario, queda claro.
  function mostrarPaginaActual(usuario: Usuario) {
    // Protección extra (RNF-03): el menú ya esconde los botones de las
    // páginas que tu rol no puede ver. Pero si por alguna razón quedaras
    // en una de ellas, te mostramos el inventario en su lugar.
    if (!puedeVerPagina(usuario.rol, paginaActual)) {
      return <PaginaInventario onInventarioCambiado={registrarCambioInventario} usuario={usuario} />;
    }

    // Según lo que diga la pizarra, devolvemos una página u otra.
    // Fíjate cómo se le pasan PROPS a cada página: como atributos de HTML,
    // nombre={valor}. Ej: usuario={usuario} le pasa la persona conectada.
    if (paginaActual === 'inventario') {
      return (
        <PaginaInventario
          key={vecesMenuInventario}
          onInventarioCambiado={registrarCambioInventario}
          usuario={usuario}
        />
      );
    } else if (paginaActual === 'reservas') {
      return <PaginaReservas usuario={usuario} />;
    } else if (paginaActual === 'incidencias') {
      return <PaginaIncidencias usuario={usuario} />;
    } else {
      return <PaginaAlertas />;
    }
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

  // 2) No hay nadie conectado: solo se puede ver el login.
  if (usuarioActual === null) {
    return <PaginaLogin />;
  }

  // 3) Hay alguien conectado: la app completa.
  return (
    // CargadorDatos trae los datos de Firestore y RECIÉN cuando llegan
    // muestra lo que tiene adentro (sus "children", ver CargadorDatos.tsx).
    // key={usuarioActual.correo}: si entra otra persona, cambia la key,
    // React crea un CargadorDatos nuevo y se vuelven a descargar los datos.
    <CargadorDatos key={usuarioActual.correo} onDatosListos={registrarCambioInventario}>
      {/* Así se escribe un comentario DENTRO del JSX: entre llaves y con barra-asterisco.
          M17: diseño de pantalla completa. MenuNavegacion dibuja la barra azul
          (fija arriba) y el menú gris (fijo a la izquierda). El <main> tiene la
          clase "app-contenido" para que nada quede tapado (ver MenuNavegacion.css). */}
      <div className="app-layout">
        {/* Le pasamos al menú 5 props:
              paginaActual    -> para pintar el botón de la página elegida
              onCambiarPagina -> una FUNCIÓN para avisarnos qué botón apretaron
              cantidadAlertas -> el numerito rojo (HU-05)
              usuario         -> la persona conectada (¡nombre y rol!)
              onCerrarSesion  -> una FUNCIÓN para el botón "Cerrar sesión"
            Así viajan los datos en React: de padre (App) a hijo (MenuNavegacion)
            por props. Si el hijo necesita avisar algo, llama a una función
            que el padre le pasó. Ver guía, pasos 3 y 6. */}
        <MenuNavegacion
          paginaActual={paginaActual}
          onCambiarPagina={cambiarPagina}
          cantidadAlertas={totalAlertas}
          usuario={usuarioActual}
          onCerrarSesion={manejarCerrarSesion}
        />

        {/* Las llaves { } dentro del JSX = "aquí va código de TypeScript".
            Llamamos a la función y lo que devuelve se dibuja aquí. */}
        <main className="app-contenido">{mostrarPaginaActual(usuarioActual)}</main>
      </div>
    </CargadorDatos>
  );
}

// "export default" = este es EL componente principal de este archivo.
// main.tsx lo importa con: import App from './App.tsx';
export default App;
