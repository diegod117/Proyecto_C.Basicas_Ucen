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

  // Decide qué página mostrar según el valor de paginaActual.
  // No recibe nada. Devuelve el componente de la página que corresponde.
  function mostrarPaginaActual() {
    if (paginaActual === 'inventario') {
      return <PaginaInventario />;
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
      {/* Le pasamos al menú la página actual y la función para cambiarla.
          Cuando el usuario hace clic en un botón del menú, el menú llama a
          setPaginaActual, el estado cambia y React vuelve a dibujar App
          mostrando la página nueva. */}
      <MenuNavegacion paginaActual={paginaActual} onCambiarPagina={setPaginaActual} />

      <main>{mostrarPaginaActual()}</main>
    </div>
  );
}

export default App;
