'use client';

import {useState} from 'react';
import {PmCategoryRow, PmHero, PmProducts, PmPromoGrid, PmTrust} from '@/components/premium/Sections';

/**
 * Portada de la tienda con el mismo lenguaje premium del sitio (referencia: anker.com):
 * banner a todo lo ancho, categorías en tarjetas grises, carrusel de productos,
 * mosaico de líneas, compra con confianza y preguntas frecuentes.
 */
export function StoreLanding() {
  return (
    <>
      <PmHero
        theme="light"
        align="left"
        title={<>Todo para conectar<br/>tu próximo proyecto</>}
        subtitle="Tienda oficial MARWA · Redes y Energía"
        cta="Ver productos"
        href="#productos"
        image="/assets/solution-new.jpg"
        position="70% 50%"
        priority
      />
      <div className="pm-soft">
        <PmCategoryRow title="Compra por categoría"/>
        <div id="productos"><PmProducts title="Lo más vendido en MARWA"/></div>
        <section className="pm-wrap pm-section">
          <div className="pm-title"><h2>Nuestras líneas</h2></div>
        </section>
        <PmPromoGrid
          tiles={[
            {title: 'Cableado estructurado', text: 'Cable UTP, patch panel y patch cords certificados.', image: '/assets/solution-cabling.jpg', href: '/tienda?categoria=cableado', cta: 'Ver productos'},
            {title: 'Fibra óptica', text: 'Cable drop y patch cords de fibra con baja pérdida.', image: '/assets/solution-fiber.jpg', href: '/tienda?categoria=fibra', cta: 'Ver productos'},
            {title: 'Infraestructura', text: 'Racks de piso y gabinetes de pared para cuartos técnicos.', image: '/assets/solution-infrastructure.jpg', href: '/tienda?categoria=infraestructura', cta: 'Ver productos'},
            {title: 'Networking', text: 'Equipos que conectan, protegen y escalan tu red.', image: '/assets/solution-networking.jpg', href: '/tienda?categoria=networking', cta: 'Ver productos'},
          ]}
        />
      </div>
      <PmTrust/>
      <Faq/>
    </>
  );
}

const faqs = [
  {q: '¿Qué productos encuentro en la tienda?', a: 'Las cinco líneas oficiales de MARWA: cableado estructurado, fibra óptica, networking, infraestructura y línea plástica. Si no encuentras una referencia, escríbenos y la cotizamos.'},
  {q: '¿Qué medios de pago aceptan?', a: 'Puedes pagar con tarjeta débito o crédito, PSE o Nequi. Recibirás la confirmación de tu pedido apenas se apruebe el pago.'},
  {q: '¿Hacen envíos a todo Colombia?', a: 'Sí, despachamos a los 32 departamentos. El costo del envío se coordina contigo al momento de despachar, según el destino del pedido.'},
  {q: '¿Cómo hago seguimiento a mi pedido?', a: 'En “Mi cuenta” ves el estado de cada pedido (pagado, preparando, enviado y entregado) y el número de guía cuando sale de nuestra bodega.'},
  {q: '¿Me ayudan a elegir los productos?', a: 'Sí. Un asesor MARWA te ayuda por WhatsApp a elegir las referencias correctas para tu red.'},
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="pm-wrap pm-section pm-faq">
      <div className="pm-title"><h2>Preguntas frecuentes</h2></div>
      <div>
        {faqs.map((f, i) => (
          <div key={f.q} className={`pm-faq-item${open === i ? ' open' : ''}`}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              {f.q}<i aria-hidden="true">{open === i ? '−' : '+'}</i>
            </button>
            {open === i && <p>{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
