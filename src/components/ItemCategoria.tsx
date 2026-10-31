// ItemCategoria.tsx
// Un ítem de la lista de categorías de la página "Configuración": muestra
// el nombre, las notas (stock mínimo, número de serie) y la descripción breve.
// Se separó de SeccionCategorias para que ese archivo no creciera demasiado.
// Usa los estilos de PaginaConfiguracion.css.
// Cubre: RF-08 (descripción breve), RNF-05, HU-12 (nota de número de serie)

import type { Categoria } from '../types/Configuracion';
import { textoDescripcionCategoria } from '../utils/configuracion';
import { categoriaUsaNumeroSerie } from '../utils/unidades';

interface PropsItemCategoria {
  // La categoría que se dibuja
  categoria: Categoria;
}

// Componente ItemCategoria
// Recibe: la categoría.
// Devuelve: el <li> con su nombre, sus notas y su descripción.
// (La "key" de la lista la pone SeccionCategorias, donde se hace el .map().)
function ItemCategoria(props: PropsItemCategoria) {
  const categoria = props.categoria;

  return (
    <li className="configuracion-item-categoria">
      {categoria.nombre}
      {categoria.usaStockMinimo && <span className="configuracion-nota"> · stock mínimo</span>}
      {categoriaUsaNumeroSerie(categoria.clave) && (
        <span className="configuracion-nota"> · número de serie</span>
      )}
      {/* Si la categoría no tiene descripción, el texto dice "Sin descripción" */}
      <span className="configuracion-descripcion">{textoDescripcionCategoria(categoria)}</span>
    </li>
  );
}

export default ItemCategoria;
