// FichaSegunRuta.tsx
// Lee el id del recurso desde la URL (ej: /inventario/3 -> 3), lo busca en
// el servicio y muestra su ficha. Si el id no existe (ej: /inventario/999),
// vuelve al listado.
// Gracias a esto cada ficha tiene su propia dirección: se puede recargar
// la página o usar el botón "Atrás" del navegador y se sigue viendo la ficha.
// Cubre: HU-02 (ficha del recurso) con React Router

import { Navigate, useParams } from 'react-router-dom';
import { obtenerRecursoPorId } from '../services/recursosService';
import FichaRecurso from './FichaRecurso';

interface PropsFichaSegunRuta {
  // Función de la página para volver al listado
  onVolver: () => void;
  // Función para avisar que se guardó un cambio (viaja hasta App)
  onEstadoCambiado: () => void;
}

// Componente FichaSegunRuta
// Recibe: las funciones para volver y para avisar cambios.
// Devuelve: la ficha del recurso de la URL, o una redirección al listado.
function FichaSegunRuta(props: PropsFichaSegunRuta) {
  // useParams (React Router) devuelve las partes variables de la URL.
  // La ruta se llama ":idRecurso" (ver PaginaInventario.tsx), así que aquí
  // viene en parametros.idRecurso, como TEXTO (ej: "3").
  const parametros = useParams();
  const idRecurso = Number(parametros.idRecurso);

  // Si el texto no era un número, Number da NaN y no encuentra nada
  const recurso = obtenerRecursoPorId(idRecurso);

  if (recurso === undefined) {
    return <Navigate to="/inventario" replace />;
  }

  return (
    <FichaRecurso
      recurso={recurso}
      onVolver={props.onVolver}
      onEstadoCambiado={props.onEstadoCambiado}
    />
  );
}

export default FichaSegunRuta;
