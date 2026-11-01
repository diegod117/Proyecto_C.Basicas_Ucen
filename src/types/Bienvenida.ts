// Bienvenida.ts
// Moldes de los textos fijos de la página de bienvenida (PaginaLogin):
// las filas de "Qué puedes hacer", sus fotos, las preguntas frecuentes y
// los créditos de las fotos. Los datos están en src/data/ y NO se guardan
// en Firestore: son parte de la página, como cualquier otro texto.
// Cubre: inicio de sesión (sección 3.4 de requerimientos), RNF-01

// Una fila de "Qué puedes hacer": un título corto y un párrafo
export interface FilaQueHace {
  titulo: string;
  texto: string;
}

// Una foto de la página: el archivo en public/bienvenida/ y su texto
// alternativo (qué muestra, para lectores de pantalla).
export interface FotoBienvenida {
  archivo: string;
  alt: string;
}

// Una pregunta frecuente con su respuesta
export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

// Crédito de una foto de Wikimedia Commons (lo pide su licencia).
// autor puede ir vacío ('') si la foto no tiene un autor conocido.
export interface CreditoFoto {
  titulo: string;
  urlPagina: string;
  autor: string;
  licencia: string;
  urlLicencia: string;
}
