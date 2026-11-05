export type CatalogProduct = {
  id: string;
  name: string;
  category: 'Infraestructura' | 'Fibra óptica' | 'Cableado';
  description: string;
  image: string;
  badge?: string;
  features: string[];
};

export const catalogProducts: CatalogProduct[] = [
  {id:'rack-piso',name:'Rack de piso para comunicaciones',category:'Infraestructura',description:'Gabinete vertical de alta capacidad para organizar y proteger equipos de red.',image:'/assets/producto-rack-piso.png',badge:'Profesional',features:['Instalación de piso','Organización vertical de equipos','Puerta frontal ventilada','Uso en cuartos técnicos']},
  {id:'gabinete-pared',name:'Gabinete de pared',category:'Infraestructura',description:'Gabinete compacto con puerta ventilada y cerradura para instalaciones seguras.',image:'/assets/producto-gabinete-pared.jpg',badge:'Disponible',features:['Instalación en pared','Cerradura de seguridad','Ventilación frontal y lateral','Formato compacto']},
  {id:'fibra-drop',name:'Cable de fibra óptica Drop-Core',category:'Fibra óptica',description:'Bobina de fibra MARWA para despliegues estables y conexiones de larga distancia.',image:'/assets/producto-fibra-drop.png',features:['Aplicación en redes ópticas','Presentación en bobina','Transmisión a larga distancia','Respaldo MARWA']},
  {id:'patch-fibra',name:'Patch cord de fibra óptica',category:'Fibra óptica',description:'Latiguillo óptico con conectores de precisión y baja pérdida de inserción.',image:'/assets/producto-patch-fibra.png',badge:'Recomendado',features:['Conexión óptica directa','Conectores de precisión','Baja pérdida de inserción','Uso en enlaces de datos']},
  {id:'patch-panel',name:'Patch panel modular Cat. 6',category:'Cableado',description:'Panel modular de 24 puertos para una administración ordenada del cableado.',image:'/assets/producto-patch-panel.jpg',features:['24 posiciones modulares','Formato para rack','Identificación numerada','Administración organizada']},
  {id:'patch-cord',name:'Patch cord Multiwire',category:'Cableado',description:'Cable de parcheo 100% cobre para conexiones confiables de red.',image:'/assets/producto-patch-cord.jpg',features:['Conductor 100% cobre','Conexión para red de datos','Presentación individual','Línea Multiwire MARWA']},
  {id:'cable-cat5e',name:'Cable UTP flexible Cat. 5E',category:'Cableado',description:'Caja de 305 metros, conductor 100% cobre y certificación para redes empresariales.',image:'/assets/producto-cable-cat5e.jpg',badge:'Más vendido',features:['Categoría 5E','Caja de 305 metros','Conductor 100% cobre','Cable flexible certificado']},
];
