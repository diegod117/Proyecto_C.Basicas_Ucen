// SeccionCategorias.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Una de las tres tarjetas de la página "Configuración".
// Arriba muestra las categorías que existen (como pastillitas azules) y
// abajo tiene un formulario para agregar una nueva (ej: "Material de vidrio").
// Las categorías nuevas aparecen SOLAS en el filtro del inventario y en el
// formulario "Agregar recurso", porque esos dos le piden la lista al
// mismo servicio (configuracionService).
// Usa los estilos de PaginaConfiguracion.css.
// En la guía: paso 4 (formularios) y paso 13 (Configuración).
// Cubre: RF-08, RNF-05 (incorporar categorías sin cambios estructurales)

import { useState } from 'react';
import type { FormEvent } from 'react';
import { obtenerCategorias, agregarCategoria } from '../services/configuracionService';
import { crearClaveCategoria, validarNuevaCategoria } from '../utils/configuracion';

// Las props que le pasa PaginaConfiguracion.
interface PropsSeccionCategorias {
  // Una función de la página para avisar "¡agregué una categoría!"
  // (así la página se redibuja).
  onAgregado: () => void;
}

// Componente SeccionCategorias
// Recibe: la función para avisar que se agregó algo.
// Devuelve: la tarjeta con la lista de categorías y el formulario.
function SeccionCategorias(props: PropsSeccionCategorias) {
  // ---------------------------------------------------------------
  // LA MEMORIA DEL FORMULARIO (formulario controlado, guía paso 4).
  // ---------------------------------------------------------------
  // Lo que se escribe en la cajita "Nueva categoría".
  const [nombre, setNombre] = useState('');
  // El cuadradito (checkbox): ¿las cosas de esta categoría se gastan?
  // Si se marca, el formulario "Agregar recurso" pedirá su stock mínimo.
  const [usaStockMinimo, setUsaStockMinimo] = useState(false);
  // Los mensajes rojo (error) y verde (éxito). '' = no se muestran.
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  // true mientras esperamos a Firestore (para apagar el botón y no guardar dos veces).
  const [guardando, setGuardando] = useState(false);

  // Las categorías que ya existen (de la copia en memoria del servicio).
  const categorias = obtenerCategorias();

  // guardar
  // Se ejecuta al apretar "+ Agregar categoría".
  // Recibe el evento del formulario. No devuelve nada.
  // Es la misma receta de todos los formularios (guía, paso 4.4):
  // 1. no recargar, 2. revisar, 3. guardar, 4. limpiar y avisar.
  async function guardar(evento: FormEvent) {
    evento.preventDefault(); // que el navegador no recargue la página
    setMensajeExito('');

    // 2. Revisar (utils/configuracion.ts). Si hay error, lo mostramos y paramos.
    const error = validarNuevaCategoria(nombre, categorias);
    if (error !== '') {
      setMensajeError(error);
      return;
    }

    setMensajeError('');
    setGuardando(true);
    // 3. Guardar. trim() le saca los espacios de los lados.
    const nombreLimpio = nombre.trim();
    // Le pasamos al servicio la categoría completa: la clave se arma sola
    // a partir del nombre ("Material de vidrio" -> "material_de_vidrio").
    const seGuardo = await agregarCategoria({
      clave: crearClaveCategoria(nombreLimpio),
      nombre: nombreLimpio,
      usaStockMinimo: usaStockMinimo,
    });
    setGuardando(false);

    // 4. Si se guardó: mensaje verde, limpiar el formulario y avisar a la página.
    if (seGuardo) {
      setMensajeExito('Categoría "' + nombreLimpio + '" agregada.');
      setNombre('');
      setUsaStockMinimo(false);
      props.onAgregado();
    } else {
      setMensajeError('No se pudo guardar la categoría. Revisa tu conexión.');
    }
  }

  return (
    <article className="configuracion-tarjeta">
      <h3 className="configuracion-titulo">Categorías de recursos ({categorias.length})</h3>

      {/* La lista de categorías, como pastillitas. <ul> = lista, <li> = cada elemento.
          La "key" es la clave de la categoría, porque nunca se repite (guía, paso 3.5).
          Si la categoría usa stock mínimo, le agregamos una notita gris. */}
      <ul className="configuracion-lista">
        {categorias.map((categoria) => (
          <li key={categoria.clave} className="configuracion-item">
            {categoria.nombre}
            {categoria.usaStockMinimo && <span className="configuracion-nota"> · stock mínimo</span>}
          </li>
        ))}
      </ul>

      {/* noValidate = que el navegador no revise solo; revisamos nosotros
          (así los mensajes de error son los nuestros, en español). */}
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
        {/* Un checkbox usa "checked" (en vez de "value") para saber si está
            marcado, y el evento trae true/false en evento.target.checked. */}
        <label className="configuracion-checkbox">
          <input
            type="checkbox"
            checked={usaStockMinimo}
            onChange={(evento) => setUsaStockMinimo(evento.target.checked)}
          />
          Se gasta (pedir stock mínimo, como insumos y reactivos)
        </label>
        <button type="submit" className="boton-principal" disabled={guardando}>
          + Agregar categoría
        </button>
      </form>

      {/* Los mensajes: solo se dibujan si tienen algo escrito. */}
      {mensajeError !== '' && <p className="configuracion-error">{mensajeError}</p>}
      {mensajeExito !== '' && <p className="configuracion-exito">{mensajeExito}</p>}
    </article>
  );
}

export default SeccionCategorias;
