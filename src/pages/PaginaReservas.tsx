// PaginaReservas.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// La página de RESERVAS. Tiene cuatro partes, de arriba a abajo:
//   1. El encabezado con el título y un contador ("Reservas registradas: 4").
//   2. El formulario "Nueva reserva" (solo docente y encargado).
//   3. La tabla de reservas ACTIVAS: programadas y en curso.
//   4. La tabla del HISTORIAL: las que ya se realizaron.
// (El docente solo ve las suyas en las dos tablas.)
// *** Para cambiar el título "Reservas de Laboratorio" o la frase de abajo,
//     cámbialos aquí, en el <header>. ***
// En la guía: paso 3 (componentes) y paso 8 (reservas).
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
// No recibe props: la persona conectada la sacamos con useUsuario()
// (ver guía, paso 6). Con ella decidimos si se ve el formulario y qué
// reservas se muestran (RNF-03).
// Devuelve: el encabezado, el formulario (si corresponde) y las dos tablas.
function PaginaReservas() {
  // useUsuario() = "¿quién está conectado?" (ver context/ContextoUsuario.ts).
  const usuario = useUsuario();
  // Un contador que sube cada vez que se crea o cancela una reserva.
  // ¿Para qué? Las reservas viven en el servicio (no en un useState), así
  // que React no se entera solo cuando cambian. Al subir este contador,
  // la página se redibuja y el contador de arriba se actualiza.
  const [actualizaciones, setActualizaciones] = useState(0);

  // Las mismas reservas que muestran las tablas: todas, o solo las del docente.
  const listaReservas = obtenerReservasVisibles(usuario);

  // El texto del contador depende del rol.
  let textoContador = 'Reservas registradas';
  if (!puedeVerTodasLasReservas(usuario.rol)) {
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
        {puedeReservar(usuario.rol) && (
          <FormularioReserva onReservaCreada={refrescarDatos} />
        )}
        {!puedeReservar(usuario.rol) && (
          <p className="texto-secundario">
            Tu rol solo permite consultar las reservas. Para reservar, inicia sesión como
            docente o encargado.
          </p>
        )}

        {/* Hay DOS tablas, hechas con el MISMO componente TablaReservas.
            La prop "modo" le dice cuál ser (pedido del profesor):
              modo="activas"   -> las que todavía no terminan (programadas
                                  y en curso), con el botón "Cancelar".
              modo="historial" -> las que ya terminaron (realizadas).
            Le pasamos "version" (el contador): cuando cambia, la tabla
            sabe que tiene que mostrarse de nuevo. */}
        <TablaReservas
          modo="activas"
          version={actualizaciones}
          onReservaModificada={refrescarDatos}
        />

        {/* El historial: cuando pasa la hora de término de una reserva,
            se cambia SOLA de la tabla de arriba a esta (nadie la mueve a mano).
            No lleva onReservaModificada porque aquí no se puede cancelar nada. */}
        <TablaReservas modo="historial" version={actualizaciones} />
      </div>
    </section>
  );
}

export default PaginaReservas;
