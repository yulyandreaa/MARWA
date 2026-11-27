import './home.css';
import './premium.css';
import './home-v3.css';
import './best-sellers.css';
import './responsive-type.css';
import {PmFooter, PmSiteHeader} from '@/components/premium/SiteChrome';
import {EcoHero} from '@/components/premium/EcoHero';
import {HvAbout, HvBestSellers, HvPolicies, HvBrandVideo, HvCharacter, HvContact, HvService, HvStats} from '@/components/premium/HomeV3';
import {HomeFX} from '@/components/premium/HomeFX';
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
        {/* Lo más vendido justo después de la portada (19-nov-2026): las líneas del ecosistema y enseguida los productos */}
        <HvBestSellers/>
        <HvAbout/>
        {/* "Compra con respaldo": cierre de Quiénes somos, mismo fondo blanco (19-nov-2026) */}
        <HvPolicies/>
        <HvBrandVideo/>
        <HvStats/>
        {/* 24-nov-2026: despachos + distribuidores, lado a lado, justo debajo de "Conectamos cada rincón de Colombia" */}
        <HvService/>
        {/* Franja de letras grandes "Calidad que no admite fallas / Redes y energía · Una sola conexión" (HvBigType) retirada el 19-nov-2026: rompía la línea gráfica. Sigue guardada en HomeV3.tsx */}
        {/* "Del puerto a tu proyecto" (HvProcess) guardada en HomeV3.tsx; quitada el 10-nov-2026, se puede volver a poner aquí */}
        <HvCharacter/>
        {/* "Una solución para cada proyecto" (HvSolutions) retirada el 24-nov-2026 a pedido del cliente. Sigue guardada en HomeV3.tsx */}
        {/* "Productos que cumplen la norma" (HvQuality) retirada el 19-nov-2026: ya la cubre "Compra con respaldo". Sigue guardada en HomeV3.tsx */}
        <HvContact/>
      </main>
      <PmFooter/>
      <WhatsAppButton/>
      <RevealOnScroll/>
      <HomeFX/>
    </div>
  );
}
