# 2026-10-04 — J27 y J28: reglas de seguridad de Firestore y prueba completa (Johann)

**Trabajado:** RNF-06 (fase 3). Rama: `feature/firestore-reglas`.

**Qué se hizo (J27):**
- Archivo nuevo `docs/firestore.rules`, publicado a mano en la consola (Firestore Database → Reglas), porque no usamos `firebase-tools`. Reemplaza las reglas temporales de J23.
- Solo se permite lo que la app hace:

| Colección | Se permite | Se rechaza |
|---|---|---|
| `recursos` | leer, crear y cambiar **solo** `cantidades` | cambiar otros campos y borrar |
| `historial` | leer y crear | **modificar y borrar** (RNF-06) |
| `incidencias` | leer, crear y cambiar **solo** `estado` | cambiar otros campos y borrar |
| `reservas` | leer, crear y borrar (cancelar) | modificar |
| otras colecciones | nada | todo |

- Todas las operaciones exigen una sesión iniciada.
- **Límite conocido:** los roles están en `data/usuarios.ts`, así que el servidor no distingue roles; RNF-03 lo sigue aplicando la app.

**Pruebas (J28):**
- **Directas contra Firestore** (API REST, cuenta `encargado@prueba.cl`), hechas de forma que no dañaran datos aunque una regla fallara:
  - se rechazan: leer sin sesión, leer una colección no permitida, borrar recursos, historial e incidencias, modificar un registro del historial, cambiar el nombre de un recurso, cambiar la descripción de una incidencia y modificar una reserva;
  - se aceptan: leer con sesión, cambiar `cantidades` de un recurso, cambiar `estado` de una incidencia y borrar una reserva;
  - nota: al principio se probó escribiendo el mismo valor, y Firestore lo acepta porque no cambia ningún campo. Se repitió con un valor distinto: los tres casos fueron rechazados y los datos quedaron intactos.
- **La app con las reglas nuevas** (Chrome, recargando después de cada paso):
  - cambio de estado en el osciloscopio;
  - reposición del sulfato de cobre;
  - crear y cancelar una reserva;
  - registrar una incidencia y avanzarla a "en revisión".
  - Todo se guardó, siguió ahí al recargar y no hubo errores en la consola.

**Pendiente antes de la demo:** las pruebas dejaron datos en Firestore (registros "J28 (Claude)", cantidades cambiadas). Para dejar los datos originales, borrar las colecciones `recursos`, `historial`, `incidencias` y `reservas` en la consola. La consola tiene permisos de administrador, así que las reglas no la bloquean. La app vuelve a subir los datos de prueba en el siguiente inicio de sesión.

**Archivos tocados:** `docs/firestore.rules`, `docs/avance/2026-10-04-J27-J28-reglas-firestore.md`.
