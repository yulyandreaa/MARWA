import {referenceProducts, seedSpecs} from './catalogRefs';

export type CategoryId = 'cableado' | 'fibra' | 'networking' | 'plastica' | 'infraestructura';

export type Category = {id: CategoryId; name: string; description: string; photo: string};

export const categories: Category[] = [
  {id: 'cableado', name: 'Cableado estructurado', description: 'Sistemas confiables para redes organizadas y de alto desempeño.', photo: '/assets/solution-cabling.jpg'},
  {id: 'fibra', name: 'Fibra óptica', description: 'Conectividad de alta velocidad para operaciones que no se detienen.', photo: '/assets/solution-fiber.jpg'},
  {id: 'networking', name: 'Networking', description: 'Equipos que conectan, protegen y hacen crecer tu infraestructura.', photo: '/assets/solution-networking.jpg'},
  {id: 'plastica', name: 'Línea plástica', description: 'Canalización y organización con acabados durables y funcionales.', photo: '/assets/solution-plastic.jpg'},
  {id: 'infraestructura', name: 'Infraestructura', description: 'Gabinetes, racks y accesorios para entornos de misión crítica.', photo: '/assets/solution-infrastructure.jpg'},
];

export const categoryName = (id: string) => categories.find(c => c.id === id)?.name ?? id;

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: CategoryId;
  description: string;
  image: string;
  badge?: string;
  features: string[];
  /** COP, IVA incluido */
  price: number;
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
    image: '/assets/producto-patch-cord.jpg',
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
    id: 'rack-piso', sku: 'MW-RK-PISO', name: 'Rack de piso para comunicaciones', category: 'infraestructura',
    description: 'Gabinete vertical de alta capacidad para organizar y proteger equipos de red.',
    image: '/assets/producto-rack-piso.png', badge: 'Profesional',
    features: ['Instalación de piso', 'Organización vertical de equipos', 'Puerta frontal ventilada', 'Uso en cuartos técnicos'],
    price: 1890000, unit: 'unidad', stock: 6, visible: true,
  },
  {
    id: 'gabinete-pared', sku: 'MW-GB-PARED', name: 'Gabinete de pared', category: 'infraestructura',
    description: 'Gabinete compacto con puerta ventilada y cerradura para instalaciones seguras.',
    image: '/assets/producto-gabinete-pared.jpg',
    features: ['Instalación en pared', 'Cerradura de seguridad', 'Ventilación frontal y lateral', 'Formato compacto'],
    price: 435000, unit: 'unidad', stock: 14, visible: true,
  },
];

/** Catálogo inicial = 7 productos originales + productos de referencia por línea. */
export const seedProducts: Product[] = [
  ...initialProducts.map(p => ({...p, specs: seedSpecs[p.id]})),
  ...referenceProducts,
];

export const departments = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare',
  'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta',
  'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
  'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
];
