// CargadorDatos.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Es la "sala de espera" que aparece justo después de iniciar sesión.
// Mientras los datos viajan desde Firestore (internet) al computador,
// muestra "Cargando datos del inventario...". Cuando llegan, deja pasar:
// muestra lo que tiene adentro (el menú y las páginas).
// Si algo falla (ej: sin internet), muestra el error y un botón "Reintentar".
// En la guía: paso 5 (useEffect y async) y paso 3 (children).
// Cubre: RNF-06 (los datos vienen de Firestore y no se pierden al recargar)
//
// ¿Por qué hay que esperar? Las páginas leen la COPIA EN MEMORIA de cada
// servicio (ver recursosService.ts). Si se mostraran antes de que lleguen
// los datos, verían las listas vacías: un inventario sin nada.

import { useState, useEffect } from 'react';
// ReactNode es un TIPO: "cualquier cosa que React sabe dibujar".
import type { ReactNode } from 'react';
import { cargarTodosLosDatos } from '../services/cargaDatos';

// Las props que recibe (la "lista del almacén").
interface PropsCargadorDatos {
  // "children" (hijos) es una prop ESPECIAL: es lo que se escribe ENTRE
  // la etiqueta que abre y la que cierra, así:
  //   <CargadorDatos> ...esto son los children... </CargadorDatos>
  // En App.tsx, los children son el menú y la página.
  // Es como una caja de regalo: CargadorDatos es la caja, y no deja ver el
  // regalo (children) hasta que los datos estén listos.
  children: ReactNode;
  // Una función de App que llamamos cuando los datos ya llegaron.
  // App la usa para volver a dibujarse y así recalcular, por ejemplo, el
  // numerito de alertas del menú (que antes se calculó con listas vacías).
  onDatosListos: () => void;
}

// Componente CargadorDatos
// Recibe: lo que tiene que mostrar cuando esté listo (children) y la
// función para avisarle a App.
// Devuelve: el aviso de "Cargando...", el error con "Reintentar", o el contenido.
function CargadorDatos(props: PropsCargadorDatos) {
  // En qué etapa va la descarga. Solo puede ser uno de estos 3 textos
  // (un tipo unión escrito directo dentro del useState):
  //   'cargando' -> se ve "Cargando datos del inventario..."
  //   'listo'    -> se ve el contenido (menú y páginas)
  //   'error'    -> se ve el error y el botón "Reintentar"
  const [estadoDatos, setEstadoDatos] = useState<'cargando' | 'listo' | 'error'>('cargando');
  const [mensajeError, setMensajeError] = useState('');
  // Cuántas veces se apretó "Reintentar". Cada vez que sube, el useEffect
  // de abajo se vuelve a ejecutar (porque "intentos" está en su lista).
  const [intentos, setIntentos] = useState(0);

  // useEffect = "haz esto DESPUÉS de dibujar".
  // La lista del final, [intentos], dice CUÁNDO repetirlo:
  //   - la primera vez que aparece el componente (justo después del login),
  //   - y cada vez que "intentos" cambia (al apretar "Reintentar").
  useEffect(() => {
    // Regla de React: la función de useEffect NO puede ser async.
    // Truco: creamos una función async aquí adentro y la llamamos al tiro.
    async function descargarDatos() {
      setEstadoDatos('cargando');
      // Esperamos a que lleguen TODOS los datos. Devuelve '' si salió bien.
      const error = await cargarTodosLosDatos();
      if (error === '') {
        setEstadoDatos('listo');
        props.onDatosListos(); // le avisamos a App
      } else {
        setMensajeError(error);
        setEstadoDatos('error');
      }
    }
    descargarDatos();
    // ¿Por qué la lista tiene solo "intentos" y no "props"?
    // Cuando terminamos, avisamos a App (onDatosListos) y App se redibuja,
    // lo que crea props nuevas. Si "props" estuviera en la lista, el
    // useEffect se volvería a ejecutar, descargaría otra vez, avisaría a App
    // otra vez... ¡y así para siempre! Por eso la dejamos fuera a propósito.
    // La línea de abajo le dice al revisor de código (lint) "sé lo que hago".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intentos]);

  // Etapa 1: todavía cargando.
  if (estadoDatos === 'cargando') {
    return <p className="contenido-pagina texto-secundario">Cargando datos del inventario...</p>;
  }

  // Etapa "error": mostramos el mensaje y el botón para intentar de nuevo.
  if (estadoDatos === 'error') {
    return (
      <section className="contenido-pagina">
        <p>{mensajeError}</p>
        {/* .boton-principal es un estilo de global.css (botón azul).
            Al hacer clic sumamos 1 a intentos -> el useEffect se repite. */}
        <button type="button" className="boton-principal" onClick={() => setIntentos(intentos + 1)}>
          Reintentar
        </button>
      </section>
    );
  }

  // Etapa "listo": abrimos la caja y mostramos el regalo (los children).
  return <>{props.children}</>;
}

export default CargadorDatos;
