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
  net: '/assets/solution-networking.jpg',
  plastic: '/assets/solution-plastic.jpg',
  infra: '/assets/solution-infrastructure.jpg',
};

type Ref = Omit<Product, 'visible'> & {visible?: boolean};
const ref = (p: Ref): Product => ({visible: true, ...p});

/** Especificaciones de los 7 productos iniciales (para los filtros). */
export const seedSpecs: Record<string, Record<string, string>> = {
  'cable-cat5e': {tipo: 'Cable UTP', categoria: 'Cat. 5E', presentacion: 'Caja x 305 m'},
  'patch-panel': {tipo: 'Patch panel', categoria: 'Cat. 6', presentacion: 'Unidad'},
  'patch-cord': {tipo: 'Patch cord', categoria: 'Cat. 5E', presentacion: 'Unidad'},
  'fibra-drop': {tipo: 'Cable de fibra', modo: 'Monomodo', conector: 'Sin conector'},
  'patch-fibra': {tipo: 'Patch cord de fibra', modo: 'Monomodo', conector: 'SC/APC'},
  'rack-piso': {tipo: 'Rack de piso', tamano: '42U', instalacion: 'Piso'},
  'gabinete-pared': {tipo: 'Gabinete de pared', tamano: '6U', instalacion: 'Pared'},
};

export const referenceProducts: Product[] = [
  /* ---------- cableado estructurado ---------- */
  ref({id: 'ref-cable-cat6', sku: 'MW-UTP6-305', name: 'Cable UTP Cat. 6 (305 m, 100% cobre)', category: 'cableado', image: IMG.cat5e, badge: 'Nuevo',
    description: 'Cable de par trenzado Cat. 6 para redes Gigabit, caja de 305 metros.', price: 529000, unit: 'caja x 305 m', stock: 30,
    features: ['Categoría 6', 'Caja de 305 metros', 'Conductor 100% cobre', 'Hasta 1 Gbps'], specs: {tipo: 'Cable UTP', categoria: 'Cat. 6', presentacion: 'Caja x 305 m'}}),
  ref({id: 'ref-cable-cat6a', sku: 'MW-UTP6A-305', name: 'Cable F/UTP Cat. 6A apantallado (305 m)', category: 'cableado', image: IMG.cat5e,
    description: 'Cable apantallado Cat. 6A para redes de 10 Gbps y entornos con interferencia.', price: 1150000, unit: 'caja x 305 m', stock: 8,
    features: ['Categoría 6A', 'Apantallado F/UTP', 'Hasta 10 Gbps', 'Caja de 305 metros'], specs: {tipo: 'Cable UTP', categoria: 'Cat. 6A', presentacion: 'Caja x 305 m'}}),
  ref({id: 'ref-patch-cord-6', sku: 'MW-PC6-3M', name: 'Patch cord Cat. 6 (3 m)', category: 'cableado', image: IMG.cord, badge: 'Más vendido',
    description: 'Cable de parcheo Cat. 6 de 3 metros con botas de protección.', price: 15900, unit: 'unidad', stock: 220,
    features: ['Categoría 6', 'Longitud 3 m', 'Conectores RJ45', 'Botas de protección'], specs: {tipo: 'Patch cord', categoria: 'Cat. 6', presentacion: 'Unidad'}}),
  ref({id: 'ref-jack-6', sku: 'MW-JK6', name: 'Jack RJ45 Cat. 6 (paquete x 10)', category: 'cableado', image: IMG.cabling,
    description: 'Jack keystone Cat. 6 para faceplates y patch panels modulares.', price: 89000, unit: 'paquete x 10', stock: 60,
    features: ['Categoría 6', 'Formato keystone', 'Paquete de 10 unidades', 'Ponchado T568A/B'], specs: {tipo: 'Jack', categoria: 'Cat. 6', presentacion: 'Paquete'}}),
  ref({id: 'ref-faceplate', sku: 'MW-FP2', name: 'Faceplate de 2 puertos', category: 'cableado', image: IMG.cabling,
    description: 'Placa frontal de 2 salidas con etiqueta de identificación.', price: 6900, unit: 'unidad', stock: 150,
    features: ['2 puertos', 'Etiqueta de identificación', 'Compatible keystone', 'Color blanco'], specs: {tipo: 'Faceplate', categoria: 'Cat. 6', presentacion: 'Unidad'}}),

  /* ---------- fibra óptica ---------- */
  ref({id: 'ref-fibra-adss', sku: 'MW-FO-ADSS12', name: 'Cable de fibra ADSS 12 hilos (bobina 1 km)', category: 'fibra', image: IMG.drop, badge: 'Más vendido',
    description: 'Cable autosoportado para tendidos aéreos de larga distancia.', price: 1650000, unit: 'bobina x 1 km', stock: 9,
    features: ['12 hilos monomodo', 'Autosoportado ADSS', 'Uso exterior', 'Bobina de 1 km'], specs: {tipo: 'Cable de fibra', modo: 'Monomodo', conector: 'Sin conector'}}),
  ref({id: 'ref-patch-lc', sku: 'MW-FO-LCLC', name: 'Patch cord de fibra LC/UPC dúplex (3 m)', category: 'fibra', image: IMG.fcord,
    description: 'Latiguillo dúplex multimodo para equipos activos y ODF.', price: 24500, unit: 'unidad', stock: 90,
    features: ['Conectores LC/UPC', 'Dúplex', 'Multimodo OM3', 'Longitud 3 m'], specs: {tipo: 'Patch cord de fibra', modo: 'Multimodo', conector: 'LC/UPC'}}),
  ref({id: 'ref-conector-sc', sku: 'MW-FO-SCAPC', name: 'Conector rápido SC/APC (paquete x 10)', category: 'fibra', image: IMG.fcord, badge: 'Nuevo',
    description: 'Conector de instalación en campo para cable drop, sin pulido.', price: 32000, unit: 'paquete x 10', stock: 75,
    features: ['SC/APC', 'Instalación en campo', 'Para cable drop', 'Paquete de 10'], specs: {tipo: 'Conector', modo: 'Monomodo', conector: 'SC/APC'}}),
  ref({id: 'ref-caja-nap', sku: 'MW-FO-NAP16', name: 'Caja NAP de 16 puertos', category: 'fibra', image: IMG.fiber,
    description: 'Caja de distribución para redes FTTH, uso exterior con sellado IP65.', price: 189000, unit: 'unidad', stock: 18,
    features: ['16 puertos SC/APC', 'Sellado IP65', 'Montaje en poste o pared', 'Bandeja de empalme'], specs: {tipo: 'Caja de distribución', modo: 'Monomodo', conector: 'SC/APC'}}),

  /* ---------- networking ---------- */
  ref({id: 'ref-switch-8', sku: 'MW-SW8G', name: 'Switch no administrable 8 puertos Gigabit', category: 'networking', image: IMG.net, badge: 'Más vendido',
    description: 'Switch de escritorio plug and play para oficinas y puntos de red pequeños.', price: 139000, unit: 'unidad', stock: 40,
    features: ['8 puertos 10/100/1000', 'Plug and play', 'Carcasa metálica', 'Bajo consumo'], specs: {tipo: 'Switch', puertos: '8 puertos', administracion: 'No administrable'}}),
  ref({id: 'ref-switch-24poe', sku: 'MW-SW24P', name: 'Switch administrable 24 puertos PoE+', category: 'networking', image: IMG.net, badge: 'Profesional',
    description: 'Switch capa 2 con PoE+ para cámaras, access points y telefonía IP.', price: 1890000, unit: 'unidad', stock: 6,
    features: ['24 puertos PoE+', '4 puertos SFP', 'Administración web', 'Montaje en rack'], specs: {tipo: 'Switch', puertos: '24 puertos', administracion: 'Administrable'}}),
  ref({id: 'ref-router', sku: 'MW-RT1200', name: 'Router inalámbrico doble banda AC1200', category: 'networking', image: IMG.net,
    description: 'Router Wi-Fi para hogares y pequeñas oficinas con control parental.', price: 229000, unit: 'unidad', stock: 25,
    features: ['Doble banda 2.4 / 5 GHz', 'AC1200', '4 antenas', 'Puertos Gigabit'], specs: {tipo: 'Router', puertos: '5 puertos', administracion: 'Administrable'}}),
  ref({id: 'ref-ap', sku: 'MW-AP-CEIL', name: 'Access point de techo doble banda', category: 'networking', image: IMG.net, badge: 'Nuevo',
    description: 'Punto de acceso con alimentación PoE para cobertura Wi-Fi empresarial.', price: 389000, unit: 'unidad', stock: 14,
    features: ['Montaje en techo', 'Alimentación PoE', 'Doble banda', 'Gestión centralizada'], specs: {tipo: 'Access point', puertos: '1 puerto', administracion: 'Administrable'}}),
  ref({id: 'ref-sfp', sku: 'MW-SFP-1G', name: 'Módulo SFP 1G monomodo (20 km)', category: 'networking', image: IMG.net,
    description: 'Transceptor óptico para enlaces de fibra entre switches.', price: 59000, unit: 'unidad', stock: 50,
    features: ['1.25 Gbps', 'Monomodo', 'Alcance 20 km', 'Conector LC'], specs: {tipo: 'Accesorio', puertos: '1 puerto', administracion: 'No administrable'}}),

  /* ---------- línea plástica ---------- */
  ref({id: 'ref-canaleta-40', sku: 'MW-CN4025', name: 'Canaleta 40 x 25 mm con adhesivo (2 m)', category: 'plastica', image: IMG.plastic, badge: 'Más vendido',
    description: 'Canaleta con división para organizar cableado de datos y energía.', price: 14500, unit: 'tira x 2 m', stock: 400,
    features: ['40 x 25 mm', 'Con adhesivo', 'Con división', 'Color blanco'], specs: {tipo: 'Canaleta', medida: '40 x 25 mm', color: 'Blanco'}}),
  ref({id: 'ref-canaleta-60', sku: 'MW-CN6040', name: 'Canaleta 60 x 40 mm (2 m)', category: 'plastica', image: IMG.plastic,
    description: 'Canaleta de mayor capacidad para tendidos troncales.', price: 22900, unit: 'tira x 2 m', stock: 220,
    features: ['60 x 40 mm', 'Alta capacidad', 'Tapa a presión', 'Color blanco'], specs: {tipo: 'Canaleta', medida: '60 x 40 mm', color: 'Blanco'}}),
  ref({id: 'ref-tubo-34', sku: 'MW-TB34', name: 'Tubo conduit PVC 3/4" (3 m)', category: 'plastica', image: IMG.plastic,
    description: 'Tubería rígida para canalización eléctrica y de datos.', price: 8900, unit: 'tubo x 3 m', stock: 600,
    features: ['Diámetro 3/4"', 'PVC rígido', 'Longitud 3 m', 'Uso interior'], specs: {tipo: 'Tubería', medida: '3/4"', color: 'Gris'}}),
  ref({id: 'ref-caja-4x4', sku: 'MW-CJ44', name: 'Caja plástica de sobreponer 4 x 4"', category: 'plastica', image: IMG.plastic, badge: 'Nuevo',
    description: 'Caja para salidas de datos y tomas en instalaciones a la vista.', price: 3900, unit: 'unidad', stock: 900,
    features: ['4 x 4"', 'Sobreponer', 'Troqueles laterales', 'Color blanco'], specs: {tipo: 'Caja', medida: '4 x 4"', color: 'Blanco'}}),
  ref({id: 'ref-angulo', sku: 'MW-AN4025', name: 'Ángulo interno para canaleta 40 x 25 mm', category: 'plastica', image: IMG.plastic,
    description: 'Accesorio para giros limpios en esquinas interiores.', price: 2900, unit: 'unidad', stock: 700,
    features: ['Para canaleta 40 x 25', 'Ángulo interno', 'Encaje a presión', 'Color blanco'], specs: {tipo: 'Accesorio', medida: '40 x 25 mm', color: 'Blanco'}}),

  /* ---------- infraestructura ---------- */
  ref({id: 'ref-gabinete-9u', sku: 'MW-GB9U', name: 'Gabinete de pared 9U con puerta de vidrio', category: 'infraestructura', image: IMG.wall, badge: 'Más vendido',
    description: 'Gabinete con ventilación y cerradura para cuartos técnicos pequeños.', price: 520000, unit: 'unidad', stock: 12,
    features: ['9 unidades de rack', 'Puerta de vidrio', 'Cerradura', 'Ventilación superior'], specs: {tipo: 'Gabinete de pared', tamano: '9U', instalacion: 'Pared'}}),
  ref({id: 'ref-bandeja', sku: 'MW-BJ1U', name: 'Bandeja fija 1U para rack', category: 'infraestructura', image: IMG.infra,
    description: 'Bandeja ventilada para equipos que no se montan en rack.', price: 79000, unit: 'unidad', stock: 45,
    features: ['1 unidad de rack', 'Ventilada', 'Fondo 350 mm', 'Acero laminado'], specs: {tipo: 'Accesorio', tamano: '1U', instalacion: 'Rack'}}),
  ref({id: 'ref-multitoma', sku: 'MW-MT8', name: 'Multitoma 8 salidas para rack', category: 'infraestructura', image: IMG.infra, badge: 'Nuevo',
    description: 'Regleta de energía con interruptor y protección para racks de 19".', price: 149000, unit: 'unidad', stock: 30,
    features: ['8 salidas', 'Montaje 19"', 'Interruptor iluminado', 'Protección contra sobrecarga'], specs: {tipo: 'Energía', tamano: '1U', instalacion: 'Rack'}}),
  ref({id: 'ref-organizador', sku: 'MW-OH1U', name: 'Organizador horizontal 1U', category: 'infraestructura', image: IMG.panel,
    description: 'Ordena los patch cords entre patch panels y switches.', price: 59000, unit: 'unidad', stock: 55,
    features: ['1 unidad de rack', 'Anillos metálicos', 'Montaje 19"', 'Color negro'], specs: {tipo: 'Accesorio', tamano: '1U', instalacion: 'Rack'}}),
];

/** Textos, filtros, guía y preguntas frecuentes de cada página de categoría. */
type Guide = {title: string; sections: {h: string; p: string}[]};
type Faq = {q: string; a: string};
export type CategoryPageInfo = {intro: string; hero: string; filters: {key: string; label: string}[]; guide: Guide; faq: Faq[]};

export const categoryPages: Record<CategoryId, CategoryPageInfo> = {
  cableado: {
    intro: 'El cableado estructurado MARWA ofrece conexiones estables, alta velocidad de datos y redes ordenadas. Encuentra cable UTP, patch panels, patch cords, jacks y faceplates de Cat. 5E a Cat. 6A para oficinas, edificios y cuartos técnicos.',
    hero: '/assets/solution-cabling.jpg',
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
    intro: 'La fibra óptica MARWA lleva conectividad de alta velocidad a largas distancias, sin interferencias. Encuentra cable drop y ADSS, conectores, patch cords y cajas NAP para despliegues FTTH y enlaces empresariales.',
    hero: '/assets/solution-fiber.jpg',
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
  networking: {
    intro: 'Los equipos de networking MARWA conectan, protegen y hacen crecer la red de tu empresa. Encuentra switches, routers, access points y módulos ópticos para oficinas, comercios y proyectos empresariales.',
    hero: '/assets/solution-networking.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'puertos', label: 'Puertos'}, {key: 'administracion', label: 'Administración'}],
    guide: {
      title: 'Encuentra el equipo de red que necesitas en MARWA',
      sections: [
        {h: 'Administrable o no administrable', p: 'Un switch no administrable es plug and play, ideal para oficinas pequeñas; uno administrable permite VLAN, calidad de servicio y monitoreo para redes que crecen.'},
        {h: 'PoE para cámaras y access points', p: 'Los switches PoE alimentan cámaras IP, teléfonos y access points por el mismo cable de red, sin tomas eléctricas adicionales.'},
        {h: 'Wi-Fi con cobertura real', p: 'Para oficinas y comercios, varios access points de techo con gestión centralizada ofrecen mejor cobertura que un solo router.'},
        {h: 'Enlaces de fibra entre equipos', p: 'Los módulos SFP conectan switches por fibra óptica para unir pisos, edificios o sedes a mayor distancia que el cobre.'},
      ],
    },
    faq: [
      {q: '¿Cuántos puertos necesito en mi switch?', a: 'Cuenta los puntos de red actuales y suma un margen de crecimiento de al menos 20 %.'},
      {q: '¿Qué es PoE?', a: 'Power over Ethernet: la tecnología que envía datos y energía por el mismo cable de red.'},
      {q: '¿Qué es un módulo SFP?', a: 'Un transceptor que se inserta en el switch para conectarlo por fibra óptica o cobre según el tipo de módulo.'},
      {q: '¿Router o access point?', a: 'El router conecta tu red con internet; el access point amplía la cobertura Wi-Fi dentro de la red.'},
      {q: '¿Me ayudan a elegir los equipos?', a: 'Sí. Un asesor MARWA te recomienda la configuración según el tamaño de tu red y tu presupuesto.'},
    ],
  },
  plastica: {
    intro: 'La línea plástica MARWA canaliza y organiza el cableado con acabados limpios y durables. Encuentra canaletas, tubería, cajas y accesorios para instalaciones a la vista, obras nuevas y remodelaciones.',
    hero: '/assets/solution-plastic.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'medida', label: 'Medida'}, {key: 'color', label: 'Color'}],
    guide: {
      title: 'Encuentra la canalización que necesitas en MARWA',
      sections: [
        {h: 'Calcula la capacidad', p: 'Elige una canaleta que quede ocupada a no más del 60 % de su capacidad: así el cableado se instala fácil y queda espacio para crecer.'},
        {h: 'Datos y energía separados', p: 'Las canaletas con división permiten llevar cableado de datos y de energía por el mismo recorrido, respetando la separación entre ambos.'},
        {h: 'Acabados limpios', p: 'Los ángulos internos, externos y planos dan continuidad a la instalación y protegen el cable en los cambios de dirección.'},
        {h: 'Tubería para cada obra', p: 'La tubería conduit de PVC protege el cableado empotrado o a la vista en obras nuevas y remodelaciones.'},
      ],
    },
    faq: [
      {q: '¿Qué medida de canaleta necesito?', a: 'Depende de la cantidad y el diámetro de los cables. Un asesor MARWA te ayuda a calcularla según tu proyecto.'},
      {q: '¿Las canaletas traen adhesivo?', a: 'Algunas referencias incluyen cinta adhesiva para instalación rápida; también pueden fijarse con tornillo y chazo.'},
      {q: '¿Puedo llevar datos y energía en la misma canaleta?', a: 'Sí, siempre que la canaleta tenga división que separe ambos tipos de cableado.'},
      {q: '¿Qué accesorios necesito?', a: 'Ángulos internos y externos, uniones, derivaciones en T y tapas finales, según el recorrido de la instalación.'},
    ],
  },
  infraestructura: {
    intro: 'La infraestructura MARWA protege y organiza tus equipos de red. Encuentra racks de piso, gabinetes de pared, bandejas, organizadores y multitomas para cuartos técnicos y entornos de misión crítica.',
    hero: '/assets/solution-infrastructure.jpg',
    filters: [{key: 'tipo', label: 'Tipo de producto'}, {key: 'tamano', label: 'Tamaño'}, {key: 'instalacion', label: 'Instalación'}],
    guide: {
      title: 'Encuentra el rack o gabinete que necesitas en MARWA',
      sections: [
        {h: 'Calcula las unidades de rack', p: 'Suma la altura de tus equipos en unidades (1U = 44,45 mm) y agrega un 30 % de espacio libre para ventilación, organizadores y crecimiento.'},
        {h: 'Piso o pared', p: 'Los gabinetes de pared ahorran espacio en oficinas y comercios; los racks de piso de 42U son el estándar para cuartos técnicos y data centers.'},
        {h: 'Ventilación y energía', p: 'Bandejas ventiladas, ventiladores y multitomas para rack mantienen los equipos frescos y la energía ordenada.'},
        {h: 'Cableado organizado', p: 'Los organizadores horizontales y verticales guían los patch cords, facilitan el mantenimiento y mejoran el flujo de aire.'},
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
  intro: 'Todo lo que tu red necesita en un solo lugar: cableado estructurado, fibra óptica, networking, línea plástica e infraestructura, con despacho a los 32 departamentos de Colombia.',
  hero: '/assets/marwa-hero-magnific.jpg',
  filters: [{key: 'linea', label: 'Línea'}],
  guide: {
    title: 'Encuentra lo que tu proyecto necesita en MARWA',
    sections: [
      {h: 'Un solo aliado para toda la red', p: 'Desde el cable y la canalización hasta los equipos activos y el rack: compra todas las líneas en un mismo pedido y recibe todo junto.'},
      {h: 'Calidad que cumple la norma', p: 'Nuestros productos están alineados a RITEL y RETIE para que tu instalación pase la certificación sin contratiempos.'},
      {h: 'Precios claros', p: 'Todos los precios de la tienda están en pesos colombianos con IVA incluido.'},
      {h: 'Asesoría de principio a fin', p: '¿No sabes qué referencia elegir? Nuestro equipo te ayuda a armar la lista de materiales correcta para tu red.'},
    ],
  },
  faq: [
    {q: '¿Qué productos encuentro en la tienda?', a: 'Las cinco líneas oficiales de MARWA: cableado estructurado, fibra óptica, networking, línea plástica e infraestructura. Si no encuentras una referencia, escríbenos y la cotizamos.'},
    {q: '¿Qué medios de pago aceptan?', a: 'Puedes pagar con tarjeta débito o crédito, PSE o Nequi. Recibirás la confirmación del pedido apenas se apruebe el pago.'},
    {q: '¿Hacen envíos a todo Colombia?', a: 'Sí, despachamos a los 32 departamentos. El costo del envío se coordina al despachar según el destino del pedido.'},
    {q: '¿Cómo hago seguimiento a mi pedido?', a: 'En “Mi cuenta” ves el estado de cada pedido y el número de guía cuando sale de nuestra bodega.'},
    {q: '¿Me ayudan a elegir los productos?', a: 'Sí. Un asesor MARWA te ayuda por WhatsApp a elegir las referencias correctas para tu red.'},
  ],
};
