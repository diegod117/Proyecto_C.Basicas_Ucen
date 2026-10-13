// FormularioReponerStock.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// El recuadro "Reponer stock" de la ficha, debajo de "Cambiar estado".
// Sirve para sumar unidades NUEVAS que llegan al laboratorio (ej: se
// compraron 10 cajas de guantes). Entran como "disponible".
// Así se apagan las alertas de reposición ("quedan pocas, hay que comprar").
// Usa las mismas clases CSS que FormularioCambioEstado para verse igual.
// Funciona igual que FormularioCambioEstado (revisar -> guardar -> avisar),
// pero más corto. (ver guía, paso 4)
// Cubre: RF-04 y HU-09 (reposición), HU-06 (queda en el historial), RNF-03

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Recurso } from '../types/Recurso';
import { useUsuario } from '../context/ContextoUsuario';
import { reponerStock } from '../services/recursosService';
import { validarReposicion, textoResumenReposicion } from '../utils/reposicion';
import './FormularioReponerStock.css';

interface PropsFormularioReponerStock {
  recurso: Recurso;
  // Se llama después de guardar, para que App redibuje todo
  // (así la alerta de reposición desaparece si ya hay suficientes).
  onStockRepuesto: () => void;
}

// Componente FormularioReponerStock
// Recibe: el recurso y la función para avisar que se guardó.
// ¿Y la persona conectada? La sacamos con useUsuario() (guía, paso 6).
// Su nombre queda en el historial.
// Devuelve: el formulario "Reponer stock".
function FormularioReponerStock(props: PropsFormularioReponerStock) {
  // useUsuario() = "¿quién está conectado?" (ver context/ContextoUsuario.ts).
  const usuario = useUsuario();
  const recurso = props.recurso;

  // La memoria del formulario: una por cajita, más los mensajes.
  const [cantidadTexto, setCantidadTexto] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  // true mientras esperamos a Firestore: apaga el botón para no guardar dos veces.
  const [guardando, setGuardando] = useState(false);

  // guardarReposicion
  // Se ejecuta al apretar "Agregar unidades".
  // Recibe: el evento del formulario. No devuelve nada.
  async function guardarReposicion(evento: FormEvent) {
    evento.preventDefault(); // que no se recargue la página
    setMensajeExito('');

    // 1. Revisar.
    const error = validarReposicion(cantidadTexto, motivo);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    // 2. Guardar (y esperar a Firestore).
    const cantidad = Number(cantidadTexto);
    setGuardando(true);
    const seGuardo = await reponerStock(recurso.id, cantidad, motivo, usuario.nombre);
    setGuardando(false);

    // 3. Contar cómo nos fue.
    if (seGuardo) {
      setMensajeError('');
      // recurso.cantidades.disponible YA tiene el número nuevo, porque el
      // servicio cambió este mismo objeto (no una copia).
      setMensajeExito(textoResumenReposicion(cantidad, recurso.cantidades.disponible));
      // Dejamos las cajitas como al principio para la próxima vez.
      setCantidadTexto('1');
      setMotivo('');
      props.onStockRepuesto(); // avisamos hacia arriba
    } else {
      setMensajeError('No se pudo reponer el stock. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  // Un texto de ayuda: cuántas hay y, si tiene, el mínimo.
  // Ej: "Disponibles: 2 · Mínimo: 5".
  let textoStockActual = 'Disponibles: ' + recurso.cantidades.disponible;
  if (recurso.stockMinimo !== undefined) {
    textoStockActual = textoStockActual + ' · Mínimo: ' + recurso.stockMinimo;
  }

  return (
    // Tiene DOS clases: "formulario-cambio-estado" (para verse igual al otro
    // recuadro) y "formulario-reponer-stock" (para lo propio de este).
    // En CSS, un elemento puede tener varias clases separadas por espacio.
    <form
      className="formulario-cambio-estado formulario-reponer-stock"
      onSubmit={guardarReposicion}
      noValidate
    >
      <h3 className="formulario-cambio-titulo">Reponer stock</h3>
      <p className="reponer-stock-actual">{textoStockActual}</p>

      <label htmlFor="cantidad-reponer">Unidades que llegaron</label>
      <input
        id="cantidad-reponer"
        type="number"
        min="1"
        value={cantidadTexto}
        onChange={(evento) => setCantidadTexto(evento.target.value)}
      />

      <label htmlFor="motivo-reponer">Motivo</label>
      <input
        id="motivo-reponer"
        type="text"
        placeholder="Ej: Compra orden 123"
        value={motivo}
        onChange={(evento) => setMotivo(evento.target.value)}
      />

      {mensajeError !== '' && <p className="formulario-cambio-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="formulario-cambio-exito">{mensajeExito}</p>}

      <button type="submit" className="formulario-cambio-boton" disabled={guardando}>
        {guardando && 'Guardando...'}
        {!guardando && 'Agregar unidades'}
      </button>
    </form>
  );
}

export default FormularioReponerStock;
