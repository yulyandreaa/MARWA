import type {Metadata} from 'next';
import {Suspense} from 'react';
import './tienda.css';
import '../premium.css';
import './panel.css';
import {ShopHeader, Toaster} from '@/components/shop/ShopUI';
import {PmAnnouncement, PmFooter} from '@/components/premium/SiteChrome';
import {CartDrawer} from '@/components/shop/CartDrawer';

export const metadata: Metadata = {
  title: 'Tienda MARWA | Redes y Energía',
  description: 'Compra en línea cableado estructurado, fibra óptica, línea plástica, HDTV, canalización y metalmecánica con despacho a todo Colombia.',
};

export default function ShopLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="shop pm">
      <PmAnnouncement shop/>
      <Suspense fallback={<div className="pm-header" style={{height: 142}}/>}>
        <ShopHeader/>
      </Suspense>
      <main className="shop-main">{children}</main>
      <PmFooter shop/>
      {/* Botón flotante de WhatsApp oculto por ahora (pedido del usuario, se revisa después) */}
      {/* <ShopWhatsApp message="Hola MARWA, tengo una pregunta sobre la tienda en línea."/> */}
      <Toaster/>
      <CartDrawer/>
    </div>
  );
}
