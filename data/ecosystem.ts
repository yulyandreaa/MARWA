export type EcosystemLine = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  /** Platform position over /assets/ecosistema-marwa.png, in % of the image */
  spot: {x: number; y: number};
  groups: {name: string; items: string[]}[];
};

export const ecosystem: EcosystemLine[] = [
  {
    id: 'cableado',
    title: 'Cableado estructurado',
    eyebrow: 'La base de toda red',
    description: 'Sistemas confiables para redes organizadas y de alto desempeño, alineados a estándares internacionales.',
    spot: {x: 12.7, y: 45},
    groups: [
      {name: 'Cobre', items: ['Cable UTP Cat. 5E y Cat. 6', 'Patch cords certificados']},
      {name: 'Conectividad', items: ['Patch panels modulares', 'Jacks y faceplates']},
      {name: 'Organización', items: ['Racks y gabinetes', 'Organizadores y accesorios']},
    ],
  },
  {
    id: 'fibra',
    title: 'Fibra óptica',
    eyebrow: 'Velocidad sin interrupciones',
    description: 'Conectividad de alta velocidad para operaciones que no se detienen, desde el backbone hasta el usuario final.',
    spot: {x: 27.6, y: 64.8},
    groups: [
      {name: 'Cables', items: ['Fibra Drop-Core', 'Cables de planta interna y externa']},
      {name: 'Conectividad', items: ['Patch cords de fibra', 'Pigtails y adaptadores']},
      {name: 'Distribución', items: ['ODF y bandejas de empalme', 'Cajas de distribución']},
    ],
  },
  {
    id: 'networking',
    title: 'Networking',
    eyebrow: 'Equipos que conectan y protegen',
    description: 'Equipos activos que conectan, protegen y hacen crecer la infraestructura de tu operación.',
    spot: {x: 41.7, y: 44},
    groups: [
      {name: 'Conmutación', items: ['Switches administrables', 'Switches PoE']},
      {name: 'Inalámbrico', items: ['Access points', 'Routers empresariales']},
      {name: 'Gestión', items: ['Soluciones escalables', 'Respaldo técnico']},
    ],
  },
  {
    id: 'plastica',
    title: 'Línea plástica',
    eyebrow: 'Canalización que organiza',
    description: 'Canalización y organización con acabados durables y funcionales para instalaciones limpias y seguras.',
    spot: {x: 56.1, y: 63},
    groups: [
      {name: 'Canaletas', items: ['Canaletas con división', 'Accesorios y terminales']},
      {name: 'Tubería', items: ['Tubo corrugado', 'Ductos y conduit']},
      {name: 'Montaje', items: ['Cajas y soportes', 'Fijaciones']},
    ],
  },
  {
    id: 'hdtv',
    title: 'HDTV',
    eyebrow: 'Señal clara de punta a punta',
    description: 'Soluciones para recepción y distribución de señal de televisión en alta definición.',
    spot: {x: 71.3, y: 45.7},
    groups: [
      {name: 'Recepción', items: ['Antenas y parabólicas', 'LNB y soportes']},
      {name: 'Distribución', items: ['Cable coaxial', 'Splitters y derivadores']},
      {name: 'Conexión', items: ['Cables HDMI', 'Conectores y accesorios']},
    ],
  },
  {
    id: 'energia',
    title: 'Energía',
    eyebrow: 'Continuidad para tu operación',
    description: 'Conducción y protección eléctrica para que tu infraestructura funcione sin interrupciones y bajo norma RETIE.',
    spot: {x: 88.8, y: 63},
    groups: [
      {name: 'Conducción', items: ['Cables de cobre', 'Terminales y conectores']},
      {name: 'Protección', items: ['Breakers y protecciones', 'Tableros eléctricos']},
      {name: 'Cumplimiento', items: ['Productos RETIE', 'Calidad comprobada']},
    ],
  },
];
