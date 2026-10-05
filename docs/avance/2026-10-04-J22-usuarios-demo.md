# 2026-10-04 — J22: usuarios de prueba para la demo (Johann)

**Trabajado:** RNF-03 (fase 2, preparación de la demo). Rama: `feature/mis-reservas-docente`, junto con J21.

**Qué se hizo:**
- `data/usuarios.ts`:
  - el docente de prueba ahora se llama "Prof. Ana Morales", igual que en `data/reservas.ts`, así al entrar como docente "Mis reservas" ya muestra sus 2 reservas;
  - el encargado ahora se llama "Pedro Soto".
- `data/historialEstados.ts` y `data/incidencias.ts` (este último, archivo de Diego): "Pedro Soto (encargado)" pasó a ser "Pedro Soto", para que los registros antiguos y los nuevos muestren el mismo nombre.
- Los correos y las contraseñas no cambian: en Firebase no hubo que tocar nada.
- Se probó en el navegador:
  - el docente ve "Mis reservas: 2" con sus 2 reservas;
  - el encargado aparece como "Pedro Soto" en el menú, en el historial y en "Registrada por".

**Archivos tocados:** `src/data/usuarios.ts`, `src/data/historialEstados.ts`, `src/data/incidencias.ts`, `docs/avance/2026-10-04-J22-usuarios-demo.md`.
