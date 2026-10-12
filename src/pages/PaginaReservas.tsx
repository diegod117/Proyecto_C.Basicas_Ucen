// PaginaReservas.tsx
// Página de reservas del laboratorio.
// Permite al personal docente registrar nuevas reservas
// y consultar o cancelar reservas existentes.
// Cubre: HU-03 (formulario), HU-07, HU-08, RF-03 (tabla y cancelación)
// y RNF-03 (el departamento solo consulta; el docente ve solo sus reservas)

import { useState } from 'react';
import FormularioReserva from '../components/FormularioReserva';
import TablaReservas from '../components/TablaReservas';
import { obtenerReservasVisibles } from '../services/reservasService';
import { useUsuario } from '../context/ContextoUsuario';
import { puedeReservar, puedeVerTodasLasReservas } from '../utils/permisos';
import './PaginaReservas.css';

// Componente PaginaReservas
// Renderiza el encabezado del módulo, el formulario y la tabla de reservas.
// No recibe props: el usuario conectado lo lee con useUsuario().
// El formulario solo aparece si su rol puede reservar.
function PaginaReservas() {
  // El usuario conectado viene del contexto (ver context/ContextoUsuario.ts)
  const usuario = useUsuario();
  const [actualizaciones, setActualizaciones] = useState(0);

  // Mismas reservas que muestra la tabla: todas, o solo las del docente (RNF-03)
  const listaReservas = obtenerReservasVisibles(usuario);

  // Texto del contador según el rol
  let textoContador = 'Reservas registradas';
  if (!puedeVerTodasLasReservas(usuario.rol)) {
    textoContador = 'Mis reservas';
  }

  function refrescarDatos() {
    setActualizaciones(function (valorAnterior) {
      return valorAnterior + 1;
    });
  }

  return (
    <section className="contenido-pagina">
      <header className="pagina-reservas-header">
        <h2>Reservas de Laboratorio</h2>
        {/* M19: clase pagina-reservas-descripcion para el estilo del encabezado */}
        <p className="pagina-reservas-descripcion">
          Módulo para solicitar recursos, instrumentos y espacios de trabajo.
        </p>
        <span className="contador-reservas-badge">
          {textoContador}: {listaReservas.length}
        </span>
      </header>

      <div className="pagina-reservas-contenedor">
        {/* Formulario para registrar una nueva reserva.
            Solo se dibuja si el rol puede reservar (RNF-03);
            si no, se muestra un aviso en su lugar. */}
        {puedeReservar(usuario.rol) && (
          <FormularioReserva onReservaCreada={refrescarDatos} />
        )}
        {!puedeReservar(usuario.rol) && (
          <p className="texto-secundario">
            Tu rol solo permite consultar las reservas. Para reservar, inicia sesión como
            docente o encargado.
          </p>
        )}

        {/* Tabla con el historial de reservas y botón de cancelación */}
        <TablaReservas
          version={actualizaciones}
          onReservaModificada={refrescarDatos}
        />
      </div>
    </section>
  );
}

export default PaginaReservas;
