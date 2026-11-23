'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {Icon} from '@/components/premium/Icons';
import {waLink} from '@/components/premium/SiteChrome';
import {ProductTile} from '@/components/premium/Sections';
import {MarwaCard} from '@/components/shop/ShopUI';
import {addToCart, useProducts} from '@/lib/shop';
import {useSettings} from '@/lib/settings';
import {money, priceText} from '@/lib/format';
import {categories} from '@/data/shopSeed';
import {BEST_SELLER_IDS} from '@/data/bestSellers';

/**
 * Portada de la tienda con la estructura del home de LUMINA (11 secciones, mismo orden y medidas):
 * hero en carrusel, pestañas con productos, banda destacada, franja móvil, 2 promos cuadradas,
 * frase de marca 50/50, carril de productos, banda a todo el ancho, 3 tarjetas, asesoría 50/50 y cierre.
 * Aquí manda el producto: el home de MARWA es el que cuenta la empresa con video y ambiente.
 */
export function StoreLanding() {
  return (
    <>
      {/* 20-nov-2026: orden nuevo con jerarquía de tamaños (estilo Homecenter):
          muy grande → pequeño → mediano → delgado → carril → 4 pequeñas → grande → 2 medianas → grande → 3 pequeñas → grande */}
      <HeroSlides/>
      <LineTabs/>
      <PromoGrid/>
      {/* 20-nov: franja móvil retirada a pedido de la usuaria */}
      <BestSellers/>
      <ProjectTiles/>
      <BrandQuote/>
      <DuoBanners/>
      <FeaturedBand/>
      <ShopCards/>
      <ServiceTiles/>
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
    const target = Math.min(Math.max(n, 0), pages - 1); // sin vuelta automática: al final se regresa con la flecha
    t.scrollTo({left: target * step(), behavior: 'smooth'});
  };
  return (
    <section className="pm-wrap pm-section lx-lines">
      <h2 className="lx-lines-title">Explora los mejores productos <em>MARWA</em> por <span>categoría</span></h2>
      <div className="lx-lines-car">
        <button type="button" className="lx-lines-arrow prev" aria-label="Anterior" disabled={pos <= 0} onClick={() => go(pos - 1)}><Icon name="chevron"/></button>
        <div className="lx-lines-row" ref={track} onScroll={update}>
          {categories.map(c => (
            <a key={c.id} href={`/tienda?categoria=${c.id}`} className="lx-line">
              <span className="lx-line-img"><Image src={linePhotos[c.id]} alt="" fill sizes="(max-width: 760px) 80vw, 340px" quality={90}/></span>
              <b>{c.name}</b>
            </a>
          ))}
        </div>
        <button type="button" className="lx-lines-arrow next" aria-label="Siguiente" disabled={pos >= pages - 1} onClick={() => go(pos + 1)}><Icon name="chevron"/></button>
      </div>
      <a className="lx-lines-all" href="/tienda?vista=todos">Ver todo el catálogo <Icon name="arrow"/></a>
    </section>
  );
}

/* 3 · Productos destacados: carrusel de banners en la línea gráfica del banner del usuario (Cat. 5E).
   Fotos sin texto (Magnific) con el logo oficial compuesto en el producto; el texto va en HTML.
   Precio, unidad, descripción y enlace salen del producto real, así el banner sigue al admin. */
/* Solo se muestran los banners cuyo producto existe en el inventario (11-nov-2026: Cat. 5E interior y rack
   no están en el Excel, quedan guardados por si vuelven). */
const featured = [
  {id: 'cable-utp-flexible-cat-6-multifilamento', image: '/assets/destacado-utp-flex-cat6-v4.jpg', title: ['Cable UTP flexible', 'Cat. ', '6'], alt: 'Carrete de cable UTP flexible Cat. 6 multifilamento MARWA de 305 m sobre ondas azules y rojas'},
  /* 20-nov: el Cat. 5E interior (destacado-cable-cat5e-v1.jpg) no está en el inventario; se reemplazó por el UTP flexible Cat. 6 */
/* 20-nov: la usuaria pidió dejar solo el UTP flexible Cat. 6. DROP y rack quedan guardados:
  {id: 'cable-drop-1-hilo-1-km', image: '/assets/destacado-fibra-drop-v2.jpg', title: ['Cable de fibra óptica', '', 'DROP'], alt: 'Bobina de fibra óptica Drop-Core MARWA sobre ondas azules y rojas'},
  {id: 'rack-piso', image: '/assets/destacado-rack-piso-v3.jpg', title: ['Rack de piso para', '', 'comunicaciones'], alt: 'Rack de piso negro MARWA sobre ondas azules y rojas'}, */
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
        <div className="lx-feat-price"><b>{priceText(p.price)}</b>{p.price > 0 && <><i aria-hidden="true"/><small>/ {p.unit}</small></>}</div>
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
const bestSellers = BEST_SELLER_IDS; // lista compartida con la página de inicio (data/bestSellers.ts)

function BestSellers() {
  const products = useProducts();
  const list = bestSellers.map(id => products.find(p => p.id === id && p.visible)).filter(Boolean) as ReturnType<typeof useProducts>;
  const track = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => { // avanza de a UNA tarjeta (ancho de la tarjeta + espacio entre tarjetas)
    const t = track.current; const card = t?.firstElementChild as HTMLElement | null; if (!t || !card) return;
    t.scrollBy({left: dir * (card.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 0)), behavior: 'smooth'});
  };
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

/* 5 · Cuatro banners 2x2 (fotos Magnific con productos REALES del inventario; 20-nov-2026 Networking y Energía
   se cambiaron por Canalización y Metalmecánica porque MARWA no tiene productos reales de esas líneas)
   tone: color del texto sobre la foto · btn: estilo del botón */
const promos = [
  {title: 'Cableado estructurado', text: 'Conectividad estable y de alto rendimiento para tus proyectos.', cta: 'Explorar productos', image: '/assets/promo-cableado-v10.jpg', href: '/tienda?categoria=cableado', tone: 'light', btn: 'blue', size: 'sm'},
  {title: 'Fibra óptica', text: 'Alta velocidad, mayor alcance y transmisión sin interferencias.', cta: 'Explorar productos', image: '/assets/promo-fibra-v9.jpg', href: '/tienda?categoria=fibra', tone: 'dark', btn: 'white', size: 'sm'},
  {title: 'Canalización y ductería', text: 'Tubería, ductos y accesorios para llevar y proteger cada cable.', cta: 'Explorar productos', image: '/assets/promo-canalizacion-v5.jpg', href: '/tienda?categoria=canalizacion', tone: 'dark', btn: 'white', size: 'lg'},
  {title: 'Metalmecánica', text: 'Gabinetes y racks para organizar y proteger tus equipos.', cta: 'Explorar productos', image: '/assets/promo-metalmecanica-v7.jpg', href: '/tienda?categoria=metalmecanica', tone: 'light', btn: 'blue', size: 'lg'},
  {title: 'Línea plástica', text: 'Amarres, espirales, cajas de paso y face plates.', cta: 'Explorar productos', image: '/assets/promo-plastica-v1.jpg', href: '/tienda?categoria=plastica', tone: 'dark', btn: 'white', size: 'sm'},
  {title: 'HDTV', text: 'Splitters y extensores para llevar tu señal de video.', cta: 'Explorar productos', image: '/assets/promo-hdtv-v1.jpg', href: '/tienda?categoria=hdtv', tone: 'light', btn: 'blue', size: 'sm'},
];

function PromoGrid() {
  return (
    <section className="pm-wrap pm-section lx-promos" aria-label="Líneas destacadas">
      {promos.map(p => (
        <a key={p.title} href={p.href} className={`is-${p.tone} is-${p.size}`}>
          <Image src={p.image} alt="" fill quality={92} sizes={p.size === 'lg' ? '(max-width: 767px) 100vw, 650px' : '(max-width: 767px) 50vw, 330px'}/>
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

/* 6 · Banner del personaje MARWA (robot de cables). Antes decía "Promoción especial · Hasta 40 % DTO.";
   se cambió el 19-nov-2026 porque MARWA no maneja ofertas ni promociones (pedido del cliente).
   Foto = banner del usuario sin texto (Magnific erase + upscale); el texto va en HTML */
function BrandQuote() {
  return (
    <section className="lx-mascot" aria-label="Respaldo de más de 12 años conectando proyectos en Colombia">
      <Image className="lx-mascot-img" src="/assets/banner-personaje-seis-lineas-v3.jpg" alt="Personaje MARWA, un robot con cabello de cables, señalando hacia el texto" fill quality={92} sizes="100vw"/>
      <div className="lx-mascot-text is-deal">
        <span className="lx-mascot-pill">Asesoría experta</span>
        <h2 className="lx-mascot-deal"><small>Respaldo de</small><span><b>12</b><i><em>+</em><em>AÑOS</em></i></span></h2>
        <p>Conectando proyectos<br/>en todo Colombia.</p>
      </div>
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
      <Image className="lx-port-img" src="/assets/portafolio-marwa-v10.jpg" alt="Productos MARWA: gabinete 12U, carretes de fibra óptica, cable DROP y cable F/UTP Cat 6A con su marca, tubería PVC SCH40, patch panel, patch cords, amarres, espiral, caja de paso, faceplate y jacks" fill quality={92} sizes="(max-width: 767px) 100vw, 1312px"/>
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
      <Image className="lx-advice-img" src="/assets/asesoria-bogota-panoramica-v1.jpg" alt="Panorámica de Bogotá de noche con Monserrate y la Torre Colpatria conectadas por líneas de luz azules y rojas con marcadores de ubicación" fill quality={90} sizes="(max-width: 767px) 100vw, 1312px"/>
      <div className="lx-advice-text">
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
        {/* 20-nov: versión sobria (sin etiqueta roja con línea, sin título bicolor, sin tarjeta con ícono) */}
        <h2 id="faq-title">Preguntas frecuentes</h2>
        <p>Pagos, envíos y pedidos en la tienda MARWA.</p>
        <p className="lx-faq-more">¿No encuentras tu respuesta?<br/><a href={wa} target="_blank" rel="noopener">Escríbenos por WhatsApp <Icon name="arrow"/></a></p>
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

/* ── Bloques nuevos del 20-nov-2026 (jerarquía de tamaños). Sin ofertas ni descuentos: MARWA no maneja promos ── */

/* 4 piezas pequeñas: soluciones por tipo de proyecto */
const projects = [
  {title: 'Edificios y conjuntos', text: 'Cableado, fibra y canalización por pisos.', image: '/assets/proyecto-edificios-v1.jpg', msg: 'Hola MARWA, tengo un proyecto de edificio o conjunto residencial.'},
  {title: 'Oficinas', text: 'Puestos de trabajo conectados y ordenados.', image: '/assets/proyecto-oficinas-v1.jpg', msg: 'Hola MARWA, tengo un proyecto de red para oficinas.'},
  {title: 'Hogar', text: 'Internet estable y televisión en cada cuarto.', image: '/assets/proyecto-hogar-v1.jpg', msg: 'Hola MARWA, quiero mejorar la red de mi casa.'},
  {title: 'Cuarto de equipos', text: 'Gabinetes, patch panels y organización.', image: '/assets/proyecto-cuarto-equipos-v1.jpg', msg: 'Hola MARWA, necesito armar un cuarto de equipos.'},
];

function ProjectTiles() {
  return (
    <section className="pm-wrap pm-section lx-projects" aria-labelledby="proyectos-title">
      <h2 id="proyectos-title" className="lx-blk-title">Soluciones por tipo de proyecto</h2>
      <div className="lx-projects-grid">
        {projects.map(p => (
          <a key={p.title} href={waLink(p.msg)} target="_blank" rel="noopener" className="lx-tile">
            <Image src={p.image} alt="" fill quality={90} sizes="(max-width: 767px) 50vw, 330px"/>
            <span><b>{p.title}</b><small>{p.text}</small></span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* 2 piezas medianas lado a lado: distribuidores y compras por volumen */
const duo = [
  {eyebrow: 'Distribuidores', title: 'Hazte distribuidor MARWA', text: 'Lleva nuestro portafolio a tu ciudad con respaldo de marca y acompañamiento comercial.', cta: 'Quiero ser distribuidor', image: '/assets/duo-distribuidor-v1.jpg', msg: 'Hola MARWA, quiero ser distribuidor.'},
  {eyebrow: 'Contratistas e instaladores', title: 'Compras por volumen para tu obra', text: 'Cotizamos tu lista completa de materiales y la despachamos a todo Colombia.', cta: 'Cotizar mi lista', image: '/assets/duo-volumen-v1.jpg', msg: 'Hola MARWA, quiero cotizar materiales por volumen para una obra.'},
];

function DuoBanners() {
  return (
    <section className="pm-wrap pm-section lx-duo" aria-label="Distribuidores y compras por volumen">
      {duo.map(d => (
        <a key={d.title} href={waLink(d.msg)} target="_blank" rel="noopener">
          <Image src={d.image} alt="" fill quality={90} sizes="(max-width: 767px) 100vw, 650px"/>
          <span>
            <b>{d.title}</b>
            <small>{d.text}</small>
            <em>{d.cta} <Icon name="arrow"/></em>
          </span>
        </a>
      ))}
    </section>
  );
}

/* 3 piezas pequeñas: servicios */
const services = [
  {title: 'Fichas técnicas', text: 'Medidas, normas y especificaciones de cada producto.', image: '/assets/servicio-fichas-v1.jpg', href: '/tienda?vista=todos', ext: false},
  {title: 'Asesoría por WhatsApp', text: 'Un asesor te ayuda a elegir la referencia correcta.', image: '/assets/servicio-whatsapp-v1.jpg', href: waLink('Hola MARWA, necesito asesoría con un producto.'), ext: true},
  {title: 'Despacho a todo Colombia', text: 'Enviamos tu pedido a los 32 departamentos.', image: '/assets/servicio-despacho-v1.jpg', href: '/tienda?vista=todos', ext: false},
];

function ServiceTiles() {
  return (
    <section className="pm-wrap pm-section lx-services" aria-label="Servicios MARWA">
      {services.map(s => (
        /* 23-nov-2026: piezas informativas, sin enlace (pedido de la usuaria) */
        <div key={s.title} className="lx-tile is-static">
          <Image src={s.image} alt="" fill quality={90} sizes="(max-width: 767px) 100vw, 430px"/>
          <span><b>{s.title}</b><small>{s.text}</small></span>
        </div>
      ))}
    </section>
  );
}
