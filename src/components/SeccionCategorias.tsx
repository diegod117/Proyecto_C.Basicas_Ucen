// SeccionCategorias.tsx
// Parte de la página "Configuración": lista las categorías de recursos (con su
// descripción breve) y tiene un formulario para agregar una nueva (ej: "Material de vidrio").
// Las categorías nuevas aparecen en el filtro del inventario y en el
// formulario "Agregar recurso".
// Usa los estilos de PaginaConfiguracion.css.
// Cubre: RF-08 (descripción breve), RNF-05 (incorporar categorías sin cambios estructurales), HU-12 (categorías con número de serie)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { obtenerCategorias, agregarCategoria } from '../services/configuracionService';
import {
  crearClaveCategoria,
  validarNuevaCategoria,
  MAXIMO_DESCRIPCION_CATEGORIA,
} from '../utils/configuracion';
import ItemCategoria from './ItemCategoria';

interface PropsSeccionCategorias {
  // Función de la página para avisar que se agregó una categoría
  onAgregado: () => void;
}

// Componente SeccionCategorias
// Recibe: la función para avisar que se agregó algo.
// Devuelve: la tarjeta con la lista de categorías y el formulario.
function SeccionCategorias(props: PropsSeccionCategorias) {
  const [nombre, setNombre] = useState('');
  // Descripción breve de la categoría (RF-08): es obligatoria y de máximo 120 caracteres
  const [descripcion, setDescripcion] = useState('');
  // Checkbox: ¿los recursos de esta categoría se gastan (tienen stock mínimo)?
  const [usaStockMinimo, setUsaStockMinimo] = useState(false);
  // Checkbox: ¿cada unidad se identifica por número de serie o de inventario? (HU-12)
  const [usaNumeroSerie, setUsaNumeroSerie] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  const categorias = obtenerCategorias();

  // guardar
  // Recibe el evento del formulario. No devuelve nada.
  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeExito('');

    const error = validarNuevaCategoria(nombre, descripcion, categorias);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    setMensajeError('');
    setGuardando(true);
    const nombreLimpio = nombre.trim();
    const seGuardo = await agregarCategoria({
      clave: crearClaveCategoria(nombreLimpio),
      nombre: nombreLimpio,
      descripcion: descripcion.trim(),
      usaStockMinimo: usaStockMinimo,
      usaNumeroSerie: usaNumeroSerie,
    });
    setGuardando(false);

    if (seGuardo) {
      setMensajeExito('Categoría "' + nombreLimpio + '" agregada.');
      setNombre('');
      setDescripcion('');
      setUsaStockMinimo(false);
      setUsaNumeroSerie(false);
      props.onAgregado();
    } else {
      setMensajeError('No se pudo guardar la categoría. Revisa tu conexión.');
    }
  }

  return (
    <article className="configuracion-tarjeta">
      <h3 className="configuracion-titulo">Categorías de recursos ({categorias.length})</h3>

      {/* Lista de categorías. La "key" es la clave, que no se repite. */}
      <ul className="configuracion-lista">
        {categorias.map((categoria) => (
          <ItemCategoria key={categoria.clave} categoria={categoria} />
        ))}
      </ul>

      <form className="configuracion-formulario" onSubmit={guardar} noValidate>
        <label className="configuracion-campo">
          Nueva categoría
          <input
            type="text"
            placeholder="Ej: Material de vidrio"
            value={nombre}
            onChange={(evento) => {
              setNombre(evento.target.value);
              setMensajeError('');
            }}
          />
        </label>
        <label className="configuracion-campo">
          Descripción breve (máx. {MAXIMO_DESCRIPCION_CATEGORIA} caracteres)
          <input
            type="text"
            placeholder="Ej: Elementos fijos como llaves de gas, data o mesones"
            value={descripcion}
            onChange={(evento) => {
              setDescripcion(evento.target.value);
              setMensajeError('');
            }}
          />
        </label>
        {/* Un checkbox usa "checked" en vez de "value" */}
        <label className="configuracion-checkbox">
          <input
            type="checkbox"
            checked={usaStockMinimo}
            onChange={(evento) => setUsaStockMinimo(evento.target.checked)}
          />
          Se gasta (pedir stock mínimo, como insumos y reactivos)
        </label>
        <label className="configuracion-checkbox">
          <input
            type="checkbox"
            checked={usaNumeroSerie}
            onChange={(evento) => setUsaNumeroSerie(evento.target.checked)}
          />
          Cada unidad tiene número de serie o de inventario (como equipos e instrumentos)
        </label>
        <button type="submit" className="boton-principal" disabled={guardando}>
          + Agregar categoría
        </button>
      </form>

      {mensajeError !== '' && <p className="configuracion-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="configuracion-exito">{mensajeExito}</p>}
    </article>
  );
}

export default SeccionCategorias;
