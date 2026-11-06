import './home.css';
import './premium.css';
import {PmAnnouncement, PmFooter, PmSiteHeader} from '@/components/premium/SiteChrome';
import {PmAbout, PmCategoryRow, PmHero, PmIntro, PmMoments, PmProducts, PmPromoGrid, PmSeries, PmTrust} from '@/components/premium/Sections';
import {EcosystemSection} from '@/components/EcosystemSection';
import {WhatsAppButton} from '@/components/WhatsAppButton';
import {RevealOnScroll} from '@/components/HomeMotion';

/**
 * Home MARWA — estructura y lenguaje visual de anker.com (premium y limpio):
 * banners a todo lo ancho con el texto centrado, fondos blancos y gris claro,
 * botones rectos de un solo color y mucho aire entre secciones.
 */
export default function Home() {
  return (
    <div className="pm">
      <PmAnnouncement/>
      <PmSiteHeader/>
      <main id="inicio">
        <PmHero
          theme="dark"
          title={<>Conectamos la infraestructura<br/>que mueve a Colombia</>}
          subtitle="MARWA Redes y Energía"
          cta="Comprar ahora"
          href="/tienda"
          newTab
          video="/assets/marwa-hero-motion-3.mp4"
          image="/assets/solution-infrastructure.jpg"
          priority
        />
        <PmHero
          theme="light"
          align="left"
          title={<>Todo para conectar<br/>tu próximo proyecto</>}
          subtitle="Tienda en línea MARWA"
          cta="Explorar la tienda"
          href="/tienda?vista=todos"
          newTab
          image="/assets/marwa-hero-magnific.jpg"
          position="70% 40%"
        />

        <div className="pm-soft">
          <PmIntro/>
          <PmPromoGrid
            newTab
            tiles={[
              {title: 'Fibra óptica sin pausas', text: 'Conectividad de alta velocidad para operaciones que no se detienen.', image: '/assets/solution-fiber.jpg', href: '/tienda?categoria=fibra'},
              {title: 'Cableado que ordena tu red', text: 'Cable UTP, patch panel y patch cords certificados.', image: '/assets/solution-cabling.jpg', href: '/tienda?categoria=cableado'},
              {title: 'Metalmecánica para tu cuarto técnico', text: 'Racks y gabinetes para telecomunicaciones.', image: '/assets/solution-infrastructure.jpg', href: '/tienda?categoria=metalmecanica'},
              {title: 'Canalización y ductería', text: 'Canaletas, tubería, ductos y bandejas porta cables.', image: '/assets/solution-plastic.jpg', href: '/tienda?categoria=canalizacion'},
            ]}
          />
          <PmCategoryRow newTab/>
          <PmSeries
            title="Conoce MARWA"
            items={[
              {theme: 'dark', title: 'Despachos a todo Colombia', text: 'Tu pedido sale de nuestra bodega en Bogotá hacia los 32 departamentos.', video: '/assets/marwa-hero-motion-2.mp4', href: '/tienda', cta: 'Comprar ahora', newTab: true},
              {theme: 'light', contain: true, title: 'Ecosistema MARWA', text: 'De la fibra al cuarto técnico: seis etapas, una sola red.', image: '/assets/marwa-digital-building.png', href: '#ecosistema', cta: 'Conocer el ecosistema'},
            ]}
          />
        </div>

        <EcosystemSection/>

        <div className="pm-soft">
          <PmMoments
            id="soluciones"
            title="Soluciones para cada proyecto"
            items={[
              {title: 'Oficinas corporativas', text: 'Redes ordenadas y escalables para equipos que no pueden detenerse.', image: '/assets/equipo-marwa-colombia.png', href: '/tienda?categoria=cableado', cta: 'Ver cableado', newTab: true},
              {title: 'Data centers', text: 'Racks, gabinetes y organización para entornos de misión crítica.', image: '/assets/solution-infrastructure.jpg', href: '/tienda?categoria=metalmecanica', cta: 'Ver metalmecánica', newTab: true},
              {title: 'Proveedores de internet', text: 'Fibra óptica y conectividad para despliegues FTTH.', image: '/assets/solution-fiber.jpg', href: '/tienda?categoria=fibra', cta: 'Ver fibra óptica', newTab: true},
              {title: 'Construcción', text: 'Canalización y ductería para obras nuevas y remodelaciones.', image: '/assets/solution-plastic.jpg', href: '/tienda?categoria=canalizacion', cta: 'Ver canalización', newTab: true},
              {title: 'Salas y comercios', text: 'Cables, extender y splitter para tu señal de video.', image: '/assets/solution-hdtv.jpg', href: '/tienda?categoria=hdtv', cta: 'Ver HDTV', newTab: true},
            ]}
          />
          <PmProducts newTab/>
        </div>

        <PmTrust/>
        <div className="pm-soft"><PmAbout/></div>
      </main>
      <PmFooter/>
      <WhatsAppButton/>
      <RevealOnScroll/>
    </div>
  );
}
