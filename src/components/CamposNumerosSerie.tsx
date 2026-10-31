// CamposNumerosSerie.tsx
// Parte del formulario "Agregar recurso" para equipos e instrumentos:
// muestra un campo de texto por cada unidad, para escribir su número de
// serie o de inventario. Si la cantidad inicial es 3, aparecen 3 campos.
// Usa los estilos de FormularioNuevoRecurso.css.
// Cubre: HU-12, RF-11 (CA-12.1)

import type { DatosNuevoRecurso } from '../types/Recurso';
import { MAXIMO_UNIDADES_CON_SERIE } from '../utils/unidades';

interface PropsCamposNumerosSerie {
  datos: DatosNuevoRecurso;
  // Igual que en CamposDetalleRecurso: recibe los datos completos con un campo cambiado
  onCambiar: (datos: DatosNuevoRecurso) => void;
}

// Componente CamposNumerosSerie
// Recibe: los datos del formulario y la función para cambiarlos.
// Devuelve: un campo por unidad, o un aviso si la cantidad todavía no es válida.
function CamposNumerosSerie(props: PropsCamposNumerosSerie) {
  const datos = props.datos;
  const cantidad = Number(datos.cantidadTexto);

  // Mientras la cantidad no sea un entero entre 1 y el máximo, no sabemos
  // cuántos campos mostrar
  const cantidadValida =
    datos.cantidadTexto.trim() !== '' && Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= MAXIMO_UNIDADES_CON_SERIE;

  if (!cantidadValida) {
    return (
      <p className="texto-secundario">
        Escribe una cantidad inicial entre 1 y {MAXIMO_UNIDADES_CON_SERIE} para ingresar el número
        de serie de cada unidad.
      </p>
    );
  }

  // cambiarNumero
  // Recibe: la posición de la unidad y el texto nuevo. No devuelve nada.
  // Copia la lista, cambia solo esa posición y avisa al formulario.
  function cambiarNumero(posicion: number, texto: string) {
    const numeros = [...datos.numerosUnidades];
    // Si la lista es más corta que la posición, rellenamos con textos vacíos
    while (numeros.length <= posicion) {
      numeros.push('');
    }
    numeros[posicion] = texto;
    props.onCambiar({ ...datos, numerosUnidades: numeros });
  }

  // Hacemos una lista [0, 1, 2...] con una posición por unidad para poder
  // recorrerla con .map y crear un campo por cada una
  const posiciones: number[] = [];
  for (let i = 0; i < cantidad; i++) {
    posiciones.push(i);
  }

  return (
    <div className="nuevo-recurso-series">
      <p className="texto-secundario">
        N° de serie o de inventario de cada unidad (no se pueden repetir):
      </p>
      <div className="nuevo-recurso-series-lista">
        {posiciones.map((posicion) => {
          // Si todavía no escribió nada en esa posición, el campo va vacío
          let valor = '';
          if (datos.numerosUnidades[posicion] !== undefined) {
            valor = datos.numerosUnidades[posicion];
          }
          return (
            <label key={posicion} className="nuevo-recurso-campo">
              Unidad {posicion + 1}
              <input
                type="text"
                value={valor}
                onChange={(evento) => cambiarNumero(posicion, evento.target.value)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default CamposNumerosSerie;
