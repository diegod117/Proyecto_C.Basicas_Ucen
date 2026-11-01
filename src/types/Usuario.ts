// Usuario.ts
// Define cómo es un usuario del sistema y qué roles puede tener.
// Lo usan el servicio de autenticación, App.tsx y el menú.
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), base para RNF-03,
//        HU-15, RF-14 (usuarios guardados en Firestore, con estado activo)

// Tipo unión: un usuario solo puede tener uno de estos tres roles
// (los tres usuarios de la tabla 1.2 de requerimientos).
export type RolUsuario = 'encargado' | 'docente' | 'departamento';

// Datos del usuario que inició sesión.
// Firebase Authentication solo nos dice el correo; el nombre, el rol y si
// la cuenta está activa los guardamos en la colección "usuarios" de
// Firestore (el documento se llama igual que el correo, en minúsculas).
export interface Usuario {
  correo: string; // en minúsculas, es el nombre del documento
  nombre: string; // es la llave que une al docente con sus reservas: no se cambia
  rol: RolUsuario;
  // false = cuenta desactivada: no puede iniciar sesión (HU-15, CA-15.3)
  activo: boolean;
}

// Resultado de buscar un usuario en Firestore (login y sesión guardada).
//   - usuario con datos y error '': lo encontró.
//   - usuario null y error '': no existe en la colección (no está registrado).
//   - usuario null y error con texto: no se pudo leer (sin internet o sin permiso).
export interface ResultadoLecturaUsuario {
  usuario: Usuario | null;
  error: string;
}

// Resultado de agregar un usuario desde Configuración (HU-15, CA-15.2)
export interface ResultadoAltaUsuario {
  ok: boolean;
  mensaje: string; // qué pasó, listo para mostrar en pantalla
}

// Resultado de crear la cuenta de acceso en Authentication (HU-15):
//   'creada'  -> se creó la cuenta
//   'existia' -> el correo ya tenía cuenta (no es un error: solo falta registrarlo)
//   cualquier otro texto -> el mensaje de error
export type ResultadoCuenta = 'creada' | 'existia' | string;

// Lo que se puede modificar de un usuario ya registrado (HU-15). El nombre NO,
// porque une al docente con sus reservas. Se indica solo el campo que cambia.
export interface CambioUsuario {
  rol?: RolUsuario;
  activo?: boolean;
}

// Lo que escribe el encargado en el formulario "Agregar usuario" (HU-15).
// El estado "activo" no se pide: un usuario nuevo siempre entra activo.
export interface DatosNuevoUsuario {
  nombre: string;
  correo: string;
  rol: RolUsuario;
}
