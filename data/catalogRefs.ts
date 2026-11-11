import type {CategoryId, Product} from './shopSeed';

/**
 * PRODUCTOS DE REFERENCIA — mientras llega el catálogo real.
 * Nombres, precios, stock y especificaciones son de ejemplo; el equipo MARWA
 * los reemplaza desde el panel del vendedor (/tienda/admin).
 * Las fotos reutilizan imágenes existentes del sitio.
 */
const IMG = {
  cat5e: '/assets/producto-cable-cat5e.jpg',
  panel: '/assets/producto-patch-panel.jpg',
  cord: '/assets/producto-patch-cord.jpg',
  drop: '/assets/producto-fibra-drop.png',
  fcord: '/assets/producto-patch-fibra.png',
  rack: '/assets/producto-rack-piso.png',
  wall: '/assets/producto-gabinete-pared.jpg',
  cabling: '/assets/solution-cabling.jpg',
  fiber: '/assets/solution-fiber.jpg',
  plastic: '/assets/solution-plastic.jpg',
  infra: '/assets/solution-infrastructure.jpg',
  hdtv: '/assets/solution-hdtv.jpg',
};

type Ref = Omit<Product, 'visible'> & {visible?: boolean};
const ref = (p: Ref): Product => ({visible: true, ...p});

/** Especificaciones de los 7 productos iniciales (para los filtros). */
export const seedSpecs: Record<string, Record<string, string>> = {
  'cable-cat5e': {tipo: 'Cable UTP', categoria: 'Cat. 5E', presentacion: 'Caja x 305 m'},
  'patch-panel': {tipo: 'Accesorios pasivos', categoria: 'Cat. 6', presentacion: 'Unidad'},
  'patch-cord': {tipo: 'Accesorios pasivos', categoria: 'Cat. 5E', presentacion: 'Unidad'},
  'fibra-drop': {tipo: 'Monomodo DROP', modo: 'Monomodo', conector: 'Sin conector'},
  'patch-fibra': {tipo: 'Accesorios', modo: 'Monomodo', conector: 'SC/APC'},
  'rack-piso': {tipo: 'Racks', tamano: '42U', instalacion: 'Piso'},
  'gabinete-pared': {tipo: 'Gabinetes', tamano: '6U', instalacion: 'Pared'},
};

export const referenceProducts: Product[] = [
  /* ---------- cableado estructurado ---------- */
  ref({id: 'ref-cable-cat6', sku: 'MW-UTP6-305', name: 'Cable UTP Cat. 6 (305 m, 100% cobre)', category: 'cableado', image: IMG.cat5e, badge: 'Nuevo',
    description: 'Cable de par trenzado Cat. 6 para redes Gigabit, caja de 305 metros.', price: 529000, unit: 'caja x 305 m', stock: 30,
    features: ['Categoría 6', 'Caja de 305 metros', 'Conductor 100% cobre', 'Hasta 1 Gbps'], specs: {tipo: 'Cable UTP', categoria: 'Cat. 6', presentacion: 'Caja x 305 m'}}),
  ref({id: 'ref-cable-cat6a', sku: 'MW-UTP6A-305', name: 'Cable F/UTP Cat. 6A apantallado (305 m)', category: 'cableado', image: IMG.cat5e,
    description: 'Cable apantallado Cat. 6A para redes de 10 Gbps y entornos con interferencia.', price: 1150000, unit: 'caja x 305 m', stock: 8,
    features: ['Categoría 6A', 'Apantallado F/UTP', 'Hasta 10 Gbps', 'Caja de 305 metros'], specs: {tipo: 'Cable FTP', categoria: 'Cat. 6A', presentacion: 'Caja x 305 m'}}),
  ref({id: 'ref-patch-cord-6', sku: 'MW-PC6-3M', name: 'Patch cord Cat. 6 (3 m)', category: 'cableado', image: IMG.cord, badge: 'Más vendido',
    description: 'Cable de parcheo Cat. 6 de 3 metros con botas de protección.', price: 15900, unit: 'unidad', stock: 220,
    features: ['Categoría 6', 'Longitud 3 m', 'Conectores RJ45', 'Botas de protección'], specs: {tipo: 'Accesorios pasivos', categoria: 'Cat. 6', presentacion: 'Unidad'}}),
  ref({id: 'ref-jack-6', sku: 'MW-JK6', name: 'Jack RJ45 Cat. 6 (paquete x 10)', category: 'cableado', image: IMG.cabling,
    description: 'Jack keystone Cat. 6 para faceplates y patch panels modulares.', price: 89000, unit: 'paquete x 10', stock: 60,
    features: ['Categoría 6', 'Formato keystone', 'Paquete de 10 unidades', 'Ponchado T568A/B'], specs: {tipo: 'Accesorios pasivos', categoria: 'Cat. 6', presentacion: 'Paquete'}}),
  ref({id: 'ref-cable-lszh', sku: 'MW-LSZH6-305', name: 'Cable LSZH Cat. 6 (305 m)', category: 'cableado', image: IMG.cat5e,
    description: 'Cable con chaqueta libre de halógenos y baja emisión de humo para espacios cerrados.', price: 689000, unit: 'caja x 305 m', stock: 15,
    features: ['Categoría 6', 'Chaqueta LSZH', 'Caja de 305 metros', 'Uso interior'], specs: {tipo: 'Cable LSZH', categoria: 'Cat. 6', presentacion: 'Caja x 305 m'}}),
  ref({id: 'ref-cable-multifilar', sku: 'MW-MF-4X22', name: 'Cable flexible multifilar 4 x 22 AWG (100 m)', category: 'cableado', image: IMG.cabling,
    description: 'Cable flexible de varios conductores para señales de control y datos.', price: 149000, unit: 'rollo x 100 m', stock: 25,
    features: ['4 conductores', 'Calibre 22 AWG', 'Cable flexible', 'Rollo de 100 metros'], specs: {tipo: 'Cable flexible multifilar', presentacion: 'Rollo x 100 m'}}),

  /* ---------- fibra óptica ---------- */
  ref({id: 'ref-fibra-adss', sku: 'MW-FO-ADSS12', name: 'Cable de fibra ADSS 12 hilos (bobina 1 km)', category: 'fibra', image: IMG.drop, badge: 'Más vendido',
    description: 'Cable autosoportado para tendidos aéreos de larga distancia.', price: 1650000, unit: 'bobina x 1 km', stock: 9,
    features: ['12 hilos monomodo', 'Autosoportado ADSS', 'Uso exterior', 'Bobina de 1 km'], specs: {tipo: 'Monomodo ADSS', modo: 'Monomodo', conector: 'Sin conector'}}),
  ref({id: 'ref-patch-lc', sku: 'MW-FO-LCLC', name: 'Patch cord de fibra LC/UPC dúplex (3 m)', category: 'fibra', image: IMG.fcord,
    description: 'Latiguillo dúplex multimodo para equipos activos y ODF.', price: 24500, unit: 'unidad', stock: 90,
    features: ['Conectores LC/UPC', 'Dúplex', 'Multimodo OM3', 'Longitud 3 m'], specs: {tipo: 'Accesorios', modo: 'Multimodo', conector: 'LC/UPC'}}),
  ref({id: 'ref-conector-sc', sku: 'MW-FO-SCAPC', name: 'Conector rápido SC/APC (paquete x 10)', category: 'fibra', image: IMG.fcord, badge: 'Nuevo',
    description: 'Conector de instalación en campo para cable drop, sin pulido.', price: 32000, unit: 'paquete x 10', stock: 75,
    features: ['SC/APC', 'Instalación en campo', 'Para cable drop', 'Paquete de 10'], specs: {tipo: 'Accesorios', modo: 'Monomodo', conector: 'SC/APC'}}),
  ref({id: 'ref-caja-nap', sku: 'MW-FO-NAP16', name: 'Caja NAP de 16 puertos', category: 'fibra', image: IMG.fiber,
    description: 'Caja de distribución para redes FTTH, uso exterior con sellado IP65.', price: 189000, unit: 'unidad', stock: 18,
    features: ['16 puertos SC/APC', 'Sellado IP65', 'Montaje en poste o pared', 'Bandeja de empalme'], specs: {tipo: 'Accesorios', modo: 'Monomodo', conector: 'SC/APC'}}),

  ref({id: 'ref-fibra-om3', sku: 'MW-FO-OM3-12', name: 'Cable de fibra multimodo OM3 12 hilos (bobina 1 km)', category: 'fibra', image: IMG.drop,
    description: 'Cable multimodo para enlaces de alta velocidad en distancias cortas dentro de edificios.', price: 1980000, unit: 'bobina x 1 km', stock: 7,
    features: ['12 hilos multimodo', 'Tipo OM3', 'Uso interior', 'Bobina de 1 km'], specs: {tipo: 'Multimodo OM3', modo: 'Multimodo', conector: 'Sin conector'}}),
  ref({id: 'ref-herraje-retencion', sku: 'MW-FO-HRT', name: 'Herraje de retención para cable ADSS', category: 'fibra', image: IMG.fiber,
    description: 'Herraje para fijar el cable ADSS en postes durante el tendido aéreo.', price: 18900, unit: 'unidad', stock: 140,
    features: ['Para cable ADSS', 'Montaje en poste', 'Uso exterior', 'Tendido aéreo'], specs: {tipo: 'Herrajería', modo: 'Monomodo', conector: 'Sin conector'}}),

  /* ---------- línea plástica ---------- */
  ref({id: 'ref-amarre', sku: 'MW-AM-200', name: 'Amarres plásticos 200 mm (bolsa x 100)', category: 'plastica', image: IMG.plastic, badge: 'Más vendido',
    description: 'Amarres de nailon para agrupar y sujetar cableado.', price: 8900, unit: 'bolsa x 100', stock: 500,
    features: ['Longitud 200 mm', 'Bolsa de 100 unidades', 'Cierre de seguridad', 'Color negro'], specs: {tipo: 'Amarres plásticos', medida: '200 mm', color: 'Negro'}}),
  ref({id: 'ref-espiral', sku: 'MW-ES-12', name: 'Espiral plástica 12 mm (10 m)', category: 'plastica', image: IMG.plastic,
    description: 'Espiral para agrupar cables y protegerlos del roce.', price: 19900, unit: 'rollo x 10 m', stock: 180,
    features: ['Diámetro 12 mm', 'Rollo de 10 metros', 'Flexible', 'Color negro'], specs: {tipo: 'Espirales plásticas', medida: '12 mm', color: 'Negro'}}),
  ref({id: 'ref-caja-4x4', sku: 'MW-CJ44', name: 'Caja de paso plástica 4 x 4"', category: 'plastica', image: IMG.plastic, badge: 'Nuevo',
    description: 'Caja para derivaciones y salidas en instalaciones a la vista.', price: 3900, unit: 'unidad', stock: 900,
    features: ['4 x 4"', 'Sobreponer', 'Troqueles laterales', 'Color blanco'], specs: {tipo: 'Cajas de paso plásticas', medida: '4 x 4"', color: 'Blanco'}}),
  ref({id: 'ref-prensa-estopa', sku: 'MW-PE-PG13', name: 'Prensa estopa plástica PG 13.5', category: 'plastica', image: IMG.plastic,
    description: 'Sujeta y sella la entrada de cables en cajas y tableros.', price: 2400, unit: 'unidad', stock: 650,
    features: ['Rosca PG 13.5', 'Con tuerca', 'Sello de cable', 'Color gris'], specs: {tipo: 'Prensa estopas', medida: 'PG 13.5', color: 'Gris'}}),
  ref({id: 'ref-faceplate', sku: 'MW-FP2', name: 'Face plate de 2 puertos', category: 'plastica', image: IMG.cabling,
    description: 'Placa frontal de 2 salidas con etiqueta de identificación.', price: 6900, unit: 'unidad', stock: 150,
    features: ['2 puertos', 'Etiqueta de identificación', 'Compatible keystone', 'Color blanco'], specs: {tipo: 'Face plate', medida: '2 puertos', color: 'Blanco'}}),
  ref({id: 'ref-organizador', sku: 'MW-OH1U', name: 'Organizador horizontal 1U', category: 'plastica', image: IMG.panel,
    description: 'Ordena los patch cords entre patch panels y switches.', price: 59000, unit: 'unidad', stock: 55,
    features: ['1 unidad de rack', 'Tapa frontal', 'Montaje 19"', 'Color negro'], specs: {tipo: 'Organizadores horizontales', medida: '1U', color: 'Negro'}}),

  /* ---------- HDTV ---------- */
  ref({id: 'ref-hdmi-cable', sku: 'MW-HD-C3', name: 'Cable HDMI 4K (3 m)', category: 'hdtv', image: IMG.hdtv,
    description: 'Cable HDMI para conectar pantallas, decodificadores y equipos de video.', price: 24900, unit: 'unidad', stock: 120,
    features: ['Resolución 4K', 'Longitud 3 m', 'Conectores HDMI', 'Uso interior'], specs: {tipo: 'Cables', resolucion: '4K'}}),
  ref({id: 'ref-hdmi-extender', sku: 'MW-HD-EX50', name: 'Extender HDMI por cable de red (50 m)', category: 'hdtv', image: IMG.hdtv,
    description: 'Lleva la señal HDMI hasta 50 metros usando cable de red.', price: 129000, unit: 'par', stock: 30,
    features: ['Alcance 50 m', 'Transmisor y receptor', 'Sobre cable de red', 'Resolución 1080p'], specs: {tipo: 'Extender', resolucion: '1080p'}}),
  ref({id: 'ref-hdmi-splitter', sku: 'MW-HD-SP4', name: 'Splitter HDMI 1 x 4', category: 'hdtv', image: IMG.hdtv,
    description: 'Reparte una señal HDMI a cuatro pantallas al mismo tiempo.', price: 149000, unit: 'unidad', stock: 22,
    features: ['1 entrada', '4 salidas', 'Resolución 4K', 'Con fuente de poder'], specs: {tipo: 'Splitter', resolucion: '4K'}}),

  /* ---------- canalización y ductería ---------- */
  ref({id: 'ref-canaleta-40', sku: 'MW-CN4025', name: 'Canaleta 40 x 25 mm con adhesivo (2 m)', category: 'canalizacion', image: IMG.plastic, badge: 'Más vendido',
    description: 'Canaleta con división para organizar cableado de datos y energía.', price: 14500, unit: 'tira x 2 m', stock: 400,
    features: ['40 x 25 mm', 'Con adhesivo', 'Con división', 'Color blanco'], specs: {tipo: 'Canaletas', medida: '40 x 25 mm', material: 'PVC'}}),
  ref({id: 'ref-canaleta-60', sku: 'MW-CN6040', name: 'Canaleta 60 x 40 mm (2 m)', category: 'canalizacion', image: IMG.plastic,
    description: 'Canaleta de mayor capacidad para tendidos troncales.', price: 22900, unit: 'tira x 2 m', stock: 220,
    features: ['60 x 40 mm', 'Alta capacidad', 'Tapa a presión', 'Color blanco'], specs: {tipo: 'Canaletas', medida: '60 x 40 mm', material: 'PVC'}}),
  ref({id: 'ref-angulo', sku: 'MW-AN4025', name: 'Ángulo interno para canaleta 40 x 25 mm', category: 'canalizacion', image: IMG.plastic,
    description: 'Accesorio para giros limpios en esquinas interiores.', price: 2900, unit: 'unidad', stock: 700,
    features: ['Para canaleta 40 x 25', 'Ángulo interno', 'Encaje a presión', 'Color blanco'], specs: {tipo: 'Canaletas', medida: '40 x 25 mm', material: 'PVC'}}),
  ref({id: 'ref-tubo-34', sku: 'MW-TB34', name: 'Tubo PVC SCH 40 de 3/4" (3 m)', category: 'canalizacion', image: IMG.plastic,
    description: 'Tubería rígida de PVC para canalización eléctrica y de datos.', price: 8900, unit: 'tubo x 3 m', stock: 600,
    features: ['Diámetro 3/4"', 'PVC SCH 40', 'Longitud 3 m', 'Tubería rígida'], specs: {tipo: 'Tubería SCH 40', medida: '3/4"', material: 'PVC'}}),
  ref({id: 'ref-tubo-emt', sku: 'MW-EMT34', name: 'Tubo EMT de 3/4" (3 m)', category: 'canalizacion', image: IMG.plastic,
    description: 'Tubería metálica liviana para instalaciones a la vista.', price: 21900, unit: 'tubo x 3 m', stock: 260,
    features: ['Diámetro 3/4"', 'Tubería EMT', 'Longitud 3 m', 'Acero galvanizado'], specs: {tipo: 'Tubería EMT', medida: '3/4"', material: 'Acero'}}),
  ref({id: 'ref-tubo-imc', sku: 'MW-IMC34', name: 'Tubo IMC de 3/4" (3 m)', category: 'canalizacion', image: IMG.plastic,
    description: 'Tubería metálica de pared intermedia para instalaciones exigentes.', price: 46900, unit: 'tubo x 3 m', stock: 120,
    features: ['Diámetro 3/4"', 'Tubería IMC', 'Longitud 3 m', 'Acero galvanizado'], specs: {tipo: 'Tubería IMC', medida: '3/4"', material: 'Acero'}}),
  ref({id: 'ref-ducto', sku: 'MW-DC4', name: 'Ducto PVC de 4" (6 m)', category: 'canalizacion', image: IMG.plastic,
    description: 'Ducto para canalización subterránea de redes.', price: 89000, unit: 'tubo x 6 m', stock: 80,
    features: ['Diámetro 4"', 'PVC', 'Longitud 6 m', 'Uso subterráneo'], specs: {tipo: 'Ductos', medida: '4"', material: 'PVC'}}),
  ref({id: 'ref-bandeja-portacable', sku: 'MW-BP100', name: 'Bandeja porta cables 100 mm (2,4 m)', category: 'canalizacion', image: IMG.infra,
    description: 'Bandeja para llevar y ordenar tendidos de cable por techos y cuartos técnicos.', price: 79000, unit: 'tramo x 2,4 m', stock: 60,
    features: ['Ancho 100 mm', 'Tramo de 2,4 m', 'Acero galvanizado', 'Montaje en techo o pared'], specs: {tipo: 'Bandejas porta cables', medida: '100 mm', material: 'Acero'}}),

  /* ---------- metalmecánica ---------- */
  ref({id: 'ref-gabinete-9u', sku: 'MW-GB9U', name: 'Gabinete de pared 9U con puerta de vidrio', category: 'metalmecanica', image: IMG.wall, badge: 'Más vendido',
    description: 'Gabinete con ventilación y cerradura para cuartos técnicos pequeños.', price: 520000, unit: 'unidad', stock: 12,
    features: ['9 unidades de rack', 'Puerta de vidrio', 'Cerradura', 'Ventilación superior'], specs: {tipo: 'Gabinetes', tamano: '9U', instalacion: 'Pared'}}),
];

/** Textos, filtros, guía y preguntas frecuentes de cada página de categoría. */
type Guide = {title: string; sections: {h: string; p: string}[]};
type Faq = {q: string; a: string};
export type CategoryPageInfo = {intro: string; tagline?: string; hero: string; filters: {key: string; label: string}[]; guide: Guide; faq: Faq[]};

export const categoryPages: Record<CategoryId, CategoryPageInfo> = {
  cableado: {
    tagline: 'Conectividad confiable para cada proyecto.',
    intro: 'Cables UTP, FTP, LSZH, multifilares y accesorios especializados para redes profesionales.',
    hero: '/assets/categoria-cableado-v5.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'categoria', label: 'Categoría'}, {key: 'presentacion', label: 'Presentación'}],
    guide: {
      title: 'Encuentra el cableado estructurado que necesitas en MARWA',
      sections: [
        {h: 'Elige la categoría correcta', p: 'Cat. 5E es suficiente para redes de hasta 1 Gbps en distancias cortas; Cat. 6 ofrece más margen y menos interferencia para redes Gigabit; Cat. 6A está pensada para 10 Gbps y entornos exigentes como data centers.'},
        {h: 'Todo el canal de la misma categoría', p: 'El desempeño de la red depende del eslabón más débil: usa cable, jacks, patch panel y patch cords de la misma categoría para que el enlace funcione como fue diseñado.'},
        {h: 'Organiza desde el cuarto técnico', p: 'Un patch panel con organizadores y patch cords de la longitud justa facilita el mantenimiento, reduce errores y mejora el flujo de aire dentro del rack.'},
        {h: 'Asesoría para tu proyecto', p: 'Para edificios u oficinas, un asesor MARWA te ayuda a armar la lista completa de materiales.'},
      ],
    },
    faq: [
      {q: '¿Qué diferencia hay entre Cat. 5E, Cat. 6 y Cat. 6A?', a: 'La categoría define el ancho de banda y la velocidad que soporta el cable. Cat. 5E soporta hasta 1 Gbps, Cat. 6 mejora el desempeño a 1 Gbps con menos interferencia y Cat. 6A soporta 10 Gbps en distancias de hasta 100 m.'},
      {q: '¿Cuántos metros trae una caja de cable UTP?', a: 'La presentación estándar es una caja de 305 metros (1.000 pies).'},
      {q: '¿Qué es un patch panel y para qué sirve?', a: 'Es el panel donde terminan los cables horizontales de la red. Permite organizar, identificar y cambiar conexiones desde el rack sin tocar el cableado de las paredes.'},
      {q: '¿Cuándo necesito cable apantallado?', a: 'Cuando el cableado pasa cerca de fuentes de interferencia, como motores, iluminación industrial o cables de energía, o cuando el proyecto exige 10 Gbps.'},
      {q: '¿Hacen despachos a todo Colombia?', a: 'Sí, despachamos a los 32 departamentos. El costo del envío se coordina al despachar según el destino del pedido.'},
    ],
  },
  fibra: {
    tagline: 'Velocidad y precisión en cada conexión.',
    intro: 'Soluciones monomodo ADSS y DROP, multimodo OM3, herrajes y accesorios para infraestructura de fibra óptica.',
    hero: '/assets/categoria-fibra-v2.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'modo', label: 'Modo'}, {key: 'conector', label: 'Conector'}],
    guide: {
      title: 'Encuentra la fibra óptica que necesitas en MARWA',
      sections: [
        {h: 'Monomodo o multimodo', p: 'La fibra monomodo cubre largas distancias y es la base de las redes FTTH y de los enlaces entre sedes; la multimodo es ideal para distancias cortas dentro de edificios y data centers.'},
        {h: 'El conector correcto', p: 'SC/APC es el estándar en redes FTTH por su baja reflexión; LC/UPC es el más común en equipos activos y switches por su tamaño compacto. Verifica el conector de tus equipos antes de comprar.'},
        {h: 'Cable para cada tendido', p: 'El cable drop conecta la red con el usuario final; el ADSS es autosoportado para tendidos aéreos entre postes; para interiores existen cables de menor diámetro y mayor flexibilidad.'},
        {h: 'Distribución ordenada', p: 'Las cajas NAP y las bandejas de empalme protegen las fusiones y facilitan agregar nuevos usuarios sin intervenir toda la red.'},
      ],
    },
    faq: [
      {q: '¿Qué es FTTH?', a: 'Fiber To The Home: una red en la que la fibra óptica llega hasta la vivienda o la oficina del usuario final.'},
      {q: '¿Qué significa APC y UPC?', a: 'Es el tipo de pulido de la punta del conector. APC tiene un ángulo de 8° y menor reflexión (se identifica con color verde); UPC tiene pulido recto (color azul).'},
      {q: '¿Puedo mezclar conectores APC y UPC?', a: 'No. Conectar APC con UPC genera pérdidas altas y puede dañar las puntas. Usa siempre el mismo tipo en ambos extremos.'},
      {q: '¿Qué es una caja NAP?', a: 'Es el punto de acceso de red donde se conectan los cables drop de los usuarios a la red de distribución de fibra.'},
      {q: '¿Me ayudan a elegir los materiales para un despliegue?', a: 'Sí. Un asesor MARWA te ayuda a elegir cable, conectores y cajas según tu proyecto.'},
    ],
  },
  plastica: {
    tagline: 'Organización y protección para tus instalaciones.',
    intro: 'Amarres, espirales, cajas de paso, prensaestopas, faceplates y organizadores para una gestión eficiente del cableado.',
    hero: '/assets/categoria-plastica-v2.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'medida', label: 'Medida'}, {key: 'color', label: 'Color'}],
    guide: {
      title: 'Encuentra la línea plástica que necesitas en MARWA',
      sections: [
        {h: 'Agrupa y protege', p: 'Los amarres sujetan los cables en cada tramo y las espirales los agrupan y protegen del roce en recorridos a la vista.'},
        {h: 'Derivaciones ordenadas', p: 'Las cajas de paso facilitan los cambios de dirección y las derivaciones, y dejan el cableado accesible para el mantenimiento.'},
        {h: 'Entradas selladas', p: 'Los prensa estopas sujetan el cable y sellan su entrada a cajas y tableros.'},
        {h: 'Puntos de red y rack', p: 'Los face plate dan un acabado limpio a cada salida de red y los organizadores horizontales guían los patch cords dentro del rack.'},
      ],
    },
    faq: [
      {q: '¿Qué medida de amarre necesito?', a: 'Depende del diámetro del grupo de cables. Un asesor MARWA te ayuda a elegirla según tu proyecto.'},
      {q: '¿Para qué sirve un prensa estopa?', a: 'Para sujetar el cable y sellar su entrada a una caja o un tablero.'},
      {q: '¿Qué es un face plate?', a: 'Es la placa frontal donde se instalan los jacks de una salida de red.'},
      {q: '¿Hacen despachos a todo Colombia?', a: 'Sí, despachamos a los 32 departamentos. El costo del envío se coordina al despachar según el destino del pedido.'},
    ],
  },
  hdtv: {
    tagline: 'Señal de alta calidad, sin límites.',
    intro: 'Cables, extensores y splitters para soluciones de transmisión y distribución de señal de video.',
    hero: '/assets/categoria-hdtv-v2.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'resolucion', label: 'Resolución'}],
    guide: {
      title: 'Encuentra lo que tu señal de video necesita en MARWA',
      sections: [
        {h: 'Cables', p: 'Para conexiones directas entre el equipo y la pantalla, elige la longitud justa y la resolución que manejan tus equipos.'},
        {h: 'Extender', p: 'Cuando la pantalla está lejos del equipo, un extender lleva la señal a mayor distancia que un cable convencional.'},
        {h: 'Splitter', p: 'Un splitter reparte la misma señal a varias pantallas al mismo tiempo.'},
      ],
    },
    faq: [
      {q: '¿Cuál es la diferencia entre un extender y un splitter?', a: 'El extender lleva la señal más lejos; el splitter la reparte a varias pantallas.'},
      {q: '¿Me ayudan a elegir los productos?', a: 'Sí. Un asesor MARWA te recomienda los productos según tus equipos y distancias.'},
      {q: '¿Hacen despachos a todo Colombia?', a: 'Sí, despachamos a los 32 departamentos. El costo del envío se coordina al despachar según el destino del pedido.'},
    ],
  },
  canalizacion: {
    tagline: 'Infraestructura segura para cada instalación.',
    intro: 'Canaletas, tuberías SCH 40, EMT e IMC, ductos y bandejas portacables para instalaciones organizadas y confiables.',
    hero: '/assets/categoria-canalizacion-v2.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'medida', label: 'Medida'}, {key: 'material', label: 'Material'}],
    guide: {
      title: 'Encuentra la canalización que necesitas en MARWA',
      sections: [
        {h: 'Calcula la capacidad', p: 'Elige una canaleta que quede ocupada a no más del 60 % de su capacidad: así el cableado se instala fácil y queda espacio para crecer.'},
        {h: 'Datos y energía separados', p: 'Las canaletas con división permiten llevar cableado de datos y de energía por el mismo recorrido, respetando la separación entre ambos.'},
        {h: 'Tubería para cada obra', p: 'La tubería SCH 40 es de PVC; la EMT y la IMC son metálicas, y la IMC tiene una pared más gruesa para instalaciones más exigentes.'},
        {h: 'Tendidos grandes', p: 'Los ductos canalizan redes subterráneas y las bandejas porta cables ordenan tendidos por techos y cuartos técnicos.'},
      ],
    },
    faq: [
      {q: '¿Qué medida de canaleta necesito?', a: 'Depende de la cantidad y el diámetro de los cables. Un asesor MARWA te ayuda a calcularla según tu proyecto.'},
      {q: '¿Las canaletas traen adhesivo?', a: 'Algunas referencias incluyen cinta adhesiva para instalación rápida; también pueden fijarse con tornillo y chazo.'},
      {q: '¿Puedo llevar datos y energía en la misma canaleta?', a: 'Sí, siempre que la canaleta tenga división que separe ambos tipos de cableado.'},
      {q: '¿Qué diferencia hay entre EMT e IMC?', a: 'Ambas son tuberías metálicas; la IMC tiene una pared más gruesa que la EMT.'},
    ],
  },
  metalmecanica: {
    tagline: 'Solidez y respaldo para tu infraestructura.',
    intro: 'Racks y gabinetes para telecomunicaciones, diseñados para organizar y proteger tus equipos de red.',
    hero: '/assets/categoria-metalmecanica-v2.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'tamano', label: 'Tamaño'}, {key: 'instalacion', label: 'Instalación'}],
    guide: {
      title: 'Encuentra el rack o gabinete que necesitas en MARWA',
      sections: [
        {h: 'Calcula las unidades de rack', p: 'Suma la altura de tus equipos en unidades (1U = 44,45 mm) y agrega un 30 % de espacio libre para ventilación, organizadores y crecimiento.'},
        {h: 'Piso o pared', p: 'Los gabinetes de pared ahorran espacio en oficinas y comercios; los racks de piso de 42U son el estándar para cuartos técnicos y data centers.'},
        {h: 'Ventilación', p: 'Deja espacio libre entre equipos y revisa la ventilación del gabinete para mantenerlos frescos.'},
      ],
    },
    faq: [
      {q: '¿Qué significa 1U?', a: 'Es la unidad de altura de un rack: 1,75 pulgadas o 44,45 mm. Un rack de 42U tiene espacio para 42 unidades.'},
      {q: '¿Los racks son de 19 pulgadas?', a: 'Sí, el estándar para equipos de red y telecomunicaciones es de 19 pulgadas de ancho.'},
      {q: '¿Qué profundidad necesito?', a: 'Depende de los equipos: los switches y patch panels caben en gabinetes de poca profundidad; los servidores necesitan racks profundos.'},
      {q: '¿Los gabinetes traen cerradura?', a: 'Sí, nuestros gabinetes incluyen puerta con cerradura para proteger los equipos.'},
    ],
  },
};

/** Página "Todo el catálogo" (y resultados de búsqueda), con la misma estructura. */
export const allCatalogPage: CategoryPageInfo = {
  tagline: 'Todo para tu red, en un solo lugar.',
  intro: 'Cableado estructurado, fibra óptica, línea plástica, HDTV, canalización y metalmecánica con despacho a toda Colombia.',
  hero: '/assets/categoria-todos-v1.jpg',
  filters: [{key: 'linea', label: 'Línea'}],
  guide: {
    title: 'Encuentra lo que tu proyecto necesita en MARWA',
    sections: [
      {h: 'Un solo aliado para toda la red', p: 'Desde el cable y la canalización hasta el rack: compra todas las líneas en un mismo pedido y recibe todo junto.'},
      {h: 'Calidad que cumple la norma', p: 'Nuestros productos están alineados a RITEL y RETIE para que tu instalación pase la certificación sin contratiempos.'},
      {h: 'Precios claros', p: 'Todos los precios de la tienda están en pesos colombianos con IVA incluido.'},
      {h: 'Asesoría de principio a fin', p: '¿No sabes qué referencia elegir? Nuestro equipo te ayuda a armar la lista de materiales correcta para tu red.'},
    ],
  },
  faq: [
    {q: '¿Qué productos encuentro en la tienda?', a: 'Las seis líneas oficiales de MARWA: cableado estructurado, fibra óptica, línea plástica, HDTV, canalización y ductería, y metalmecánica. Si no encuentras una referencia, escríbenos y la cotizamos.'},
    {q: '¿Qué medios de pago aceptan?', a: 'Puedes pagar con tarjeta débito o crédito, PSE o Nequi. Recibirás la confirmación del pedido apenas se apruebe el pago.'},
    {q: '¿Hacen envíos a todo Colombia?', a: 'Sí, despachamos a los 32 departamentos. El costo del envío se coordina al despachar según el destino del pedido.'},
    {q: '¿Cómo hago seguimiento a mi pedido?', a: 'En “Mi cuenta” ves el estado de cada pedido y el número de guía cuando sale de nuestra bodega.'},
    {q: '¿Me ayudan a elegir los productos?', a: 'Sí. Un asesor MARWA te ayuda por WhatsApp a elegir las referencias correctas para tu red.'},
  ],
};
