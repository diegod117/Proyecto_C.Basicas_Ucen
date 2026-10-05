// CargadorDatos.tsx
// Descarga los datos desde Firestore justo después de iniciar sesión y,
// mientras tanto, muestra "Cargando datos del inventario...".
// Cuando terminan de llegar, muestra lo que tiene adentro (el menú y las páginas).
// Si la descarga falla (ej: sin internet), muestra el error y "Reintentar".
// Cubre: RNF-06 (los datos vienen de Firestore y no se pierden al recargar)
//
// ¿Por qué hay que esperar? Las páginas leen la COPIA EN MEMORIA que tiene
// cada servicio (ver docs/plan-fase-3.md). Si se mostraran antes de
// descargar, verían las listas vacías.

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { cargarTodosLosDatos } from '../services/cargaDatos';

interface PropsCargadorDatos {
  // "children" es lo que se escribe ENTRE las etiquetas del componente:
  //   <CargadorDatos> ...esto... </CargadorDatos>
  // ReactNode es el tipo de "cualquier cosa que React puede dibujar".
  children: ReactNode;
  // Función de App que se llama cuando los datos ya llegaron. App la usa
  // para volver a dibujarse: así recalcula, por ejemplo, el contador de
  // alertas del menú, que antes se había calculado con las listas vacías.
  onDatosListos: () => void;
}

// Componente CargadorDatos
// Recibe: lo que debe mostrar cuando los datos estén listos (children)
// y la función para avisar a App que ya llegaron.
// Devuelve: el aviso de carga, el error con "Reintentar", o el contenido.
function CargadorDatos(props: PropsCargadorDatos) {
  // Estado de la descarga:
  //   'cargando' -> se ve "Cargando datos del inventario..."
  //   'listo'    -> se ve el contenido (menú y páginas)
  //   'error'    -> se ve el error y el botón "Reintentar"
  const [estadoDatos, setEstadoDatos] = useState<'cargando' | 'listo' | 'error'>('cargando');
  const [mensajeError, setMensajeError] = useState('');
  // Cada vez que se aprieta "Reintentar" sumamos 1, y eso vuelve a
  // ejecutar el useEffect de abajo (está en su lista de dependencias).
  const [intentos, setIntentos] = useState(0);

  // Se ejecuta al aparecer el componente (justo después del login) y
  // cada vez que cambia "intentos" (al apretar "Reintentar").
  useEffect(() => {
    // Un useEffect no puede ser async directamente, así que creamos una
    // función async adentro y la llamamos.
    async function descargarDatos() {
      setEstadoDatos('cargando');
      const error = await cargarTodosLosDatos();
      if (error === '') {
        setEstadoDatos('listo');
        props.onDatosListos();
      } else {
        setMensajeError(error);
        setEstadoDatos('error');
      }
    }
    descargarDatos();
    // A propósito la lista tiene solo "intentos" y no "props": App se
    // redibuja después de cada descarga (por onDatosListos), y si "props"
    // estuviera en la lista, la descarga se repetiría sin parar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intentos]);

  if (estadoDatos === 'cargando') {
    return <p className="contenido-pagina texto-secundario">Cargando datos del inventario...</p>;
  }

  if (estadoDatos === 'error') {
    return (
      <section className="contenido-pagina">
        <p>{mensajeError}</p>
        {/* .boton-principal viene de global.css */}
        <button type="button" className="boton-principal" onClick={() => setIntentos(intentos + 1)}>
          Reintentar
        </button>
      </section>
    );
  }

  // Datos listos: dibujamos lo que venía entre las etiquetas
  return <>{props.children}</>;
}

export default CargadorDatos;
