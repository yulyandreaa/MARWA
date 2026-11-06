'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useMemo, useState, type ReactNode} from 'react';
import {categories, type CategoryId, type Product} from '@/data/shopSeed';
import {useProducts} from '@/lib/shop';
import {Icon} from './Icons';

export const WA = 'https://wa.me/573102569469';
export const waLink = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;
const newTab = {target: '_blank', rel: 'noopener'} as const;

/* Barra de anuncio negra. */
export function PmAnnouncement({shop = false}: {shop?: boolean}) {
  if (shop) {
    return (
      <div className="pm-announce mh-bar">
        <div className="pm-wrap">
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
        <p>Compra en línea con despacho a todo Colombia. <a href="/tienda" {...newTab}>Ir a la tienda &gt;&gt;</a></p>
      </div>
    </div>
  );
}

export function PmLogo({href = '/'}: {href?: string}) {
  return (
    <Link href={href} className="pm-logo" aria-label="MARWA Redes y Energía — inicio">
      <Image src="/assets/marwa-hex-logo.svg" alt="MARWA Redes y Energía" width={261} height={290} priority/>
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

/* Encabezado del sitio: logo · Inicio / Quiénes somos / Catálogo · botón Ir a la tienda. */
export function PmSiteHeader() {
  const [menu, setMenu] = useState(false);

  return (
    <header className={`pm-header${menu ? ' menu-open' : ''}`}>
      <div className="pm-wrap pm-header-row">
        <PmLogo/>
        <nav className="pm-menu" aria-label="Principal">
          <a href="/#inicio" onClick={() => setMenu(false)}>Inicio</a>
          <a href="/#nosotros" onClick={() => setMenu(false)}>Quiénes somos</a>
          <CatalogMenu newTab onNavigate={() => setMenu(false)}/>
        </nav>
        <div className="pm-icons">
          <a className="pm-btn pm-shop-btn" href="/tienda" {...newTab}>Ir a la tienda</a>
          <button className="pm-burger" onClick={() => setMenu(!menu)} aria-label="Menú" aria-expanded={menu}><Icon name={menu ? 'close' : 'menu'}/></button>
        </div>
      </div>
    </header>
  );
}

/* Pie de página negro. */
export function PmFooter({shop = false}: {shop?: boolean}) {
  const extra = shop ? {} : newTab;
  const trust: [string, string][] = [['truck', 'Despacho a todo Colombia'], ['shield', 'Calidad certificada RITEL · RETIE'], ['card', 'Pago seguro'], ['chat', 'Asesoría experta']];
  const cols: {title: string; links: [string, string, boolean?][]}[] = [
    {title: 'Productos', links: [...categories.map(c => [c.name, `/tienda?categoria=${c.id}`, true] as [string, string, boolean]), ['Todo el catálogo', '/tienda?vista=todos', true]]},
    {title: 'MARWA', links: [['Quiénes somos', '/#nosotros'], ['Ecosistema MARWA', '/#ecosistema'], ['Soluciones', '/#soluciones']]},
    {title: 'Soporte', links: [['Mi cuenta', '/tienda/cuenta', true], ['Seguimiento de pedidos', '/tienda/cuenta', true], ['Devoluciones y garantía', '/#contacto'], ['PQRS', '/#contacto']]},
  ];
  return (
    <div className="pm-footer" id="contacto">
      <div className="pm-wrap">
        <div className="pm-footer-trust">
          <b>Compra en la tienda MARWA</b>
          <ul>{trust.map(([i, t]) => <li key={t}><Icon name={i}/>{t}</li>)}</ul>
        </div>
        <div className="pm-footer-cols">
          {cols.map(c => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              {c.links.map(([label, href, store]) => {
                const ext = href.startsWith('http');
                return <a key={label} href={href} {...(ext ? newTab : store ? extra : {})}>{label}</a>;
              })}
            </div>
          ))}
          <div>
            <h3>Contacto</h3>
            <p><Icon name="phone"/><span>Línea de ventas<br/><a href="tel:+573102569469">310 256 9469</a></span></p>
            <p><Icon name="mail"/><span>Escríbenos<br/><a href="mailto:info@marwa.com.co">info@marwa.com.co</a></span></p>
            <p><Icon name="pin"/><span>Nuestra sede<br/>Av. 70 #49-39, Bogotá</span></p>
          </div>
        </div>
        <div className="pm-footer-brands">
          <strong>MARWA</strong>
          {categories.map(c => <span key={c.id}>{c.name}</span>)}
          <em>Colombia / Español</em>
        </div>
        <div className="pm-footer-legal">
          <span>© 2026 MARWA · Redes y Energía. Todos los derechos reservados.</span>
          <a href="#">Tratamiento de datos</a>
          <a href="#">Privacidad</a>
          <a href="#">Términos y condiciones</a>
        </div>
      </div>
    </div>
  );
}

export function PmSectionTitle({children, aside}: {children: ReactNode; aside?: ReactNode}) {
  return <div className="pm-title"><h2>{children}</h2>{aside}</div>;
}
