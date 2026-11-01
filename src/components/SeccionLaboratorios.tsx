// SeccionLaboratorios.tsx
// Sección "Dos salas, un inventario" de la bienvenida: una página de color
// (azul noche) con un mosaico de fotos y bloques con los códigos de sala.
// Los datos salen de la planilla real del inventario (marzo de 2026):
// Torre B, salas B206 y B302, 13 categorías (ver bitácoras J38 y J42).
// Cubre: RF-10 (ubicación torre + sala), RF-08 (categorías), RNF-01

import './SeccionLaboratorios.css';

// Componente SeccionLaboratorios
// No recibe props. Devuelve la sección con el título, el párrafo y el mosaico.
// bienv-oscuro le avisa a bienvenida.css que el contorno de foco va en blanco.
function SeccionLaboratorios() {
  return (
    <section id="laboratorios" className="bienv-seccion laboratorios bienv-oscuro" aria-labelledby="laboratorios-titulo">
      <div className="bienv-ancho bienv-grilla">
        <h2 id="laboratorios-titulo" className="bienv-display bienv-eje aparece">
          Dos salas, un inventario
        </h2>
        <p className="bienv-texto bienv-eje laboratorios-parrafo aparece aparece-2">
          El inventario del laboratorio de Ciencias Básicas está en la Torre B, salas B206 y B302:
          balanzas, control de temperatura, material volumétrico, pH-metros, computadores e
          instrumentos de mecánica, óptica y electrónica, en 13 categorías.
        </p>

        {/* Mosaico sin separación: 3 × 2 en escritorio, 2 columnas en tablet y celular */}
        <div className="laboratorios-mosaico aparece aparece-3">
          <div className="mosaico-celda mosaico-azul">
            <p className="bienv-display">B206</p>
          </div>
          <div className="mosaico-celda mosaico-foto">
            <img src="/bienvenida/llama-bunsen.jpg" alt="Chispas sobre la llama azul de un mechero" loading="lazy" />
          </div>
          <div className="mosaico-celda mosaico-foto">
            <img
              src="/bienvenida/laboratorio-1910.jpg"
              alt="Fotografía antigua de un laboratorio con dos personas trabajando en sus mesones, 1910"
              loading="lazy"
            />
          </div>
          <div className="mosaico-celda mosaico-foto">
            {/* Otro recorte de la misma foto de hornos del tablero */}
            <img
              className="mosaico-hornos"
              src="/bienvenida/hornos-mufla.jpg"
              alt="Hornos mufla de laboratorio"
              loading="lazy"
            />
          </div>
          <div className="mosaico-celda mosaico-claro mosaico-ancho-celular">
            <p className="bienv-display">B302</p>
          </div>
          <div className="mosaico-celda mosaico-azul mosaico-ancho-celular">
            <p className="bienv-display">13 categorías</p>
            <p className="bienv-nota mosaico-lista">
              Balanzas · Temperatura · Electrónica · Mecánica · Computadores · Óptica y calor · Densidad ·
              pH-metros · Volumétricos y más
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeccionLaboratorios;
