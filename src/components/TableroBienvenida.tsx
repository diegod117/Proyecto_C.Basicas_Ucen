// TableroBienvenida.tsx
// Primera pantalla de la bienvenida: un "tablero" de tiles que llena la
// pantalla, con el nombre LabCentral, dos fotos, el formulario de ingreso
// y un tile de acento.
// El orden en el HTML es el del celular (nombre, ingreso, foto, acento, foto):
// así el lector de pantalla y la tecla Tab siguen un orden lógico. En
// escritorio y tablet los tiles se acomodan con grid-template-areas (ver .css).
// Cubre: inicio de sesión (sección 3.4 de requerimientos), HU-15, RNF-01

import BarraBienvenida from './BarraBienvenida';
import NombreTablero from './NombreTablero';
import FormularioIngreso from './FormularioIngreso';
import FotoTablero from './FotoTablero';
import './TableroBienvenida.css';

interface PropsTableroBienvenida {
  // Mensaje de la sesión guardada (HU-15); se le pasa tal cual al formulario
  mensajeInicial: string;
}

// Componente TableroBienvenida
// Recibe: el mensaje inicial para el formulario.
// Devuelve: la sección "inicio" con la barra y la grilla de tiles.
function TableroBienvenida(props: PropsTableroBienvenida) {
  return (
    <section id="inicio" className="tablero" aria-label="Bienvenida">
      <BarraBienvenida />

      <div className="tablero-grilla">
        <NombreTablero />

        {/* Ingreso: el formulario de siempre (con recuperar contraseña) */}
        <div className="tablero-tile tablero-ingreso">
          <FormularioIngreso mensajeInicial={props.mensajeInicial} />
        </div>

        {/* Foto principal: se "abre" como un obturador al cargar (ver FotoTablero.css) */}
        <FotoTablero
          archivo="probetas-tinta.jpg"
          alt="Probetas graduadas y un vaso de precipitado con líquidos de colores"
          ancho={1600}
          alto={1066}
          clase="tablero-foto-probetas"
        />

        <div className="tablero-tile tablero-acento">
          <p>Reserva por fecha y horario, sin chocar con otro curso.</p>
        </div>

        <FotoTablero
          archivo="hornos-mufla.jpg"
          alt="Hornos mufla de laboratorio"
          ancho={1600}
          alto={1200}
          clase="tablero-foto-hornos"
        />
      </div>
    </section>
  );
}

export default TableroBienvenida;
