// App.tsx
// Componente principal de la aplicación. Más adelante aquí se decidirá
// qué página mostrar (Inventario, Reservas, Incidencias...).
// Por ahora solo muestra un mensaje para comprobar que el proyecto funciona.
// Cubre: configuración base del proyecto (no corresponde a una HU específica)

// Un componente de React es una función que devuelve lo que se ve en pantalla.
// Lo que parece HTML dentro del return se llama JSX.
// No recibe nada (no tiene props) y devuelve la pantalla inicial.
function App() {
  return (
    <main className="contenedor-inicio">
      <h1>UCEN - Gestión de Inventario</h1>
      <p>Laboratorios del Departamento de Ciencias Básicas</p>
      <p className="texto-secundario">
        Proyecto base listo. Las pantallas se agregarán una historia de usuario a la vez.
      </p>
    </main>
  );
}

// "export default" permite que otros archivos (main.tsx) importen este componente.
export default App;
