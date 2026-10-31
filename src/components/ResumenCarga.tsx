// ResumenCarga.tsx
// Resumen de la vista previa: cuántas filas se leyeron y cuántas son
// válidas o tienen error.
// Usa los estilos de PaginaCargaExcel.css.
// Cubre: HU-16, RF-15 (CA-16.2: vista previa que separa válidas y con error)

interface PropsResumenCarga {
  nombreArchivo: string;
  totalFilas: number;
  cantidadValidas: number;
  cantidadConError: number;
}

// Componente ResumenCarga
// Recibe: el nombre del archivo y los totales.
// Devuelve: el texto resumen.
function ResumenCarga(props: PropsResumenCarga) {
  return (
    <p className="carga-resumen">
      <strong>{props.nombreArchivo}</strong>: {props.totalFilas} filas leídas,{' '}
      {props.cantidadValidas} válidas y {props.cantidadConError} con error.
    </p>
  );
}

export default ResumenCarga;
