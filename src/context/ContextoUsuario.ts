// ContextoUsuario.ts
// Comparte el usuario conectado con TODA la aplicación usando useContext.
// Antes el usuario se pasaba como prop de componente en componente
// (App -> PaginaInventario -> FichaRecurso -> FormularioCambioEstado),
// aunque los del medio no lo usaran. Ahora App lo "publica" una vez con
// ContextoUsuario.Provider y cualquier componente lo lee con useUsuario().
// Cubre: inicio de sesión con roles (sección 3.4 de requerimientos), RNF-03

import { createContext, useContext } from 'react';
import type { Usuario } from '../types/Usuario';

// createContext crea el "canal" por donde viaja el dato.
// El valor inicial es null: significa "no hay nadie conectado".
// "Usuario | null" le dice a TypeScript que puede ser un Usuario o null.
export const ContextoUsuario = createContext<Usuario | null>(null);

// useUsuario (hook personalizado)
// No recibe nada.
// Devuelve: el usuario conectado.
// Un hook personalizado es una función que empieza con "use" y usa otros
// hooks adentro (aquí, useContext). Así cada componente escribe solo
// "const usuario = useUsuario();" en vez de repetir lo de abajo.
// Solo se usa en componentes que aparecen DESPUÉS del login. Si alguien lo
// usa fuera de la sesión, el error avisa al tiro qué pasó.
export function useUsuario(): Usuario {
  const usuario = useContext(ContextoUsuario);
  if (usuario === null) {
    throw new Error('useUsuario() solo se puede usar con una sesión iniciada.');
  }
  return usuario;
}
