# SGIL — Sistema de Inventario C. Básicas

Sistema web de gestión de inventario para los laboratorios del Departamento de Ciencias Básicas (Universidad Central).
Asignatura: Programación de Aplicaciones — Prof. Luis Rojas Rubio.

**Equipo:** Johann Cortés, Martín Zepeda Puelles, Diego Cortés.

## Tecnologías

- React + TypeScript
- Vite (herramienta para correr y compilar el proyecto)
- CSS simple

## Cómo correr el proyecto

Necesitas tener instalado [Node.js](https://nodejs.org/).

```bash
npm install      # instala las dependencias (solo la primera vez)
npm run dev      # inicia el proyecto en modo desarrollo
```

Luego abre en el navegador la dirección que aparece en la terminal (normalmente `http://localhost:5173`).

Otros comandos:

```bash
npm run build    # revisa los tipos y genera la versión final en dist/
npm run lint     # revisa errores comunes en el código
```

## Documentación

- `docs/requerimientos.md`: requerimientos funcionales, no funcionales e historias de usuario.
- `docs/avance.md`: bitácora de lo que se hizo en cada sesión.
- `docs/plan-implementacion.md`: qué hace cada integrante, en qué orden y con qué commits.
- `docs/mockup-sgil.html`: diseño de referencia (ábrelo directo en el navegador).
- `CLAUDE.md`: reglas del proyecto.

## Estructura de carpetas

```
src/
├── main.tsx       # punto de entrada
├── App.tsx        # componente principal
├── types/         # interfaces y tipos (Recurso, Reserva, Incidencia)
├── data/          # datos de prueba mientras no haya backend
├── components/    # componentes reutilizables
├── pages/         # pantallas completas
├── services/      # funciones que leen/guardan datos
├── utils/         # funciones de ayuda
└── styles/        # estilos globales
```
