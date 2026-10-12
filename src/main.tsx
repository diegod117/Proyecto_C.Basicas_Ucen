// main.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Es la PUERTA DE ENTRADA de la app: el primer archivo que se ejecuta.
// Hace una sola cosa: busca una cajita vacía en index.html
// (un <div id="root">) y adentro dibuja toda la app (el componente App).
// Piensa en index.html como una hoja en blanco y en este archivo como
// la mano que pega el dibujo en la hoja.
// En la guía: paso 1 (mapa de la app).
// Cubre: configuración base del proyecto (no corresponde a una HU específica)

// Traemos herramientas de React (vienen instaladas en node_modules).
// Las llaves { } = de todo lo que tiene 'react', solo queremos StrictMode.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Importar un .css así lo aplica a TODA la app (colores, letras, etc.).
import './styles/global.css';
// Sin llaves = traemos lo que el archivo exporta "por defecto" (export default).
import App from './App.tsx';

// document = toda la página web. getElementById('root') = "búscame el
// elemento que tiene id='root'". Si no lo encuentra, devuelve null (= nada).
const elementoRaiz = document.getElementById('root');

// Por eso preguntamos con un if: "¿lo encontraste?". Dentro del if,
// TypeScript ya sabe que elementoRaiz NO es null, y nos deja usarlo.
if (elementoRaiz) {
  // createRoot(...).render(...) = "React, desde ahora tú mandas en esta cajita
  // y dibuja esto adentro".
  // <App /> es el componente principal (ver App.tsx). Se escribe como una
  // etiqueta HTML, pero es NUESTRO componente: eso es JSX (ver guía, paso 3).
  // StrictMode es un ayudante de React que solo funciona mientras
  // programamos: revisa el código y avisa en la consola si algo anda raro.
  // No cambia cómo se ve la página.
  createRoot(elementoRaiz).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
