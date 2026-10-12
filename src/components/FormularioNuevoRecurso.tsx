// FormularioNuevoRecurso.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// El formulario "Agregar recurso" (botón "+ Agregar recurso", solo el
// encargado). Sirve para sumar un recurso NUEVO al inventario sin tener que
// entrar a la consola de Firebase.
// Las unidades entran como "disponible" y queda una línea de "alta" en el historial.
// Es un formulario grande, así que se partió en 3 pedazos (componentes):
//   - este archivo: nombre, categoría, cantidad y stock mínimo,
//   - CamposUbicacionRecurso.tsx: torre, sala, bodega y mueble,
//   - CamposDetalleRecurso.tsx: marca, serie, proveedor y observación.
// En la guía: paso 4 (un useState con un OBJETO) y paso 9 (agregar un dato nuevo).
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

// Las props que le pasa PaginaInventario.
interface PropsFormularioNuevoRecurso {
  // La persona conectada: su nombre queda en la línea de "alta" del historial.
  usuario: Usuario;
  // Se llama después de guardar, con el número del recurso nuevo
  // (la página lo usa para abrir su ficha).
  onGuardado: (idRecurso: number) => void;
  // Se llama al apretar "Cancelar" (la página vuelve al listado).
  onCancelar: () => void;
}

// Componente FormularioNuevoRecurso
// Recibe: la persona, la función de "listo" y la de "cancelar".
// Devuelve: el formulario completo.
function FormularioNuevoRecurso(props: PropsFormularioNuevoRecurso) {
  // UN SOLO useState para TODAS las cajitas: un objeto con 12 datos
  // (ver DatosNuevoRecurso en types/Recurso.ts). Es como una mochila con
  // 12 bolsillos, en vez de 12 mochilas separadas.
  // Para cambiar UN bolsillo se escribe { ...datos, nombre: 'nuevo' }:
  //   ...datos  = copia los 12 bolsillos como están,
  //   nombre: ... = y reemplaza solo el bolsillo "nombre".
  // ¿Por qué copiar y no cambiar directo (datos.nombre = 'x')? Porque React
  // solo se da cuenta del cambio si le entregas un objeto NUEVO.
  const [datos, setDatos] = useState<DatosNuevoRecurso>(datosVaciosNuevoRecurso);
  const [mensajeError, setMensajeError] = useState('');
  // true mientras esperamos a Firestore: apaga el botón.
  const [guardando, setGuardando] = useState(false);

  // cambiarDatos
  // Recibe: la mochila con algún bolsillo cambiado. No devuelve nada.
  // Además de guardarla, borra el mensaje de error: si la persona ya está
  // corrigiendo, el error viejo ya no sirve.
  // Esta función se la pasamos también a los componentes hijos.
  function cambiarDatos(nuevosDatos: DatosNuevoRecurso) {
    setDatos(nuevosDatos);
    setMensajeError('');
  }

  // guardar
  // Se ejecuta al apretar "Agregar recurso".
  // Recibe: el evento del formulario. No devuelve nada.
  async function guardar(evento: FormEvent) {
    evento.preventDefault(); // que no se recargue la página

    // 1. Revisar (también revisa que no exista otro igual en el mismo lugar).
    const error = validarNuevoRecurso(datos, obtenerRecursos());
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    // 2. Guardar y esperar a Firestore.
    setMensajeError('');
    setGuardando(true);
    const recursoNuevo = await agregarRecurso(datos, props.usuario.nombre);
    setGuardando(false);

    // 3. ¿Cómo nos fue? agregarRecurso devuelve null si falló.
    if (recursoNuevo === null) {
      setMensajeError('No se pudo guardar el recurso. Revisa tu conexión e inténtalo de nuevo.');
    } else {
      props.onGuardado(recursoNuevo.id); // la página abre la ficha del nuevo
    }
  }

  return (
    <form className="nuevo-recurso" onSubmit={guardar} noValidate>
      <h2 className="nuevo-recurso-titulo">Agregar recurso al inventario</h2>
      <p className="texto-secundario">
        Las unidades iniciales entran como "Disponible". Si alguna viene mala, se
        cambia después en su ficha con "Cambiar estado".
      </p>

      {/* <fieldset> agrupa cajitas que van juntas, con un borde.
          <legend> es el título que aparece sobre el borde. */}
      <fieldset className="nuevo-recurso-grupo">
        <legend>Recurso</legend>
        {/* Aquí la cajita va DENTRO del <label>: así no hace falta htmlFor
            para unirlos (otra forma válida de hacerlo).
            onChange: copiamos la mochila y cambiamos solo el bolsillo "nombre". */}
        <label className="nuevo-recurso-campo">
          Nombre
          <input
            type="text"
            placeholder="Ej: Multímetro Fluke 87V"
            value={datos.nombre}
            onChange={(evento) => cambiarDatos({ ...datos, nombre: evento.target.value })}
          />
        </label>

        {/* Una fila con dos cajitas lado a lado. */}
        <div className="nuevo-recurso-fila">
          <label className="nuevo-recurso-campo">
            Categoría
            <select
              value={datos.categoria}
              onChange={(evento) =>
                cambiarDatos({ ...datos, categoria: evento.target.value as CategoriaRecurso })
              }
            >
              {/* value="" = todavía no se elige nada. */}
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

        {/* El stock mínimo solo aparece si la categoría es insumo o reactivo
            (HU-09). Si eliges "Insumo", ¡aparece solo! Porque al cambiar la
            categoría React redibuja, y esta condición ahora da true. */}
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

      {/* Los otros dos pedazos del formulario. Les pasamos la mochila completa
          (datos) y la función cambiarDatos: cuando la persona escribe en ellos,
          llaman a cambiarDatos con la mochila cambiada, y la memoria de ESTE
          componente se actualiza. Los hijos no tienen memoria propia. */}
      <CamposUbicacionRecurso datos={datos} onCambiar={cambiarDatos} />
      <CamposDetalleRecurso datos={datos} onCambiar={cambiarDatos} />

      {mensajeError !== '' && <p className="nuevo-recurso-error">{mensajeError}</p>}

      <div className="nuevo-recurso-botones">
        {/* type="button" = "Cancelar" NO envía el formulario, solo llama a onCancelar. */}
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
