'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {Icon} from '@/components/premium/Icons';
import {ProductTile} from '@/components/premium/Sections';
import {MarwaCard} from '@/components/shop/ShopUI';
import {addToCart, isOnOffer, useProducts} from '@/lib/shop';
import {useSettings} from '@/lib/settings';
import {money} from '@/lib/format';
import {categories} from '@/data/shopSeed';

/**
 * Portada de la tienda con la estructura del home de LUMINA (11 secciones, mismo orden y medidas):
 * hero en carrusel, pestañas con productos, banda destacada, franja móvil, 2 promos cuadradas,
 * frase de marca 50/50, carril de productos, banda a todo el ancho, 3 tarjetas, asesoría 50/50 y cierre.
 * Aquí manda el producto: el home de MARWA es el que cuenta la empresa con video y ambiente.
 */
export function StoreLanding() {
  return (
    <>
      <HeroSlides/>
      <LineTabs/>
      <FeaturedBand/>
      <Marquee/>
      <PromoGrid/>
      <BrandQuote/>
      <BestSellers/>
      <Offers/>
      <WideBand/>
      <ShopCards/>
      <Advisor/>
      <Faq/>
    </>
  );
}

/* 1 · Hero en carrusel: 16:9, alto min(82svh, 768px) */
/* Fotos de producto sin empaque (Magnific, con fotos reales de MARWA como referencia). theme = color del texto */
const heroSlides = [
  {image: '/assets/hero-p-fibra-personaje-v1.jpg', theme: 'dark', bg: 'linear-gradient(180deg, rgb(4,14,44) 0%, rgb(6,20,58) 50%, rgb(8,26,70) 100%)', pos: '70% 50%', eyebrow: 'Fibra óptica', title: 'Fibra óptica de alto rendimiento', text: 'Conectividad estable, rápida y segura.', cta: 'Ver productos', href: '/tienda?categoria=fibra'},
  {image: '/assets/hero-p-patch-cord-v2-hq.jpg', theme: 'light', bg: 'linear-gradient(180deg, rgb(237,246,252) 0%, rgb(240,247,252) 30%, rgb(227,240,250) 55%, rgb(224,237,249) 75%, rgb(228,241,250) 100%)', pos: '70% 50%', eyebrow: 'Cableado estructurado', title: 'Cada punto de tu red, bien conectado', text: 'Cable UTP, patch cord, patch panel y accesorios.', cta: 'Comprar cableado', href: '/tienda?categoria=cableado'},
  {image: '/assets/hero-p-fibra-v2-hq.jpg', theme: 'dark', bg: 'linear-gradient(180deg, rgb(2,9,25) 0%, rgb(2,14,34) 30%, rgb(8,30,66) 50%, rgb(6,24,52) 75%, rgb(28,28,60) 100%)', pos: '70% 50%', eyebrow: 'Tienda MARWA', title: 'Soluciones integrales en redes y energía', text: 'Un portafolio completo para la infraestructura de tus proyectos.', cta: 'Ver soluciones', href: '/tienda?vista=todos'},
  {image: '/assets/hero-p-jacks-colores-v2.jpg', layout: 'center', theme: 'light', bg: 'linear-gradient(180deg, rgb(226,234,248) 0%, rgb(232,239,250) 50%, rgb(222,231,247) 100%)', pos: '50% 50%', eyebrow: 'Jack keystone Cat 6', title: 'Cada conexión, en los colores|de tu red', text: 'Jack keystone Cat 6 MARWA, en azul y rojo', cta: 'Comprar ahora', href: `/tienda?categoria=cableado&tipo=${encodeURIComponent('Accesorios pasivos')}`},
];

function HeroSlides() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI(n => (n + 1) % heroSlides.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused]);
  return (
    <section className={`lx-hero${heroSlides[i].theme === 'light' ? ' lx-light' : ''}${heroSlides[i].layout === 'center' ? ' lx-center' : ''}`} aria-roledescription="carrusel" aria-label="Destacados de la tienda">
      {heroSlides.map((s, n) => (
        <div key={s.image} className={`lx-hero-slide${n === i ? ' on' : ''}${s.layout === 'center' ? ' is-center' : ''}`} aria-hidden={n !== i} style={{background: s.bg}}>
          {/* La foto 2:1 en 4K va anclada a la derecha con el alto del banner (nunca se amplía);
              el espacio libre a la izquierda es un degradado con los colores del borde de la foto. */}
          <span className="lx-hero-main"><Image src={s.image} alt="" fill sizes="(max-width: 1199px) 100vw, 75vw" quality={92} priority={n === 0} style={{objectPosition: s.pos}}/></span>
        </div>
      ))}
      <div className="pm-wrap lx-hero-text" key={i}>
        <span>{heroSlides[i].eyebrow}</span>
        <h1>{heroSlides[i].title.split('|')[0]}{heroSlides[i].title.includes('|') && <em>{heroSlides[i].title.split('|')[1]}</em>}</h1>
        <p>{heroSlides[i].text}</p>
        <a href={heroSlides[i].href}>{heroSlides[i].cta} <Icon name="arrow"/></a>
      </div>
      <div className="pm-wrap lx-hero-dots">
        {heroSlides.map((s, n) => (
          <button key={s.image} type="button" aria-label={`Ver destacado ${n + 1}`} aria-current={n === i} onClick={() => setI(n)}><i/></button>
        ))}
        <button type="button" className="lx-hero-pause" aria-label={paused ? 'Reanudar' : 'Pausar'} onClick={() => setPaused(!paused)}>{paused ? '▶' : '❚❚'}</button>
      </div>
    </section>
  );
}

/* 2 · Compra por línea, estilo Anker: una tarjeta por línea con foto de producto sobre gris claro */
const linePhotos: Record<string, string> = {
  cableado: '/assets/linea-cableado-v2.jpg', fibra: '/assets/linea-fibra-v2.jpg', plastica: '/assets/linea-plastica-v2.jpg',
  hdtv: '/assets/linea-hdtv-v2.jpg', canalizacion: '/assets/linea-canalizacion-v2.jpg', metalmecanica: '/assets/linea-metalmecanica-v2.jpg',
};

function LineTabs() {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [pages, setPages] = useState(1);
  const step = () => { const t = track.current; const card = t?.querySelector<HTMLElement>('.lx-line'); return (card?.offsetWidth ?? 300) + 20; };
  const update = () => {
    const t = track.current; if (!t) return;
    const st = step(), visible = Math.max(1, Math.floor((t.clientWidth + 20) / st));
    setPages(Math.max(1, categories.length - visible + 1));
    setPos(Math.round(t.scrollLeft / st));
  };
  useEffect(() => { update(); addEventListener('resize', update); return () => removeEventListener('resize', update); }, []);
  const go = (n: number) => {
    const t = track.current; if (!t) return;
    const target = (n + pages) % pages; // al pasar del final vuelve al inicio, y al revés
    t.scrollTo({left: target * step(), behavior: 'smooth'});
  };
  return (
    <section className="pm-wrap pm-section lx-lines">
      <h2 className="lx-lines-title">Explora los mejores productos <em>MARWA</em> por <span>categoría</span></h2>
      <div className="lx-lines-car">
        <button type="button" className="lx-lines-arrow prev" aria-label="Anterior" onClick={() => go(pos - 1)}><Icon name="chevron"/></button>
        <div className="lx-lines-row" ref={track} onScroll={update}>
          {categories.map(c => (
            <a key={c.id} href={`/tienda?categoria=${c.id}`} className="lx-line">
              <span className="lx-line-img"><Image src={linePhotos[c.id]} alt="" fill sizes="(max-width: 760px) 80vw, 340px" quality={90}/></span>
              <b>{c.name}</b>
            </a>
          ))}
        </div>
        <button type="button" className="lx-lines-arrow next" aria-label="Siguiente" onClick={() => go(pos + 1)}><Icon name="chevron"/></button>
      </div>
      {pages > 1 && (
        <div className="lx-lines-dots" role="tablist" aria-label="Posición del carrusel">
          {Array.from({length: pages}, (_, n) => (
            <button key={n} type="button" aria-label={`Ir a la posición ${n + 1}`} aria-current={n === pos} onClick={() => go(n)}><i/></button>
          ))}
        </div>
      )}
      <a className="lx-lines-all" href="/tienda?vista=todos">Ver todo el catálogo <Icon name="arrow"/></a>
    </section>
  );
}

/* 3 · Productos destacados: carrusel de banners en la línea gráfica del banner del usuario (Cat. 5E).
   Fotos sin texto (Magnific) con el logo oficial compuesto en el producto; el texto va en HTML.
   Precio, unidad, descripción y enlace salen del producto real, así el banner sigue al admin. */
const featured = [
  {id: 'cable-cat5e', image: '/assets/destacado-cable-cat5e-v1.jpg', title: ['Cable UTP flexible', 'Cat. ', '5E'], alt: 'Carrete de cable UTP Cat. 5E sobre ondas azules y rojas'},
  {id: 'fibra-drop', image: '/assets/destacado-fibra-drop-v2.jpg', title: ['Cable de fibra óptica', '', 'Drop-Core'], alt: 'Bobina de fibra óptica Drop-Core MARWA sobre ondas azules y rojas'},
  {id: 'rack-piso', image: '/assets/destacado-rack-piso-v3.jpg', title: ['Rack de piso para', '', 'comunicaciones'], alt: 'Rack de piso negro MARWA sobre ondas azules y rojas'},
];

function FeaturedBand() {
  const products = useProducts();
  const slides = featured.map(f => ({...f, p: products.find(p => p.id === f.id && p.visible)})).filter(f => f.p);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const t = setTimeout(() => setI(n => (n + 1) % slides.length), 6000);
    return () => clearTimeout(t);
  }, [i, slides.length, paused]);
  if (!slides.length) return null;
  const n = i % slides.length, s = slides[n], p = s.p!;
  const cat = categories.find(c => c.id === p.category);
  return (
    <div className="lx-feat-wrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <section className="lx-feat" aria-roledescription="carrusel" aria-label="Productos destacados">
      {slides.map((f, k) => (
        <Image key={f.id} className={`lx-feat-img${k === n ? ' on' : ''}`} src={f.image} alt={k === n ? f.alt : ''} fill quality={92} sizes="(max-width: 767px) 100vw, 1312px" priority={k === 0}/>
      ))}
      <div className="lx-feat-text" key={s.id} aria-live="polite">
        <span className="lx-feat-pill">Producto destacado · {cat?.name}</span>
        <h2>{s.title[0]} <span>{s.title[1]}<em>{s.title[2]}</em></span></h2>
        <p>{p.description}</p>
        <div className="lx-feat-price"><b>{money(p.price)}</b><i aria-hidden="true"/><small>/ {p.unit}</small></div>
        <a className="lx-feat-btn" href={`/tienda/producto/${p.id}`}>Ver producto <i aria-hidden="true"/><Icon name="arrow"/></a>
      </div>
    </section>
      {slides.length > 1 && (
        <div className="lx-feat-dots">
          {slides.map((f, k) => (
            <button key={f.id} type="button" className={k === n ? 'on' : ''} aria-label={`Ver ${f.p!.name}`} aria-current={k === n} onClick={() => setI(k)}/>
          ))}
        </div>
      )}
    </div>
  );
}

/* 7 · Lo más vendido: uno por línea, los productos del inventario elegidos con varias vistas (fotos).
   Título con el mismo estilo de "Explora los mejores productos MARWA por categoría". */
const bestSellers = ['jack-keystone-cat6-azul', 'patch-cord-fibra-sc-apc-3m', 'espiral-cables-3-4-negro', 'tuberia-pvc-sch40-1', 'gabinete-12ru'];

function BestSellers() {
  const products = useProducts();
  const list = bestSellers.map(id => products.find(p => p.id === id && p.visible)).filter(Boolean) as ReturnType<typeof useProducts>;
  const track = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => track.current?.scrollBy({left: dir * track.current.clientWidth * 0.8, behavior: 'smooth'});
  if (!list.length) return null;
  return (
    <section id="productos" className="pm-wrap pm-section lx-best">
      <h2 className="lx-lines-title">Lo más vendido en <em>MARWA</em></h2>
      <div className="pm-carousel">
        <div className="pm-products" ref={track}>
          {list.map(p => <MarwaCard key={p.id} p={p} badge/>)}
        </div>
        <button className="pm-arrow prev" onClick={() => move(-1)} aria-label="Anteriores"><Icon name="chevron"/></button>
        <button className="pm-arrow next" onClick={() => move(1)} aria-label="Siguientes"><Icon name="chevron"/></button>
      </div>
    </section>
  );
}

type ShopProduct = ReturnType<typeof useProducts>[number];

/* 4 · Franja en movimiento */
function Marquee() {
  const items = ['Calidad que no admite fallas', 'Despacho a los 32 departamentos', 'Pago seguro con tarjeta y PSE', 'Asesoría experta para tu proyecto'];
  const row = [...items, ...items];
  return (
    <div className="lx-marquee" aria-label={items.join('. ')}>
      <div aria-hidden="true">{[...row, ...row].map((t, n) => <span key={n}>{t}<i/></span>)}</div>
    </div>
  );
}

/* 5 · Cuatro banners 2x2 (fotos Magnific con logo MARWA en los productos)
   tone: color del texto sobre la foto · btn: estilo del botón */
const promos = [
  {title: 'Cableado estructurado', text: 'La base de una red estable, segura y de alto rendimiento.', cta: 'Ver soluciones', image: '/assets/promo-cableado-v3.jpg', href: '/tienda?categoria=cableado', tone: 'dark', btn: 'white'},
  {title: 'Fibra óptica', text: 'Conexiones de alta velocidad para grandes distancias y mayor capacidad.', cta: 'Explorar fibra', image: '/assets/promo-fibra-v3.jpg', href: '/tienda?categoria=fibra', tone: 'light', btn: 'navy'},
  {title: 'Networking', text: 'Conectividad inteligente para empresas más productivas.', cta: 'Ver equipos', image: '/assets/promo-networking-v3.jpg', href: '/tienda?vista=todos', tone: 'light', btn: 'blue'},
  {title: 'Energía', text: 'Respaldo, protección y continuidad para tus operaciones.', cta: 'Conoce la línea', image: '/assets/promo-energia-v3.jpg', href: '/tienda?vista=todos', tone: 'dark', btn: 'white'},
];

function PromoGrid() {
  return (
    <section className="pm-wrap pm-section lx-promos" aria-label="Líneas destacadas">
      {promos.map(p => (
        <a key={p.title} href={p.href} className={`is-${p.tone}`}>
          <Image src={p.image} alt="" fill quality={92} sizes="(max-width: 767px) 100vw, 50vw"/>
          <span>
            <b>{p.title}</b>
            <small>{p.text}</small>
            <em className={`btn-${p.btn}`}>{p.cta} <Icon name="arrow"/></em>
          </span>
        </a>
      ))}
    </section>
  );
}

/* 6 · Banner del personaje MARWA (robot de cables): "Promoción especial · Hasta 40 % DTO."
   Foto = banner del usuario sin texto (Magnific erase + upscale); el texto va en HTML */
function BrandQuote() {
  return (
    <section className="lx-mascot" aria-label="Promoción especial: hasta 40 % de descuento">
      <Image className="lx-mascot-img" src="/assets/banner-personaje-seis-lineas-v3.jpg" alt="Personaje MARWA, un robot con cabello de cables, señalando hacia el texto" fill quality={92} sizes="100vw"/>
      <div className="lx-mascot-text is-deal">
        <span className="lx-mascot-pill">Promoción especial</span>
        <h2 className="lx-mascot-deal"><small>Hasta</small><span><b>40</b><i><em>%</em><em>DTO.</em></i></span></h2>
        <p>En productos seleccionados.</p>
      </div>
    </section>
  );
}

/* 7b · Ofertas: solo si hay productos con precio de oferta */
function Offers() {
  const offers = useProducts().filter(p => p.visible && isOnOffer(p));
  if (!offers.length) return null;
  return (
    <section className="pm-wrap pm-section">
      <div className="pm-title"><h2>Ofertas</h2></div>
      <div className="pm-products">{offers.map(p => <ProductTile key={p.id} p={p}/>)}</div>
    </section>
  );
}

/* 8 · Banda a todo el ancho (en LUMINA es el video; en la tienda va foto, el video es del home) */
function WideBand() {
  const perks = [
    {icon: 'truck', t: 'Despacho nacional'},
    {icon: 'shield', t: 'Compra segura'},
    {icon: 'headset', t: 'Asesoría técnica'},
  ];
  return (
    <section className="lx-wide lx-wide2" aria-label="Todo para tu red, en un solo lugar.">
      <Image className="lx-wide-img" src="/assets/banner-todo-para-tu-red-v2.jpg" alt="Patch cord azul MARWA con conector RJ45 en primer plano y franjas azul y roja" fill quality={92} sizes="(max-width: 767px) 160vw, 1400px"/>
      <div className="lx-wide-text">
        <span className="lw-pill">Tienda MARWA</span>
        <h2><span>Todo para tu red,</span> <em>en un solo lugar.</em></h2>
        <ul className="lw-perks">
          {perks.map(p => <li key={p.t}><span><Icon name={p.icon}/></span>{p.t}</li>)}
        </ul>
        <a className="lw-btn" href="/tienda?vista=todos">Ver catálogo <Icon name="arrow"/></a>
      </div>
    </section>
  );
}

/* 9 · Banner del portafolio (las 6 líneas alrededor de los productos) */

function ShopCards() {
  return (
    <section className="lx-port" aria-label="Un portafolio. Infinitas conexiones.">
      <Image className="lx-port-img" src="/assets/portafolio-marwa-v3.jpg" alt="Rack, cable UTP, switch, bobina de fibra y canaletas MARWA rodeados por las seis líneas: cableado estructurado, fibra óptica, HDTV, networking, línea plástica y energía" fill quality={92} sizes="(max-width: 767px) 100vw, 1312px"/>
      <div className="lx-port-text">
        <h2>Un portafolio<i>.</i> <em>Infinitas <span>conexiones<i>.</i></span></em></h2>
        <p>Soluciones en conectividad, infraestructura y energía para proyectos que no se detienen.</p>
        <a className="lx-port-btn" href="/tienda?vista=todos">Explorar portafolio <Icon name="arrow"/></a>
      </div>
    </section>
  );
}

/* 10 · Asesoría: texto y foto 1:1 */
function Advisor() {
  const {whatsapp} = useSettings();
  const wa = (text: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  return (
    <section className="lx-advice" id="asesoria" aria-label="Asesoría experta">
      <Image className="lx-advice-img" src="/assets/asesoria-ciudad-v2.jpg" alt="Ciudad de noche conectada por líneas de luz azules y rojas con marcadores de ubicación" fill quality={90} sizes="(max-width: 767px) 100vw, 1312px"/>
      <div className="lx-advice-text">
        <span className="lx-advice-eyebrow">Asesoría experta</span>
        <h2>¿No sabes qué referencia <em>elegir?</em></h2>
        <p>Cuéntanos tu proyecto y un asesor te ayuda a encontrar la solución correcta.</p>
        <div className="lx-advice-actions">
          <a className="lx-advice-btn" href={wa('Hola MARWA, quiero solicitar una cotización para mi proyecto.')} target="_blank" rel="noopener">Solicitar cotización</a>
          <a className="lx-advice-btn ghost" href={wa('Hola MARWA, necesito asesoría para elegir productos.')} target="_blank" rel="noopener">Hablar con un asesor</a>
        </div>
      </div>
    </section>
  );
}

/* 11 · Cierre: preguntas frecuentes en 2 columnas.
   Izquierda: título y tarjeta de contacto. Derecha: acordeón en tarjetas con ícono por tema. */
function Faq() {
  const {shippingMode, whatsapp} = useSettings();
  const [open, setOpen] = useState(0);
  const faqs = [
    {icon: 'card', q: '¿Qué medios de pago aceptan?', a: 'Puedes pagar con tarjeta débito o crédito, o por PSE con tu banco o Nequi. Recibirás la confirmación de tu pedido apenas se apruebe el pago.'},
    {icon: 'truck', q: '¿Hacen envíos a todo Colombia?', a: `Sí, despachamos a los 32 departamentos. ${shippingMode === 'fijo' ? 'Verás el costo del envío en el carrito antes de pagar.' : 'El costo del envío se coordina contigo al momento de despachar.'}`},
    {icon: 'box', q: '¿Cómo hago seguimiento a mi pedido?', a: 'En “Mi cuenta” ves el estado de cada pedido y, cuando se despacha, la transportadora y el número de guía.'},
    {icon: 'layers', q: '¿Puedo cotizar grandes cantidades para un proyecto?', a: 'Sí. Escríbenos por WhatsApp con las referencias y cantidades, y un asesor MARWA te envía la cotización.'},
    {icon: 'headset', q: '¿Me ayudan a elegir los productos?', a: 'Sí. Un asesor MARWA te ayuda por WhatsApp a elegir las referencias correctas para tu red.'},
  ];
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola MARWA, tengo una pregunta sobre la tienda.')}`;
  return (
    <section className="pm-wrap pm-section lx-faq" aria-labelledby="faq-title">
      <div className="lx-faq-side">
        <span className="lx-faq-eyebrow">Centro de ayuda</span>
        <h2 id="faq-title">Preguntas <em>frecuentes</em></h2>
        <p>Resolvemos las dudas más comunes sobre pagos, envíos y pedidos en la tienda MARWA.</p>
        <div className="lx-faq-contact">
          <span className="lx-faq-contact-icon"><Icon name="chat"/></span>
          <div>
            <b>¿No encuentras tu respuesta?</b>
            <small>Un asesor te responde por WhatsApp.</small>
          </div>
          <a href={wa} target="_blank" rel="noopener">Escríbenos <Icon name="arrow"/></a>
        </div>
      </div>
      <div className="lx-faq-list">
        {faqs.map((f, i) => {
          const on = open === i;
          return (
            <div key={f.q} className={`lx-faq-item${on ? ' open' : ''}`}>
              <button type="button" id={`faq-q-${i}`} aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span className="lx-faq-icon"><Icon name={f.icon}/></span>
                <span className="lx-faq-q">{f.q}</span>
                <i aria-hidden="true"/>
              </button>
              <div className="lx-faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                <div><p>{f.a}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
