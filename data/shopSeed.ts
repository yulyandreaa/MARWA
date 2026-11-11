import {referenceProducts, seedSpecs} from './catalogRefs';

export type CategoryId = 'cableado' | 'fibra' | 'plastica' | 'hdtv' | 'canalizacion' | 'metalmecanica';

/** subs = subcategorías oficiales; cada una coincide con specs.tipo de sus productos. */
export type Category = {id: CategoryId; name: string; description: string; photo: string; subs: string[]};

export const categories: Category[] = [
  {id: 'cableado', name: 'Cableado estructurado', description: 'Cables UTP, FTP, LSZH, flexibles multifilares y sus accesorios pasivos.', photo: '/assets/solution-cabling.jpg',
    subs: ['Cable UTP', 'Cable FTP', 'Cable LSZH', 'Cable flexible multifilar', 'Accesorios pasivos']},
  {id: 'fibra', name: 'Fibra óptica', description: 'Fibra monomodo ADSS y DROP, multimodo OM3, herrajería y accesorios.', photo: '/assets/solution-fiber.jpg',
    subs: ['Monomodo ADSS', 'Monomodo DROP', 'Multimodo OM3', 'Herrajería', 'Accesorios']},
  {id: 'plastica', name: 'Línea plástica', description: 'Amarres, espirales, cajas de paso, prensa estopas, face plate y organizadores horizontales.', photo: '/assets/solution-plastic.jpg',
    subs: ['Amarres plásticos', 'Espirales plásticas', 'Cajas de paso plásticas', 'Prensa estopas', 'Face plate', 'Organizadores horizontales']},
  {id: 'hdtv', name: 'HDTV', description: 'Cables, extender y splitter para llevar tu señal de video.', photo: '/assets/solution-hdtv.jpg',
    subs: ['Cables', 'Extender', 'Splitter']},
  {id: 'canalizacion', name: 'Canalización y ductería', description: 'Canaletas, tubería SCH 40, EMT e IMC, ductos y bandejas porta cables.', photo: '/assets/solution-plastic.jpg',
    subs: ['Canaletas', 'Tubería SCH 40', 'Tubería EMT', 'Tubería IMC', 'Ductos', 'Bandejas porta cables']},
  {id: 'metalmecanica', name: 'Metalmecánica', description: 'Racks y gabinetes para telecomunicaciones.', photo: '/assets/solution-infrastructure.jpg',
    subs: ['Racks', 'Gabinetes']},
];

export const categoryName = (id: string) => categories.find(c => c.id === id)?.name ?? id;

export type Datasheet = {name: string; url: string; size?: number};

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: CategoryId;
  description: string;
  image: string;
  /** Vistas adicionales del producto; `image` es la principal. */
  gallery?: string[];
  /** Ficha técnica en PDF: ruta pública o data URL subida desde el panel. */
  datasheet?: Datasheet;
  badge?: string;
  features: string[];
  /** COP, IVA incluido */
  price: number;
  /** Precio antes de la oferta; si es mayor que `price`, el producto está en oferta. */
  listPrice?: number;
  unit: string;
  stock: number;
  visible: boolean;
  custom?: boolean;
  /** Especificaciones para los filtros de la página de categoría. */
  specs?: Record<string, string>;
};

/**
 * Catálogo inicial. PRECIOS Y STOCK DE EJEMPLO — el equipo MARWA los ajusta
 * desde el panel del vendedor (/tienda/admin) hasta conectar el inventario real.
 */
const initialProducts: Product[] = [
  {
    id: 'cable-cat5e', sku: 'MW-UTP5E-305', name: 'Cable UTP flexible Cat. 5E', category: 'cableado',
    description: 'Caja de 305 metros, conductor 100% cobre y certificación para redes empresariales.',
    image: '/assets/producto-cable-cat5e.jpg', badge: 'Más vendido',
    features: ['Categoría 5E', 'Caja de 305 metros', 'Conductor 100% cobre', 'Cable flexible certificado'],
    price: 389000, unit: 'caja x 305 m', stock: 48, visible: true,
  },
  {
    id: 'patch-panel', sku: 'MW-PP6-24', name: 'Patch panel modular Cat. 6', category: 'cableado',
    description: 'Panel modular de 24 puertos para una administración ordenada del cableado.',
    image: '/assets/producto-patch-panel.jpg',
    features: ['24 posiciones modulares', 'Formato para rack', 'Identificación numerada', 'Administración organizada'],
    price: 168000, unit: 'unidad', stock: 35, visible: true,
  },
  {
    id: 'patch-cord', sku: 'MW-PC-MULTI', name: 'Patch cord Multiwire', category: 'cableado',
    description: 'Cable de parcheo 100% cobre para conexiones confiables de red.',
    image: '/assets/productos/patch-cord-azul-1.jpg',
    gallery: ['/assets/productos/patch-cord-azul-2.jpg', '/assets/productos/patch-cord-azul-3.jpg', '/assets/productos/patch-cord-azul-4.jpg'],
    features: ['Conductor 100% cobre', 'Conexión para red de datos', 'Presentación individual', 'Línea Multiwire MARWA'],
    price: 9800, unit: 'unidad', stock: 300, visible: true,
  },
  {
    id: 'fibra-drop', sku: 'MW-FO-DROP', name: 'Cable de fibra óptica Drop-Core', category: 'fibra',
    description: 'Bobina de fibra MARWA para despliegues estables y conexiones de larga distancia.',
    image: '/assets/producto-fibra-drop.png',
    features: ['Aplicación en redes ópticas', 'Presentación en bobina', 'Transmisión a larga distancia', 'Respaldo MARWA'],
    price: 495000, unit: 'bobina', stock: 20, visible: true,
  },
  {
    id: 'patch-fibra', sku: 'MW-FO-PC', name: 'Patch cord de fibra óptica', category: 'fibra',
    description: 'Latiguillo óptico con conectores de precisión y baja pérdida de inserción.',
    image: '/assets/producto-patch-fibra.png', badge: 'Recomendado',
    features: ['Conexión óptica directa', 'Conectores de precisión', 'Baja pérdida de inserción', 'Uso en enlaces de datos'],
    price: 18500, unit: 'unidad', stock: 120, visible: true,
  },
  {
    id: 'rack-piso', sku: 'MW-RK-PISO', name: 'Rack de piso para comunicaciones', category: 'metalmecanica',
    description: 'Gabinete vertical de alta capacidad para organizar y proteger equipos de red.',
    image: '/assets/producto-rack-piso.png', badge: 'Profesional',
    features: ['Instalación de piso', 'Organización vertical de equipos', 'Puerta frontal ventilada', 'Uso en cuartos técnicos'],
    price: 1890000, unit: 'unidad', stock: 6, visible: true,
  },
  {
    id: 'gabinete-pared', sku: 'MW-GB-PARED', name: 'Gabinete de pared', category: 'metalmecanica',
    description: 'Gabinete compacto con puerta ventilada y cerradura para instalaciones seguras.',
    image: '/assets/producto-gabinete-pared.jpg',
    features: ['Instalación en pared', 'Cerradura de seguridad', 'Ventilación frontal y lateral', 'Formato compacto'],
    price: 435000, unit: 'unidad', stock: 14, visible: true,
  },
  {
    id: 'gabinete-12ru', sku: 'MW-GB12RU', name: 'Gabinete de 12RU con ruedas', category: 'metalmecanica',
    description: 'Estructura metálica de diseño sencillo para alojar equipos de networking, servidores, switches y sistemas de telecomunicaciones. Incluye ventilación y acceso seguro para un óptimo funcionamiento.',
    image: '/assets/productos/gabinete-12ru-1.jpg',
    gallery: ['/assets/productos/gabinete-12ru-2.jpg', '/assets/productos/gabinete-12ru-3.jpg', '/assets/productos/gabinete-12ru-4.jpg'],
    datasheet: {name: 'MARWA_Ficha_Gabinete_12RU.pdf', url: '/fichas/marwa-ficha-gabinete-12ru.pdf', size: 289894},
    badge: 'Nuevo',
    features: ['Estructura robusta en lámina cold rolled', 'Ventilación integrada con 18 ranuras', 'Puerta con chapa de seguridad', 'Ruedas para moverlo con facilidad'],
    price: 790000, unit: 'unidad', stock: 8, visible: true,
    specs: {
      tipo: 'Gabinetes', tamano: '12U', instalacion: 'Piso',
      'Medidas (alto × ancho × fondo)': '60 × 60 × 60 cm', Peso: '13,3 kg', Material: 'Lámina cold rolled cal. 22',
      Color: 'Pintura electrostática negra', Chapa: '16 mm', 'Ranuras para ventiladores': '1', 'Ranuras de ventilación': '18',
      Uso: 'Interior, espacios cubiertos', 'Capacidad de carga': 'Carga estática', Garantía: '1 mes por defectos de fábrica',
    },
  },
  /* ---------- productos del inventario MARWA (Excel 6-nov-2026) con fotos editadas ----------
     PRECIO Y STOCK DE EJEMPLO: el Excel aún no los trae. */
  {
    id: 'jack-keystone-cat6-azul', sku: 'MW-010', name: 'Jack keystone Cat. 6 azul', category: 'cableado',
    description: 'Jack keystone Cat. 6 MARWA para tomas de datos, face plates y patch panels modulares. Velocidad de transmisión de 1 Gbps y ancho de banda de 250 MHz.',
    image: '/assets/productos/jack-keystone-cat6-azul-1.jpg',
    gallery: ['/assets/productos/jack-keystone-cat6-azul-2.jpg', '/assets/productos/jack-keystone-cat6-azul-3.jpg', '/assets/productos/jack-keystone-cat6-azul-4.jpg'],
    features: ['Velocidad de transmisión 1 Gbps', 'Ancho de banda 250 MHz', 'Formato keystone color azul', 'Incluye tapa de ponchado'],
    price: 9900, unit: 'unidad', stock: 150, visible: true,
    specs: {tipo: 'Accesorios pasivos', categoria: 'Cat. 6', presentacion: 'Unidad', Color: 'Azul', 'Velocidad de transmisión': '1 Gbps', 'Ancho de banda': '250 MHz', Empaque: 'Bolsa individual'},
  },
  {
    id: 'patch-cord-fibra-sc-apc-3m', sku: 'MW-027', name: 'Patch cord de fibra SC/APC a SC/APC (3 m)', category: 'fibra',
    description: 'Patch cord de fibra óptica monomodo G657A2 con conectores SC/APC en ambos extremos, chaqueta de 3,0 mm y 3 metros de longitud. Cable certificado RITEL.',
    image: '/assets/productos/patch-cord-fibra-sc-apc-1.jpg',
    gallery: ['/assets/productos/patch-cord-fibra-sc-apc-2.jpg', '/assets/productos/patch-cord-fibra-sc-apc-3.jpg', '/assets/productos/patch-cord-fibra-sc-apc-4.jpg'],
    features: ['Fibra monomodo G657A2', 'Conectores SC/APC – SC/APC', 'Longitud 3 m, chaqueta 3,0 mm', 'Cable certificado RITEL'],
    price: 14500, unit: 'unidad', stock: 200, visible: true,
    specs: {tipo: 'Accesorios', modo: 'Monomodo', conector: 'SC/APC', 'Tipo de fibra': 'G657A2', Longitud: '3 m', 'Diámetro de chaqueta': '3,0 mm', Color: 'Amarillo', Certificación: 'RITEL'},
  },
  {
    id: 'espiral-cables-3-4-negro', sku: 'MW-048', name: 'Espiral para cables 3/4" negro (5 m)', category: 'plastica',
    description: 'Espiral plástica MARWA para agrupar y ordenar cables en escritorios, gabinetes y tableros. Bolsa con 5 metros de espiral de 3/4".',
    image: '/assets/productos/espiral-cables-3-4-negro-1.jpg',
    gallery: ['/assets/productos/espiral-cables-3-4-negro-2.jpg', '/assets/productos/espiral-cables-3-4-negro-3.jpg', '/assets/productos/espiral-cables-3-4-negro-4.jpg'],
    features: ['Diámetro 3/4"', 'Rollo de 5 metros', 'Color negro', 'Agrupa y ordena los cables'],
    price: 16900, unit: 'bolsa x 5 m', stock: 80, visible: true,
    specs: {tipo: 'Espirales plásticas', medida: '3/4"', color: 'Negro', Longitud: '5 m', Empaque: 'Bolsa'},
  },
  {
    id: 'tuberia-pvc-sch40-1', sku: 'MW-061', name: 'Tubería PVC SCH 40 de 1" (atado x 15)', category: 'canalizacion',
    description: 'Tubería rígida de PVC SCH 40 de 1" para canalizar instalaciones eléctricas y de datos. Se vende por atado de 15 tubos.',
    image: '/assets/productos/tuberia-pvc-sch40-1-1.jpg',
    gallery: ['/assets/productos/tuberia-pvc-sch40-1-2.jpg', '/assets/productos/tuberia-pvc-sch40-1-3.jpg'],
    features: ['Diámetro 1"', 'PVC SCH 40', 'Atado de 15 tubos', 'Color gris'],
    price: 189000, unit: 'atado x 15', stock: 20, visible: true,
    specs: {tipo: 'Tubería SCH 40', medida: '1"', material: 'PVC', Color: 'Gris', Marca: 'Cico'},
  },
];

/** Catálogo inicial = 7 productos originales + productos de referencia por línea. */
export const seedProducts: Product[] = [
  ...initialProducts.map(p => ({...p, specs: p.specs ?? seedSpecs[p.id]})),
  ...referenceProducts,
];

export const departments = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare',
  'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta',
  'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
  'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
];
