// PaginaReservas.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La página de RESERVAS. Tiene tres partes, de arriba a abajo:
//   1. El encabezado con el título y un contador ("Reservas registradas: 4").
//   2. El formulario "Nueva reserva" (solo docente y encargado).
//   3. La tabla con las reservas (el docente solo ve las suyas).
// *** Para cambiar el título "Reservas de Laboratorio" o la frase de abajo,
//     cámbialos aquí, en el <header>. ***
// En la guía: paso 3 (componentes) y paso 8 (reservas).
// Cubre: HU-03 (formulario), HU-07, HU-08, RF-03 (tabla y cancelación)
// y RNF-03 (el departamento solo consulta; el docente ve solo sus reservas)

import { useState } from 'react';
import FormularioReserva from '../components/FormularioReserva';
import TablaReservas from '../components/TablaReservas';
import { obtenerReservasVisibles } from '../services/reservasService';
import type { Usuario } from '../types/Usuario';
import { puedeReservar, puedeVerTodasLasReservas } from '../utils/permisos';
import './PaginaReservas.css';

// Las props que le pasa App.
interface PropsPaginaReservas {
  // La persona conectada: decide si se ve el formulario y qué reservas (RNF-03).
  usuario: Usuario;
}

// Componente PaginaReservas
// Recibe: la persona conectada.
// Devuelve: el encabezado, el formulario (si corresponde) y la tabla.
function PaginaReservas(props: PropsPaginaReservas) {
  // Un contador que sube cada vez que se crea o cancela una reserva.
  // ¿Para qué? Las reservas viven en el servicio (no en un useState), así
  // que React no se entera solo cuando cambian. Al subir este contador,
  // la página se redibuja y el contador de arriba se actualiza.
  const [actualizaciones, setActualizaciones] = useState(0);

  // Las mismas reservas que muestra la tabla: todas, o solo las del docente.
  const listaReservas = obtenerReservasVisibles(props.usuario);

  // El texto del contador depende del rol.
  let textoContador = 'Reservas registradas';
  if (!puedeVerTodasLasReservas(props.usuario.rol)) {
    textoContador = 'Mis reservas';
  }

  // refrescarDatos
  // No recibe ni devuelve nada. Sube el contador en 1 para que React redibuje.
  // Aquí se usa la forma "con función" de un set:
  //   setActualizaciones(function (valorAnterior) { return valorAnterior + 1; })
  // React nos pasa el valor anterior y nosotros devolvemos el nuevo.
  // Hace lo mismo que setActualizaciones(actualizaciones + 1), pero es más
  // seguro si se llama varias veces seguidas.
  function refrescarDatos() {
    setActualizaciones(function (valorAnterior) {
      return valorAnterior + 1;
    });
  }

  return (
    <section className="contenido-pagina">
      <header className="pagina-reservas-header">
        <h2>Reservas de Laboratorio</h2>
        {/* M19: la clase pagina-reservas-descripcion le da el estilo a esta frase. */}
        <p className="pagina-reservas-descripcion">
          Módulo para solicitar recursos, instrumentos y espacios de trabajo.
        </p>
        {/* La "pastilla" azul con el contador, ej: "Reservas registradas: 4". */}
        <span className="contador-reservas-badge">
          {textoContador}: {listaReservas.length}
        </span>
      </header>

      <div className="pagina-reservas-contenedor">
        {/* El formulario solo se dibuja si el rol puede reservar (RNF-03).
            Si no puede (departamento), se muestra un aviso en su lugar. */}
        {puedeReservar(props.usuario.rol) && (
          <FormularioReserva onReservaCreada={refrescarDatos} usuario={props.usuario} />
        )}
        {!puedeReservar(props.usuario.rol) && (
          <p className="texto-secundario">
            Tu rol solo permite consultar las reservas. Para reservar, inicia sesión como
            docente o encargado.
          </p>
        )}

        {/* La tabla. Le pasamos "version" (el contador): cuando cambia,
            la tabla sabe que tiene que mostrarse de nuevo. */}
        <TablaReservas
          version={actualizaciones}
          onReservaModificada={refrescarDatos}
          usuario={props.usuario}
        />
      </div>
    </section>
  );
}

export default PaginaReservas;
