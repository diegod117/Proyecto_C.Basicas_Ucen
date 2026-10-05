# 2026-10-03 — J13: generar y validar el código de ubicación (Johann)

**HU trabajada:** HU-11. Rama: `feature/hu-11-ubicacion`, creada desde `feature/hu-06-historial-estados` porque ese PR aún no estaba en `main` y las dos tocan `FichaRecurso`.

**Qué se hizo:**
- Archivo nuevo `src/utils/ubicacion.ts`:
  - `generarCodigoUbicacion()` sigue la regla torre + sala - bodega - mueble ("B307-B1-M2"). Los recursos en la sala misma quedan como "B308-SALA". Usa `abreviarBodega()` y `abreviarMueble()`.
  - `validarUbicacion()` devuelve la lista de problemas: sala que no es un número, bodega o mueble vacíos, o un código que no coincide con la ubicación.
- Componente nuevo `src/components/AvisoUbicacion.tsx` y `.css`: un recuadro amarillo en la ficha, debajo de la ubicación, que aparece solo si hay problemas (devuelve `null` si está todo bien). Servirá para detectar errores al migrar la planilla Excel.
- Se mantuvo el campo `codigo` en los datos porque lo usan Reservas (Martín) y Alertas (Diego).
- Se probó:
  - el código generado coincide con el de los 10 recursos de prueba;
  - se detectan código mal escrito, sala vacía, sala con letras, y bodega y mueble vacíos;
  - los espacios extra no cuentan como error;
  - con un código roto a propósito (y luego restaurado), el aviso aparece en la ficha del multímetro y no en la de los demás.

**Archivos tocados:** `src/utils/ubicacion.ts`, `src/components/AvisoUbicacion.tsx`, `src/components/AvisoUbicacion.css`, `src/components/FichaRecurso.tsx`, `docs/avance.md`.
