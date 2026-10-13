// FichaSegunRuta.tsx
// ¿QUÉ ES ESTE ARCHIVO?
// Un componente "intermediario" entre la dirección (URL) y la ficha.
// Lee el número del recurso que viene en la dirección
// (ej: /inventario/3 -> 3), busca ese recurso y muestra su ficha.
// Si ese número no existe (ej: /inventario/999), te devuelve al listado.
// ¿Para qué? Gracias a esto cada ficha tiene su PROPIA dirección: puedes
// recargar la página, copiar el link o usar el botón "Atrás" del navegador,
// y sigues viendo la misma ficha.
// En la guía: paso 10 (useParams).
// Cubre: HU-02 (ficha del recurso) con React Router

// useParams = el hook de React Router que lee las partes que CAMBIAN de la dirección.
import { Navigate, useParams } from 'react-router-dom';
import { obtenerRecursoPorId } from '../services/recursosService';
import FichaRecurso from './FichaRecurso';

// Las props que le pasa PaginaInventario.
interface PropsFichaSegunRuta {
  // Una función de la página para volver al listado.
  onVolver: () => void;
  // Una función para avisar que se guardó un cambio (viaja hasta App).
  onEstadoCambiado: () => void;
}

// Componente FichaSegunRuta
// Recibe: las funciones para volver y para avisar cambios.
// Devuelve: la ficha del recurso de la dirección, o un "desvío" al listado.
function FichaSegunRuta(props: PropsFichaSegunRuta) {
  // useParams() devuelve un objeto con las partes que cambian de la dirección.
  // En PaginaInventario la ruta se llama ":idRecurso", así que aquí el
  // número viene en parametros.idRecurso. OJO: viene como TEXTO ("3"),
  // porque una dirección siempre es texto.
  const parametros = useParams();
  // Number("3") convierte el texto "3" en el número 3.
  const idRecurso = Number(parametros.idRecurso);

  // Buscamos el recurso. Si el texto no era un número (ej: /inventario/hola),
  // Number da NaN ("no es un número") y simplemente no encuentra nada.
  const recurso = obtenerRecursoPorId(idRecurso);

  // undefined = "no lo encontré". Te mandamos de vuelta al listado.
  if (recurso === undefined) {
    return <Navigate to="/inventario" replace />;
  }

  // Lo encontramos: dibujamos la ficha de siempre, pasándole las props.
  return (
    <FichaRecurso
      recurso={recurso}
      onVolver={props.onVolver}
      onEstadoCambiado={props.onEstadoCambiado}
    />
  );
}

export default FichaSegunRuta;
