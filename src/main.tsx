// main.tsx
// Punto de entrada de la aplicación: es el primer archivo que se ejecuta.
// Busca el <div id="root"> de index.html y dibuja ahí el componente App.
// Cubre: configuración base del proyecto (no corresponde a una HU específica)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.tsx';

// document.getElementById puede devolver null si no encuentra el div.
// Por eso revisamos con un if antes de usarlo: así TypeScript sabe
// que dentro del if el elemento sí existe.
const elementoRaiz = document.getElementById('root');

if (elementoRaiz) {
  // StrictMode es una ayuda de React solo para desarrollo:
  // revisa el código y muestra advertencias en la consola si algo está mal.
  // No cambia cómo se ve la página.
  createRoot(elementoRaiz).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
