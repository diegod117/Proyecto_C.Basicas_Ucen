// creditosBienvenida.ts
// Créditos de las fotos de la página de bienvenida. Todas son de Wikimedia
// Commons (NO son fotos de la UCEN) y sus licencias piden nombrar la obra,
// el autor y la licencia, con enlaces (CC BY y CC BY-SA piden además decir
// si se cambió la imagen: eso lo dice CreditosBienvenida.tsx).
// OJO: a diferencia de los otros archivos de src/data/, estos textos NO se
// suben a Firestore. Son parte de la página, como un título o un botón.
// Cubre: presentación del proyecto (no corresponde a una HU)

import type { CreditoFoto } from '../types/Bienvenida';

export const creditosFotos: CreditoFoto[] = [
  {
    titulo: 'Graduated Cylinders and Beaker filled with Chemical Compounds',
    urlPagina: 'https://commons.wikimedia.org/wiki/File:Graduated_Cylinders_and_Beaker_filled_with_Chemical_Compounds.jpg',
    autor: 'Horia Varlan',
    licencia: 'CC BY 2.0',
    urlLicencia: 'https://creativecommons.org/licenses/by/2.0',
  },
  {
    titulo: 'Muffle furnaces',
    urlPagina: 'https://commons.wikimedia.org/wiki/File:Muffle_furnaces.jpg',
    autor: 'Brammers',
    licencia: 'CC0',
    urlLicencia: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  {
    titulo: 'Beckman Model 72 pH Meter',
    urlPagina: 'https://commons.wikimedia.org/wiki/File:Beckman_model_72_pH_meter_jw827b87k.tiff',
    autor: '',
    licencia: 'dominio público',
    urlLicencia: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  {
    titulo: 'Oscilloscope APL',
    urlPagina: 'https://commons.wikimedia.org/wiki/File:Oscilloscope_APL.JPG',
    autor: 'Tourbillon',
    licencia: 'CC BY-SA 3.0',
    urlLicencia: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  {
    titulo: 'Incandescence',
    urlPagina: 'https://commons.wikimedia.org/wiki/File:Incandescence.jpg',
    autor: 'Debivort',
    licencia: 'CC BY-SA 3.0',
    urlLicencia: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    titulo: 'Laboratory Hydrometer test',
    urlPagina: 'https://commons.wikimedia.org/wiki/File:Laboratory_Hydrometer_test.jpg',
    autor: 'Maame1Yaa',
    licencia: 'CC0',
    urlLicencia: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  {
    titulo: 'Laboratory graduated cylinders for volumes measurements (milliliters)',
    urlPagina:
      'https://commons.wikimedia.org/wiki/File:Laboratory_graduated_cylinders_for_volumes_measurements_(milliliters).jpg',
    autor: 'Albarubescens',
    licencia: 'CC BY-SA 4.0',
    urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  {
    titulo: 'Laboratory at Park College, 1910',
    urlPagina:
      'https://commons.wikimedia.org/wiki/File:Laboratory_at_Park_College,_1910_-_DPLA_-_49bb268b35a676b2254ba0de1fc02996.jpg',
    autor: '',
    licencia: 'sin restricciones de derechos conocidas',
    urlLicencia: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
];
