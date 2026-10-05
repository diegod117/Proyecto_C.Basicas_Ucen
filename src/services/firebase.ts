// firebase.ts
// Conecta la aplicación con nuestro proyecto de Firebase.
// Es el ÚNICO archivo que sabe a qué proyecto de Firebase nos conectamos;
// los demás archivos importan "autenticacion" (login) y "baseDatos"
// (Firestore) desde aquí.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos),
//        RNF-06 (los datos se guardan en Firestore y no se pierden)

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Datos del proyecto, copiados desde la consola de Firebase
// (Configuración del proyecto > Tus apps > App web).
// Estos datos NO son secretos: identifican el proyecto, pero no dan
// permisos por sí solos. Por eso pueden estar en el repositorio.
const configuracionFirebase = {
  apiKey: 'AIzaSyB5oln7cskiEaXV-u3C_NTK_JGiH8fRlJs',
  authDomain: 'ucen-gestiondelaboratorio.firebaseapp.com',
  projectId: 'ucen-gestiondelaboratorio',
  storageBucket: 'ucen-gestiondelaboratorio.firebasestorage.app',
  messagingSenderId: '31012650945',
  appId: '1:31012650945:web:d2f062bc2692031ac8b940',
};

// initializeApp "enciende" Firebase con nuestros datos. Se hace una sola vez.
const appFirebase = initializeApp(configuracionFirebase);

// getAuth nos da el módulo de autenticación (login/logout) de Firebase.
export const autenticacion = getAuth(appFirebase);

// Idioma de los correos que envía Firebase (por ejemplo, el de
// "Olvidaste tu contraseña"). Sin esto llegarían en inglés.
autenticacion.languageCode = 'es';

// baseDatos es la conexión con Firestore, la base de datos de Firebase.
// Los servicios (recursosService, historialService...) la usan para
// leer y guardar los datos.
//
// ignoreUndefinedProperties: true -> varios campos de nuestros tipos son
// opcionales (ej: "marca?" o "stockMinimo?"). Si un campo viene como
// undefined, Firestore daría error; con esta opción simplemente lo salta.
export const baseDatos = initializeFirestore(appFirebase, {
  ignoreUndefinedProperties: true,
});
