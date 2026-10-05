// FormularioReponerStock.tsx
// Recuadro "Reponer stock" de la ficha, debajo de "Cambiar estado".
// Sirve para sumar unidades NUEVAS que llegan al laboratorio (por ejemplo,
// una compra de guantes). Las unidades entran como "disponible".
// Así se resuelven las alertas de reposición: antes solo se podían mover
// unidades entre estados, pero no agregar unidades nuevas.
// Usa el mismo estilo que FormularioCambioEstado (sus clases CSS).
// Cubre: RF-04 y HU-09 (reposición), HU-06 (queda en el historial), RNF-03

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Recurso } from '../types/Recurso';
import type { Usuario } from '../types/Usuario';
import { reponerStock } from '../services/recursosService';
import { validarReposicion, textoResumenReposicion } from '../utils/reposicion';
import './FormularioReponerStock.css';

interface PropsFormularioReponerStock {
  recurso: Recurso;
  // Se llama después de guardar, para que App redibuje todo
  // (así la alerta de reposición desaparece si ya se llegó al mínimo)
  onStockRepuesto: () => void;
  // Usuario conectado: su nombre queda en el historial
  usuario: Usuario;
}

// Componente FormularioReponerStock
// Recibe: el recurso, la función para avisar que se guardó y el usuario.
// Devuelve: el formulario "Reponer stock".
function FormularioReponerStock(props: PropsFormularioReponerStock) {
  const recurso = props.recurso;

  const [cantidadTexto, setCantidadTexto] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  // true mientras se espera a Firestore: desactiva el botón para no guardar dos veces
  const [guardando, setGuardando] = useState(false);

  // guardarReposicion
  // Recibe: el evento del formulario. No devuelve nada.
  // Es "async" porque el servicio guarda en Firestore y hay que esperarlo.
  async function guardarReposicion(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    const error = validarReposicion(cantidadTexto, motivo);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    const cantidad = Number(cantidadTexto);
    setGuardando(true);
    const seGuardo = await reponerStock(recurso.id, cantidad, motivo, props.usuario.nombre);
    setGuardando(false);

    if (seGuardo) {
      setMensajeError('');
      // recurso.cantidades.disponible ya tiene el número nuevo, porque el
      // servicio modificó este mismo objeto
      setMensajeExito(textoResumenReposicion(cantidad, recurso.cantidades.disponible));
      setCantidadTexto('1');
      setMotivo('');
      props.onStockRepuesto();
    } else {
      setMensajeError('No se pudo reponer el stock. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  // Texto de ayuda: cuántas hay disponibles y, si tiene, el stock mínimo
  let textoStockActual = 'Disponibles: ' + recurso.cantidades.disponible;
  if (recurso.stockMinimo !== undefined) {
    textoStockActual = textoStockActual + ' · Mínimo: ' + recurso.stockMinimo;
  }

  return (
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
