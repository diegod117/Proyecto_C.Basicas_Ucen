# CLAUDE.md — Sistema de Inventario C. Básicas

## Contexto del proyecto

Proyecto de la asignatura **Programación de Aplicaciones** (Universidad Central), profesor Luis Rojas Rubio.
Equipo: Johann Cortés, Martín Zepeda Puelles y Diego Cortés.

Es un sistema web de gestión de inventario para los laboratorios del Departamento de Ciencias Básicas.
Los requerimientos vigentes están en **`docs/linea-base-v1.md`** (línea base v1.0, después de la validación con el stakeholder del 14-10-2026).
`docs/requerimientos.md` es la versión anterior: cuando se contradicen, manda la línea base.
**Lee la línea base antes de empezar cualquier tarea** y respeta los IDs (RF-01, HU-12, CA-12.1, etc.).
El plan de esta etapa está en `docs/plan-fase-4.md`.

Desde la fase 4, **Johann trabaja solo** en el repositorio (Diego y Martín no están haciendo cambios por ahora).

Stack: **React + TypeScript con Vite**.
Los datos se guardan en **Firebase** (Authentication + Firestore); `src/data/` solo tiene los datos de prueba que se suben la primera vez.
La navegación usa **React Router** (`react-router-dom`), porque lo exige la rúbrica de la EVA1.
No agregues otro backend, base de datos ni librerías nuevas sin preguntar primero.

---

## Cómo debes escribir el código (MUY IMPORTANTE)

Somos estudiantes de pregrado de Ingeniería Civil en Computación e Informática y es **nuestra primera vez usando React y TypeScript**.
El código tiene que verse como lo escribiría un estudiante que está aprendiendo, y nosotros tenemos que poder explicarlo en una presentación.

- Escribe código **simple y fácil de leer**, aunque sea un poco más largo.
- Usa solo lo básico de React: componentes de función, `useState`, `useEffect`, props y eventos (`onClick`, `onChange`).
- La rúbrica de la EVA1 pide además React Router y `useContext`: el usuario conectado se comparte con `ContextoUsuario` y el hook personalizado `useUsuario()` (`src/context/`). Usa `useContext` solo para eso, no para reemplazar las props de siempre.
- Usa TypeScript de forma básica: `interface` o `type` para los datos, tipos en props y en funciones. Nada de genéricos complicados, tipos utilitarios avanzados ni `any`.
- **No uses** (salvo que te lo pidamos): Redux, Zustand, React Query, `useReducer`, `useMemo`, `useCallback`, custom hooks complejos, HOCs, patrones de diseño avanzados ni librerías de UI.
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
│   ├── avance.md              # Portada de la bitácora: explica cómo registrar (no se modifica)
│   └── avance/                # Bitácora: un archivo por tarea (AAAA-MM-DD-ID-descripcion.md)
├── public/
└── src/
    ├── main.tsx               # Punto de entrada
    ├── App.tsx                # Rutas / navegación principal
    ├── types/                 # Interfaces y tipos (Recurso, Reserva, Incidencia...)
    ├── data/                  # Datos de prueba mientras no haya backend
    ├── components/            # Componentes reutilizables (Boton, TablaRecursos...)
    ├── pages/                 # Pantallas completas (Inventario, Reservas, Incidencias...)
    ├── services/              # Funciones que leen/guardan datos
    ├── context/               # Contexto del usuario conectado (useContext + useUsuario)
    ├── hooks/                 # Hooks personalizados (ej: useFiltrosInventario)
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

1. **Leer**: revisa `docs/linea-base-v1.md`, `docs/plan-fase-4.md` y los archivos de `docs/avance/` para saber qué hay hecho.
2. **Planificar**: antes de escribir código, explícame en pocas líneas qué archivos vas a crear o modificar y por qué. **Espera mi confirmación.**
3. **Implementar**: haz cambios pequeños, solo lo necesario para la historia de usuario. No refactorices otras partes sin preguntar.
4. **Verificar**: ejecuta `npm run build` (y `npm run lint` si existe) y corrige los errores antes de decir que terminaste.
5. **Explicar**: resume qué hiciste, en lenguaje simple, como si se lo explicaras a un compañero. Indica cómo probarlo en el navegador.
6. **Registrar**: crea un archivo nuevo en `docs/avance/` (nombre y plantilla en `docs/avance.md`) con la fecha, la HU trabajada y los archivos tocados. Nunca agregues entradas al final de `docs/avance.md`: eso causaba conflictos.
7. **Git (automático)**: cuando el build y el lint pasen, haz commit, push y abre el PR **sin pedir permiso**, siguiendo la sección "Git" de abajo.

Si algo de los requerimientos no está claro o está marcado como "pendiente de confirmar", **pregunta** en vez de inventar.

---

## Flujo con agentes (`.claude/agents/`)

En la sesión principal tú eres el **coordinador**: lees, planificas y conversas con Johann, pero **no escribes código ni haces git tú mismo**. Para cada HU:

1. **Plan (tú):** pasos 1 y 2 de arriba. Espera la confirmación de Johann.
2. **`implementador`:** pásale la HU, los CA y el plan aprobado. Programa, verifica, hace commits locales y crea la bitácora (pasos 3, 4 y 6).
3. **`revisor`:** pásale la HU. Si responde `CAMBIOS NECESARIOS`, vuelve a llamar al `implementador` con esa lista y luego otra vez al `revisor`. Máximo 3 vueltas; si sigue sin aprobar, detente y pregúntale a Johann.
4. **`encargado-pr`:** solo con `APROBADO`. Hace push y abre el PR (paso 7).
5. **Resumen (tú):** explícale a Johann en lenguaje simple qué se hizo, cómo probarlo y el link del PR (paso 5). Espera a que haga el merge antes de pasar a la siguiente HU.

Pásale a cada agente todo lo que necesita en el mensaje: no ven esta conversación.

---

## Git

Johann trabaja solo, así que Git va **en automático**. Para cada historia de usuario:

1. **Antes de empezar:** `git checkout main && git pull`, y crea la rama `feature/hu-XX-descripcion-corta` (ej.: `feature/hu-12-unidades-serie`).
2. **Mientras trabajas:** haz commits pequeños **sin preguntar**, cada vez que una parte quede funcionando y `npm run build` pase. Mensajes en español, cortos y en presente:
   `feat(HU-12): agrega tabla de unidades con número de serie`
   `fix(HU-03): valida que la cantidad reservada no supere la disponible`
   `docs: agrega avance de J29`
3. **Push:** después de cada commit, `git push` (la primera vez, `git push -u origin <rama>`).
4. **Pull request:** al terminar la historia (build y lint sin errores y bitácora creada), abre el PR hacia `main` con `gh pr create --base main`. Título igual al commit principal; descripción en español con: HU y RF cubiertos, criterios de aceptación cumplidos (CA-XX.X), cómo probarlo en el navegador y archivos tocados.
5. **Después del PR:** entrega el link del PR y espera. **No hagas merge**: Johann lo revisa y lo aprueba. Si te pide un cambio, haz commit y push en la misma rama (el PR se actualiza solo).
6. **Siguiente historia:** solo cuando Johann te diga que el PR ya está en `main`.

Nunca:
- `git push --force`, `git reset --hard` sobre algo ya subido, ni borrar ramas.
- Hacer commit de `.env`, claves de Firebase de servicio ni archivos de `node_modules`/`dist`.
- Hacer commit con el build roto.

Los IDs de la bitácora siguen con la letra **J** desde **J29** (el último fue J28).

---

## Lo que NO debes hacer

- No instalar paquetes nuevos sin preguntar.
- No cambiar la estructura de carpetas.
- No escribir código "de experto" que no podamos explicar.
- No modificar `docs/requerimientos.md` ni `docs/linea-base-v1.md` (si un requisito cambia, pregúntame).
- No implementar lo que la línea base deja fuera de la primera versión (acta de baja, permisos temporales, vista por laboratorio, login institucional, RF-06, RF-07).
- No implementar varias historias de usuario de una sola vez.
- No borrar código de otros integrantes sin avisar.
