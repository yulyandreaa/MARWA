import {inventoryProducts} from './inventario';

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
 * Catálogo de la tienda = inventario real de MARWA (Excel del 11-nov-2026), en data/inventario.ts.
 * Los productos de ejemplo anteriores quedaron guardados en _backup/inventario-antes-excel-2026-11-11/.
 */
export const seedProducts: Product[] = inventoryProducts;

export const departments = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare',
  'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta',
  'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
  'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
];
