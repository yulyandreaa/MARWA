import './home.css';
import './premium.css';
import './home-v3.css';
import {PmFooter, PmSiteHeader} from '@/components/premium/SiteChrome';
import {EcoHero} from '@/components/premium/EcoHero';
import {HvAbout, HvBigType, HvBrandVideo, HvCable, HvCharacter, HvContact, HvDivider, HvQuality, HvSolutions, HvStats} from '@/components/premium/HomeV3';
import {HomeFX, HomeIntro} from '@/components/premium/HomeFX';
import {WhatsAppButton} from '@/components/WhatsAppButton';
import {RevealOnScroll} from '@/components/HomeMotion';

/**
 * Página de inicio MARWA v3 (10-nov-2026): presentación de marca premium que lleva a la tienda.
 * 1 Ecosistema (portada, pedido del cliente) · 2 Video de marca · 3 Cifras · 4 Del puerto a tu proyecto ·
 * 5 Soluciones por proyecto · 6 Calidad y respaldo · 7 Personaje · 8 Quiénes somos · 9 Contacto (sin productos: pedido del usuario).
 * La versión anterior quedó en _backup/home-antes-v3/page.tsx.
 */
export default function Home() {
  return (
    <div className="pm hv">
      <PmSiteHeader/>
      <main id="inicio">
        <EcoHero/>
        <HvAbout/>
        <HvBrandVideo/>
        <HvStats/>
        <HvBigType/>
        {/* "Del puerto a tu proyecto" (HvProcess) guardada en HomeV3.tsx; quitada el 10-nov-2026, se puede volver a poner aquí */}
        <HvSolutions/>
        <HvDivider/>
        <HvQuality/>
        <HvCharacter/>
        <HvContact/>
      </main>
      <PmFooter/>
      <WhatsAppButton/>
      <RevealOnScroll/>
      <HvCable/>
      <HomeFX/>
      <HomeIntro/>
    </div>
  );
}
