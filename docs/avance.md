# Bitácora de avance

Las entradas de la bitácora están en la carpeta **`docs/avance/`**, **un archivo por tarea**.

## ¿Por qué un archivo por tarea?

Antes, los tres agregábamos las entradas al final de este mismo archivo. Cada vez que dos ramas lo modificaban, GitHub marcaba conflicto, y al resolverlo a mano se perdieron entradas (J16 a J18, M1 a M13). Git **nunca** marca conflicto cuando dos ramas crean archivos **distintos**, así que con un archivo por tarea el problema desaparece.

**Este archivo ya no se modifica.** Para registrar una tarea se crea un archivo nuevo en `docs/avance/`.

## Cómo agregar una entrada

1. Crea un archivo en `docs/avance/` con este nombre:

   ```
   AAAA-MM-DD-ID-descripcion-corta.md
   ```

   Ejemplos: `2026-10-04-J21-mis-reservas.md`, `2026-10-05-M22-ajustes-menu.md`.
   - El ID va con dos dígitos (`J05`, no `J5`) para que los archivos queden ordenados.
   - Si la tarea abarca varios commits, se ponen el primero y el último: `D15-D17`.
   - Sin tildes, ñ ni espacios en el nombre del archivo.

2. Copia esta plantilla dentro del archivo:

   ```markdown
   # AAAA-MM-DD — ID: título de la tarea (Nombre)

   **HU trabajada:** HU-XX. Rama: `feature/...`.

   **Qué se hizo:**
   - ...
   - Se probó en el navegador: ...

   **Archivos tocados:** `src/...`, `docs/avance/AAAA-MM-DD-ID-descripcion.md`.
   ```

3. Haz commit del archivo junto con el código de la tarea, o en un commit aparte (`docs: agrega avance de J21`).

## Para leer la bitácora

Los archivos se ordenan solos por fecha y luego por integrante (D = Diego, J = Johann, M = Martín). En GitHub o en VS Code basta con abrir la carpeta `docs/avance/`.
