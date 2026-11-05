export const productCategories = [
  { title:'Cableado estructurado', description:'Sistemas confiables para redes organizadas y de alto desempeño.', image:'/assets/solution-cabling.jpg', icon:'⌁', tone:'red' },
  { title:'Fibra óptica', description:'Conectividad de alta velocidad para operaciones que no se detienen.', image:'/assets/solution-fiber.jpg', icon:'Ψ', tone:'blue' },
  { title:'Networking', description:'Equipos que conectan, protegen y hacen crecer tu infraestructura.', image:'/assets/solution-networking.jpg', icon:'⌘', tone:'blue' },
  { title:'Línea plástica', description:'Canalización y organización con acabados durables y funcionales.', image:'/assets/solution-plastic.jpg', icon:'▱', tone:'green' },
  { title:'Infraestructura', description:'Gabinetes, racks y accesorios para entornos de misión crítica.', image:'/assets/solution-infrastructure.jpg', icon:'▤', tone:'blue' },
  { title:'Novedades', description:'Algo grande está por llegar. Prepárate para descubrir una nueva solución que transformará la conectividad.', image:'/assets/solution-new.jpg', icon:'✦', tone:'red' },
].map(item => ({...item, href:'/tienda', cta:'Explorar línea'}));
