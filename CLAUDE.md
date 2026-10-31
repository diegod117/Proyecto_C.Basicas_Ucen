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
2. **Planificar**: antes de escribir código, se definen los archivos a crear o modificar y por qué. Con el flujo de agentes, el plan lo aprueba el `validador-plan` (ver abajo); sin agentes, **espera mi confirmación**.
3. **Implementar**: haz cambios pequeños, solo lo necesario para la historia de usuario. No refactorices otras partes sin preguntar.
4. **Verificar**: ejecuta `npm run build` (y `npm run lint` si existe) y corrige los errores antes de decir que terminaste.
5. **Explicar**: resume qué hiciste, en lenguaje simple, como si se lo explicaras a un compañero. Indica cómo probarlo en el navegador.
6. **Registrar**: crea un archivo nuevo en `docs/avance/` (nombre y plantilla en `docs/avance.md`) con la fecha, la HU trabajada y los archivos tocados. Nunca agregues entradas al final de `docs/avance.md`: eso causaba conflictos.
7. **Git (automático)**: commits, push, PR y merge **sin pedir permiso**, siguiendo las secciones "Flujo con agentes" y "Git" de abajo.

Si algo de los requerimientos no está claro o está marcado como "pendiente de confirmar", **pregunta** en vez de inventar.

---

## Flujo con agentes (`.claude/agents/`)

En la sesión principal tú eres el **coordinador**: eliges la HU, pasas los mensajes entre los agentes y le informas a Johann, pero **no escribes código ni haces git tú mismo**. Los agentes no se ven entre sí: tú les reenvías lo que dijo el anterior. Pásale a cada uno todo lo que necesita en el mensaje (HU, CA, plan, observaciones), porque no ven esta conversación.

Para cada HU:

1. **Plan:** llama al `implementador` con `MODO PLAN` y la HU (con sus CA de la línea base).
2. **Validación del plan:** pásale ese plan al `validador-plan`.
   - `CAMBIOS AL PLAN` → reenvía las observaciones al `implementador` (`MODO PLAN`) y vuelve a validar. Máximo 3 vueltas.
   - `REQUIERE A JOHANN` → **detente**, muéstrale a Johann la decisión con sus opciones y espera su respuesta antes de seguir.
   - `PLAN APROBADO` → continúa.
3. **Implementación:** llama al `implementador` con `MODO IMPLEMENTAR` y el plan aprobado.
4. **Revisión:** llama al `revisor` con la HU y el plan. Si responde `CAMBIOS NECESARIOS`, reenvía la lista al `implementador` (`MODO IMPLEMENTAR`) y vuelve a revisar. Máximo 3 vueltas.
5. **PR:** con `APROBADO`, llama al `encargado-pr` con la HU, el resumen del implementador y el veredicto del revisor.
6. **Merge:** llama al `integrador` con el link del PR y el veredicto `APROBADO` del revisor.
7. **Resumen (tú):** explícale a Johann en lenguaje simple qué se hizo, cómo probarlo en el navegador, el link del PR y el resultado del build en `main`.

**Cuándo detenerse y preguntarle a Johann:** `REQUIERE A JOHANN`; 3 vueltas sin aprobación (plan o revisión); el integrador no pudo hacer merge o el build de `main` falló; o cualquier agente devuelve una pregunta.

**Después de cada HU:** detente y espera. Si Johann dijo "sigue con todo el plan", continúa con la siguiente HU de `docs/plan-fase-4.md` hasta terminarlo o hasta que ocurra una de las situaciones de arriba.

---

## Git

Johann trabaja solo, así que Git va **en automático**. Cada paso lo hace un agente distinto:

1. **Rama** (`implementador`): desde `main` actualizado (`git checkout main && git pull`), crea `feature/hu-XX-descripcion-corta` (ej.: `feature/hu-12-unidades-serie`).
2. **Commits** (`implementador`): pequeños y **sin preguntar**, cada vez que una parte funciona y `npm run build` pasa. Mensajes en español, cortos y en presente:
   `feat(HU-12): agrega tabla de unidades con número de serie`
   `fix(HU-03): valida que la cantidad reservada no supere la disponible`
   `docs: agrega avance de J29`
3. **Push y PR** (`encargado-pr`): solo con el `APROBADO` del revisor. PR hacia `main` con `gh pr create --base main`; título igual al commit principal; descripción en español con HU y RF cubiertos, CA cumplidos, cómo probarlo, archivos tocados y resultado de la revisión.
4. **Merge** (`integrador`): solo después del PR y con el `APROBADO` del revisor, con `gh pr merge --merge`, sin conflictos y con los checks en verde. Luego actualiza `main` local y comprueba que el build pase.

Nunca:
- `git push --force`, push directo a `main`, `git reset --hard` sobre algo ya subido, ni borrar ramas.
- Merge sin el `APROBADO` del revisor o con conflictos.
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
