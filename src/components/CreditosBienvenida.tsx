// CreditosBienvenida.tsx
// Créditos que van en el pie de la bienvenida:
//   1) el equipo que hizo LabCentral (bloque pedido por el profesor) y
//   2) los créditos de las fotos de Wikimedia Commons, con sus enlaces.
// Cubre: presentación del proyecto (no corresponde a una HU)

import { integrantesEquipo } from '../data/bienvenida';
import { creditosFotos } from '../data/creditosBienvenida';
import './CreditosBienvenida.css';

// Componente CreditosBienvenida
// No recibe props. Devuelve el bloque del equipo y el párrafo de créditos.
function CreditosBienvenida() {
  return (
    <div className="creditos">
      <div className="creditos-equipo">
        <p className="bienv-titulo creditos-equipo-titulo">Realizado en equipo por:</p>
        {/* Un nombre por línea */}
        {integrantesEquipo.map((nombre) => (
          <p key={nombre} className="bienv-titulo creditos-equipo-nombre">
            {nombre}
          </p>
        ))}
        <p className="bienv-nota creditos-equipo-nota">
          Ingeniería Civil en Computación e Informática · Programación de Aplicaciones · Prof. Luis Rojas Rubio
        </p>
      </div>

      {/* Cada foto: «título» (enlace a su página), autor si tiene, y la
          licencia (enlace a su texto). target="_blank" abre otra pestaña y
          rel="noopener noreferrer" impide que esa pestaña controle la nuestra. */}
      <p className="creditos-fotos">
        Fotografías:{' '}
        {creditosFotos.map((credito, indice) => {
          let separador = '; ';
          if (indice === creditosFotos.length - 1) {
            separador = '. ';
          }
          let textoAutor = '';
          if (credito.autor !== '') {
            textoAutor = credito.autor + ', ';
          }
          return (
            <span key={credito.urlPagina}>
              «<a href={credito.urlPagina} target="_blank" rel="noopener noreferrer">{credito.titulo}</a>»,{' '}
              {textoAutor}
              <a href={credito.urlLicencia} target="_blank" rel="noopener noreferrer">{credito.licencia}</a>
              {separador}
            </span>
          );
        })}
        Todas vía Wikimedia Commons. Imágenes redimensionadas y mostradas en escala de grises.
      </p>
    </div>
  );
}

export default CreditosBienvenida;
