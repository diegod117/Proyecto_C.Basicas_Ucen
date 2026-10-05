// FormularioCambioEstado.tsx
// Formulario para que el encargado cambie el estado de algunas unidades
// de un recurso. Ej: pasar 1 multímetro de "Disponible" a "Dañado".
// Se muestra a la derecha de la ficha del recurso, como en el mockup.
// Cubre: HU-02, RF-01, HU-06 (el historial guarda quién hizo el cambio)

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Recurso, EstadoRecurso } from '../types/Recurso';
import { listaEstadosRecurso, textoEstado } from '../utils/inventario';
import {
  obtenerEstadoOrigenInicial,
  validarCambioEstado,
  textoResumenCambio,
} from '../utils/cambioEstado';
import { cambiarEstadoRecurso } from '../services/recursosService';
import type { Usuario } from '../types/Usuario';
import './FormularioCambioEstado.css';

interface PropsFormularioCambioEstado {
  recurso: Recurso;
  // Se llama después de guardar, para avisarle a la página que los datos
  // cambiaron y que tiene que volver a dibujarse con los números nuevos.
  onEstadoCambiado: () => void;
  // Usuario conectado: su nombre queda en el historial (HU-06)
  usuario: Usuario;
}

// Componente FormularioCambioEstado
// Recibe: el recurso, la función para avisar que se guardó un cambio
// y el usuario conectado.
// Devuelve: el formulario "Cambiar estado".
function FormularioCambioEstado(props: PropsFormularioCambioEstado) {
  const recurso = props.recurso;

  // Un useState por cada campo del formulario ("inputs controlados").
  // useState<EstadoRecurso> indica que solo puede guardar uno de los 5 estados.
  const [estadoOrigen, setEstadoOrigen] = useState<EstadoRecurso>(obtenerEstadoOrigenInicial(recurso));
  const [estadoNuevo, setEstadoNuevo] = useState<EstadoRecurso>('danado');
  // La cantidad se guarda como texto porque así la entrega el <input>;
  // se convierte a número recién al validar.
  const [cantidadTexto, setCantidadTexto] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  // Mensaje verde que confirma el último cambio guardado
  const [mensajeExito, setMensajeExito] = useState('');
  // true mientras se espera a Firestore: desactiva el botón para no guardar dos veces
  const [guardando, setGuardando] = useState(false);

  // guardarCambio
  // Recibe: el evento del formulario. No devuelve nada.
  // Valida los datos y, si están bien, guarda el cambio en el servicio.
  // Es "async" porque el servicio guarda en Firestore y hay que esperarlo.
  async function guardarCambio(evento: FormEvent) {
    // Por defecto, enviar un <form> recarga toda la página.
    // preventDefault() evita eso, para manejar el envío nosotros.
    evento.preventDefault();

    // Al intentar guardar de nuevo, borramos el mensaje de éxito anterior
    setMensajeExito('');

    const error = validarCambioEstado(recurso, estadoOrigen, estadoNuevo, cantidadTexto, motivo);
    if (error !== '') {
      setMensajeError(error); // se muestra en rojo debajo del formulario
      return; // "return" corta la función: no se guarda nada
    }

    const cantidad = Number(cantidadTexto);

    // Dar de baja es un cambio importante (la unidad deja de usarse),
    // así que pedimos confirmación. window.confirm muestra una ventana
    // con "Aceptar" y "Cancelar": devuelve true o false según lo que elija.
    if (estadoNuevo === 'dado_de_baja') {
      const confirmado = window.confirm(
        '¿Seguro que quieres dar de baja ' + cantidad + ' unidad(es) de "' + recurso.nombre + '"?',
      );
      if (!confirmado) {
        return; // eligió "Cancelar": no se guarda nada
      }
    }

    // El servicio cambia las cantidades Y registra el cambio en el historial.
    // "await" espera a que Firestore responda antes de seguir.
    setGuardando(true);
    const seGuardo = await cambiarEstadoRecurso(
      recurso.id,
      estadoOrigen,
      estadoNuevo,
      cantidad,
      motivo,
      props.usuario.nombre,
    );
    setGuardando(false);
    if (seGuardo) {
      setMensajeError('');
      setMensajeExito(textoResumenCambio(cantidad, estadoOrigen, estadoNuevo));
      setMotivo('');
      // Si el estado de origen quedó sin unidades (ej: "Dañado (0)"), elegimos
      // otro que sí tenga, para que el siguiente cambio no dé error.
      if (recurso.cantidades[estadoOrigen] === 0) {
        setEstadoOrigen(obtenerEstadoOrigenInicial(recurso));
      }
      props.onEstadoCambiado(); // avisamos hacia arriba para que App redibuje todo
    } else {
      setMensajeError('No se pudo guardar el cambio. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  return (
    // onSubmit se ejecuta al hacer clic en el botón "submit" o al apretar
    // Enter dentro de un campo. Así funciona también desde el teclado.
    // noValidate desactiva las validaciones automáticas del navegador
    // (por ejemplo, el min="1" del input). Así TODOS los errores los revisa
    // validarCambioEstado y se muestran con el mismo estilo y en español.
    <form className="formulario-cambio-estado" onSubmit={guardarCambio} noValidate>
      <h3 className="formulario-cambio-titulo">Cambiar estado</h3>

      <label htmlFor="estado-origen">Estado actual</label>
      {/* El <select> entrega un texto (string). Con "as EstadoRecurso" le
          aseguramos a TypeScript que ese texto es un estado válido, lo que
          es cierto porque las opciones solo tienen estados de la lista. */}
      <select
        id="estado-origen"
        value={estadoOrigen}
        onChange={(evento) => setEstadoOrigen(evento.target.value as EstadoRecurso)}
      >
        {/* Mostramos cuántas unidades hay en cada estado, para ayudar a elegir */}
        {listaEstadosRecurso.map((estado) => (
          <option key={estado} value={estado}>
            {textoEstado(estado)} ({recurso.cantidades[estado]})
          </option>
        ))}
      </select>

      <label htmlFor="estado-nuevo">Nuevo estado</label>
      <select
        id="estado-nuevo"
        value={estadoNuevo}
        onChange={(evento) => setEstadoNuevo(evento.target.value as EstadoRecurso)}
      >
        {listaEstadosRecurso.map((estado) => (
          <option key={estado} value={estado}>
            {textoEstado(estado)}
          </option>
        ))}
      </select>

      <label htmlFor="cantidad-cambio">Cantidad</label>
      <input
        id="cantidad-cambio"
        type="number"
        min="1"
        value={cantidadTexto}
        onChange={(evento) => setCantidadTexto(evento.target.value)}
      />

      <label htmlFor="motivo-cambio">Motivo</label>
      <input
        id="motivo-cambio"
        type="text"
        placeholder="Ej: Punta rota"
        value={motivo}
        onChange={(evento) => setMotivo(evento.target.value)}
      />

      {/* El mensaje de error solo aparece si hay uno (texto no vacío) */}
      {mensajeError !== '' && <p className="formulario-cambio-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="formulario-cambio-exito">{mensajeExito}</p>}

      <button type="submit" className="formulario-cambio-boton" disabled={guardando}>
        {guardando && 'Guardando...'}
        {!guardando && 'Guardar cambio'}
      </button>
    </form>
  );
}

export default FormularioCambioEstado;
