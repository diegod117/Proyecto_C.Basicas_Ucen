// PaginaReservas.tsx
// Página de reservas del laboratorio.
// Permite al personal docente registrar nuevas reservas
// y consultar o cancelar reservas existentes.
// Cubre: HU-03 (formulario), HU-07, HU-08, RF-03 (tabla y cancelación)
// y RNF-03 (el departamento solo consulta, no reserva)

import { useState } from 'react';
import FormularioReserva from '../components/FormularioReserva';
import TablaReservas from '../components/TablaReservas';
import { obtenerReservas } from '../services/reservasService';
import type { Usuario } from '../types/Usuario';
import { puedeReservar } from '../utils/permisos';
import './PaginaReservas.css';

// Props que recibe la página desde App
interface PropsPaginaReservas {
  // Usuario conectado: decide si se muestra el formulario (RNF-03)
  usuario: Usuario;
}

// Componente PaginaReservas
// Renderiza el encabezado del módulo, el formulario y la tabla de reservas.
// Recibe el usuario conectado. El formulario solo aparece si su rol puede reservar.
function PaginaReservas(props: PropsPaginaReservas) {
  const [actualizaciones, setActualizaciones] = useState(0);

  const listaReservas = obtenerReservas();

  function refrescarDatos() {
    setActualizaciones(function (valorAnterior) {
      return valorAnterior + 1;
    });
  }

  return (
    <section className="contenido-pagina">
      <header className="pagina-reservas-header">
        <h2>Reservas de Laboratorio</h2>
        <p className="texto-secundario">
          Módulo para solicitar recursos, instrumentos y espacios de trabajo.
        </p>
        <span className="contador-reservas-badge">
          Reservas registradas: {listaReservas.length}
        </span>
      </header>

      <div className="pagina-reservas-contenedor">
        {/* Formulario para registrar una nueva reserva.
            Solo se dibuja si el rol puede reservar (RNF-03);
            si no, se muestra un aviso en su lugar. */}
        {puedeReservar(props.usuario.rol) && (
          <FormularioReserva onReservaCreada={refrescarDatos} usuario={props.usuario} />
        )}
        {!puedeReservar(props.usuario.rol) && (
          <p className="texto-secundario">
            Tu rol solo permite consultar las reservas. Para reservar, inicia sesión como
            docente o encargado.
          </p>
        )}

        {/* Tabla con el historial de reservas y botón de cancelación */}
        <TablaReservas version={actualizaciones} onReservaModificada={refrescarDatos} />
      </div>
    </section>
  );
}

export default PaginaReservas;
