'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {categories, type CategoryId, type Product} from '@/data/shopSeed';
import {useProducts} from '@/lib/shop';
import {Icon} from './Icons';
import {ShipToBar} from '@/components/shop/ShipTo';

export const WA = 'https://wa.me/573102569469';
export const waLink = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;
const newTab = {target: '_blank', rel: 'noopener'} as const;

/* Barra de anuncio negra. */
export function PmAnnouncement({shop = false}: {shop?: boolean}) {
  if (shop) {
    return (
      <div className="pm-announce mh-bar">
        <div className="pm-wrap">
          <ShipToBar/>
          <ul>
            <li><Icon name="truck"/>Despacho a los 32 departamentos de Colombia</li>
            <li><Icon name="shield"/>Compra segura</li>
            <li><Icon name="headset"/>Asesoría técnica especializada</li>
          </ul>
          <a href={waLink('Hola MARWA, tengo una pregunta sobre la tienda.')} {...newTab}>¿Necesitas ayuda? Contáctanos <Icon name="arrow"/></a>
        </div>
      </div>
    );
  }
  return (
    <div className="pm-announce">
      <div className="pm-wrap">
        <p>Compra en línea con despacho a todo Colombia. <a href="/tienda">Ir a la tienda &gt;&gt;</a></p>
      </div>
    </div>
  );
}

export function PmLogo({href = '/'}: {href?: string}) {
  return (
    <Link href={href} className="pm-logo" aria-label="MARWA Redes y Energía — inicio">
      <Image src="/assets/marwa-logo-oficial.png" alt="MARWA Redes y Energía" width={900} height={445} priority/>
    </Link>
  );
}

/* Imagen de cada línea (tarjetas de categoría y menú Catálogo). */
export const catImages: Record<CategoryId, {src: string; photo?: boolean}> = {
  cableado: {src: '/assets/producto-cable-cat5e.jpg'},
  fibra: {src: '/assets/producto-fibra-drop.png'},
  plastica: {src: '/assets/solution-plastic.jpg', photo: true},
  hdtv: {src: '/assets/solution-hdtv.jpg', photo: true},
  canalizacion: {src: '/assets/solution-plastic.jpg', photo: true},
  metalmecanica: {src: '/assets/producto-rack-piso.png'},
};

/* Menú desplegable "Catálogo" (mega menú estilo Anker):
   columna izquierda con vistas y líneas, cuadrícula de productos a la derecha. */
type CatalogView = 'top' | 'new' | CategoryId;
export function CatalogMenu({newTab: open = false, active, onNavigate}: {newTab?: boolean; active?: boolean; onNavigate?: () => void}) {
  const [show, setShow] = useState(false);
  const [view, setView] = useState<CatalogView>('top');
  const [linesOpen, setLinesOpen] = useState(true);
  const products = useProducts();
  const extra = open ? newTab : {};
  const close = () => { setShow(false); onNavigate?.(); };

  const visible = useMemo(() => products.filter(p => p.visible), [products]);
  const lists: Record<'top' | 'new', Product[]> = {
    top: visible.filter(p => p.badge && p.badge !== 'Nuevo'),
    new: visible.filter(p => p.custom || p.badge === 'Nuevo'),
  };
  const current = view === 'top' || view === 'new' ? lists[view] : visible.filter(p => p.category === view);
  const shown = (current.length || view !== 'top' ? current : visible).slice(0, 9);
  const cat = categories.find(c => c.id === view);
  const title = view === 'top' ? 'Más vendidos' : view === 'new' ? 'Recién llegados' : cat?.name ?? '';
  const titleHref = cat ? `/tienda?categoria=${cat.id}` : '/tienda?vista=todos';

  const item = (v: CatalogView, label: string, sub = false) => (
    <button
      type="button"
      key={v}
      className={`${sub ? 'sub' : ''}${view === v ? ' on' : ''}`}
      onMouseEnter={() => setView(v)}
      onFocus={() => setView(v)}
      onClick={() => setView(v)}
    >{label}</button>
  );

  return (
    <div className={`pm-catalog${show ? ' open' : ''}`} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button type="button" className={active ? 'active' : ''} aria-expanded={show} onClick={() => setShow(!show)}>
        Catálogo <Icon name="chevron"/>
      </button>
      <div className="pm-catalog-panel">
        <aside className="pm-catalog-side">
          <div>
            {item('top', 'Más vendidos')}
            {lists.new.length > 0 && item('new', 'Recién llegados')}
            <button type="button" className="group" aria-expanded={linesOpen} onClick={() => setLinesOpen(!linesOpen)}>
              Por línea <Icon name="chevron"/>
            </button>
            {linesOpen && categories.map(c => (
              <a
                key={c.id}
                href={`/tienda?categoria=${c.id}`}
                {...extra}
                className={`sub${view === c.id ? ' on' : ''}`}
                onMouseEnter={() => setView(c.id)}
                onFocus={() => setView(c.id)}
                onClick={close}
              >{c.name}<Icon name="chevron"/></a>
            ))}
          </div>
          <a className="pm-btn" href="/tienda?vista=todos" {...extra} onClick={close}>Ver todo el catálogo</a>
        </aside>
        <div className="pm-catalog-main">
          <a className="pm-catalog-title" href={titleHref} {...extra} onClick={close}>{title} <Icon name="chevron"/></a>
          {shown.length ? (
            <div className="pm-catalog-grid">
              {shown.map(p => (
                <a key={p.id} href={`/tienda/producto/${p.id}`} {...extra} onClick={close}>
                  <span className="pm-catalog-img"><Image src={p.image} alt="" fill sizes="96px" unoptimized={p.image.startsWith('data:')}/></span>
                  <span>
                    {p.badge && <em>{p.badge}</em>}
                    <b>{p.name}</b>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="pm-catalog-empty">
              <b>Muy pronto en la tienda</b>
              <p>Estamos cargando esta línea. Mientras tanto, un asesor te cotiza lo que necesites.</p>
              <a className="pm-btn ghost sm" href={waLink(`Hola MARWA, quiero cotizar productos de ${title.toLowerCase()}.`)} {...newTab}>Cotizar con un asesor</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Menú de la página de inicio (landing premium, 10-nov-2026):
   transparente sobre la portada; al bajar se vuelve blanco translúcido, más bajo y con sombra.
   Enlaces a las secciones de la página con el activo resaltado según la sección visible.
   En celular abre un menú a pantalla completa. */
const landingLinks: [string, string][] = [
  ['ecosistema', 'Ecosistema'],
  ['nosotros', 'Quiénes somos'],
  ['soluciones', 'Soluciones'],
  ['contacto', 'Contacto'],
];
export function PmSiteHeader() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('ecosistema');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, {rootMargin: '-45% 0px -50% 0px'});
    landingLinks.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menu]);

  return (
    <header className={`pm-header lh${scrolled ? ' is-scrolled' : ''}${menu ? ' menu-open' : ''}`}>
      <div className="pm-wrap lh-row">
        <PmLogo/>
        <nav className="lh-menu" aria-label="Principal">
          {landingLinks.map(([id, label]) => (
            <a key={id} href={`/#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined} onClick={() => setMenu(false)}>{label}</a>
          ))}
        </nav>
        <div className="lh-actions">
          <a className="lh-quote" href="https://wa.me/573102569469?text=Hola%20MARWA%2C%20quiero%20cotizar%20un%20proyecto." target="_blank" rel="noopener">Cotizar</a>
          <a className="lh-shop" href="/tienda">Ir a la tienda <Icon name="arrow"/></a>
          <button className="lh-burger" onClick={() => setMenu(!menu)} aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menu}><Icon name={menu ? 'close' : 'menu'}/></button>
        </div>
      </div>
      <div className="lh-sheet" aria-hidden={!menu}>
        <nav aria-label="Principal (celular)">
          {landingLinks.map(([id, label], i) => (
            <a key={id} href={`/#${id}`} style={{transitionDelay: `${menu ? 80 + i * 60 : 0}ms`}} onClick={() => setMenu(false)}>{label}</a>
          ))}
        </nav>
        <a className="lh-shop big" href="/tienda" onClick={() => setMenu(false)}>Ir a la tienda <Icon name="arrow"/></a>
      </div>
    </header>
  );
}

/* Pie de página negro. */
/* Footer compacto adaptado del de LUMINA: marca (logo, frase, descriptor) · 4 columnas · legales.
   En celular las columnas se pliegan (una abierta a la vez) para que no quede tan alto. */
export function PmFooter({shop = false}: {shop?: boolean}) {
  const extra = {};
  const [openCol, setOpenCol] = useState<string | null>(null);
  const cols: {title: string; links: [string, string, boolean?][]}[] = [
    {title: 'Productos', links: [...categories.map(c => [c.name, `/tienda?categoria=${c.id}`, true] as [string, string, boolean]), ['Todo el catálogo', '/tienda?vista=todos', true]]},
    {title: 'MARWA', links: [['Quiénes somos', '/#nosotros'], ['Ecosistema MARWA', '/#ecosistema'], ['Soluciones', '/#soluciones']]},
    {title: 'Soporte', links: [['Mi cuenta', '/tienda/cuenta', true], ['Seguimiento de pedidos', '/tienda/cuenta', true], ['Devoluciones y garantía', '/tienda/devoluciones', true], ['PQRS', '/tienda/pqrs', true]]},
    {title: 'Contacto', links: [['310 256 9469', 'tel:+573102569469'], ['info@marwa.com.co', 'mailto:info@marwa.com.co'], ['Av. 70 #49-39, Bogotá', '#contacto']]},
  ];
  return (
    <footer className="mf" id="contacto">
      <div className="pm-wrap mf-grid">
        <div className="mf-brand">
          <Image className="mf-logo" src="/assets/marwa-logo-oficial.png" alt="MARWA Redes y Energía" width={900} height={445}/>
          <p className="mf-quote">“Calidad que no admite fallas.”</p>
          <span className="mf-desc">Redes y energía · Colombia</span>
        </div>
        {cols.map((c, i) => {
          const open = openCol === c.title;
          return (
            <nav key={c.title} className={`mf-col${open ? ' open' : ''}`} aria-label={c.title}>
              <h2>
                <button type="button" aria-expanded={open} aria-controls={`mf-col-${i}`} onClick={() => setOpenCol(open ? null : c.title)}>
                  {c.title}<i aria-hidden="true"/>
                </button>
              </h2>
              <ul id={`mf-col-${i}`}>
                {c.links.map(([label, href, store]) => {
                  const ext = href.startsWith('http');
                  return <li key={label}><a href={href} {...(ext ? newTab : store ? extra : {})}>{label}</a></li>;
                })}
              </ul>
            </nav>
          );
        })}
      </div>
      <div className="pm-wrap mf-bottom">
        <p>© {new Date().getFullYear()} MARWA · Redes y Energía · Colombia (COP)</p>
        <ul>
          <li><a href="/tienda/terminos-y-condiciones" {...extra}>Términos y condiciones</a></li>
          <li><a href="/tienda/tratamiento-de-datos" {...extra}>Tratamiento de datos</a></li>
        </ul>
      </div>
    </footer>
  );
}

export function PmSectionTitle({children, aside}: {children: ReactNode; aside?: ReactNode}) {
  return <div className="pm-title"><h2>{children}</h2>{aside}</div>;
}
