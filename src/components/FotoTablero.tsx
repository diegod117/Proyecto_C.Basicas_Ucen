// FotoTablero.tsx
// Una foto del tablero de bienvenida: el tile recorta la foto con sus
// esquinas redondeadas y la foto lo llena. Se usa dos veces (probetas y
// hornos). Se separó de TableroBienvenida para que su .css no pasara de
// ~200 líneas.
// Cubre: RNF-01

import './FotoTablero.css';

interface PropsFotoTablero {
  // Nombre del archivo en public/bienvenida/ (ej: 'probetas-tinta.jpg')
  archivo: string;
  // Qué muestra la foto, para lectores de pantalla
  alt: string;
  // Tamaño original de la foto (ayuda al navegador a reservar el espacio)
  ancho: number;
  alto: number;
  // Clase que dice en qué área de la grilla va y qué animación tiene
  // ('tablero-foto-probetas' o 'tablero-foto-hornos')
  clase: string;
}

// Componente FotoTablero
// Recibe: el archivo, el texto alternativo, el tamaño y la clase.
// Devuelve: el tile con la foto. Sin loading="lazy", porque las dos fotos
// del tablero se ven apenas se abre la página.
function FotoTablero(props: PropsFotoTablero) {
  return (
    <div className={'tablero-tile tablero-foto ' + props.clase}>
      <img src={'/bienvenida/' + props.archivo} alt={props.alt} width={props.ancho} height={props.alto} />
    </div>
  );
}

export default FotoTablero;
