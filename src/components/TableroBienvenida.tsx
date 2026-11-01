// TableroBienvenida.tsx
// Primera pantalla de la bienvenida: un "tablero" de tiles que llena la
// pantalla, con el nombre LabCentral, dos fotos, el formulario de ingreso
// y un tile de acento.
// El orden en el HTML es el del celular (nombre, ingreso, foto, acento, foto):
// así el lector de pantalla y la tecla Tab siguen un orden lógico. En
// escritorio y tablet los tiles se acomodan con grid-template-areas (ver .css).
// Cubre: inicio de sesión (sección 3.4 de requerimientos), HU-15, RNF-01

import BarraBienvenida from './BarraBienvenida';
import FormularioIngreso from './FormularioIngreso';
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
        {/* Nombre: logo de la facultad arriba y el nombre abajo */}
        <div className="tablero-tile tablero-nombre">
          <img
            className="tablero-logo"
            src="/bienvenida/logo-finarq-azul.svg"
            alt="Universidad Central de Chile, Facultad de Ingeniería y Arquitectura"
            width="136"
            height="48"
          />
          <div>
            {/* El único h1 de toda la página */}
            <h1 className="tablero-titulo">LabCentral</h1>
            <p className="tablero-frase">Inventario y reservas de los laboratorios de Ciencias Básicas.</p>
          </div>
        </div>

        {/* Ingreso: el formulario de siempre (con recuperar contraseña) */}
        <div className="tablero-tile tablero-ingreso">
          <FormularioIngreso mensajeInicial={props.mensajeInicial} />
        </div>

        {/* Foto principal. Sin loading="lazy" porque se ve al abrir la página.
            El <div> de afuera recorta la foto (sirve para la animación). */}
        <div className="tablero-tile tablero-foto tablero-foto-probetas">
          <img
            src="/bienvenida/probetas-tinta.jpg"
            alt="Probetas graduadas y un vaso de precipitado con líquidos de colores"
            width="1600"
            height="1066"
          />
        </div>

        <div className="tablero-tile tablero-acento">
          <p>Reserva por fecha y horario, sin chocar con otro curso.</p>
        </div>

        <div className="tablero-tile tablero-foto tablero-foto-hornos">
          <img
            src="/bienvenida/hornos-mufla.jpg"
            alt="Hornos mufla de laboratorio"
            width="1600"
            height="1200"
          />
        </div>
      </div>
    </section>
  );
}

export default TableroBienvenida;
