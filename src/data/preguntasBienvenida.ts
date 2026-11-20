// preguntasBienvenida.ts
// Preguntas frecuentes de la página de bienvenida.
// OJO: a diferencia de los otros archivos de src/data/, estos textos NO se
// suben a Firestore. Son parte de la página, como un título o un botón.
// Cada respuesta se revisó contra el código (authService, permisos.ts,
// FormularioReserva, TablaReservas, reglas de Firestore); ver la bitácora J42.
// Cubre: inicio de sesión (sección 3.4), HU-15 (mensajes de cuenta), RNF-01

import type { PreguntaFrecuente } from '../types/Bienvenida';

export const preguntasFrecuentes: PreguntaFrecuente[] = [
  {
    pregunta: '¿Cómo obtengo una cuenta?',
    respuesta:
      'La crea el encargado del laboratorio desde Configuración, en la sección Usuarios. Te llega un correo con un enlace para crear tu contraseña; revisa también la carpeta de spam.',
  },
  {
    pregunta: '¿Qué hago si olvidé mi contraseña?',
    respuesta:
      'Usa «¿Olvidaste tu contraseña?» en el formulario de ingreso y te llegará un enlace a tu correo para crear una nueva. Revisa también la carpeta de spam.',
  },
  {
    pregunta: '¿Por qué me dice «Usuario no registrado»?',
    respuesta:
      'Tu correo todavía no está dado de alta en LabCentral. Pide al encargado del laboratorio que te registre. Si dice «Correo o contraseña incorrectos, o usuario no registrado», revisa primero lo que escribiste.',
  },
  {
    pregunta: '¿Por qué me dice que mi cuenta está desactivada?',
    respuesta: 'El encargado la desactivó desde Configuración. Habla con él para que la vuelva a activar.',
  },
  {
    pregunta: '¿Puedo usarlo desde el celular?',
    respuesta: 'Sí. Está pensado para pantallas desde 360 px de ancho.',
  },
  {
    pregunta: '¿Qué pasa si el recurso ya está reservado en ese horario?',
    respuesta:
      'Al elegir fecha y horario, el formulario te dice cuántas unidades quedan libres y solo te ofrece las salas libres. Si pides más de las que quedan, no te deja reservar.',
  },
  {
    pregunta: '¿Puedo cancelar una reserva?',
    respuesta:
      'Sí, las tuyas que todavía no terminan, desde la página Reservas. Las realizadas pasan solas a tu historial.',
  },
  {
    pregunta: '¿Quién puede cambiar el estado de un equipo?',
    respuesta: 'Solo el encargado del laboratorio, y cada cambio queda en el historial.',
  },
  {
    pregunta: '¿Cómo aviso que un equipo está dañado?',
    respuesta:
      'Avísale al encargado: él registra la incidencia y, si el equipo tiene número de serie, indica la unidad afectada.',
  },
  {
    pregunta: '¿Se puede borrar algo del historial?',
    respuesta: 'No. El historial solo agrega registros, para que nada se pierda.',
  },
];
