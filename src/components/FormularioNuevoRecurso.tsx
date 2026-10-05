// FormularioNuevoRecurso.tsx
// Formulario "Agregar recurso" de la página de inventario: el encargado
// agrega un recurso nuevo sin tener que entrar a la consola de Firebase.
// Las unidades iniciales entran como "disponible" y el alta queda
// registrada en el historial del recurso.
// La ubicación y los datos opcionales van en componentes aparte
// (CamposUbicacionRecurso y CamposDetalleRecurso) para que este archivo
// no crezca demasiado.
// Cubre: RF-01, RF-08 (categoría), RF-10 y HU-11 (ubicación), RNF-03

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { DatosNuevoRecurso, CategoriaRecurso } from '../types/Recurso';
import type { Usuario } from '../types/Usuario';
import { listaCategoriasRecurso, textoCategoria } from '../utils/inventario';
import { datosVaciosNuevoRecurso, usaStockMinimo, validarNuevoRecurso } from '../utils/nuevoRecurso';
import { agregarRecurso, obtenerRecursos } from '../services/recursosService';
import CamposUbicacionRecurso from './CamposUbicacionRecurso';
import CamposDetalleRecurso from './CamposDetalleRecurso';
import './FormularioNuevoRecurso.css';

interface PropsFormularioNuevoRecurso {
  // Usuario conectado: su nombre queda en el registro de "alta" del historial
  usuario: Usuario;
  // Se llama después de guardar, con el id del recurso nuevo
  // (la página lo usa para abrir su ficha)
  onGuardado: (idRecurso: number) => void;
  // Se llama al apretar "Cancelar" (la página vuelve al listado)
  onCancelar: () => void;
}

// Componente FormularioNuevoRecurso
// Recibe: el usuario, la función que avisa que se guardó y la de cancelar.
// Devuelve: el formulario completo.
function FormularioNuevoRecurso(props: PropsFormularioNuevoRecurso) {
  // Todos los campos del formulario en un solo objeto (ver DatosNuevoRecurso).
  // Para cambiar un campo se usa { ...datos, campo: valor }: copia el objeto
  // completo y cambia solo ese campo. Así React detecta el cambio.
  const [datos, setDatos] = useState<DatosNuevoRecurso>(datosVaciosNuevoRecurso);
  const [mensajeError, setMensajeError] = useState('');
  // true mientras se espera a Firestore: desactiva el botón
  const [guardando, setGuardando] = useState(false);

  // cambiarDatos
  // Recibe: los datos con algún campo cambiado. No devuelve nada.
  // Además de guardarlos, borra el mensaje de error: si el encargado ya
  // está corrigiendo el campo, el error anterior ya no corresponde.
  function cambiarDatos(nuevosDatos: DatosNuevoRecurso) {
    setDatos(nuevosDatos);
    setMensajeError('');
  }

  // guardar
  // Recibe el evento del formulario. No devuelve nada.
  // Es "async" porque agregarRecurso guarda en Firestore.
  async function guardar(evento: FormEvent) {
    evento.preventDefault();

    const error = validarNuevoRecurso(datos, obtenerRecursos());
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    setMensajeError('');
    setGuardando(true);
    const recursoNuevo = await agregarRecurso(datos, props.usuario.nombre);
    setGuardando(false);

    if (recursoNuevo === null) {
      setMensajeError('No se pudo guardar el recurso. Revisa tu conexión e inténtalo de nuevo.');
    } else {
      props.onGuardado(recursoNuevo.id);
    }
  }

  return (
    <form className="nuevo-recurso" onSubmit={guardar} noValidate>
      <h2 className="nuevo-recurso-titulo">Agregar recurso al inventario</h2>
      <p className="texto-secundario">
        Las unidades iniciales entran como "Disponible". Si alguna viene mala, se
        cambia después en su ficha con "Cambiar estado".
      </p>

      <fieldset className="nuevo-recurso-grupo">
        <legend>Recurso</legend>
        <label className="nuevo-recurso-campo">
          Nombre
          <input
            type="text"
            placeholder="Ej: Multímetro Fluke 87V"
            value={datos.nombre}
            onChange={(evento) => cambiarDatos({ ...datos, nombre: evento.target.value })}
          />
        </label>

        <div className="nuevo-recurso-fila">
          <label className="nuevo-recurso-campo">
            Categoría
            <select
              value={datos.categoria}
              onChange={(evento) =>
                cambiarDatos({ ...datos, categoria: evento.target.value as CategoriaRecurso })
              }
            >
              <option value="">Elige una categoría</option>
              {listaCategoriasRecurso.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {textoCategoria(categoria)}
                </option>
              ))}
            </select>
          </label>
          <label className="nuevo-recurso-campo">
            Cantidad inicial
            <input
              type="number"
              min="1"
              value={datos.cantidadTexto}
              onChange={(evento) => cambiarDatos({ ...datos, cantidadTexto: evento.target.value })}
            />
          </label>
        </div>

        {/* El stock mínimo solo tiene sentido en insumos y reactivos (HU-09) */}
        {usaStockMinimo(datos) && (
          <label className="nuevo-recurso-campo">
            Stock mínimo (opcional: avisa cuando quedan pocas unidades)
            <input
              type="number"
              min="0"
              value={datos.stockMinimoTexto}
              onChange={(evento) => cambiarDatos({ ...datos, stockMinimoTexto: evento.target.value })}
            />
          </label>
        )}
      </fieldset>

      {/* Le pasamos cambiarDatos: los componentes hijos la llaman con los datos cambiados */}
      <CamposUbicacionRecurso datos={datos} onCambiar={cambiarDatos} />
      <CamposDetalleRecurso datos={datos} onCambiar={cambiarDatos} />

      {mensajeError !== '' && <p className="nuevo-recurso-error">{mensajeError}</p>}

      <div className="nuevo-recurso-botones">
        {/* type="button" para que "Cancelar" NO envíe el formulario */}
        <button type="button" className="boton-secundario" onClick={props.onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="boton-principal" disabled={guardando}>
          {guardando && 'Guardando...'}
          {!guardando && 'Agregar recurso'}
        </button>
      </div>
    </form>
  );
}

export default FormularioNuevoRecurso;
