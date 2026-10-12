// firebase.ts
// ¿QUÉ ES ESTE ARCHIVO?
// Es el "enchufe" que conecta nuestra app con Firebase.
// Firebase es un servicio de Google que nos presta dos cosas:
//   1. Authentication: revisa correos y contraseñas (el guardia de la puerta).
//   2. Firestore: una base de datos en internet (un cuaderno gigante en la
//      nube donde guardamos recursos, historial, incidencias y reservas).
// Este es el ÚNICO archivo que sabe a qué proyecto de Firebase nos conectamos.
// Los demás archivos piden prestado "autenticacion" y "baseDatos" desde aquí.
// En la guía: paso 8 (Firebase y los datos).
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos),
//        RNF-06 (los datos se guardan en Firestore y no se pierden)

// Traemos las herramientas de Firebase (la librería vive en node_modules).
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// La "dirección" de nuestro proyecto en Firebase.
// Se copió de la consola de Firebase (Configuración del proyecto > Tus apps).
// ¿Es peligroso que esté a la vista? No: es como la dirección de una casa.
// Saber la dirección no te da la llave. Lo que protege los datos son las
// reglas de Firestore (docs/firestore.rules) y el inicio de sesión.
// Esto es un objeto: datos con nombre entre llaves { }.
const configuracionFirebase = {
  apiKey: 'AIzaSyB5oln7cskiEaXV-u3C_NTK_JGiH8fRlJs',
  authDomain: 'ucen-gestiondelaboratorio.firebaseapp.com',
  projectId: 'ucen-gestiondelaboratorio',
  storageBucket: 'ucen-gestiondelaboratorio.firebasestorage.app',
  messagingSenderId: '31012650945',
  appId: '1:31012650945:web:d2f062bc2692031ac8b940',
};

// initializeApp = "prende Firebase con esta dirección". Se hace UNA sola vez.
const appFirebase = initializeApp(configuracionFirebase);

// getAuth = dame la parte de Firebase que maneja el inicio de sesión.
// "export" para que authService.ts la pueda usar.
export const autenticacion = getAuth(appFirebase);

// El idioma de los correos que manda Firebase (por ejemplo, el de
// "¿Olvidaste tu contraseña?"). Sin esta línea llegarían en inglés.
autenticacion.languageCode = 'es';

// baseDatos = la conexión con Firestore (el cuaderno en la nube).
// Los servicios (recursosService, historialService...) la usan para
// leer y escribir datos.
//
// ignoreUndefinedProperties: true -> algunos datos son opcionales
// (ej: "marca?"). Si uno no viene, vale undefined (= "no hay nada").
// Firestore se enoja si le mandas undefined; con esta opción, en vez de
// enojarse, simplemente no guarda ese dato.
export const baseDatos = initializeFirestore(appFirebase, {
  ignoreUndefinedProperties: true,
});
