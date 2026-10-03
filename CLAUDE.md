# CLAUDE.md — Sistema de Inventario C. Básicas

## Contexto del proyecto

Proyecto de la asignatura **Programación de Aplicaciones** (Universidad Central), profesor Luis Rojas Rubio.
Equipo: Johann Cortés, Martín Zepeda Puelles y Diego Cortés.

Es un sistema web de gestión de inventario para los laboratorios del Departamento de Ciencias Básicas.
Los requerimientos completos (RF, RNF e historias de usuario) están en `docs/requerimientos.md`.
**Lee ese archivo antes de empezar cualquier tarea** y respeta los IDs (RF-01, HU-03, etc.).

Stack: **React + TypeScript con Vite**.
El backend todavía no está definido: mientras tanto se usan datos de prueba en `src/data/`.
No agregues un backend, base de datos ni librerías nuevas sin preguntar primero.

---

## Cómo debes escribir el código (MUY IMPORTANTE)

Somos estudiantes de pregrado de Ingeniería Civil en Computación e Informática y es **nuestra primera vez usando React y TypeScript**.
El código tiene que verse como lo escribiría un estudiante que está aprendiendo, y nosotros tenemos que poder explicarlo en una presentación.

- Escribe código **simple y fácil de leer**, aunque sea un poco más largo.
- Usa solo lo básico de React: componentes de función, `useState`, `useEffect`, props y eventos (`onClick`, `onChange`).
- Usa TypeScript de forma básica: `interface` o `type` para los datos, tipos en props y en funciones. Nada de genéricos complicados, tipos utilitarios avanzados ni `any`.
- **No uses** (salvo que te lo pidamos): Redux, Zustand, React Query, `useReducer`, `useContext`, `useMemo`, `useCallback`, custom hooks complejos, HOCs, patrones de diseño avanzados ni librerías de UI.
- Prefiere `if/else` y bucles claros antes que one-liners, operadores ternarios anidados o cadenas largas de `.map().filter().reduce()`.
- Nombres de variables, funciones y componentes **en español** y descriptivos (`listaRecursos`, `cambiarEstado`, `FormularioReserva`).
- Un componente por archivo. Si un archivo pasa de ~150 líneas, divídelo.
- Estilos con CSS simple (un archivo `.css` por componente o página). Nada de Tailwind ni CSS-in-JS salvo que lo pidamos.

---

## Comentarios en el código

Todo el código debe ir **comentado en español**, como apuntes de un estudiante:

- Al inicio de cada archivo: un comentario breve que diga qué hace el archivo y qué requerimiento o historia de usuario cubre.
  ```tsx
  // FormularioReserva.tsx
  // Formulario para que el docente reserve un recurso por fecha y horario.
  // Cubre: HU-03, RF-03
  ```
- Antes de cada función o componente: qué hace, qué recibe y qué devuelve.
- Dentro del código: explica las partes que no son obvias para alguien que recién aprende React/TypeScript (por qué se usa `useState`, qué hace el `useEffect`, para qué sirve una `interface`, etc.).
- No comentes lo evidente (`// suma 1` sobre `i++`). Comenta el **porqué**.

---

## Estructura de carpetas

Respeta esta estructura. No crees carpetas nuevas sin avisar.

```
inventario-cs-basicas/
├── CLAUDE.md
├── README.md
├── docs/
│   ├── requerimientos.md      # Requerimientos del proyecto (no modificar)
│   └── avance.md              # Bitácora: qué se hizo en cada sesión
├── public/
└── src/
    ├── main.tsx               # Punto de entrada
    ├── App.tsx                # Rutas / navegación principal
    ├── types/                 # Interfaces y tipos (Recurso, Reserva, Incidencia...)
    ├── data/                  # Datos de prueba mientras no haya backend
    ├── components/            # Componentes reutilizables (Boton, TablaRecursos...)
    ├── pages/                 # Pantallas completas (Inventario, Reservas, Incidencias...)
    ├── services/              # Funciones que leen/guardan datos
    ├── utils/                 # Funciones de ayuda (formatear fechas, calcular disponibilidad...)
    └── styles/                # Estilos globales
```

Reglas:
- Los tipos compartidos van en `src/types/`, no repetidos en cada componente.
- La lógica de datos (filtrar, calcular cantidad disponible, validar reservas) va en `services/` o `utils/`, no mezclada dentro del JSX.
- Las páginas usan componentes; los componentes no importan páginas.

---

## Flujo de trabajo (respetar siempre)

Trabaja **una historia de usuario a la vez**. Para cada tarea sigue estos pasos y **no te saltes ninguno**:

1. **Leer**: revisa `docs/requerimientos.md` y `docs/avance.md` para saber qué hay hecho.
2. **Planificar**: antes de escribir código, explícame en pocas líneas qué archivos vas a crear o modificar y por qué. **Espera mi confirmación.**
3. **Implementar**: haz cambios pequeños, solo lo necesario para la historia de usuario. No refactorices otras partes sin preguntar.
4. **Verificar**: ejecuta `npm run build` (y `npm run lint` si existe) y corrige los errores antes de decir que terminaste.
5. **Explicar**: resume qué hiciste, en lenguaje simple, como si se lo explicaras a un compañero. Indica cómo probarlo en el navegador.
6. **Registrar**: agrega una entrada en `docs/avance.md` con la fecha, la HU trabajada y los archivos tocados.
7. **Commit**: propón el mensaje de commit, pero **no hagas commit ni push sin que te lo pida**.

Si algo de los requerimientos no está claro o está marcado como "pendiente de confirmar", **pregunta** en vez de inventar.

---

## Git

- Trabajamos 3 personas en el mismo repositorio.
- Cada historia de usuario en su propia rama: `feature/hu-01-listado-inventario`, `feature/hu-03-reservas`, etc.
- Mensajes de commit en español, cortos y en presente:
  `feat(HU-01): agrega listado de inventario con filtros`
  `fix(HU-03): valida que la cantidad reservada no supere la disponible`
- Nunca hagas `git push --force`, ni borres ramas, ni hagas merge a `main` sin pedirlo.

---

## Lo que NO debes hacer

- No instalar paquetes nuevos sin preguntar.
- No cambiar la estructura de carpetas.
- No escribir código "de experto" que no podamos explicar.
- No modificar `docs/requerimientos.md`.
- No implementar varias historias de usuario de una sola vez.
- No borrar código de otros integrantes sin avisar.
