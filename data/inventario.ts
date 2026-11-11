import type {Product} from './shopSeed';

/**
 * Inventario real de MARWA, generado desde "MARWA INVENTARIO.xlsx" (11-nov-2026).
 * PRECIO Y EXISTENCIAS EN 0: están pendientes; el equipo MARWA los ajusta desde el panel del vendedor.
 * Mientras el precio sea 0, la tienda muestra "Precio por confirmar" y ofrece cotizar con un asesor.
 * No editar a mano: se vuelve a generar con el script del inventario.
 */
export const inventoryProducts: Product[] = [
  {
    "id": "cable-utp-cat-6a-pe",
    "sku": "MW-001",
    "name": "Cable UTP Cat 6A PE",
    "category": "cableado",
    "description": "Cable UTP Cat 6A PE de MARWA para la línea de cableado estructurado. Chaqueta PE, 100% cobre, 23 AWG, ISO, RoHS.",
    "image": "/assets/productos/cable-utp-cat-6a-pe-1.jpg",
    "features": [
      "Chaqueta PE",
      "100% cobre",
      "23 AWG",
      "ISO, RoHS",
      "Reporte de prueba Fluke pegado al carrete"
    ],
    "price": 0,
    "unit": "carrete",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cable UTP",
      "categoria": "Cat. 6A",
      "presentacion": "Carrete",
      "Marca": "MARWA",
      "Color": "Negro",
      "Medida": "305 m / 1000 ft",
      "Contenido": "305 m"
    },
    "gallery": [
      "/assets/productos/cable-utp-cat-6a-pe-2.jpg"
    ]
  },
  {
    "id": "cable-cat-5e-uso-exterior",
    "sku": "MW-002",
    "name": "Cable Cat 5E uso exterior",
    "category": "cableado",
    "description": "Cable Cat 5E uso exterior de MARWA para la línea de cableado estructurado. Uso exterior, negro.",
    "image": "/assets/productos/cable-cat-5e-uso-exterior-1.jpg",
    "features": [
      "Uso exterior",
      "Negro"
    ],
    "price": 0,
    "unit": "carrete",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cable UTP",
      "categoria": "Cat. 5E",
      "presentacion": "Carrete",
      "Marca": "MARWA",
      "Color": "Negro"
    },
    "gallery": [
      "/assets/productos/cable-cat-5e-uso-exterior-2.jpg"
    ],
    "datasheet": {
      "name": "UTPCAT 5E EXT MARWA.pdf",
      "url": "/fichas/marwa-ficha-utpcat-5e-ext.pdf",
      "size": 8822828
    }
  },
  {
    "id": "cable-f-utp-cat-6a-lszh",
    "sku": "MW-003",
    "name": "Cable F/UTP Cat 6A LSZH",
    "category": "cableado",
    "description": "Cable F/UTP Cat 6A LSZH de MARWA para la línea de cableado estructurado. LSZH, 100% cobre, UL, CE, ISO, RoHS, reporte de prueba Fluke pegado al carrete.",
    "image": "/assets/productos/cable-f-utp-cat-6a-lszh-1.jpg",
    "features": [
      "LSZH",
      "100% cobre",
      "UL, CE, ISO, RoHS",
      "Reporte de prueba Fluke pegado al carrete"
    ],
    "price": 0,
    "unit": "carrete",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cable FTP",
      "categoria": "Cat. 6A",
      "presentacion": "Carrete",
      "Marca": "MARWA",
      "Color": "Violeta",
      "Medida": "305 m"
    },
    "gallery": [
      "/assets/productos/cable-f-utp-cat-6a-lszh-2.jpg"
    ],
    "datasheet": {
      "name": "FUTP BLINDADO CAT 6A LSZH MARWA.pdf",
      "url": "/fichas/marwa-ficha-futp-blindado-cat-6a-lszh.pdf",
      "size": 9485080
    }
  },
  {
    "id": "cable-utp-cat-6-lszh-rigido",
    "sku": "MW-004",
    "name": "Cable UTP Cat 6 LSZH rígido",
    "category": "cableado",
    "description": "Cable UTP Cat 6 LSZH rígido de MARWA para la línea de cableado estructurado. Conductor rígido 0,57 mm CU, LSZH, RITEL, 100% cobre.",
    "image": "/assets/productos/cable-utp-cat-6-lszh-rigido-1.jpg",
    "features": [
      "Conductor rígido 0,57 mm CU",
      "LSZH",
      "RITEL",
      "100% cobre",
      "Cable certificado",
      "TIA/EIA-568B e ISO/IEC 11801"
    ],
    "price": 0,
    "unit": "caja",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cable LSZH",
      "categoria": "Cat. 6",
      "presentacion": "Caja",
      "Marca": "MARWA",
      "Color": "Azul",
      "Medida": "305 m / 1000 ft",
      "Contenido": "305 m"
    },
    "gallery": [
      "/assets/productos/cable-utp-cat-6-lszh-rigido-2.jpg",
      "/assets/productos/cable-utp-cat-6-lszh-rigido-3.jpg"
    ],
    "datasheet": {
      "name": "UTP CAT 6 LSZH MARWA.pdf",
      "url": "/fichas/marwa-ficha-utp-cat-6-lszh.pdf",
      "size": 8871742
    }
  },
  {
    "id": "cable-utp-flexible-cat-6-multifilamento",
    "sku": "MW-005",
    "name": "Cable UTP flexible Cat 6 multifilamento",
    "category": "cableado",
    "description": "Cable UTP flexible Cat 6 multifilamento de MARWA para la línea de cableado estructurado. Multifilamento 7/0.19 mm, 100% cobre certificado, CE, ISO, RoHS, 305 m.",
    "image": "/assets/productos/cable-utp-flexible-cat-6-multifilamento-1.jpg",
    "features": [
      "Multifilamento 7/0.19 mm",
      "100% cobre certificado",
      "CE, ISO, RoHS",
      "305 m"
    ],
    "price": 0,
    "unit": "carrete",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cable flexible multifilar",
      "categoria": "Cat. 6",
      "presentacion": "Carrete",
      "Marca": "MARWA",
      "Color": "Azul",
      "Medida": "305 m"
    },
    "gallery": [
      "/assets/productos/cable-utp-flexible-cat-6-multifilamento-2.jpg"
    ],
    "datasheet": {
      "name": "UTP CAT 6 MULTIFILAR FLEX MARWA.pdf",
      "url": "/fichas/marwa-ficha-utp-cat-6-multifilar-flex.pdf",
      "size": 9221990
    }
  },
  {
    "id": "patch-cord-utp-cat-6-de-5-m-rojo",
    "sku": "MW-006",
    "name": "Patch cord UTP Cat 6 de 5 m rojo",
    "category": "cableado",
    "description": "Patch cord UTP Cat 6 de 5 m rojo de MARWA para la línea de cableado estructurado. Multifilar, 100% cobre, RITEL, cable certificado.",
    "image": "/assets/productos/patch-cord-utp-cat-6-de-5-m-rojo-1.jpg",
    "features": [
      "Multifilar",
      "100% cobre",
      "RITEL",
      "Cable certificado"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6",
      "presentacion": "Bolsa",
      "Marca": "MARWA",
      "Color": "Rojo",
      "Medida": "5 m",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-cord-utp-cat-6-de-5-m-rojo-2.jpg",
      "/assets/productos/patch-cord-utp-cat-6-de-5-m-rojo-3.jpg",
      "/assets/productos/patch-cord-utp-cat-6-de-5-m-rojo-4.jpg"
    ],
    "datasheet": {
      "name": "PATCH CORD CAT 6 MARWA.pdf",
      "url": "/fichas/marwa-ficha-patch-cord-cat-6.pdf",
      "size": 3607874
    }
  },
  {
    "id": "patch-cord-utp-cat-6a-de-1-m-azul",
    "sku": "MW-007",
    "name": "Patch cord UTP Cat 6A de 1 m azul",
    "category": "cableado",
    "description": "Patch cord UTP Cat 6A de 1 m azul de MARWA para la línea de cableado estructurado. Multifilar, 100% cobre, RITEL, cable certificado.",
    "image": "/assets/productos/patch-cord-utp-cat-6a-de-1-m-azul-1.jpg",
    "features": [
      "Multifilar",
      "100% cobre",
      "RITEL",
      "Cable certificado"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6A",
      "presentacion": "Bolsa",
      "Marca": "MARWA",
      "Color": "Azul",
      "Medida": "1 m",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-cord-utp-cat-6a-de-1-m-azul-2.jpg",
      "/assets/productos/patch-cord-utp-cat-6a-de-1-m-azul-3.jpg"
    ],
    "datasheet": {
      "name": "PATCH CORD CAT  6A MARWA.pdf",
      "url": "/fichas/marwa-ficha-patch-cord-cat-6a.pdf",
      "size": 4468682
    }
  },
  {
    "id": "patch-cord-utp-cat-6a-de-3-ft-rojo",
    "sku": "MW-008",
    "name": "Patch cord UTP Cat 6A de 3 ft rojo",
    "category": "cableado",
    "description": "Patch cord UTP Cat 6A de 3 ft rojo de MARWA para la línea de cableado estructurado. 3 ft (0,9 m), rojo.",
    "image": "/assets/productos/patch-cord-utp-cat-6a-de-3-ft-rojo-1.jpg",
    "features": [
      "3 ft (0,9 m)",
      "Rojo"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6A",
      "presentacion": "Bolsa",
      "Marca": "MARWA",
      "Color": "Rojo",
      "Medida": "3 ft (0,9 m)"
    },
    "gallery": [
      "/assets/productos/patch-cord-utp-cat-6a-de-3-ft-rojo-2.jpg",
      "/assets/productos/patch-cord-utp-cat-6a-de-3-ft-rojo-3.jpg",
      "/assets/productos/patch-cord-utp-cat-6a-de-3-ft-rojo-4.jpg"
    ],
    "datasheet": {
      "name": "PATCH CORD CAT  6A MARWA.pdf",
      "url": "/fichas/marwa-ficha-patch-cord-cat-6a.pdf",
      "size": 4468682
    }
  },
  {
    "id": "plug-rj45-ftp-cat-6a-blindado",
    "sku": "MW-009",
    "name": "Plug RJ45 FTP Cat 6A blindado",
    "category": "cableado",
    "description": "Plug RJ45 FTP Cat 6A blindado de MARWA para la línea de cableado estructurado. Blindado, incluye guía de hilos, metálico / transparente.",
    "image": "/assets/productos/plug-rj45-ftp-cat-6a-blindado-1.jpg",
    "features": [
      "Blindado",
      "Incluye guía de hilos",
      "Metálico / transparente"
    ],
    "price": 0,
    "unit": "bandeja",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6A",
      "presentacion": "Bandeja",
      "Marca": "MARWA",
      "Color": "Metálico / transparente"
    },
    "gallery": [
      "/assets/productos/plug-rj45-ftp-cat-6a-blindado-2.jpg",
      "/assets/productos/plug-rj45-ftp-cat-6a-blindado-3.jpg",
      "/assets/productos/plug-rj45-ftp-cat-6a-blindado-4.jpg"
    ],
    "datasheet": {
      "name": "RJ45 BLINDADO CAT 6A MARWA.pdf",
      "url": "/fichas/marwa-ficha-rj45-blindado-cat-6a.pdf",
      "size": 272908
    }
  },
  {
    "id": "jack-keystone-cat-6-azul",
    "sku": "MW-010",
    "name": "Jack keystone Cat 6 azul",
    "category": "cableado",
    "description": "Jack keystone Cat 6 azul de MARWA para la línea de cableado estructurado. 1 Gbps, 250 MHz, azul.",
    "image": "/assets/productos/jack-keystone-cat-6-azul-1.jpg",
    "features": [
      "1 Gbps",
      "250 MHz",
      "Azul"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6",
      "presentacion": "Bolsa",
      "Marca": "MARWA",
      "Color": "Azul",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/jack-keystone-cat-6-azul-2.jpg",
      "/assets/productos/jack-keystone-cat-6-azul-3.jpg",
      "/assets/productos/jack-keystone-cat-6-azul-4.jpg"
    ],
    "datasheet": {
      "name": "KEYSTONE CAT6.pdf",
      "url": "/fichas/marwa-ficha-keystone-cat6.pdf",
      "size": 3328873
    }
  },
  {
    "id": "jack-keystone-cat-6-rojo",
    "sku": "MW-011",
    "name": "Jack keystone Cat 6 rojo",
    "category": "cableado",
    "description": "Jack keystone Cat 6 rojo de MARWA para la línea de cableado estructurado. Igual al azul a la vista, rojo.",
    "image": "/assets/productos/jack-keystone-cat-6-rojo-1.jpg",
    "features": [
      "Igual al azul a la vista",
      "Rojo"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6",
      "Marca": "MARWA",
      "Color": "Rojo"
    },
    "gallery": [
      "/assets/productos/jack-keystone-cat-6-rojo-2.jpg"
    ],
    "datasheet": {
      "name": "KEYSTONE CAT6.pdf",
      "url": "/fichas/marwa-ficha-keystone-cat6.pdf",
      "size": 3328873
    }
  },
  {
    "id": "jack-keystone-negro",
    "sku": "MW-012",
    "name": "Jack keystone negro",
    "category": "cableado",
    "description": "Jack keystone negro de MARWA para la línea de cableado estructurado. Tapa transparente con logo MARWA, negro.",
    "image": "/assets/productos/jack-keystone-negro-1.jpg",
    "features": [
      "Tapa transparente con logo MARWA",
      "Negro"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": false,
    "specs": {
      "tipo": "Accesorios pasivos",
      "Marca": "MARWA",
      "Color": "Negro"
    },
    "gallery": [
      "/assets/productos/jack-keystone-negro-2.jpg"
    ]
  },
  {
    "id": "jack-keystone-blindado-cat-6a",
    "sku": "MW-013",
    "name": "Jack keystone blindado Cat 6A",
    "category": "cableado",
    "description": "Jack keystone blindado Cat 6A de MARWA para la línea de cableado estructurado. Blindado, metálico.",
    "image": "/assets/productos/jack-keystone-blindado-cat-6a-1.jpg",
    "features": [
      "Blindado",
      "Metálico"
    ],
    "price": 0,
    "unit": "caja de cartón",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6A",
      "presentacion": "Caja de cartón",
      "Marca": "MARWA",
      "Color": "Metálico"
    },
    "gallery": [
      "/assets/productos/jack-keystone-blindado-cat-6a-2.jpg",
      "/assets/productos/jack-keystone-blindado-cat-6a-3.jpg",
      "/assets/productos/jack-keystone-blindado-cat-6a-4.jpg"
    ],
    "datasheet": {
      "name": "JACK KEYSTONE CAT6A.pdf",
      "url": "/fichas/marwa-ficha-jack-keystone-cat6a.pdf",
      "size": 3478464
    }
  },
  {
    "id": "bota-o-capuchon-para-rj45",
    "sku": "MW-014",
    "name": "Bota o capuchón para RJ45",
    "category": "cableado",
    "description": "Bota o capuchón para RJ45 de MARWA para la línea de cableado estructurado. Gris.",
    "image": "/assets/productos/bota-o-capuchon-para-rj45-1.jpg",
    "features": [
      "Gris"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "Color": "Gris"
    }
  },
  {
    "id": "bota-o-capuchon-para-rj45-azul",
    "sku": "MW-015",
    "name": "Bota o capuchón para RJ45 azul",
    "category": "cableado",
    "description": "Bota o capuchón para RJ45 azul de MARWA para la línea de cableado estructurado. Azul.",
    "image": "/assets/productos/bota-o-capuchon-para-rj45-azul-1.jpg",
    "features": [
      "Azul"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "Color": "Azul"
    }
  },
  {
    "id": "bota-o-capuchon-para-rj45-rojo",
    "sku": "MW-016",
    "name": "Bota o capuchón para RJ45 rojo",
    "category": "cableado",
    "description": "Bota o capuchón para RJ45 rojo de MARWA para la línea de cableado estructurado. Rojo.",
    "image": "/assets/productos/bota-o-capuchon-para-rj45-rojo-1.jpg",
    "features": [
      "Rojo"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "Color": "Rojo"
    }
  },
  {
    "id": "patch-panel-cat-6-de-24-puertos",
    "sku": "MW-017",
    "name": "Patch panel Cat 6 de 24 puertos",
    "category": "cableado",
    "description": "Patch panel Cat 6 de 24 puertos de MARWA para la línea de cableado estructurado. RITEL, 100% cobre, cable certificado, 24 puertos.",
    "image": "/assets/productos/patch-panel-cat-6-de-24-puertos-1.jpg",
    "features": [
      "RITEL",
      "100% cobre",
      "Cable certificado",
      "24 puertos"
    ],
    "price": 0,
    "unit": "caja de cartón",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6",
      "presentacion": "Caja de cartón",
      "Marca": "MARWA",
      "Color": "Negro",
      "Medida": "24 puertos",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-panel-cat-6-de-24-puertos-2.jpg",
      "/assets/productos/patch-panel-cat-6-de-24-puertos-3.jpg"
    ],
    "datasheet": {
      "name": "PATCH PANEL DE 24 PUETOS MARWA.pdf",
      "url": "/fichas/marwa-ficha-patch-panel-de-24-puetos.pdf",
      "size": 2685057
    }
  },
  {
    "id": "patch-panel-cat-6-de-48-puertos",
    "sku": "MW-018",
    "name": "Patch panel Cat 6 de 48 puertos",
    "category": "cableado",
    "description": "Patch panel Cat 6 de 48 puertos de MARWA para la línea de cableado estructurado. RITEL, 100% cobre, cable certificado, incluye Jack keystone negro (MW-012).",
    "image": "/assets/productos/patch-panel-cat-6-de-48-puertos-1.jpg",
    "features": [
      "RITEL",
      "100% cobre",
      "Cable certificado",
      "Incluye Jack keystone negro (MW-012)"
    ],
    "price": 0,
    "unit": "caja de cartón",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6",
      "presentacion": "Caja de cartón",
      "Marca": "MARWA",
      "Color": "Negro",
      "Medida": "48 puertos",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-panel-cat-6-de-48-puertos-2.jpg",
      "/assets/productos/patch-panel-cat-6-de-48-puertos-3.jpg"
    ],
    "datasheet": {
      "name": "PATCH PANEL DE 48 PUERTOS MARWA.pdf",
      "url": "/fichas/marwa-ficha-patch-panel-de-48-puertos.pdf",
      "size": 3145173
    }
  },
  {
    "id": "patch-panel-cat-6a-de-24-puertos",
    "sku": "MW-019",
    "name": "Patch panel Cat 6A de 24 puertos",
    "category": "cableado",
    "description": "Patch panel Cat 6A de 24 puertos de MARWA para la línea de cableado estructurado. 500 MHz, 10 Gbps, RITEL, 24 puertos.",
    "image": "/assets/productos/patch-panel-cat-6a-de-24-puertos-1.jpg",
    "features": [
      "500 MHz",
      "10 Gbps",
      "RITEL",
      "24 puertos"
    ],
    "price": 0,
    "unit": "caja de cartón",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios pasivos",
      "categoria": "Cat. 6A",
      "presentacion": "Caja de cartón",
      "Marca": "MARWA",
      "Color": "Negro / metálico",
      "Medida": "24 puertos",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-panel-cat-6a-de-24-puertos-2.jpg",
      "/assets/productos/patch-panel-cat-6a-de-24-puertos-3.jpg"
    ],
    "datasheet": {
      "name": "HERRAJE CAT 6A MARWA.pdf",
      "url": "/fichas/marwa-ficha-herraje-cat-6a.pdf",
      "size": 303163
    }
  },
  {
    "id": "fibra-optica-48",
    "sku": "MW-020",
    "name": "Fibra óptica 48",
    "category": "fibra",
    "description": "Fibra óptica 48 de MARWA para la línea de fibra óptica. Vano 100 m, varios tubos de colores con varias fibras cada uno, peso bruto 170 kg, carrete No. 25070002 (a mano).",
    "image": "/assets/productos/fibra-optica-48-1.jpg",
    "features": [
      "Vano 100 m",
      "Varios tubos de colores con varias fibras cada uno",
      "Peso bruto 170 kg",
      "Carrete No. 25070002 (a mano)"
    ],
    "price": 0,
    "unit": "carrete de madera",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Monomodo ADSS",
      "modo": "Monomodo",
      "Marca": "MARWA",
      "Color": "Negro",
      "Medida": "2000 m en este carrete",
      "Contenido": "2000 m"
    },
    "gallery": [
      "/assets/productos/fibra-optica-48-2.jpg",
      "/assets/productos/fibra-optica-48-3.jpg"
    ]
  },
  {
    "id": "cable-drop-2-hilos-1-km",
    "sku": "MW-021",
    "name": "Cable DROP 2 hilos 1 km",
    "category": "fibra",
    "description": "Cable DROP 2 hilos 1 km de MARWA para la línea de fibra óptica. 2 hilos, exterior FTTH, punto verde en el carrete, 1 km (1000 m).",
    "image": "/assets/productos/cable-drop-2-hilos-1-km-1.jpg",
    "features": [
      "2 hilos",
      "Exterior FTTH",
      "Punto verde en el carrete",
      "1 km (1000 m)"
    ],
    "price": 0,
    "unit": "carrete de madera",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Monomodo DROP",
      "modo": "Monomodo",
      "Marca": "MARWA",
      "Color": "Negro",
      "Medida": "1 km (1000 m)",
      "Contenido": "1000 m"
    },
    "gallery": [
      "/assets/productos/cable-drop-2-hilos-1-km-2.jpg",
      "/assets/productos/cable-drop-2-hilos-1-km-3.jpg"
    ],
    "datasheet": {
      "name": "FIBRA DROP 2 HILOS.pdf",
      "url": "/fichas/marwa-ficha-fibra-drop-2-hilos.pdf",
      "size": 860836
    }
  },
  {
    "id": "cable-drop-1-hilo-1-km",
    "sku": "MW-022",
    "name": "Cable DROP 1 hilo 1 km",
    "category": "fibra",
    "description": "Cable DROP 1 hilo 1 km de MARWA para la línea de fibra óptica. 1 hilo, exterior FTTH, 1 km (1000 m), negro.",
    "image": "/assets/productos/cable-drop-1-hilo-1-km-1.jpg",
    "features": [
      "1 hilo",
      "Exterior FTTH",
      "1 km (1000 m)",
      "Negro"
    ],
    "price": 0,
    "unit": "carrete de madera",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Monomodo DROP",
      "modo": "Monomodo",
      "Marca": "MARWA",
      "Color": "Negro",
      "Medida": "1 km (1000 m)",
      "Contenido": "1000 m"
    },
    "gallery": [
      "/assets/productos/cable-drop-1-hilo-1-km-2.jpg"
    ],
    "datasheet": {
      "name": "FIBRA DROP 1 HILO.pdf",
      "url": "/fichas/marwa-ficha-fibra-drop-1-hilo.pdf",
      "size": 860267
    }
  },
  {
    "id": "conector-rapido-de-fibra-sc-apc-60-mm",
    "sku": "MW-023",
    "name": "Conector rápido de fibra SC/APC 60 mm",
    "category": "fibra",
    "description": "Conector rápido de fibra SC/APC 60 mm de MARWA para la línea de fibra óptica. Pérdida de inserción: promedio ≤0,3 dB, máx ≤0,5 dB, pérdida de retorno ≥50 dB, tensión F>50 N, 60 mm.",
    "image": "/assets/productos/conector-rapido-de-fibra-sc-apc-60-mm-1.jpg",
    "features": [
      "Pérdida de inserción: promedio ≤0,3 dB, máx ≤0,5 dB",
      "Pérdida de retorno ≥50 dB",
      "Tensión F>50 N",
      "60 mm"
    ],
    "price": 0,
    "unit": "blíster en caja",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios",
      "conector": "SC/APC",
      "Marca": "MARWA",
      "Color": "Verde / negro",
      "Medida": "60 mm",
      "Contenido": "10 por blíster, 100 por caja"
    },
    "gallery": [
      "/assets/productos/conector-rapido-de-fibra-sc-apc-60-mm-2.jpg",
      "/assets/productos/conector-rapido-de-fibra-sc-apc-60-mm-3.jpg",
      "/assets/productos/conector-rapido-de-fibra-sc-apc-60-mm-4.jpg"
    ]
  },
  {
    "id": "splitter-plc-tipo-tubo-1x8-sc-apc",
    "sku": "MW-024",
    "name": "Splitter PLC tipo tubo 1x8 SC/APC",
    "category": "fibra",
    "description": "Splitter PLC tipo tubo 1x8 SC/APC de MARWA para la línea de fibra óptica. Conector SC/APC, cable Φ 0,9 mm SM, 1x8, 1,5 m, blanco / verde.",
    "image": "/assets/productos/splitter-plc-tipo-tubo-1x8-sc-apc-1.jpg",
    "features": [
      "Conector SC/APC",
      "Cable Φ 0,9 mm SM",
      "1x8, 1,5 m",
      "Blanco / verde"
    ],
    "price": 0,
    "unit": "blíster",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios",
      "conector": "SC/APC",
      "Marca": "MARWA",
      "Color": "Blanco / verde",
      "Medida": "1x8, 1,5 m",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/splitter-plc-tipo-tubo-1x8-sc-apc-2.jpg"
    ]
  },
  {
    "id": "splitter-plc-tipo-tubo-1x16-sc-apc",
    "sku": "MW-025",
    "name": "Splitter PLC tipo tubo 1x16 SC/APC",
    "category": "fibra",
    "description": "Splitter PLC tipo tubo 1x16 SC/APC de MARWA para la línea de fibra óptica. Conector SC/APC, cable Φ 0,9 mm SM, 1x16, 1,5 m, blanco / verde.",
    "image": "/assets/productos/splitter-plc-tipo-tubo-1x16-sc-apc-1.jpg",
    "features": [
      "Conector SC/APC",
      "Cable Φ 0,9 mm SM",
      "1x16, 1,5 m",
      "Blanco / verde"
    ],
    "price": 0,
    "unit": "blíster",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios",
      "conector": "SC/APC",
      "Marca": "MARWA",
      "Color": "Blanco / verde",
      "Medida": "1x16, 1,5 m",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/splitter-plc-tipo-tubo-1x16-sc-apc-2.jpg"
    ]
  },
  {
    "id": "patch-cord-fibra-sc-apc-sc-upc-3-m",
    "sku": "MW-026",
    "name": "Patch cord fibra SC/APC-SC/UPC 3 m",
    "category": "fibra",
    "description": "Patch cord fibra SC/APC-SC/UPC 3 m de MARWA para la línea de fibra óptica. Monomodo, G657A2, RITEL, cable certificado.",
    "image": "/assets/productos/patch-cord-fibra-sc-apc-sc-upc-3-m-1.jpg",
    "features": [
      "Monomodo",
      "G657A2",
      "RITEL",
      "Cable certificado"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios",
      "conector": "SC/APC – SC/UPC",
      "Marca": "MARWA",
      "Color": "Amarillo",
      "Medida": "3 m, 3,0 mm",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-cord-fibra-sc-apc-sc-upc-3-m-2.jpg",
      "/assets/productos/patch-cord-fibra-sc-apc-sc-upc-3-m-3.jpg",
      "/assets/productos/patch-cord-fibra-sc-apc-sc-upc-3-m-4.jpg"
    ]
  },
  {
    "id": "patch-cord-fibra-sc-apc-sc-apc-3-m",
    "sku": "MW-027",
    "name": "Patch cord fibra SC/APC-SC/APC 3 m",
    "category": "fibra",
    "description": "Patch cord fibra SC/APC-SC/APC 3 m de MARWA para la línea de fibra óptica. Monomodo, G657A2, RITEL, cable certificado.",
    "image": "/assets/productos/patch-cord-fibra-sc-apc-sc-apc-3-m-1.jpg",
    "features": [
      "Monomodo",
      "G657A2",
      "RITEL",
      "Cable certificado"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios",
      "conector": "SC/APC",
      "Marca": "MARWA",
      "Color": "Amarillo",
      "Medida": "3 m, 3,0 mm",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-cord-fibra-sc-apc-sc-apc-3-m-2.jpg",
      "/assets/productos/patch-cord-fibra-sc-apc-sc-apc-3-m-3.jpg",
      "/assets/productos/patch-cord-fibra-sc-apc-sc-apc-3-m-4.jpg"
    ]
  },
  {
    "id": "patch-cord-fibra-lc-upc-lc-upc-3-m",
    "sku": "MW-028",
    "name": "Patch cord fibra LC/UPC-LC/UPC 3 m",
    "category": "fibra",
    "description": "Patch cord fibra LC/UPC-LC/UPC 3 m de MARWA para la línea de fibra óptica. Monomodo, G657A2, RITEL, cable certificado.",
    "image": "/assets/productos/patch-cord-fibra-lc-upc-lc-upc-3-m-1.jpg",
    "features": [
      "Monomodo",
      "G657A2",
      "RITEL",
      "Cable certificado"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios",
      "conector": "LC/UPC",
      "Marca": "MARWA",
      "Color": "Amarillo",
      "Medida": "3 m, 3,0 mm",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-cord-fibra-lc-upc-lc-upc-3-m-2.jpg",
      "/assets/productos/patch-cord-fibra-lc-upc-lc-upc-3-m-3.jpg",
      "/assets/productos/patch-cord-fibra-lc-upc-lc-upc-3-m-4.jpg"
    ]
  },
  {
    "id": "patch-cord-fibra-sc-upc-sc-upc-3-m",
    "sku": "MW-029",
    "name": "Patch cord fibra SC/UPC-SC/UPC 3 m",
    "category": "fibra",
    "description": "Patch cord fibra SC/UPC-SC/UPC 3 m de MARWA para la línea de fibra óptica. Monomodo, G657A2, RITEL, cable certificado.",
    "image": "/assets/productos/patch-cord-fibra-sc-upc-sc-upc-3-m-1.jpg",
    "features": [
      "Monomodo",
      "G657A2",
      "RITEL",
      "Cable certificado"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Accesorios",
      "conector": "SC/UPC",
      "Marca": "MARWA",
      "Color": "Amarillo",
      "Medida": "3 m, 3,0 mm",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/patch-cord-fibra-sc-upc-sc-upc-3-m-2.jpg",
      "/assets/productos/patch-cord-fibra-sc-upc-sc-upc-3-m-3.jpg",
      "/assets/productos/patch-cord-fibra-sc-upc-sc-upc-3-m-4.jpg"
    ]
  },
  {
    "id": "amarre-plastico-10-cm-x-2-5-mm-negro",
    "sku": "MW-030",
    "name": "Amarre plástico 10 cm x 2,5 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 10 cm x 2,5 mm negro de MARWA para la línea de línea plástica. Resiste 18 lb, 10 cm x 2,5 mm, negro.",
    "image": "/assets/productos/amarre-plastico-10-cm-x-2-5-mm-negro-1.jpg",
    "features": [
      "Resiste 18 lb",
      "10 cm x 2,5 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "10 cm x 2,5 mm",
      "color": "Negro",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-10-cm-x-2-5-mm-negro-2.jpg",
      "/assets/productos/amarre-plastico-10-cm-x-2-5-mm-negro-3.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-10-cm-x-2-5-mm-natural",
    "sku": "MW-031",
    "name": "Amarre plástico 10 cm x 2,5 mm natural",
    "category": "plastica",
    "description": "Amarre plástico 10 cm x 2,5 mm natural de MARWA para la línea de línea plástica. Resiste 18 lb, 10 cm x 2,5 mm, natural.",
    "image": "/assets/productos/amarre-plastico-10-cm-x-2-5-mm-natural-1.jpg",
    "features": [
      "Resiste 18 lb",
      "10 cm x 2,5 mm",
      "Natural"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "10 cm x 2,5 mm",
      "color": "Natural",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-15-cm-x-3-5-mm-negro",
    "sku": "MW-032",
    "name": "Amarre plástico 15 cm x 3,5 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 15 cm x 3,5 mm negro de MARWA para la línea de línea plástica. Resiste 40 lb, 15 cm x 3,5 mm, negro.",
    "image": "/assets/productos/amarre-plastico-15-cm-x-3-5-mm-negro-1.jpg",
    "features": [
      "Resiste 40 lb",
      "15 cm x 3,5 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "15 cm x 3,5 mm",
      "color": "Negro",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-15-cm-x-3-5-mm-negro-2.jpg",
      "/assets/productos/amarre-plastico-15-cm-x-3-5-mm-negro-3.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-15-cm-x-3-5-mm-natural",
    "sku": "MW-033",
    "name": "Amarre plástico 15 cm x 3,5 mm natural",
    "category": "plastica",
    "description": "Amarre plástico 15 cm x 3,5 mm natural de MARWA para la línea de línea plástica. Resiste 40 lb, 15 cm x 3,5 mm, natural.",
    "image": "/assets/productos/amarre-plastico-15-cm-x-3-5-mm-natural-1.jpg",
    "features": [
      "Resiste 40 lb",
      "15 cm x 3,5 mm",
      "Natural"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "15 cm x 3,5 mm",
      "color": "Natural",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-20-cm-x-4-8-mm-negro",
    "sku": "MW-034",
    "name": "Amarre plástico 20 cm x 4,8 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 20 cm x 4,8 mm negro de MARWA para la línea de línea plástica. Resiste 50 lb, 20 cm x 4,8 mm, negro.",
    "image": "/assets/productos/amarre-plastico-20-cm-x-4-8-mm-negro-1.jpg",
    "features": [
      "Resiste 50 lb",
      "20 cm x 4,8 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "20 cm x 4,8 mm",
      "color": "Negro",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-20-cm-x-4-8-mm-negro-2.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-20-cm-x-4-8-mm-natural",
    "sku": "MW-035",
    "name": "Amarre plástico 20 cm x 4,8 mm natural",
    "category": "plastica",
    "description": "Amarre plástico 20 cm x 4,8 mm natural de MARWA para la línea de línea plástica. Resiste 50 lb, 20 cm x 4,8 mm, natural.",
    "image": "/assets/productos/amarre-plastico-20-cm-x-4-8-mm-natural-1.jpg",
    "features": [
      "Resiste 50 lb",
      "20 cm x 4,8 mm",
      "Natural"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "20 cm x 4,8 mm",
      "color": "Natural",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-25-cm-x-4-8-mm-negro",
    "sku": "MW-038",
    "name": "Amarre plástico 25 cm x 4,8 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 25 cm x 4,8 mm negro de MARWA para la línea de línea plástica. Resiste 50 lb, 25 cm x 4,8 mm, negro.",
    "image": "/assets/productos/amarre-plastico-25-cm-x-4-8-mm-negro-1.jpg",
    "features": [
      "Resiste 50 lb",
      "25 cm x 4,8 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "25 cm x 4,8 mm",
      "color": "Negro",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-25-cm-x-4-8-mm-negro-2.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-25-cm-x-4-8-mm-natural",
    "sku": "MW-039",
    "name": "Amarre plástico 25 cm x 4,8 mm natural",
    "category": "plastica",
    "description": "Amarre plástico 25 cm x 4,8 mm natural de MARWA para la línea de línea plástica. Resiste 50 lb, 25 cm x 4,8 mm, natural.",
    "image": "/assets/productos/amarre-plastico-25-cm-x-4-8-mm-natural-1.jpg",
    "features": [
      "Resiste 50 lb",
      "25 cm x 4,8 mm",
      "Natural"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "25 cm x 4,8 mm",
      "color": "Natural",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-30-cm-x-4-8-mm-negro",
    "sku": "MW-040",
    "name": "Amarre plástico 30 cm x 4,8 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 30 cm x 4,8 mm negro de MARWA para la línea de línea plástica. Resiste 50 lb, 30 cm x 4,8 mm, negro.",
    "image": "/assets/productos/amarre-plastico-30-cm-x-4-8-mm-negro-1.jpg",
    "features": [
      "Resiste 50 lb",
      "30 cm x 4,8 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "30 cm x 4,8 mm",
      "color": "Negro",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-30-cm-x-4-8-mm-negro-2.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-30-cm-x-4-8-mm-natural",
    "sku": "MW-041",
    "name": "Amarre plástico 30 cm x 4,8 mm natural",
    "category": "plastica",
    "description": "Amarre plástico 30 cm x 4,8 mm natural de MARWA para la línea de línea plástica. Resiste 50 lb, 30 cm x 4,8 mm, natural.",
    "image": "/assets/productos/amarre-plastico-30-cm-x-4-8-mm-natural-1.jpg",
    "features": [
      "Resiste 50 lb",
      "30 cm x 4,8 mm",
      "Natural"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "30 cm x 4,8 mm",
      "color": "Natural",
      "Marca": "MARWA",
      "Contenido": "100 unidades"
    },
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-40-cm-x-7-6-mm-negro",
    "sku": "MW-042",
    "name": "Amarre plástico 40 cm x 7,6 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 40 cm x 7,6 mm negro de MARWA para la línea de línea plástica. 100% nylon, tensión máx. 120 lb, 40 cm x 7,6 mm, negro.",
    "image": "/assets/productos/amarre-plastico-40-cm-x-7-6-mm-negro-1.jpg",
    "features": [
      "100% nylon",
      "Tensión máx. 120 lb",
      "40 cm x 7,6 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "40 cm x 7,6 mm",
      "color": "Negro",
      "Marca": "MARWA"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-40-cm-x-7-6-mm-negro-2.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-40-cm-x-7-6-mm-natural",
    "sku": "MW-043",
    "name": "Amarre plástico 40 cm x 7,6 mm natural",
    "category": "plastica",
    "description": "Amarre plástico 40 cm x 7,6 mm natural de MARWA para la línea de línea plástica. 100% nylon, tensión máx. 120 lb, 40 cm x 7,6 mm, natural.",
    "image": "/assets/productos/amarre-plastico-40-cm-x-7-6-mm-natural-1.jpg",
    "features": [
      "100% nylon",
      "Tensión máx. 120 lb",
      "40 cm x 7,6 mm",
      "Natural"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "40 cm x 7,6 mm",
      "color": "Natural",
      "Marca": "MARWA"
    },
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-55-cm-x-7-6-mm-negro",
    "sku": "MW-044",
    "name": "Amarre plástico 55 cm x 7,6 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 55 cm x 7,6 mm negro de MARWA para la línea de línea plástica. 100% nylon, tensión máx. 120 lb, 55 cm x 7,6 mm, negro.",
    "image": "/assets/productos/amarre-plastico-55-cm-x-7-6-mm-negro-1.jpg",
    "features": [
      "100% nylon",
      "Tensión máx. 120 lb",
      "55 cm x 7,6 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "55 cm x 7,6 mm",
      "color": "Negro",
      "Marca": "MARWA"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-55-cm-x-7-6-mm-negro-2.jpg",
      "/assets/productos/amarre-plastico-55-cm-x-7-6-mm-negro-3.jpg",
      "/assets/productos/amarre-plastico-55-cm-x-7-6-mm-negro-4.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-70-cm-x-9-0-mm-negro",
    "sku": "MW-045",
    "name": "Amarre plástico 70 cm x 9,0 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 70 cm x 9,0 mm negro de MARWA para la línea de línea plástica. 100% nylon, tensión máx. 175 lb, 70 cm x 9,0 mm, negro.",
    "image": "/assets/productos/amarre-plastico-70-cm-x-9-0-mm-negro-1.jpg",
    "features": [
      "100% nylon",
      "Tensión máx. 175 lb",
      "70 cm x 9,0 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "70 cm x 9,0 mm",
      "color": "Negro",
      "Marca": "MARWA"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-70-cm-x-9-0-mm-negro-2.jpg",
      "/assets/productos/amarre-plastico-70-cm-x-9-0-mm-negro-3.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-70-cm-x-9-0-mm-natural",
    "sku": "MW-046",
    "name": "Amarre plástico 70 cm x 9,0 mm natural",
    "category": "plastica",
    "description": "Amarre plástico 70 cm x 9,0 mm natural de MARWA para la línea de línea plástica. 100% nylon, tensión máx. 175 lb, 70 cm x 9,0 mm, natural.",
    "image": "/assets/productos/amarre-plastico-70-cm-x-9-0-mm-natural-1.jpg",
    "features": [
      "100% nylon",
      "Tensión máx. 175 lb",
      "70 cm x 9,0 mm",
      "Natural"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "70 cm x 9,0 mm",
      "color": "Natural",
      "Marca": "MARWA"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-70-cm-x-9-0-mm-natural-2.jpg",
      "/assets/productos/amarre-plastico-70-cm-x-9-0-mm-natural-3.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "amarre-plastico-81-cm-x-9-0-mm-negro",
    "sku": "MW-047",
    "name": "Amarre plástico 81 cm x 9,0 mm negro",
    "category": "plastica",
    "description": "Amarre plástico 81 cm x 9,0 mm negro de MARWA para la línea de línea plástica. 100% nylon, tensión máx. 175 lb, 81 cm x 9,0 mm, negro.",
    "image": "/assets/productos/amarre-plastico-81-cm-x-9-0-mm-negro-1.jpg",
    "features": [
      "100% nylon",
      "Tensión máx. 175 lb",
      "81 cm x 9,0 mm",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Amarres plásticos",
      "medida": "81 cm x 9,0 mm",
      "color": "Negro",
      "Marca": "MARWA"
    },
    "gallery": [
      "/assets/productos/amarre-plastico-81-cm-x-9-0-mm-negro-2.jpg",
      "/assets/productos/amarre-plastico-81-cm-x-9-0-mm-negro-3.jpg"
    ],
    "datasheet": {
      "name": "AMARRES MARWA.pdf",
      "url": "/fichas/marwa-ficha-amarres.pdf",
      "size": 3817137
    }
  },
  {
    "id": "espiral-para-cables-3-4-pulg-negro-5-m",
    "sku": "MW-048",
    "name": "Espiral para cables 3/4\" negro 5 m",
    "category": "plastica",
    "description": "Espiral para cables 3/4\" negro 5 m de MARWA para la línea de línea plástica. 3/4\", 5 m, negro.",
    "image": "/assets/productos/espiral-para-cables-3-4-pulg-negro-5-m-1.jpg",
    "features": [
      "3/4\", 5 m",
      "Negro"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Espirales plásticas",
      "medida": "3/4\", 5 m",
      "color": "Negro",
      "Marca": "MARWA",
      "Contenido": "5 m"
    },
    "gallery": [
      "/assets/productos/espiral-para-cables-3-4-pulg-negro-5-m-2.jpg",
      "/assets/productos/espiral-para-cables-3-4-pulg-negro-5-m-3.jpg",
      "/assets/productos/espiral-para-cables-3-4-pulg-negro-5-m-4.jpg"
    ],
    "datasheet": {
      "name": "ESPIRALES MARWA.pdf",
      "url": "/fichas/marwa-ficha-espirales.pdf",
      "size": 4803920
    }
  },
  {
    "id": "espiral-para-cables-1-2-pulg-natural-5-m",
    "sku": "MW-049",
    "name": "Espiral para cables 1/2\" natural 5 m",
    "category": "plastica",
    "description": "Espiral para cables 1/2\" natural 5 m de MARWA para la línea de línea plástica. 1/2\", 5 m, natural.",
    "image": "/assets/productos/espiral-para-cables-1-2-pulg-natural-5-m-1.jpg",
    "features": [
      "1/2\", 5 m",
      "Natural"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Espirales plásticas",
      "medida": "1/2\", 5 m",
      "color": "Natural",
      "Marca": "MARWA",
      "Contenido": "5 m"
    },
    "gallery": [
      "/assets/productos/espiral-para-cables-1-2-pulg-natural-5-m-2.jpg",
      "/assets/productos/espiral-para-cables-1-2-pulg-natural-5-m-3.jpg",
      "/assets/productos/espiral-para-cables-1-2-pulg-natural-5-m-4.jpg"
    ],
    "datasheet": {
      "name": "ESPIRALES MARWA.pdf",
      "url": "/fichas/marwa-ficha-espirales.pdf",
      "size": 4803920
    }
  },
  {
    "id": "espiral-para-cables-natural-posible-3-4-pulg",
    "sku": "MW-050",
    "name": "Espiral para cables natural (posible 3/4\")",
    "category": "plastica",
    "description": "Espiral para cables natural (posible 3/4\") de MARWA para la línea de línea plástica. Natural.",
    "image": "/assets/productos/espiral-para-cables-natural-posible-3-4-pulg-1.jpg",
    "features": [
      "Natural"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Espirales plásticas",
      "color": "Natural",
      "Marca": "MARWA"
    },
    "gallery": [
      "/assets/productos/espiral-para-cables-natural-posible-3-4-pulg-2.jpg"
    ],
    "datasheet": {
      "name": "ESPIRALES MARWA.pdf",
      "url": "/fichas/marwa-ficha-espirales.pdf",
      "size": 4803920
    }
  },
  {
    "id": "caja-plastica-rectangular-blanca",
    "sku": "MW-051",
    "name": "Caja plástica rectangular blanca",
    "category": "plastica",
    "description": "Caja plástica rectangular blanca de MARWA para la línea de línea plástica. Con perforación central y dos torres para tornillo, blanco.",
    "image": "/assets/productos/caja-plastica-rectangular-blanca-1.jpg",
    "features": [
      "Con perforación central y dos torres para tornillo",
      "Blanco"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cajas de paso plásticas",
      "color": "Blanco",
      "Marca": "TTS"
    },
    "gallery": [
      "/assets/productos/caja-plastica-rectangular-blanca-2.jpg"
    ]
  },
  {
    "id": "caja-de-paso-plastica-cuadrada-blanca",
    "sku": "MW-052",
    "name": "Caja de paso plástica cuadrada blanca",
    "category": "plastica",
    "description": "Caja de paso plástica cuadrada blanca de MARWA para la línea de línea plástica. Tapa con logo en relieve, blanco.",
    "image": "/assets/productos/caja-de-paso-plastica-cuadrada-blanca-1.jpg",
    "features": [
      "Tapa con logo en relieve",
      "Blanco"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cajas de paso plásticas",
      "color": "Blanco",
      "Marca": "MARWA"
    },
    "gallery": [
      "/assets/productos/caja-de-paso-plastica-cuadrada-blanca-2.jpg"
    ]
  },
  {
    "id": "caja-de-paso-plastica-grande-con-tornillos-a",
    "sku": "MW-053",
    "name": "Caja de paso plástica grande con tornillos (A)",
    "category": "plastica",
    "description": "Caja de paso plástica grande con tornillos (A) de MARWA para la línea de línea plástica. Tapa atornillada, blanco.",
    "image": "/assets/productos/caja-de-paso-plastica-grande-con-tornillos-a-1.jpg",
    "features": [
      "Tapa atornillada",
      "Blanco"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cajas de paso plásticas",
      "color": "Blanco"
    },
    "gallery": [
      "/assets/productos/caja-de-paso-plastica-grande-con-tornillos-a-2.jpg"
    ]
  },
  {
    "id": "caja-de-paso-plastica-grande-b",
    "sku": "MW-054",
    "name": "Caja de paso plástica grande (B)",
    "category": "plastica",
    "description": "Caja de paso plástica grande (B) de MARWA para la línea de línea plástica. Tapa con huecos para tornillo, gris claro.",
    "image": "/assets/productos/caja-de-paso-plastica-grande-b-1.jpg",
    "features": [
      "Tapa con huecos para tornillo",
      "Gris claro"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Cajas de paso plásticas",
      "color": "Gris claro"
    },
    "gallery": [
      "/assets/productos/caja-de-paso-plastica-grande-b-2.jpg",
      "/assets/productos/caja-de-paso-plastica-grande-b-3.jpg"
    ]
  },
  {
    "id": "face-plate-rj-45-tipo-keystone-sencillo",
    "sku": "MW-055",
    "name": "Face plate RJ-45 tipo keystone sencillo",
    "category": "plastica",
    "description": "Face plate RJ-45 tipo keystone sencillo de MARWA para la línea de línea plástica. 1 puerto, blanco.",
    "image": "/assets/productos/face-plate-rj-45-tipo-keystone-sencillo-1.jpg",
    "features": [
      "1 puerto",
      "Blanco"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Face plate",
      "medida": "1 puerto",
      "color": "Blanco",
      "Marca": "MARWA",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/face-plate-rj-45-tipo-keystone-sencillo-2.jpg",
      "/assets/productos/face-plate-rj-45-tipo-keystone-sencillo-3.jpg"
    ],
    "datasheet": {
      "name": "FACE PLATE DE 1 Y 2 PUERTOS MARWA.pdf",
      "url": "/fichas/marwa-ficha-face-plate-de-1-y-2-puertos.pdf",
      "size": 3638427
    }
  },
  {
    "id": "face-plate-rj-45-tipo-keystone-doble",
    "sku": "MW-056",
    "name": "Face plate RJ-45 tipo keystone doble",
    "category": "plastica",
    "description": "Face plate RJ-45 tipo keystone doble de MARWA para la línea de línea plástica. 2 puertos, blanco.",
    "image": "/assets/productos/face-plate-rj-45-tipo-keystone-doble-1.jpg",
    "features": [
      "2 puertos",
      "Blanco"
    ],
    "price": 0,
    "unit": "bolsa",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Face plate",
      "medida": "2 puertos",
      "color": "Blanco",
      "Marca": "MARWA",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/face-plate-rj-45-tipo-keystone-doble-2.jpg",
      "/assets/productos/face-plate-rj-45-tipo-keystone-doble-3.jpg"
    ],
    "datasheet": {
      "name": "FACE PLATE DE 1 Y 2 PUERTOS MARWA.pdf",
      "url": "/fichas/marwa-ficha-face-plate-de-1-y-2-puertos.pdf",
      "size": 3638427
    }
  },
  {
    "id": "organizador-horizontal-2u-19-pulg",
    "sku": "MW-057",
    "name": "Organizador horizontal 2U (19\")",
    "category": "plastica",
    "description": "Organizador horizontal 2U (19\") de MARWA para la línea de línea plástica. Con tapa, 2U, 19\", negro.",
    "image": "/assets/productos/organizador-horizontal-2u-19-pulg-1.jpg",
    "features": [
      "Con tapa",
      "2U, 19\"",
      "Negro"
    ],
    "price": 0,
    "unit": "caja de cartón",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Organizadores horizontales",
      "medida": "2U, 19\"",
      "color": "Negro",
      "Marca": "MARWA",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/organizador-horizontal-2u-19-pulg-2.jpg",
      "/assets/productos/organizador-horizontal-2u-19-pulg-3.jpg",
      "/assets/productos/organizador-horizontal-2u-19-pulg-4.jpg"
    ],
    "datasheet": {
      "name": "ORGANIZADOR DE 2U MARWA.pdf",
      "url": "/fichas/marwa-ficha-organizador-de-2u.pdf",
      "size": 3029410
    }
  },
  {
    "id": "dobladora-para-tubo-1-pulgada",
    "sku": "MW-058",
    "name": "Dobladora para tubo 1 pulgada",
    "category": "canalizacion",
    "description": "Dobladora para tubo 1 pulgada de MARWA para la línea de canalización y ductería. Marcas de 10, 22, 30, 45 y 60°, en fotos con y sin mango, 1\" EMT, 3/4\" RIGID, aluminio, mango azul.",
    "image": "/assets/productos/dobladora-para-tubo-1-pulgada-1.jpg",
    "features": [
      "Marcas de 10, 22, 30, 45 y 60°",
      "En fotos con y sin mango",
      "1\" EMT, 3/4\" RIGID",
      "Aluminio, mango azul"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": false,
    "specs": {
      "tipo": "Herramientas",
      "Marca": "ALEX",
      "Color": "Aluminio, mango azul",
      "Medida": "1\" EMT, 3/4\" RIGID",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/dobladora-para-tubo-1-pulgada-2.jpg",
      "/assets/productos/dobladora-para-tubo-1-pulgada-3.jpg",
      "/assets/productos/dobladora-para-tubo-1-pulgada-4.jpg"
    ]
  },
  {
    "id": "dobladora-para-tubo-3-4-pulgada",
    "sku": "MW-059",
    "name": "Dobladora para tubo 3/4 pulgada",
    "category": "canalizacion",
    "description": "Dobladora para tubo 3/4 pulgada de MARWA para la línea de canalización y ductería. Marcas de 10, 22, 30, 45 y 60°, en fotos con y sin mango, 3/4\" EMT, 1/2\" RIGID, aluminio, mango azul.",
    "image": "/assets/productos/dobladora-para-tubo-3-4-pulgada-1.jpg",
    "features": [
      "Marcas de 10, 22, 30, 45 y 60°",
      "En fotos con y sin mango",
      "3/4\" EMT, 1/2\" RIGID",
      "Aluminio, mango azul"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": false,
    "specs": {
      "tipo": "Herramientas",
      "Marca": "ALEX",
      "Color": "Aluminio, mango azul",
      "Medida": "3/4\" EMT, 1/2\" RIGID",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/dobladora-para-tubo-3-4-pulgada-2.jpg",
      "/assets/productos/dobladora-para-tubo-3-4-pulgada-3.jpg",
      "/assets/productos/dobladora-para-tubo-3-4-pulgada-4.jpg"
    ]
  },
  {
    "id": "dobladora-para-tubo-1-2-pulgada",
    "sku": "MW-060",
    "name": "Dobladora para tubo 1/2 pulgada",
    "category": "canalizacion",
    "description": "Dobladora para tubo 1/2 pulgada de MARWA para la línea de canalización y ductería. Marcas de 10, 22, 30, 45 y 60°, sin mango en las fotos, 1/2\" EMT, aluminio.",
    "image": "/assets/productos/dobladora-para-tubo-1-2-pulgada-1.jpg",
    "features": [
      "Marcas de 10, 22, 30, 45 y 60°",
      "Sin mango en las fotos",
      "1/2\" EMT",
      "Aluminio"
    ],
    "price": 0,
    "unit": "unidad",
    "stock": 0,
    "visible": false,
    "specs": {
      "tipo": "Herramientas",
      "Marca": "ALEX",
      "Color": "Aluminio",
      "Medida": "1/2\" EMT",
      "Contenido": "1"
    },
    "gallery": [
      "/assets/productos/dobladora-para-tubo-1-2-pulgada-2.jpg",
      "/assets/productos/dobladora-para-tubo-1-2-pulgada-3.jpg"
    ]
  },
  {
    "id": "tuberia-pvc-sch-40-de-1-pulg-atado-de-15",
    "sku": "MW-061",
    "name": "Tubería PVC SCH 40 de 1\" (atado de 15)",
    "category": "canalizacion",
    "description": "Tubería PVC SCH 40 de 1\" (atado de 15) de MARWA para la línea de canalización y ductería. Se ven unos 15 tubos, amarrados con cinta roja, 1\", gris.",
    "image": "/assets/productos/tuberia-pvc-sch-40-de-1-pulg-atado-de-15-1.jpg",
    "features": [
      "Se ven unos 15 tubos, amarrados con cinta roja",
      "1\"",
      "Gris"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería SCH 40",
      "medida": "1\"",
      "material": "PVC",
      "Marca": "Cico (según etiqueta)",
      "Color": "Gris"
    },
    "gallery": [
      "/assets/productos/tuberia-pvc-sch-40-de-1-pulg-atado-de-15-2.jpg",
      "/assets/productos/tuberia-pvc-sch-40-de-1-pulg-atado-de-15-3.jpg"
    ]
  },
  {
    "id": "tuberia-sch-1-2-pulgada",
    "sku": "MW-062",
    "name": "Tubería SCH 1/2 pulgada",
    "category": "canalizacion",
    "description": "Tubería SCH 1/2 pulgada de MARWA para la línea de canalización y ductería. 4 tubos sueltos, 1/2\", gris.",
    "image": "/assets/productos/tuberia-sch-1-2-pulgada-1.jpg",
    "features": [
      "4 tubos sueltos",
      "1/2\"",
      "Gris"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería SCH 40",
      "medida": "1/2\"",
      "material": "PVC",
      "Color": "Gris"
    },
    "gallery": [
      "/assets/productos/tuberia-sch-1-2-pulgada-2.jpg"
    ]
  },
  {
    "id": "tuberia-sch40-1-4-pulgada",
    "sku": "MW-063",
    "name": "Tubería SCH40 1/4 pulgada",
    "category": "canalizacion",
    "description": "Tubería SCH40 1/4 pulgada de MARWA para la línea de canalización y ductería. Más de 20 tubos, amarrados con cinta azul, 1/4\", gris.",
    "image": "/assets/productos/tuberia-sch40-1-4-pulgada-1.jpg",
    "features": [
      "Más de 20 tubos, amarrados con cinta azul",
      "1/4\"",
      "Gris"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería SCH 40",
      "medida": "1/4\"",
      "material": "PVC",
      "Color": "Gris"
    },
    "gallery": [
      "/assets/productos/tuberia-sch40-1-4-pulgada-2.jpg"
    ]
  },
  {
    "id": "emt-1-2-pulgada-sifocol",
    "sku": "MW-065",
    "name": "EMT 1/2 pulgada sifocol",
    "category": "canalizacion",
    "description": "EMT 1/2 pulgada sifocol de MARWA para la línea de canalización y ductería. Extremos lisos, atado de unos 10 tubos, 1/2\", galvanizado.",
    "image": "/assets/productos/emt-1-2-pulgada-sifocol-1.jpg",
    "features": [
      "Extremos lisos",
      "Atado de unos 10 tubos",
      "1/2\"",
      "Galvanizado"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería EMT",
      "medida": "1/2\"",
      "material": "Acero galvanizado",
      "Marca": "Sifocol",
      "Color": "Galvanizado"
    },
    "gallery": [
      "/assets/productos/emt-1-2-pulgada-sifocol-2.jpg"
    ]
  },
  {
    "id": "emt-3-4-sifocol",
    "sku": "MW-066",
    "name": "EMT 3/4 sifocol",
    "category": "canalizacion",
    "description": "EMT 3/4 sifocol de MARWA para la línea de canalización y ductería. Extremos lisos, atado con alambre, 3/4\", galvanizado.",
    "image": "/assets/productos/emt-3-4-sifocol-1.jpg",
    "features": [
      "Extremos lisos",
      "Atado con alambre",
      "3/4\"",
      "Galvanizado"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería EMT",
      "medida": "3/4\"",
      "material": "Acero galvanizado",
      "Marca": "Sifocol",
      "Color": "Galvanizado"
    }
  },
  {
    "id": "emt-1-pulgada-sifocol",
    "sku": "MW-067",
    "name": "EMT 1 pulgada sifocol",
    "category": "canalizacion",
    "description": "EMT 1 pulgada sifocol de MARWA para la línea de canalización y ductería. Extremos lisos, atado con alambre, unos 9 tubos, 1\", galvanizado.",
    "image": "/assets/productos/emt-1-pulgada-sifocol-1.jpg",
    "features": [
      "Extremos lisos",
      "Atado con alambre, unos 9 tubos",
      "1\"",
      "Galvanizado"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería EMT",
      "medida": "1\"",
      "material": "Acero galvanizado",
      "Marca": "Sifocol",
      "Color": "Galvanizado"
    },
    "gallery": [
      "/assets/productos/emt-1-pulgada-sifocol-2.jpg"
    ]
  },
  {
    "id": "emt-2-pulgadas",
    "sku": "MW-068",
    "name": "EMT 2 pulgadas",
    "category": "canalizacion",
    "description": "EMT 2 pulgadas de MARWA para la línea de canalización y ductería. Extremos lisos, atado de 3 tubos, 2\", galvanizado.",
    "image": "/assets/productos/emt-2-pulgadas-1.jpg",
    "features": [
      "Extremos lisos",
      "Atado de 3 tubos",
      "2\"",
      "Galvanizado"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería EMT",
      "medida": "2\"",
      "material": "Acero galvanizado",
      "Color": "Galvanizado"
    },
    "gallery": [
      "/assets/productos/emt-2-pulgadas-2.jpg"
    ]
  },
  {
    "id": "imc-1-2-pulgada",
    "sku": "MW-069",
    "name": "IMC 1/2 pulgada",
    "category": "canalizacion",
    "description": "IMC 1/2 pulgada de MARWA para la línea de canalización y ductería. Extremos roscados, atado de unos 10 tubos, sin tapas, 1/2\", galvanizado.",
    "image": "/assets/productos/imc-1-2-pulgada-1.jpg",
    "features": [
      "Extremos roscados",
      "Atado de unos 10 tubos, sin tapas",
      "1/2\"",
      "Galvanizado"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería IMC",
      "medida": "1/2\"",
      "material": "Acero galvanizado",
      "Color": "Galvanizado"
    },
    "gallery": [
      "/assets/productos/imc-1-2-pulgada-2.jpg"
    ]
  },
  {
    "id": "imc-3-4",
    "sku": "MW-070",
    "name": "IMC 3/4",
    "category": "canalizacion",
    "description": "IMC 3/4 de MARWA para la línea de canalización y ductería. Extremos roscados, tapas azules cerradas en un extremo, 3/4\", galvanizado, tapa azul.",
    "image": "/assets/productos/imc-3-4-1.jpg",
    "features": [
      "Extremos roscados",
      "Tapas azules cerradas en un extremo",
      "3/4\"",
      "Galvanizado, tapa azul"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería IMC",
      "medida": "3/4\"",
      "material": "Acero galvanizado",
      "Color": "Galvanizado, tapa azul"
    },
    "gallery": [
      "/assets/productos/imc-3-4-2.jpg",
      "/assets/productos/imc-3-4-3.jpg"
    ]
  },
  {
    "id": "imc-1-pulgada",
    "sku": "MW-071",
    "name": "IMC 1 pulgada",
    "category": "canalizacion",
    "description": "IMC 1 pulgada de MARWA para la línea de canalización y ductería. Extremos roscados, tapas azules cerradas en un extremo, 1\", galvanizado, tapa azul.",
    "image": "/assets/productos/imc-1-pulgada-1.jpg",
    "features": [
      "Extremos roscados",
      "Tapas azules cerradas en un extremo",
      "1\"",
      "Galvanizado, tapa azul"
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería IMC",
      "medida": "1\"",
      "material": "Acero galvanizado",
      "Color": "Galvanizado, tapa azul"
    },
    "gallery": [
      "/assets/productos/imc-1-pulgada-2.jpg"
    ]
  },
  {
    "id": "imc-1-2",
    "sku": "MW-072",
    "name": "IMC 1/2",
    "category": "canalizacion",
    "description": "IMC 1/2 de MARWA para la línea de canalización y ductería. Extremos roscados, tapas abiertas, atado de 5 tubos, 1/2\".",
    "image": "/assets/productos/imc-1-2-1.jpg",
    "features": [
      "Extremos roscados",
      "Tapas abiertas",
      "Atado de 5 tubos",
      "1/2\""
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería IMC",
      "medida": "1/2\"",
      "material": "Acero galvanizado",
      "Color": "Galvanizado, tapa azul"
    },
    "gallery": [
      "/assets/productos/imc-1-2-2.jpg"
    ]
  },
  {
    "id": "imc-2",
    "sku": "MW-073",
    "name": "IMC 2",
    "category": "canalizacion",
    "description": "IMC 2 de MARWA para la línea de canalización y ductería. Extremos roscados, tapas abiertas, atado de 3 tubos, 2\".",
    "image": "/assets/productos/imc-2-1.jpg",
    "features": [
      "Extremos roscados",
      "Tapas abiertas",
      "Atado de 3 tubos",
      "2\""
    ],
    "price": 0,
    "unit": "atado",
    "stock": 0,
    "visible": true,
    "specs": {
      "tipo": "Tubería IMC",
      "medida": "2\"",
      "material": "Acero galvanizado",
      "Color": "Galvanizado, tapa azul"
    },
    "gallery": [
      "/assets/productos/imc-2-2.jpg"
    ]
  }
];
