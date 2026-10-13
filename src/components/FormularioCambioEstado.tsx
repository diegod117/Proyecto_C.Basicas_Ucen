// FormularioCambioEstado.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// El recuadro "Cambiar estado" que aparece a la derecha de la ficha (solo
// para el encargado). Sirve para mover unidades de un estado a otro.
// Ej: pasar 1 multímetro de "Disponible" a "Dañado" porque se le rompió la punta.
// Es el ejemplo más completo de FORMULARIO de la app: si entiendes este,
// entiendes todos. (ver guía, paso 4)
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
// useUsuario es NUESTRO hook para saber quién está conectado (guía, paso 6).
import { useUsuario } from '../context/ContextoUsuario';
import './FormularioCambioEstado.css';

// Las props que le pasa FichaRecurso.
interface PropsFormularioCambioEstado {
  recurso: Recurso;
  // Se llama después de guardar, para avisar hacia arriba que los números
  // cambiaron y hay que volver a dibujar todo.
  onEstadoCambiado: () => void;
}

// Componente FormularioCambioEstado
// Recibe: el recurso y la función para avisar que se guardó un cambio.
// ¿Y la persona conectada? Ya NO llega por props: la sacamos del
// "parlante" con useUsuario() (ver context/ContextoUsuario.ts y guía, paso 6).
// Su nombre queda anotado en el historial (HU-06).
// Devuelve: el formulario "Cambiar estado".
function FormularioCambioEstado(props: PropsFormularioCambioEstado) {
  // useUsuario() = "¿quién está conectado?" (ver context/ContextoUsuario.ts).
  const usuario = useUsuario();
  const recurso = props.recurso;

  // ---------------------------------------------------------------
  // LA MEMORIA DEL FORMULARIO: un useState por cada cajita.
  // ---------------------------------------------------------------
  // useState<EstadoRecurso>(...) = solo puede guardar uno de los 5 estados.
  // Parte con el estado que elige obtenerEstadoOrigenInicial (casi siempre "disponible").
  const [estadoOrigen, setEstadoOrigen] = useState<EstadoRecurso>(obtenerEstadoOrigenInicial(recurso));
  // El estado nuevo parte en "danado" porque es el cambio más común.
  const [estadoNuevo, setEstadoNuevo] = useState<EstadoRecurso>('danado');
  // La cantidad se guarda como TEXTO porque así la entrega el <input>.
  // Recién al revisar se convierte en número.
  const [cantidadTexto, setCantidadTexto] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  // El mensaje verde de "Cambio guardado: ...".
  const [mensajeExito, setMensajeExito] = useState('');
  // true mientras esperamos a Firestore: apaga el botón para no guardar dos veces.
  const [guardando, setGuardando] = useState(false);

  // guardarCambio
  // Se ejecuta al apretar "Guardar cambio" (o Enter).
  // Recibe: el evento del formulario. No devuelve nada.
  // Los pasos son como una receta:
  //   1. revisar, 2. preguntar si es grave, 3. guardar, 4. avisar.
  // Es "async" porque guardar en Firestore se demora.
  async function guardarCambio(evento: FormEvent) {
    // Un <form> recarga la página al enviarse; preventDefault() lo evita.
    evento.preventDefault();

    // Borramos el mensaje verde anterior (si había).
    setMensajeExito('');

    // PASO 1: revisar. La herramienta devuelve '' si todo está bien.
    const error = validarCambioEstado(recurso, estadoOrigen, estadoNuevo, cantidadTexto, motivo);
    if (error !== '') {
      setMensajeError(error); // se muestra en rojo debajo del formulario
      return; // return = cortamos aquí, no se guarda nada
    }

    // Ya sabemos que es un número válido: lo convertimos.
    const cantidad = Number(cantidadTexto);

    // PASO 2: dar de baja es grave (la unidad no se usa nunca más), así que
    // preguntamos. window.confirm abre una ventanita con "Aceptar" y
    // "Cancelar", y devuelve true (Aceptar) o false (Cancelar).
    if (estadoNuevo === 'dado_de_baja') {
      const confirmado = window.confirm(
        '¿Seguro que quieres dar de baja ' + cantidad + ' unidad(es) de "' + recurso.nombre + '"?',
      );
      if (!confirmado) {
        return; // eligió "Cancelar": no se guarda nada
      }
    }

    // PASO 3: guardar. El servicio cambia los números Y anota en el historial.
    // await = esperamos la respuesta de Firestore antes de seguir.
    setGuardando(true);
    const seGuardo = await cambiarEstadoRecurso(
      recurso.id,
      estadoOrigen,
      estadoNuevo,
      cantidad,
      motivo,
      usuario.nombre,
    );
    setGuardando(false);

    // PASO 4: contar cómo nos fue.
    if (seGuardo) {
      setMensajeError('');
      setMensajeExito(textoResumenCambio(cantidad, estadoOrigen, estadoNuevo));
      setMotivo(''); // limpiamos el motivo para el próximo cambio
      // Si el estado de origen quedó en 0 (ej: "Dañado (0)"), elegimos otro
      // que sí tenga unidades, para que el próximo cambio no dé error.
      if (recurso.cantidades[estadoOrigen] === 0) {
        setEstadoOrigen(obtenerEstadoOrigenInicial(recurso));
      }
      props.onEstadoCambiado(); // la "carta" que sube hasta App para que redibuje todo
    } else {
      setMensajeError('No se pudo guardar el cambio. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  return (
    // onSubmit se ejecuta al apretar el botón "submit" o Enter en una cajita.
    // noValidate apaga las revisiones automáticas del navegador (como el
    // min="1"). Así TODOS los errores los revisa validarCambioEstado, y se
    // ven con el mismo estilo y en español.
    <form className="formulario-cambio-estado" onSubmit={guardarCambio} noValidate>
      <h3 className="formulario-cambio-titulo">Cambiar estado</h3>

      <label htmlFor="estado-origen">Estado actual</label>
      {/* Un <select> siempre entrega TEXTO. "as EstadoRecurso" le asegura a
          TypeScript que ese texto es un estado válido (y es verdad, porque
          las opciones solo tienen estados de la lista). */}
      <select
        id="estado-origen"
        value={estadoOrigen}
        onChange={(evento) => setEstadoOrigen(evento.target.value as EstadoRecurso)}
      >
        {/* Cada opción muestra cuántas unidades hay en ese estado, para
            ayudar a elegir. Ej: "Disponible (12)". */}
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
      {/* type="number" muestra flechitas para subir y bajar el número. */}
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

      {/* Los mensajes solo se dibujan si tienen texto. */}
      {mensajeError !== '' && <p className="formulario-cambio-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="formulario-cambio-exito">{mensajeExito}</p>}

      {/* El texto del botón cambia mientras guarda. Solo una de las dos
          líneas se dibuja: o "Guardando..." o "Guardar cambio". */}
      <button type="submit" className="formulario-cambio-boton" disabled={guardando}>
        {guardando && 'Guardando...'}
        {!guardando && 'Guardar cambio'}
      </button>
    </form>
  );
}

export default FormularioCambioEstado;
