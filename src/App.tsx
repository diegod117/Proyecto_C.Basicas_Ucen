// App.tsx
// Componente principal de la aplicación.
// Muestra el menú arriba y, debajo, la página que el usuario eligió.
// Cubre: navegación base (no corresponde a una HU específica)

import { useState } from 'react';
import type { Pagina } from './types/Pagina';
import MenuNavegacion from './components/MenuNavegacion';
import PaginaInventario from './pages/PaginaInventario';
import PaginaReservas from './pages/PaginaReservas';
import PaginaIncidencias from './pages/PaginaIncidencias';
import PaginaAlertas from './pages/PaginaAlertas';
import { generarAlertas } from './utils/alertas';

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

  return (
    <div>
      {/* Le pasamos al menú la página actual, la función para cambiarla
          y el contador de alertas para la campana/badge (HU-05). */}
      <MenuNavegacion
        paginaActual={paginaActual}
        onCambiarPagina={setPaginaActual}
        cantidadAlertas={totalAlertas}
      />

      <main>{mostrarPaginaActual()}</main>
    </div>
  );
}

export default App;
