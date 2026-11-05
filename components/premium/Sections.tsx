'use client';

import Image from 'next/image';
import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import {categories, type Product} from '@/data/shopSeed';
import {addToCart, useProducts} from '@/lib/shop';
import {money} from '@/lib/format';
import {Icon} from './Icons';
import {catImages, waLink} from './SiteChrome';

const tab = (on: boolean) => (on ? {target: '_blank', rel: 'noopener'} : {});

/* ---------- banner a todo lo ancho (hero) ---------- */
type HeroProps = {
  theme: 'dark' | 'light';
  align?: 'center' | 'left';
  title: ReactNode;
  subtitle: string;
  cta: string;
  href: string;
  newTab?: boolean;
  image?: string;
  video?: string;
  position?: string;
  priority?: boolean;
};
export function PmHero({theme, align = 'center', title, subtitle, cta, href, newTab, image, video, position, priority}: HeroProps) {
  return (
    <section className={`pm-hero ${theme} is-${align}`}>
      <div className="pm-hero-media" aria-hidden="true">
        {video
          ? <video autoPlay muted loop playsInline poster={image}><source src={video} type="video/mp4"/></video>
          : image && <Image src={image} alt="" fill sizes="100vw" priority={priority} style={{objectPosition: position}}/>}
      </div>
      <div className="pm-wrap pm-hero-copy">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <a className={`pm-btn ${theme === 'dark' ? 'light' : ''}`} href={href} {...tab(!!newTab)}>{cta}</a>
      </div>
    </section>
  );
}

/* ---------- título + cifras (en Anker: "The World's No. 1 Charging Brand") ---------- */
export function PmIntro() {
  const stats = [
    ['+12 años', 'importando y distribuyendo'],
    ['32 departamentos', 'con despacho nacional'],
    ['5 líneas', 'de producto oficiales'],
  ];
  return (
    <section className="pm-wrap pm-intro">
      <h2>La marca de redes y energía<br/>que conecta a Colombia</h2>
      <ul>{stats.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}</ul>
    </section>
  );
}

/* ---------- mosaico 2×2 de banners con foto ---------- */
export type Tile = {title: string; text: string; image: string; href: string; cta?: string; position?: string};
export function PmPromoGrid({tiles, newTab}: {tiles: Tile[]; newTab?: boolean}) {
  return (
    <section className="pm-wrap pm-grid">
      {tiles.map(t => (
        <a key={t.title} href={t.href} className="pm-tile" {...tab(!!newTab)}>
          <Image src={t.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" style={{objectPosition: t.position}}/>
          <span className="pm-tile-copy">
            <b>{t.title}</b>
            <small>{t.text}</small>
            <span className="pm-btn light sm">{t.cta ?? 'Comprar'}</span>
          </span>
        </a>
      ))}
    </section>
  );
}

/* ---------- fila de categorías (tarjetas grises con producto) ---------- */
export function PmCategoryRow({title = 'Explora los productos MARWA por categoría', newTab}: {title?: string; newTab?: boolean}) {
  return (
    <section className="pm-wrap pm-section">
      <div className="pm-title"><h2>{title}</h2></div>
      <div className="pm-cats">
        {categories.map(c => (
          <a key={c.id} href={`/tienda?categoria=${c.id}`} className="pm-cat" {...tab(!!newTab)}>
            <span className="pm-cat-img"><span className={catImages[c.id].photo ? 'pm-cat-photo' : ''}><Image src={catImages[c.id].src} alt="" fill sizes="220px"/></span></span>
            <b>{c.name}</b>
          </a>
        ))}
        <a href="/tienda?vista=todos" className="pm-cat all" {...tab(!!newTab)}>
          <span className="pm-cat-img"><i><Icon name="arrow"/></i></span>
          <b>Todo el catálogo</b>
        </a>
      </div>
    </section>
  );
}

/* ---------- dos banners de líneas insignia (oscuro + claro) ---------- */
export type Series = {title: string; text: string; image?: string; video?: string; href: string; cta: string; theme: 'dark' | 'light'; newTab?: boolean; contain?: boolean};
export function PmSeries({title, items}: {title: string; items: Series[]}) {
  return (
    <section className="pm-wrap pm-section">
      <div className="pm-title"><h2>{title}</h2></div>
      <div className="pm-series">
        {items.map(s => (
          <article key={s.title} className={`pm-serie ${s.theme}${s.contain ? ' contain' : ''}`}>
            <div className="pm-serie-media" aria-hidden="true">
              {s.video
                ? <video autoPlay muted loop playsInline><source src={s.video} type="video/mp4"/></video>
                : s.image && <Image src={s.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw"/>}
            </div>
            <div className="pm-serie-copy">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <a className={`pm-btn sm ${s.theme === 'dark' ? 'light' : ''}`} href={s.href} {...tab(!!s.newTab)}>{s.cta}</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- galería que se expande (en Anker: "Power for Every Moment") ---------- */
export type Moment = {title: string; text: string; image: string; href: string; cta?: string; newTab?: boolean};
export function PmMoments({title, items, id}: {title: string; items: Moment[]; id?: string}) {
  const [active, setActive] = useState(0);
  return (
    <section className="pm-wrap pm-section" id={id}>
      <div className="pm-title"><h2>{title}</h2></div>
      <div className="pm-moments">
        {items.map((m, i) => (
          <article
            key={m.title}
            className={`pm-moment${i === active ? ' active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <Image src={m.image} alt="" fill sizes="(max-width: 760px) 100vw, 60vw"/>
            <span className="pm-moment-label">{m.title}</span>
            <div className="pm-moment-copy">
              <div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
              <a className="pm-btn light sm" href={m.href} {...tab(!!m.newTab)} tabIndex={i === active ? 0 : -1}>{m.cta ?? 'Ver más'}</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- carrusel de productos con pestañas ---------- */
function ProductTile({p, newTab}: {p: Product; newTab?: boolean}) {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);
  const href = `/tienda/producto/${p.id}`;
  const out = p.stock <= 0;
  return (
    <article className="pm-product">
      <a href={href} className="pm-product-img" {...tab(!!newTab)} tabIndex={-1} aria-hidden="true">
        <Image src={p.image} alt="" fill sizes="(max-width: 760px) 70vw, 260px" unoptimized={p.image.startsWith('data:')}/>
        {p.badge && <small>{p.badge}</small>}
      </a>
      <h3><a href={href} {...tab(!!newTab)}>{p.name}</a></h3>
      <p>{p.description}</p>
      <div className="pm-product-price"><b>{money(p.price)}</b><span>/ {p.unit}</span></div>
      <div className="pm-product-actions">
        <button className="pm-btn ghost sm" disabled={out} onClick={() => { if (addToCart(p.id, 1)) setAdded(true); }}>
          {out ? 'Agotado' : added ? 'Agregado ✓' : 'Agregar'}
        </button>
        <a className="pm-btn sm" href={href} {...tab(!!newTab)}>Comprar</a>
      </div>
    </article>
  );
}

export function PmProducts({title = 'Lo imprescindible de MARWA', newTab}: {title?: string; newTab?: boolean}) {
  const products = useProducts();
  const visible = useMemo(() => products.filter(p => p.visible), [products]);
  const tabs = {
    destacados: {label: 'Más vendidos', list: visible.filter(p => p.badge)},
    nuevos: {label: 'Recién llegados', list: visible.filter(p => p.custom || p.badge === 'Nuevo')},
    todos: {label: 'Todos', list: visible},
  };
  type Key = keyof typeof tabs;
  const keys = (Object.keys(tabs) as Key[]).filter(k => tabs[k].list.length);
  const [current, setCurrent] = useState<Key>('destacados');
  const key = keys.includes(current) ? current : keys[0];
  const track = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => track.current?.scrollBy({left: dir * track.current.clientWidth * 0.8, behavior: 'smooth'});

  return (
    <section className="pm-wrap pm-section">
      <div className="pm-title"><h2>{title}</h2></div>
      {keys.length > 1 && (
        <div className="pm-tabs" role="tablist">
          {keys.map(k => <button key={k} role="tab" aria-selected={k === key} className={k === key ? 'active' : ''} onClick={() => setCurrent(k)}>{tabs[k].label}</button>)}
        </div>
      )}
      <div className="pm-carousel">
        <div className="pm-products" ref={track}>
          {key && tabs[key].list.map(p => <ProductTile key={p.id} p={p} newTab={newTab}/>)}
        </div>
        <button className="pm-arrow prev" onClick={() => move(-1)} aria-label="Anteriores"><Icon name="chevron"/></button>
        <button className="pm-arrow next" onClick={() => move(1)} aria-label="Siguientes"><Icon name="chevron"/></button>
      </div>
    </section>
  );
}

/* ---------- compra con confianza (banda azul con franjas del logo) ---------- */
export function PmTrust() {
  const cards: [string, string, string][] = [
    ['truck', 'Despacho nacional', 'Enviamos a los 32 departamentos de Colombia.'],
    ['shield', 'Calidad certificada', 'Productos alineados a RITEL y RETIE.'],
    ['card', 'Pago seguro', 'Paga con tarjeta, PSE o Nequi.'],
    ['chat', 'Asesoría experta', 'Te ayudamos a elegir la solución correcta.'],
    ['tag', 'Precios claros', 'Precios en pesos con IVA incluido.'],
    ['tools', 'Respaldo técnico', 'Acompañamiento de la cotización a la instalación.'],
  ];
  return (
    <section className="pm-trust">
      <div className="pm-trust-bands" aria-hidden="true"><i/><i/><i/></div>
      <div className="pm-wrap pm-trust-inner">
        <h2>Compra con confianza en MARWA</h2>
        <div className="pm-trust-cards">
          {cards.map(([icon, t, d]) => (
            <div key={t}>
              <span><b>{t}</b><Icon name={icon}/></span>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="pm-member" id="asesoria">
          <div className="pm-member-bands" aria-hidden="true"><i/><i/><i/></div>
          <div>
            <h3>Asesoría experta MARWA</h3>
            <p>¿No sabes qué referencia elegir? Nuestro equipo te ayuda a encontrar la solución correcta para tu red.</p>
            <div>
              <a className="pm-btn outline-light sm" href="/#nosotros">Conocer MARWA</a>
              <a className="pm-btn light sm" href={waLink('Hola MARWA, necesito asesoría para elegir productos.')} target="_blank" rel="noopener">Hablar con un asesor</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- quiénes somos ---------- */
export function PmAbout() {
  const pillars = [
    ['Importación directa', 'Sin intermediarios: precios competitivos y control de calidad desde el origen.'],
    ['Cumplimiento normativo', 'Productos alineados a RITEL y RETIE en cada entrega.'],
    ['Servicio cercano', 'Un equipo que acompaña cada pedido, en todo el país.'],
  ];
  return (
    <section className="pm-wrap pm-section pm-about" id="nosotros">
      <div className="pm-about-img">
        <Image src="/assets/equipo-marwa-colombia.png" alt="Equipo de MARWA trabajando en un cuarto técnico" fill sizes="(max-width: 760px) 100vw, 50vw"/>
      </div>
      <div className="pm-about-copy">
        <span className="pm-kicker">Quiénes somos</span>
        <h2>El equipo detrás de las redes de Colombia</h2>
        <p><b>MARWA Redes y Energía</b> es importador y distribuidor directo, especialista en suministro de soluciones completas en cableado estructurado, fibra óptica, networking, línea plástica e infraestructura.</p>
        <ul>{pillars.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ul>
        <a className="pm-btn" href={waLink('Hola MARWA, quiero cotizar un proyecto.')} target="_blank" rel="noopener">Cotizar un proyecto</a>
      </div>
    </section>
  );
}

