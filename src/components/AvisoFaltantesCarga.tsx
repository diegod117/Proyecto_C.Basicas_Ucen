// AvisoFaltantesCarga.tsx
// Paso 1 de 2 de la carga: muestra las categorías y salas que usa la planilla
// y todavía no existen en Configuración, y las crea cuando el encargado
// aprieta el botón. Antes de escribir nada, muestra la lista exacta de lo que
// se va a crear, porque estas escrituras no se pueden borrar desde la app.
// Usa los estilos de PaginaCargaExcel.css.
// Cubre: HU-16, RF-15, RF-08 (descripción de las categorías), RNF-05

import { useState } from 'react';
import type { FaltantesCarga } from '../types/Importacion';
import { agregarCategoria, agregarSala } from '../services/configuracionService';

// Descripción provisional de las categorías creadas desde la planilla (RF-08
// pide una descripción para cada categoría)
const DESCRIPCION_CATEGORIA_IMPORTADA = 'Categoría importada desde la planilla Excel de inventario.';

interface PropsAvisoFaltantesCarga {
  faltantes: FaltantesCarga;
  // Función de la página para avisar que se crearon cosas (y recalcular la vista previa)
  onCreado: () => void;
}

// Componente AvisoFaltantesCarga
// Recibe: lo que falta crear y la función para avisar que se creó.
// Devuelve: el recuadro del paso 1 (o nada si no falta nada).
function AvisoFaltantesCarga(props: PropsAvisoFaltantesCarga) {
  const [creando, setCreando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const faltantes = props.faltantes;
  if (faltantes.categorias.length === 0 && faltantes.salas.length === 0) {
    return null;
  }

  // crear
  // No recibe nada. Crea una por una las categorías y salas que faltan; si
  // una falla, se detiene y lo dice (al volver a apretar solo se crean las que quedan).
  async function crear() {
    setCreando(true);
    setMensajeError('');
    for (const categoria of faltantes.categorias) {
      const seGuardo = await agregarCategoria({
        clave: categoria.clave,
        nombre: categoria.nombre,
        usaStockMinimo: false,
        usaNumeroSerie: false,
        descripcion: DESCRIPCION_CATEGORIA_IMPORTADA,
      });
      if (!seGuardo) {
        setMensajeError('No se pudo crear la categoría "' + categoria.nombre + '". Revisa tu conexión e inténtalo de nuevo.');
        setCreando(false);
        props.onCreado();
        return;
      }
    }
    for (const sala of faltantes.salas) {
      const seGuardo = await agregarSala(sala);
      if (!seGuardo) {
        setMensajeError('No se pudo crear la sala ' + sala.codigo + '. Revisa tu conexión e inténtalo de nuevo.');
        setCreando(false);
        props.onCreado();
        return;
      }
    }
    setCreando(false);
    props.onCreado();
  }

  return (
    <div className="carga-paso">
      <h3 className="carga-subtitulo">Paso 1 de 2: crear categorías y salas</h3>
      <p>
        La planilla usa categorías o salas que todavía no existen en Configuración. Estas
        escrituras son permanentes: desde la app no se pueden borrar. Se crearán:
      </p>
      <ul>
        {faltantes.categorias.map((categoria) => (
          <li key={categoria.clave}>
            Categoría <strong>{categoria.nombre}</strong> (clave: {categoria.clave})
          </li>
        ))}
        {faltantes.salas.map((sala) => (
          <li key={sala.codigo}>
            Sala <strong>{sala.codigo}</strong> (torre {sala.torre})
          </li>
        ))}
      </ul>
      <button type="button" className="boton-principal" onClick={crear} disabled={creando}>
        {creando && 'Creando...'}
        {!creando && 'Crear categorías y salas'}
      </button>
      {mensajeError !== '' && <p className="carga-error">{mensajeError}</p>}
    </div>
  );
}

export default AvisoFaltantesCarga;
