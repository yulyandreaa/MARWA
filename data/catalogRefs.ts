import type {CategoryId} from './shopSeed';

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
