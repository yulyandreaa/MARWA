'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {Icon} from '@/components/premium/Icons';
import {MarwaCard, ProductImage} from '@/components/shop/ShopUI';
import {categories} from '@/data/shopSeed';
import {useProducts} from '@/lib/shop';
import {mapDots, mapHub, mapNodes, mapSize} from '@/data/colombiaMap';
import {BEST_SELLER_IDS} from '@/data/bestSellers';
import {LOGO_BARS} from '@/data/logoMarwa';

/**
 * Página de inicio v3 (10-nov-2026), secciones 2 a 9. La sección 1 es EcoHero.
 * Línea gráfica de la tienda: Poppins, azul noche #10233f, azul #2447e8, rojo #e52332,
 * eyebrow rojo con línea, títulos con acento azul y mucho aire. Videos: los 4 de marca por ahora.
 */
const WA = 'https://wa.me/573102569469?text=';
const wa = (t: string) => WA + encodeURIComponent(t);

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
      {/* video de fondo sin audio (13-nov-2026); la foto queda de imagen de espera */}
      <div className="hv-video-img">
        <video src="/assets/marwa-infraestructura-v2.mp4" poster="/assets/marwa-infraestructura-v2.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden="true"/>
      </div>
      <div className="hv-video-shade" aria-hidden="true"/>
      <div className="hv-wrap hv-video-copy" data-fx>
        <h2 id="hv-video-title" data-split>La infraestructura detrás<br/> <em>de cada conexión</em></h2>
        <p>Importamos y distribuimos cableado, fibra óptica, canalización y metalmecánica con calidad certificada, para que tu proyecto funcione desde el primer día.</p>
        <div className="hv-actions">
          <a className="hv-btn light" href="/tienda" target="_blank" rel="noopener">Explorar la tienda <Icon name="arrow"/></a>
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
/* Mapa: hexágono del logo MARWA, cables curvos y ciudades con nombre */
const isRed = (i: number) => i % 3 === 2;
const hex = (x: number, y: number, r: number) =>
  Array.from({length: 6}, (_, k) => { const a = Math.PI / 6 + k * Math.PI / 3; return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
const cable = (n: {x: number; y: number}) => {
  const mx = (mapHub.x + n.x) / 2, my = (mapHub.y + n.y) / 2;
  const dx = n.x - mapHub.x, dy = n.y - mapHub.y;
  return `M${mapHub.x} ${mapHub.y}Q${(mx - dy * .22).toFixed(1)} ${(my + dx * .22).toFixed(1)} ${n.x} ${n.y}`;
};
const mapLabels = [
  {name: 'Barranquilla', dx: 12, dy: -6}, {name: 'Medellín', dx: -12, dy: -4}, {name: 'Cali', dx: -12, dy: 4},
  {name: 'Leticia', dx: -12, dy: 4}, {name: 'San Andrés', dx: 12, dy: 4},
];
/* Mapa con el estilo del ecosistema (19-nov-2026, v3, en código): Colombia como plataforma 3D blanca perlada
   con canto y luz de neón en el borde, haces de 4 tubos de neón desde el hexágono MARWA en Bogotá hasta cada ciudad
   en su posición real (coordenadas de data/colombiaMap.ts) y una plataforma pequeña con luz en cada ciudad.
   Sin recuadro: va sobre el fondo blanco de la página. SY aplana el mapa para dar la vista inclinada. */
const SY = 0.82;
const mainCities = ['Barranquilla', 'Cartagena', 'Medellín', 'Cali', 'Bucaramanga', 'Cúcuta', 'Pasto', 'Leticia', 'Puerto Carreño', 'Riohacha', 'Neiva'];
const cityLabel: Record<string, [number, number]> = {Barranquilla: [14, -14], Medellín: [-16, -10], Cali: [-16, 6], Bucaramanga: [16, -6], Leticia: [-16, 6], Pasto: [-16, 8], Cúcuta: [16, -8], 'Puerto Carreño': [-4, -18]};
const tubes = [{c: '#2f6bff', o: -4.5}, {c: '#22c4e6', o: -1.5}, {c: '#8a5cff', o: 1.5}, {c: '#ff4f8b', o: 4.5}];
const P = (x: number, y: number) => [x, y * SY] as const;
function bundle(n: {x: number; y: number}, o: number) {
  const [hx, hy] = P(mapHub.x, mapHub.y), [nx, ny] = P(n.x, n.y);
  const dx = nx - hx, dy = ny - hy, len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len;            // perpendicular para separar los 4 tubos
  const mx = (hx + nx) / 2 + px * len * .16, my = (hy + ny) / 2 + py * len * .16;
  const k = Math.min(1, 26 / len);                // los tubos se juntan al llegar al hexágono y a la ciudad
  return `M${(hx + dx * k + px * o * .3).toFixed(1)} ${(hy + dy * k + py * o * .3).toFixed(1)}Q${(mx + px * o).toFixed(1)} ${(my + py * o).toFixed(1)} ${(nx - dx * .03 + px * o * .3).toFixed(1)} ${(ny - dy * .03 + py * o * .3).toFixed(1)}`;
}
function MapLine() {
  const nodes = mapNodes.filter(n => mainCities.includes(n.name));
  const [hx, hy] = P(mapHub.x, mapHub.y);
  const W = mapSize.w, H = mapSize.h * SY;
  return (
    <div className="hs-map2">
      <svg viewBox={`-40 -30 ${W + 80} ${H + 90}`} role="img" aria-label="Mapa de Colombia con despacho a los 32 departamentos desde Bogotá">
        <defs>
          <filter id="hm-goo"><feGaussianBlur stdDeviation="4.5"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"/></filter>
          <filter id="hm-neon" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="hm-led" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
          <filter id="hm-shadow" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>
          <linearGradient id="hm-side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe5f8"/><stop offset="1" stopColor="#b9c4ea"/></linearGradient>
          <radialGradient id="hm-face" cx="45%" cy="35%" r="75%"><stop offset="0" stopColor="#ffffff"/><stop offset=".7" stopColor="#f6f8ff"/><stop offset="1" stopColor="#e9eefc"/></radialGradient>
          <linearGradient id="hm-rim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2f6bff"/><stop offset=".5" stopColor="#ff3b5c"/><stop offset="1" stopColor="#2f6bff"/></linearGradient>
          <mask id="hm-face-mask"><g filter="url(#hm-goo)" transform={`scale(1 ${SY})`}><path d={mapDots} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round"/></g></mask>
        </defs>
        {/* sombra sobre el piso */}
        <g transform={`translate(10 34) scale(1 ${SY})`} filter="url(#hm-shadow)" opacity=".35"><path d={mapDots} fill="none" stroke="#7d8fd6" strokeWidth="14" strokeLinecap="round"/></g>
        {/* luz LED del borde inferior */}
        <g transform={`translate(0 18) scale(1 ${SY})`} filter="url(#hm-led)" opacity=".9"><g filter="url(#hm-goo)"><path d={mapDots} fill="none" stroke="url(#hm-rim)" strokeWidth="12" strokeLinecap="round"/></g></g>
        {/* canto (grosor) */}
        {[16, 12, 8, 4].map(d => (
          <g key={d} transform={`translate(0 ${d}) scale(1 ${SY})`} filter="url(#hm-goo)"><path d={mapDots} fill="none" stroke={d === 16 ? '#aab7e6' : 'url(#hm-side)'} strokeWidth="12" strokeLinecap="round"/></g>
        ))}
        {/* cara superior perlada */}
        <rect x="-40" y="-30" width={W + 80} height={H + 90} fill="url(#hm-face)" mask="url(#hm-face-mask)"/>
        {/* haces de 4 tubos de neón */}
        <g filter="url(#hm-neon)">
          {nodes.map(n => tubes.map(t => <path key={`${n.name}-${t.o}`} d={bundle(n, t.o)} fill="none" stroke={t.c} strokeWidth="1.7" strokeLinecap="round" opacity=".95"/>))}
        </g>
        {/* plataformas de las ciudades */}
        {nodes.map((n, i) => {
          const [x, y] = P(n.x, n.y); const red = i % 2 === 1;
          return (
            <g key={`p-${n.name}`}>
              <ellipse cx={x} cy={y + 3.5} rx="10" ry="5.2" fill={red ? '#ff3b5c' : '#2f6bff'} filter="url(#hm-led)" opacity=".9"/>
              <ellipse cx={x} cy={y + 2.5} rx="9" ry="4.6" fill="#c3cdf0"/>
              <ellipse cx={x} cy={y} rx="9" ry="4.6" fill="#fff" stroke={red ? '#ff3b5c' : '#2f6bff'} strokeWidth="1.4"/>
            </g>
          );
        })}
        {Object.entries(cityLabel).map(([name, [dx, dy]]) => {
          const n = mapNodes.find(m => m.name === name); if (!n) return null;
          const [x, y] = P(n.x, n.y);
          return <text key={name} className="hm-city" x={x + dx} y={y + dy} textAnchor={dx < 0 ? 'end' : 'start'}>{name}</text>;
        })}
        {/* Bogotá: hexágono MARWA con canto y luz, como el centro del ecosistema */}
        <polygon points={hex(hx, hy + 9, 30)} fill="#2f6bff" filter="url(#hm-led)" opacity=".8"/>
        <polygon points={hex(hx, hy + 6, 29)} fill="#b9c4ea"/>
        <polygon points={hex(hx, hy, 29)} fill="url(#hm-face)" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
        <svg x={hx - 19} y={hy - 11} width="38" height="22" viewBox="382 357 316 149">
          {LOGO_BARS.map((p, k) => <path key={k} d={p.d} fill={p.fill}/>)}
        </svg>
        <text className="hm-city hub" x={hx + 38} y={hy + 6}>Bogotá</text>
      </svg>
    </div>
  );
}

export function HvStats() {
  const [ref, seen] = useInView<HTMLElement>();
  return (
    <section ref={ref} className={`hv-wrap hv-section hv-stats2${seen ? ' seen' : ''}`} aria-labelledby="hv-stats-title">
      <div className="hs-side">
        <div className="hv-stats-head" data-fx>
          <h2 id="hv-stats-title" data-split>Conectamos cada rincón <em>de Colombia</em></h2>
          <p className="hs-lead">Hace más de <strong><Counter to={12} run={seen}/> años</strong> importamos y distribuimos soluciones para redes y energía.<br className="hs-br"/> Hoy llevamos nuestras <strong><Counter to={6} run={seen}/> líneas de producto</strong> a los <strong><Counter to={32} run={seen}/> departamentos</strong> del país,<br className="hs-br"/> con respaldo técnico y cumplimiento normativo.</p>
        </div>
      </div>

      {/* 20-nov-2026: el mapa (MapLine) se cambió por un carrusel de ciudades; MapLine queda guardado */}
      <CityCarousel/>
    </section>
  );
}

/* Carrusel continuo de ciudades (fotos de la usuaria con el nombre de la ciudad ya puesto).
   Se mueve solo, se pausa al pasar el mouse; la lista va duplicada para que el giro no tenga salto. */
const cities = [
  {id: 'bogota', name: 'Bogotá'},
  {id: 'medellin', name: 'Medellín'},
  {id: 'cali', name: 'Cali'},
  {id: 'cartagena', name: 'Cartagena'},
  {id: 'barranquilla', name: 'Barranquilla'},
  {id: 'bucaramanga', name: 'Bucaramanga'},
  {id: 'pereira', name: 'Pereira'},
];

function CityCarousel() {
  return (
    <div className="hs-cities" role="region" aria-label="Ciudades donde llega MARWA">
      <ul className="hs-cities-track">
        {[...cities, ...cities].map((c, i) => (
          <li key={`${c.id}-${i}`} aria-hidden={i >= cities.length}>
            <Image src={`/assets/ciudades/ciudad-${c.id}-v1.jpg`} alt={i < cities.length ? `${c.name} de noche conectada por líneas de luz` : ''} fill quality={88} sizes="(max-width: 767px) 80vw, 520px"/>
          </li>
        ))}
      </ul>
    </div>
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
    {t: 'Edificios y oficinas', d: 'Cableado estructurado, canalización y gabinetes para redes corporativas ordenadas y certificables.', lines: ['Cableado', 'Canalización', 'Metalmecánica'], image: '/assets/solucion-oficinas-v3.jpg', href: '/tienda?categoria=cableado'},
    {t: 'Centros de datos', d: 'Racks, gabinetes, patch panels y fibra para cuartos técnicos de alta densidad.', lines: ['Metalmecánica', 'Cableado', 'Fibra óptica'], image: '/assets/solucion-datacenter-v3.jpg', href: '/tienda?categoria=metalmecanica'},
    {t: 'Operadores de fibra', d: 'Fibra ADSS y DROP, conectores, splitters y herrajería para despliegues FTTH.', lines: ['Fibra óptica', 'Línea plástica'], image: '/assets/solucion-fibra-v3.jpg', href: '/tienda?categoria=fibra'},
    {t: 'Hogar y entretenimiento', d: 'Cables HDMI, extensores y splitters para llevar la señal de video a cada pantalla.', lines: ['HDTV', 'Línea plástica'], image: '/assets/solucion-hogar-v3.jpg', href: '/tienda?categoria=hdtv'},
  ];
  return (
    <section className="hv-wrap hv-section hv-solutions" id="soluciones" aria-labelledby="hv-sol-title">
      <header className="hv-head center">
        <h2 id="hv-sol-title" data-split>Una solución para <em>cada proyecto</em></h2>
        <p>Elige el tipo de proyecto y encuentra las líneas MARWA que necesitas.</p>
      </header>
      <div className="hv-sol-grid">
        {items.map(s => (
          <a key={s.t} href={s.href} target="_blank" rel="noopener" className="hv-sol" data-fx data-glow>
            <Image src={s.image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 25vw"/>
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
    <section className="hv-quality hq2" id="calidad" aria-labelledby="hv-q-title">
      <div className="hv-wrap">
        <header className="hv-head center">
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

/* 7 · Presentación de MARWOT (23-nov-2026): franja delgada como las de la tienda; texto elegido = opción 2 */
export function HvCharacter() {
  return (
    <section className="hv-char is-boxed is-strip hv-wrap" aria-labelledby="hv-char-title">
      <Image src="/assets/personaje-presentacion-v2.jpg" alt="MARWOT, el personaje de MARWA: un robot con cabello de cables y el pulgar arriba" fill sizes="(max-width: 767px) 200vw, 150vw" quality={95} priority={false}/>
      <div className="hv-char-shade" aria-hidden="true"/>
      <div className="hv-char-copy" data-fx>
        <h2 id="hv-char-title">MARWOT llegó <em className="is-break">para conectarte</em></h2>
        <p>Nuestro personaje te acompaña en la tienda, en cada pedido y en cada proyecto que hacemos juntos.</p>
        <a className="hv-btn red" href="/tienda" target="_blank" rel="noopener">Explora nuestro portafolio <Icon name="arrow"/></a>
      </div>
    </section>
  );
}

/* Galería de Quiénes somos (19-nov-2026, opción 1): foto grande + miniaturas que la cambian.
   Sin carrusel automático ni pantalla completa; en celular se puede deslizar sobre la foto. */
function AboutGallery({photos}: {photos: {src: string; alt: string}[]}) {
  const [i, setI] = useState(0);
  const n = photos.length;
  const touch = useRef(0);
  return (
    <div className="hv-gal" data-fx>
      <div className="hv-gal-main"
        onTouchStart={e => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) setI(v => (v + (dx < 0 ? 1 : -1) + n) % n); }}>
        {photos.map((p, k) => <Image key={p.src} src={p.src} alt={p.alt} fill quality={92} sizes="(max-width: 900px) 100vw, 45vw" className={k === i ? 'on' : ''}/>)}
        <span className="hv-gal-count" aria-hidden="true">{i + 1} / {n}</span>
      </div>
      <div className="hv-gal-thumbs" role="tablist" aria-label="Fotos de MARWA">
        {photos.map((p, k) => (
          <button key={p.src} type="button" role="tab" aria-selected={k === i} aria-label={p.alt} className={k === i ? 'on' : ''} onClick={() => setI(k)}>
            <Image src={p.src} alt="" fill sizes="120px" quality={70}/>
          </button>
        ))}
      </div>
    </div>
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
    <section className="hv-ab3" id="nosotros" aria-labelledby="hv-about-title">
      <div className="hv-wrap hv-ab3-in">
        {/* izquierda: galería de fotos reales con miniaturas (opción 1, aprobada 19-nov-2026) */}
        <AboutGallery photos={photos}/>
        {/* derecha: texto ordenado de arriba hacia abajo */}
        <div className="hv-ab3-copy" data-fx>
          <h2 id="hv-about-title" data-split>El equipo detrás de <em>las redes de Colombia</em></h2>
          {/* palabras clave del cliente resaltadas dentro del párrafo (propuesta A, aprobada 19-nov-2026) */}
          <p className="kw-para"><b>MARWA Redes y Energía</b> es importador y distribuidor directo de <strong>productos certificados</strong> para <strong>infraestructura en telecomunicaciones</strong>. Acompañamos con <strong>ingeniería en telecomunicaciones</strong> y <strong>soluciones para proyectos</strong> de <strong>cableado estructurado</strong> y <strong>redes de voz y datos</strong>, con fibra óptica, línea plástica, HDTV, canalización y ductería, y metalmecánica.</p>
          <ul className="hv-ab3-list">
            {pillars.map(([t, d]) => <li key={t}><span className="hv-ab3-ic"><Icon name="check"/></span><span><b>{t}</b>{d}</span></li>)}
          </ul>
          <a className="hv-btn" href={wa('Hola MARWA, quiero cotizar un proyecto.')} target="_blank" rel="noopener">Cotizar un proyecto <Icon name="arrow"/></a>
        </div>
      </div>
    </section>
  );
}

/* 5a · Lo más vendido en MARWA (pedido expreso del cliente, 19-nov-2026): mismas tarjetas y mismos productos que la tienda. */
export function HvBestSellers() {
  const products = useProducts();
  const list = BEST_SELLER_IDS.map(id => products.find(p => p.id === id && p.visible)).filter(Boolean) as ReturnType<typeof useProducts>;
  const track = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => { // avanza de a UNA tarjeta (ancho de la tarjeta + espacio entre tarjetas)
    const t = track.current; const card = t?.firstElementChild as HTMLElement | null; if (!t || !card) return;
    t.scrollBy({left: dir * (card.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 0)), behavior: 'smooth'});
  };
  if (!list.length) return null;
  return (
    <section className="hv-best2" id="productos" aria-labelledby="hv-best-title">
      <div className={`hv-wrap lx-best hv-best${list.length <= 4 ? ' fits' : ''}`}>
        <header className="hv-best-head">
          <h2 id="hv-best-title" className="lx-lines-title">Lo más vendido en <em>MARWA</em></h2>
        </header>
        <div className="pm-carousel">
          <div className="pm-products" ref={track}>
            {/* tarjeta liviana solo para la página de inicio (referencia del usuario): línea, foto, nombre y "Ver producto" */}
            {list.map(p => {
              const line = categories.find(c => c.id === p.category)?.name ?? '';
              const href = `/tienda/producto/${p.id}`;
              return (
                <a key={p.id} className="hv-pcard" href={href} target="_blank" rel="noopener">
                  <span className="hv-pcard-line">{line}</span>
                  <span className="hv-pcard-img"><ProductImage src={p.image} alt="" sizes="(max-width: 760px) 70vw, 300px"/></span>
                  <b className="hv-pcard-name">{p.name}</b>
                  <span className="hv-pcard-go">Ver producto <Icon name="arrow"/></span>
                </a>
              );
            })}
          </div>
          <button className="pm-arrow prev" onClick={() => move(-1)} aria-label="Anteriores"><Icon name="chevron"/></button>
          <button className="pm-arrow next" onClick={() => move(1)} aria-label="Siguientes"><Icon name="chevron"/></button>
        </div>
        <div className="hv-best-more">
          <a className="hv-btn ghost-blue" href="/tienda?vista=todos" target="_blank" rel="noopener">Ver todos los productos</a>
        </div>
      </div>
    </section>
  );
}

/* 5b · Piezas tipo volante (punto 11 del cliente, 19-nov-2026): distribución nacional en vehículos propios y respaldo técnico.
   Fotos TEMPORALES (camión con el logo puesto en vector, asesor generado en Magnific) mientras el cliente envía las reales.
   "Más vendidos" va en su propia sección (HvBestSellers), por pedido expreso del cliente. */
export function HvService() {
  return (
    <>
    <section className="hv-wrap hv-svc truck-a" aria-label="Despachos a todo Colombia">
      <a className="hv-flyer is-truck" href={wa('Hola MARWA, quiero cotizar un pedido con envío.')} target="_blank" rel="noopener" data-fx>
        <Image src="/assets/marwa-camion-v3.jpg" alt="Camión de carga MARWA con el personaje de la marca recorriendo una avenida de Bogotá" fill quality={90} sizes="(max-width: 900px) 100vw, 1100px"/>
        <span className="hv-flyer-shade" aria-hidden="true"/>
        <span className="hv-flyer-copy">
          <b>Despachamos a todo Colombia</b>
          <span>Con vehículos propios llevamos tu pedido desde Bogotá hasta tu obra o tu bodega.</span>
          <span className="hv-flyer-cta">Cotizar un pedido <Icon name="arrow"/></span>
        </span>
      </a>
    </section>
    {/* franja de lado a lado (punto 12 del cliente): "Conviértete en distribuidor". Reemplaza a "Respaldo técnico",
        que repetía la sección de contacto. Textos y campos tomados de marwa.com.co/distribuidores. */}
    <DistributorBand/>
    </>
  );
}

/* Franja + ventana centrada (igual a las de los paneles de cliente y administrador) con el formulario de distribuidores (19-nov-2026).
   Campos iguales a marwa.com.co/distribuidores. Por ahora envía la solicitud por WhatsApp;
   al publicar se puede conectar a correo (info@marwa.com.co). */
function DistributorBand() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) || '').trim();
    const lines = [
      'Hola MARWA, quiero ser distribuidor.',
      `Empresa o razón social: ${v('empresa')}`,
      `Correo: ${v('correo')}`,
      `Teléfono: ${v('telefono')}`,
      `Ciudad: ${v('ciudad')}`,
      v('sitio_web') && `Sitio web: ${v('sitio_web')}`,
      v('direccion') && `Dirección: ${v('direccion')}`,
      v('actividad') && `Actividad: ${v('actividad')}`,
      'Autorizo el tratamiento de mis datos personales conforme a la Política de Tratamiento de Datos de MARWA.',
    ].filter(Boolean).join('\n');
    window.open(wa(lines), '_blank', 'noopener');
    setSent(true);
  };
  return (
    <section className="hv-svc2" id="distribuidores" aria-labelledby="hv-dist-title">
      <div className="hv-flyer2" data-fx>
        <div className="hv-flyer2-copy">
          <h2 id="hv-dist-title" className="hv-dist-title">Conviértete en distribuidor MARWA</h2>
          <span>Déjanos tus datos y nuestro equipo comercial te contactará para iniciar tu vinculación como distribuidor autorizado.</span>
          <ul className="hv-dist-perks">
            {['Precios mayoristas', 'Despachos a todo Colombia', 'Respaldo técnico'].map(t => <li key={t}><Icon name="check"/>{t}</li>)}
          </ul>
          <button type="button" className="hv-flyer-cta" onClick={() => { setSent(false); setOpen(true); }}>Quiero ser distribuidor <Icon name="arrow"/></button>
        </div>
        <span className="hv-flyer2-img"><Image src="/assets/marwa-asesor-dotacion-temporal-v3.jpg" alt="Asesor comercial de MARWA con la dotación de la marca atendiendo una llamada" fill quality={90} sizes="(max-width: 900px) 100vw, 55vw"/></span>
      </div>

      {open && (
        <div className="hv-drawer-bg" onClick={() => setOpen(false)}>
          <aside className="hv-drawer" role="dialog" aria-modal="true" aria-labelledby="hv-drawer-title" onClick={e => e.stopPropagation()}>
            <h3 id="hv-drawer-title">Conviértete en distribuidor MARWA</h3>
            {sent ? (
              <div className="hv-drawer-ok">
                <p><b>¡Gracias!</b> Abrimos WhatsApp con tus datos. Envía el mensaje y nuestro equipo comercial te contactará.</p>
                <div className="pa-like-actions"><button type="button" className="pa-like-btn primary" onClick={() => setOpen(false)}>Cerrar</button></div>
              </div>
            ) : (
              <form className="hv-dist-form" onSubmit={submit}>
                <p>Déjanos tus datos y nuestro equipo comercial te contactará.</p>
                <label className="full"><span>Empresa o razón social *</span><input name="empresa" required autoComplete="organization"/></label>
                <label><span>Correo electrónico *</span><input name="correo" type="email" required autoComplete="email"/></label>
                <label><span>Teléfono *</span><input name="telefono" type="tel" required autoComplete="tel"/></label>
                <label><span>Ciudad *</span><input name="ciudad" required autoComplete="address-level2"/></label>
                <label><span>Sitio web o URL</span><input name="sitio_web" type="url" placeholder="https://" autoComplete="url"/></label>
                <label className="full"><span>Dirección</span><input name="direccion" autoComplete="street-address"/></label>
                <label className="full"><span>Describe la actividad de tu empresa</span><textarea name="actividad" rows={3}/></label>
                <label className="full hv-dist-check">
                  <input type="checkbox" name="autorizacion" required/>
                  <span>Autorizo el tratamiento de mis datos personales conforme a la <a href="/tienda/tratamiento-de-datos" target="_blank" rel="noopener">Política de Tratamiento de Datos de MARWA</a>. *</span>
                </label>
                <small className="full">* Campos obligatorios.</small>
                {/* mismos botones que los paneles de cliente y administrador */}
                <div className="full pa-like-actions">
                  <button type="submit" className="pa-like-btn primary">Enviar solicitud</button>
                  <button type="button" className="pa-like-btn ghost" onClick={() => setOpen(false)}>Cancelar</button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}

/* 8b · Políticas comerciales y certificaciones (pedido del cliente, 19-nov-2026).
   Datos tomados SOLO de marwa.com.co (/devoluciones y sección Certificaciones): no inventar condiciones. */
export function HvPolicies() {
  const rows = [
    {n: '01', k: 'Garantía', big: '12 meses', text: 'Desde la entrega, o el plazo del fabricante si es mayor. Cubre defectos de fabricación.', href: '/tienda/devoluciones#garantia', cta: 'Ver garantía'},
    {n: '02', k: 'Devoluciones', big: '6 días hábiles', text: 'Después de facturado, con el producto sin uso y en su empaque original. No aplica para cable ni productos a la medida.', href: '/tienda/devoluciones#devoluciones', cta: 'Ver política'},
  ];
  return (
    <section className="hv-pol2" aria-labelledby="hv-pol-title">
      <div className="hv-wrap hv-pol2-in">
        <div className="hv-pol2-side">
          <h2 id="hv-pol-title" className="hv-pol-title">Compra con <em>respaldo</em></h2>
          {/* sellos tal como aparecen en marwa.com.co: RITEL y RETIE en texto con check, LENOR con su logo */}
          <div className="hv-pol2-certs" aria-label="Certificaciones">
            <span className="hv-cert"><Icon name="check"/>RITEL</span>
            <span className="hv-cert"><Icon name="check"/>RETIE</span>
            <span className="hv-cert is-logo"><Image src="/assets/certificaciones/lenor.png" alt="Certificación LENOR" width={249} height={251}/></span>
          </div>
        </div>
        <ol className="hv-pol-rows">
          {rows.map(r => (
            <li key={r.k}>
              <a href={r.href} target="_blank" rel="noopener">
                {/* tema y dato en la misma línea ("Garantía  12 meses"), sin numeración; debajo la explicación */}
                <span className="hv-pol-line"><span className="hv-pol-k">{r.k}</span><span className="hv-pol-big">{r.big}</span></span>
                <span className="hv-pol-text">{r.text}</span>
                <span className="hv-pol-go" aria-label={r.cta}><Icon name="arrow"/></span>
              </a>
            </li>
          ))}
        </ol>
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
