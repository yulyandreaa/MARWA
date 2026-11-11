'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {Icon} from '@/components/premium/Icons';
import {MarwaCard} from '@/components/shop/ShopUI';
import {useProducts} from '@/lib/shop';
import {mapDots, mapHub, mapNodes, mapSize} from '@/data/colombiaMap';

/**
 * Página de inicio v3 (10-nov-2026), secciones 2 a 9. La sección 1 es EcoHero.
 * Línea gráfica de la tienda: Poppins, azul noche #10233f, azul #2447e8, rojo #e52332,
 * eyebrow rojo con línea, títulos con acento azul y mucho aire. Videos: los 4 de marca por ahora.
 */
const WA = 'https://wa.me/573102569469?text=';
const wa = (t: string) => WA + encodeURIComponent(t);

function Eyebrow({children, light = false}: {children: string; light?: boolean}) {
  return <span className={`hv-eyebrow${light ? ' light' : ''}`}>{children}</span>;
}

/* Aparece al entrar en pantalla */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, {threshold: .25});
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/* 2 · Video de marca a pantalla completa */
export function HvBrandVideo() {
  return (
    <section className="hv-video is-photo" aria-labelledby="hv-video-title">
      {/* foto premium (Magnific 4K): Bogotá con las líneas de luz MARWA */}
      <div className="hv-video-img" data-speed=".08"><Image src="/assets/marwa-ciudad-conectada-v1.jpg" alt="" fill sizes="100vw" quality={90}/></div>
      <div className="hv-video-shade" aria-hidden="true"/>
      <div className="hv-wrap hv-video-copy" data-fx>
        <Eyebrow light>Redes y energía para Colombia</Eyebrow>
        <h2 id="hv-video-title" data-split>Conectamos la infraestructura <em>que mueve a Colombia</em></h2>
        <p>Importamos y distribuimos cableado, fibra óptica, canalización y más, para que cada proyecto quede conectado de punta a punta. Calidad garantizada y despacho a todo el país.</p>
        <div className="hv-actions">
          <a className="hv-btn light" href="/tienda" target="_blank" rel="noopener">Explorar la tienda <Icon name="arrow"/></a>
          <a className="hv-btn outline-light" href="#nosotros">Conoce MARWA</a>
        </div>
      </div>
    </section>
  );
}

/* 3 · Cifras de la marca con números que se animan */
function Counter({to, prefix = '', suffix = '', run}: {to: number; prefix?: string; suffix?: string; run: boolean}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(to); return; }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{prefix}{n}{suffix}</>;
}
export function HvStats() {
  const [ref, seen] = useInView<HTMLElement>();
  return (
    <section ref={ref} className={`hv-wrap hv-section hv-stats2${seen ? ' seen' : ''}`} aria-labelledby="hv-stats-title">
      <div className="hs-side">
        <div className="hv-stats-head" data-fx>
          <Eyebrow>Nuestro respaldo</Eyebrow>
          <h2 id="hv-stats-title" data-split>Conectamos cada rincón <em>de Colombia</em></h2>
          <p className="hs-lead">Hace más de <strong><Counter to={12} run={seen}/> años</strong> importamos y distribuimos soluciones para redes y energía. Hoy llevamos nuestras <strong><Counter to={6} run={seen}/> líneas de producto</strong> a los <strong><Counter to={32} run={seen}/> departamentos</strong> del país, con respaldo técnico y cumplimiento normativo.</p>
        </div>
      </div>

      <article className="hs-map" data-fx>
        <svg className="hs-svg" viewBox={`-10 -10 ${mapSize.w + 20} ${mapSize.h + 20}`} role="img" aria-label="Mapa de Colombia con despacho a los 32 departamentos desde Bogotá">
          <path className="hs-dots" d={mapDots}/>
          <rect className="hs-inset" x="2" y="4" width="44" height="40" rx="8"/>
          {mapNodes.map((n, i) => {
            const mx = (mapHub.x + n.x) / 2, my = (mapHub.y + n.y) / 2;
            const dx = n.x - mapHub.x, dy = n.y - mapHub.y;
            const cx = mx - dy * .22, cy = my + dx * .22;
            return <path key={`l-${n.name}`} className={`hs-link${i % 4 === 3 ? ' red' : ''}`} d={`M${mapHub.x} ${mapHub.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${n.x} ${n.y}`} pathLength={1} style={{transitionDelay: `${200 + i * 45}ms`}}/>;
          })}
          {mapNodes.map((n, i) => (
            <circle key={`n-${n.name}`} className={`hs-node${i % 4 === 3 ? ' red' : ''}`} cx={n.x} cy={n.y} r="5" style={{transitionDelay: `${700 + i * 45}ms`}}><title>{n.name}</title></circle>
          ))}
          <circle className="hs-hub-ring" cx={mapHub.x} cy={mapHub.y} r="10"/>
          <circle className="hs-hub" cx={mapHub.x} cy={mapHub.y} r="8"/>
        </svg>
      </article>
    </section>
  );
}

/* Texto gigante que se desliza con el desplazamiento (dos filas en sentidos opuestos) */
export function HvBigType() {
  const a = 'Calidad que no admite fallas · ';
  return (
    <section className="hv-big" aria-label="Calidad que no admite fallas. Redes y energía. Una sola conexión.">
      <div className="hv-big-row outline" data-scroll-x="420" aria-hidden="true">{a.repeat(4)}</div>
      <div className="hv-big-row fill" data-scroll-x="-420" aria-hidden="true">
        {Array.from({length: 4}, (_, i) => <span key={i}><span className="c-blue">Redes y energía</span><span className="c-navy"> · </span><span className="c-red">Una sola conexión</span><span className="c-navy"> · </span></span>)}
      </div>
    </section>
  );
}

/* Divisor: cable de luz azul y rojo con un pulso que lo recorre */
export function HvDivider() {
  return <div className="hv-wrap hv-divider" aria-hidden="true"><i/><span/></div>;
}

/* Cable de luz fijo al costado que se llena al bajar por la página */
export function HvCable() {
  return <div className="hv-cable" aria-hidden="true"><i/></div>;
}

/* 4 · Del puerto a tu proyecto: video de fondo + 4 pasos */
export function HvProcess() {
  const steps = [
    {icon: 'layers', t: 'Importación directa', d: 'Traemos cada línea desde fábrica, sin intermediarios y con control de calidad desde el origen.', img: '/assets/marwa-puerto-conectado-v1.jpg', pos: '58% 60%'},
    {icon: 'box', t: 'Bodega en Bogotá', d: 'Inventario disponible en nuestra bodega para despachar rápido y sin sorpresas.', img: '/assets/marwa-real/bodega-general.jpg', pos: '50% 50%'},
    {icon: 'truck', t: 'Despacho nacional', d: 'Llevamos tu pedido a los 32 departamentos con seguimiento y número de guía.', img: '/assets/marwa-real/bodega-cajas.jpg', pos: '50% 50%'},
    {icon: 'headset', t: 'Soporte técnico', d: 'Te acompañamos antes y después de la compra para que tu instalación funcione.', img: '/assets/marwa-real/oficina-equipo.jpg', pos: '50% 35%'},
  ];
  return (
    <section className="hv-process hp3" data-steps={steps.length} aria-labelledby="hv-process-title">
     <div className="hv-process-pin">
      <div className="hv-wrap hv-process-inner">
        <div className="hv-process-head">
          <Eyebrow>Cómo trabajamos</Eyebrow>
          <h2 id="hv-process-title" data-split>Del puerto <em>a tu proyecto</em></h2>
        </div>
        <ol className="hv-steps">
          {steps.map((s, i) => (
            <li key={s.t}>
              <div className="hp3-photo">
                <Image src={s.img} alt="" fill sizes="(max-width: 767px) 100vw, 320px" style={{objectPosition: s.pos}}/>
                <span className="hp3-num">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="hp3-body">
                <span className="hv-step-icon"><Icon name={s.icon}/></span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="hv-steps-track" aria-hidden="true"><i/></div>
      </div>
     </div>
    </section>
  );
}

/* 5 · Soluciones por tipo de proyecto */
export function HvSolutions() {
  const items = [
    {t: 'Edificios y oficinas', d: 'Cableado estructurado, canalización y gabinetes para redes corporativas ordenadas y certificables.', lines: ['Cableado', 'Canalización', 'Metalmecánica'], image: '/assets/solucion-oficinas-v2.jpg', href: '/tienda?categoria=cableado'},
    {t: 'Centros de datos', d: 'Racks, gabinetes, patch panels y fibra para cuartos técnicos de alta densidad.', lines: ['Metalmecánica', 'Cableado', 'Fibra óptica'], image: '/assets/solucion-datacenter-v2.jpg', href: '/tienda?categoria=metalmecanica'},
    {t: 'Operadores de fibra', d: 'Fibra ADSS y DROP, conectores, splitters y herrajería para despliegues FTTH.', lines: ['Fibra óptica', 'Línea plástica'], image: '/assets/solucion-fibra-v2.jpg', href: '/tienda?categoria=fibra'},
    {t: 'Hogar y entretenimiento', d: 'Cables HDMI, extensores y splitters para llevar la señal de video a cada pantalla.', lines: ['HDTV', 'Línea plástica'], image: '/assets/solucion-hogar-v2.jpg', href: '/tienda?categoria=hdtv'},
  ];
  return (
    <section className="hv-wrap hv-section hv-solutions" id="soluciones" aria-labelledby="hv-sol-title">
      <header className="hv-head center">
        <Eyebrow>Soluciones</Eyebrow>
        <h2 id="hv-sol-title" data-split>Una solución para <em>cada proyecto</em></h2>
        <p>Elige el tipo de proyecto y encuentra las líneas MARWA que necesitas.</p>
      </header>
      <div className="hv-sol-grid">
        {items.map(s => (
          <a key={s.t} href={s.href} target="_blank" rel="noopener" className="hv-sol" data-fx data-glow>
            <Image data-speed=".06" src={s.image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 25vw"/>
            <span className="hv-sol-shade" aria-hidden="true"/>
            <span className="hv-sol-copy">
              <span className="hv-sol-tags">{s.lines.map(l => <small key={l}>{l}</small>)}</span>
              <b>{s.t}</b>
              <span className="hv-sol-text">{s.d}</span>
              <span className="hv-sol-cta">Ver productos <Icon name="arrow"/></span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* 6 · Calidad y respaldo */
export function HvQuality() {
  return (
    <section className="hv-quality hq2" aria-labelledby="hv-q-title">
      <div className="hv-wrap">
        <header className="hv-head center">
          <Eyebrow>Calidad y respaldo</Eyebrow>
          <h2 id="hv-q-title" data-split>Productos que cumplen <em>la norma</em></h2>
        </header>
        <ul className="hv-q-grid hq-grid">
          <li data-fx>
            <span className="hq-tag"><span>01</span>Norma técnica</span>
            <span className="hq-mark"><span className="hq-word" aria-hidden="true">{'RITEL'.split('').map((c, i) => <i key={i} style={{transitionDelay: `${i * 60}ms`}}>{c}</i>)}</span></span>
            <span className="hq-seal">Telecomunicaciones</span>
            <i className="hq-rule"/>
            <b className="sr-only">RITEL</b>
            <p>Alineados al Reglamento Técnico de Instalaciones de Telecomunicaciones.</p>
          </li>
          <li data-fx>
            <span className="hq-tag"><span>02</span>Norma técnica</span>
            <span className="hq-mark"><span className="hq-word" aria-hidden="true">{'RETIE'.split('').map((c, i) => <i key={i} style={{transitionDelay: `${i * 60}ms`}}>{c}</i>)}</span></span>
            <span className="hq-seal">Instalaciones eléctricas</span>
            <i className="hq-rule"/>
            <b className="sr-only">RETIE</b>
            <p>Cumplimos el Reglamento Técnico de Instalaciones Eléctricas.</p>
          </li>
          <li data-fx>
            <span className="hq-tag"><span>03</span>Material</span>
            <span className="hq-mark">
              <span className="hq-element" aria-hidden="true"><small>29</small><span className="hq-word"><i>C</i><i style={{transitionDelay: '60ms'}}>u</i></span><em>Cobre</em></span>
            </span>
            <span className="hq-seal">100 % cobre puro</span>
            <i className="hq-rule"/>
            <b className="sr-only">100 % cobre</b>
            <p>Conductores de cobre puro en nuestros cables de red, sin aleaciones.</p>
          </li>
          <li data-fx>
            <span className="hq-tag"><span>04</span>Respaldo</span>
            <span className="hq-mark is-stack"><span className="hq-word" aria-hidden="true"><i>1</i><i style={{transitionDelay: '60ms'}}>2</i></span><span className="hq-unit" aria-hidden="true">meses</span></span>
            <span className="hq-seal">Garantía MARWA</span>
            <i className="hq-rule"/>
            <b className="sr-only">Garantía de 12 meses</b>
            <p>Respaldo directo de MARWA ante cualquier defecto de fabricación.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* 7 · El personaje MARWA */
export function HvCharacter() {
  return (
    <section className="hv-char" aria-labelledby="hv-char-title">
      <Image src="/assets/personaje-presentacion-v2.jpg" alt="Personaje MARWA, un robot con cabello de cables, con el pulgar arriba" fill sizes="(max-width: 767px) 200vw, 150vw" quality={95} priority={false}/>
      <div className="hv-char-shade" aria-hidden="true"/>
      <div className="hv-wrap hv-char-copy" data-fx>
        <h2 id="hv-char-title" data-split>La energía de MARWA <em>tiene cara</em></h2>
        <p>Conectado a cada una de nuestras líneas, nuestro personaje representa lo que hacemos todos los días: unir redes, personas y proyectos.</p>
        <a className="hv-btn red" href="/tienda" target="_blank" rel="noopener">Conoce nuestro portafolio <Icon name="arrow"/></a>
      </div>
    </section>
  );
}

/* 8 · Quiénes somos, con fotos reales de oficinas y bodega */
export function HvAbout() {
  const pillars = [
    ['Importación directa', 'Precios competitivos y control de calidad desde el origen.'],
    ['Cumplimiento normativo', 'Productos alineados a RITEL y RETIE en cada entrega.'],
    ['Servicio cercano', 'Un equipo que acompaña cada pedido, en todo el país.'],
  ];
  const photos = [
    {src: '/assets/marwa-real-premium/oficina-vidrios.jpg', alt: 'Oficinas de MARWA en Bogotá con el logo en los vidrios', cls: 'big'},
    {src: '/assets/marwa-real-premium/oficina-equipo.jpg', alt: 'Oficinas de MARWA en Bogotá', cls: ''},
    {src: '/assets/marwa-real-premium/bodega-cajas.jpg', alt: 'Bodega de MARWA con inventario listo para despacho', cls: ''},
    {src: '/assets/marwa-real-premium/oficina-sala.jpg', alt: 'Sala de reuniones de MARWA', cls: ''},
    {src: '/assets/marwa-real-premium/bodega-tuberia.jpg', alt: 'Tubería en la bodega de MARWA', cls: ''},
  ];
  return (
    <section className="hv-wrap hv-section hv-about" id="nosotros" aria-labelledby="hv-about-title">
      <div className="hv-about-copy" data-fx>
        <Eyebrow>Quiénes somos</Eyebrow>
        <h2 id="hv-about-title" data-split>El equipo detrás de <em>las redes de Colombia</em></h2>
        <p><b>MARWA Redes y Energía</b> es importador y distribuidor directo, especialista en soluciones completas de cableado estructurado, fibra óptica, línea plástica, HDTV, canalización y ductería, y metalmecánica.</p>
        <ul>{pillars.map(([t, d]) => <li key={t}><span className="hv-check"><Icon name="check"/></span><span><b>{t}</b>{d}</span></li>)}</ul>
        <a className="hv-btn" href={wa('Hola MARWA, quiero cotizar un proyecto.')} target="_blank" rel="noopener">Cotizar un proyecto <Icon name="arrow"/></a>
      </div>
      <div className="hv-about-gallery">
        {photos.map(p => <div key={p.src} className={`hv-ph ${p.cls}`} data-fx><Image src={p.src} alt={p.alt} fill quality={92} sizes={p.cls === 'big' ? '(max-width: 767px) 100vw, 50vw' : '(max-width: 767px) 60vw, 30vw'}/></div>)}
      </div>
    </section>
  );
}

/* 9 · Puente a la tienda + contacto */
export function HvStoreBridge() {
  const products = useProducts();
  const picks = products.filter(p => p.visible && p.badge === 'Más vendido').slice(0, 4);
  const list = picks.length >= 4 ? picks : [...picks, ...products.filter(p => p.visible && !picks.includes(p))].slice(0, 4);
  return (
    <section className="hv-wrap hv-section hv-bridge" aria-labelledby="hv-bridge-title">
      <header className="hv-head split">
        <div>
          <Eyebrow>Tienda en línea</Eyebrow>
          <h2 id="hv-bridge-title" data-split>Compra MARWA <em>en línea</em></h2>
        </div>
        <a className="hv-btn" href="/tienda" target="_blank" rel="noopener">Ver toda la tienda <Icon name="arrow"/></a>
      </header>
      <div className="hv-bridge-grid">{list.map(p => <MarwaCard key={p.id} p={p} badge sizes="(max-width: 767px) 46vw, 300px"/>)}</div>
    </section>
  );
}

export function HvContact() {
  const items = [
    {icon: 'phone', label: 'Teléfono', value: <><a href="tel:+573102569469">310 256 9469</a><small>PBX 601 6136490</small></>},
    {icon: 'mail', label: 'Correo', value: <><a href="mailto:info@marwa.com.co">info@marwa.com.co</a><small>Cotizaciones y pedidos</small></>},
    {icon: 'pin', label: 'Dirección', value: <>Av. 70 #49-39<small>Bogotá, Colombia</small></>},
    {icon: 'clock', label: 'Horario', value: <>Lun a jue · 7:30 – 4:00<small>Viernes · 8:00 – 4:00</small></>},
  ];
  return (
    <section className="hv-contact hc4" id="contacto" aria-labelledby="hv-contact-title">
      <div className="hv-wrap">
        <header className="hv-head center hc4-head" data-fx>
          <Eyebrow>Hablemos</Eyebrow>
          <h2 id="hv-contact-title" data-split>¿Tienes un proyecto? <em>Te ayudamos a cotizarlo</em></h2>
          <p>Cuéntanos qué necesitas y un asesor MARWA te ayuda a elegir las referencias y a armar la lista completa de materiales.</p>
          <div className="hv-actions">
            <a className="hv-btn red" href={wa('Hola MARWA, quiero cotizar un proyecto.')} target="_blank" rel="noopener">Escríbenos por WhatsApp <Icon name="arrow"/></a>
            <a className="hv-btn ghost" href="/tienda" target="_blank" rel="noopener">Ir a la tienda</a>
          </div>
        </header>
        <ul className="hc4-grid">
          {items.map(i => (
            <li key={i.label} data-fx>
              <span className="hc-ico"><Icon name={i.icon}/></span>
              <div><b className="hc4-label">{i.label}</b><span className="hc-val">{i.value}</span></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
