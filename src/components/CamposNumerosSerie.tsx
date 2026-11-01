// CamposNumerosSerie.tsx
// Campos para escribir el número de serie o de inventario de cada unidad
// de un equipo o instrumento. Si la cantidad es 3, aparecen 3 campos.
// Lo usan "Agregar recurso" (HU-12) y la entrada de unidades (HU-14).
// Usa los estilos de FormularioNuevoRecurso.css.
// Cubre: HU-12, RF-11 (CA-12.1), HU-14, HU-15 (máximo de unidades por operación)

import { MAXIMO_UNIDADES_CON_SERIE } from '../utils/unidades';

interface PropsCamposNumerosSerie {
  // La cantidad de unidades, como texto (así la entrega el <input>)
  cantidadTexto: string;
  // Los números escritos hasta ahora (uno por unidad)
  numeros: string[];
  // Recibe la lista de números completa con una posición cambiada
  onCambiar: (numeros: string[]) => void;
  // Máximo de unidades que acepta el formulario. Si no se indica, es el de
  // "Agregar recurso" (100). La entrada de unidades pasa un máximo menor (HU-15).
  maximo?: number;
}

// Componente CamposNumerosSerie
// Recibe: la cantidad, los números escritos y la función para cambiarlos.
// Devuelve: un campo por unidad, o un aviso si la cantidad todavía no es válida.
function CamposNumerosSerie(props: PropsCamposNumerosSerie) {
  const cantidad = Number(props.cantidadTexto);
  let maximo = MAXIMO_UNIDADES_CON_SERIE;
  if (props.maximo !== undefined) {
    maximo = props.maximo;
  }

  // Mientras la cantidad no sea un entero entre 1 y el máximo, no sabemos
  // cuántos campos mostrar
  const cantidadValida =
    props.cantidadTexto.trim() !== '' && Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= maximo;

  if (!cantidadValida) {
    return (
      <p className="texto-secundario">
        Escribe una cantidad entre 1 y {maximo} para ingresar el número de serie de cada unidad.
      </p>
    );
  }

  // cambiarNumero
  // Recibe: la posición de la unidad y el texto nuevo. No devuelve nada.
  // Copia la lista, cambia solo esa posición y avisa al formulario.
  function cambiarNumero(posicion: number, texto: string) {
    const numeros = [...props.numeros];
    // Si la lista es más corta que la posición, rellenamos con textos vacíos
    while (numeros.length <= posicion) {
      numeros.push('');
    }
    numeros[posicion] = texto;
    props.onCambiar(numeros);
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
          if (props.numeros[posicion] !== undefined) {
            valor = props.numeros[posicion];
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
