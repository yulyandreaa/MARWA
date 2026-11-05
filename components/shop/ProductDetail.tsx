'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useRef, useState} from 'react';
import {categories, categoryName, type Product} from '@/data/shopSeed';
import {categoryPages} from '@/data/catalogRefs';
import {addToCart, useProducts, useSessionUser} from '@/lib/shop';
import {money} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {waLink} from '@/components/premium/SiteChrome';
import {FavoriteButton, ProductImage, QtyStepper, toast} from './ShopUI';

/**
 * Ficha de producto — estructura de anker.com/products:
 * subnavegación fija · galería + columna de compra (revisa tu selección, servicios) ·
 * barra de compra fija abajo · te puede interesar · descripción · especificaciones · preguntas.
 */
const sections = [
  {id: 'comprar', label: 'Comprar'},
  {id: 'descripcion', label: 'Descripción'},
  {id: 'especificaciones', label: 'Especificaciones'},
  {id: 'preguntas', label: 'Preguntas'},
];

export function ProductDetail({product}: {product: Product}) {
  const router = useRouter();
  const user = useSessionUser();
  const products = useProducts();
  const [qty, setQty] = useState(1);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [active, setActive] = useState('comprar');
  const [subnav, setSubnav] = useState(false);
  const page = categoryPages[product.category];
  const out = product.stock <= 0;
  const max = Math.max(1, product.stock);

  const related = useMemo(() => {
    const same = products.filter(p => p.visible && p.id !== product.id && p.category === product.category);
    const other = products.filter(p => p.visible && p.id !== product.id && p.category !== product.category && p.badge);
    return [...same, ...other].slice(0, 8);
  }, [products, product]);

  const specRows = useMemo(() => {
    const labels = Object.fromEntries(page.filters.map(f => [f.key, f.label]));
    return [
      ['Referencia', product.sku],
      ['Línea', categoryName(product.category)],
      ['Presentación', product.unit],
      ...Object.entries(product.specs ?? {}).map(([k, v]) => [labels[k] ?? k, v]),
      ['Disponibilidad', out ? 'Agotado' : product.stock <= 5 ? `Últimas ${product.stock} unidades` : 'Disponible'],
    ] as [string, string][];
  }, [product, page.filters, out]);

  /* Subnavegación: aparece al bajar y marca la sección visible. */
  useEffect(() => {
    const onScroll = () => {
      setSubnav(window.scrollY > 520);
      let current = 'comprar';
      sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 200) current = s.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    document.body.classList.add('has-buybar');
    return () => { window.removeEventListener('scroll', onScroll); document.body.classList.remove('has-buybar'); };
  }, []);

  const add = () => {
    const n = addToCart(product.id, qty);
    toast(n ? `${product.name} · ${n} en el carrito` : 'Producto agotado');
    return n;
  };
  const buy = () => { if (add()) router.push('/tienda/checkout'); };
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth'});
  };

  return (
    <div className="pp">
      <div className={`pp-subnav${subnav ? ' show' : ''}`}>
        <div className="pc-wrap">
          <b>{product.name}</b>
          <nav>{sections.map(s => <button key={s.id} className={active === s.id ? 'on' : ''} onClick={() => go(s.id)}>{s.label}</button>)}</nav>
        </div>
      </div>

      <nav className="pc-wrap pc-crumbs" aria-label="Ruta">
        <Link href="/">Inicio</Link><span>/</span><Link href="/tienda">Tienda</Link><span>/</span>
        <Link href={`/tienda?categoria=${product.category}`}>{categoryName(product.category)}</Link><span>/</span><b>{product.name}</b>
      </nav>

      <section className="pc-wrap pp-top" id="comprar">
        <Gallery product={product}/>

        <div className="pp-buy">
          {product.badge && <small className="pp-badge">{product.badge}</small>}
          <div className="pp-title"><h1>{product.name}</h1><FavoriteButton product={product}/></div>
          <p className="pp-ref">Ref. {product.sku} · {categoryName(product.category)}</p>
          <div className="pp-price"><b>{money(product.price)}</b><span>IVA incluido</span></div>

          <a className="pp-coupon" href={waLink(`Hola MARWA, tengo una pregunta sobre: ${product.name} (Ref. ${product.sku}).`)} target="_blank" rel="noopener">
            <span className="pp-ticket"><small>Asesoría</small><b>Experta</b></span>
            <span><b>¿Dudas con esta referencia?</b> Un asesor MARWA te ayuda a elegir la correcta para tu red.<u>Hablar con un asesor</u></span>
          </a>

          {!user && (
            <Link className="pp-login" href="/tienda/ingresar">
              <Icon name="user"/>
              <span>Ingresa para comprar más rápido y seguir tus pedidos.</span>
              <b>Ingresar <Icon name="chevron"/></b>
            </Link>
          )}

          <div className="pp-block">
            <button className="pp-block-title" onClick={() => go('descripcion')}>Características principales <Icon name="chevron"/></button>
            <ul className="pp-bullets">{product.features.map(f => <li key={f}>{f}</li>)}</ul>
          </div>
          <div className="pp-block">
            <button className="pp-block-title" aria-expanded={specsOpen} onClick={() => setSpecsOpen(!specsOpen)}>Especificaciones <Icon name="chevron"/></button>
            {specsOpen && <dl className="pp-mini-specs">{specRows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
          </div>

          <h3 className="pp-label">Presentación: <span>{product.unit}</span></h3>
          <div className="pp-chips"><span className="on">{product.unit}</span></div>

          <h3 className="pp-label">Cantidad</h3>
          <QtyStepper value={qty} max={max} onChange={n => setQty(Math.max(1, Math.min(max, n || 1)))}/>

          <div className="pp-bulk">
            <Icon name="truck"/>
            <p><b>Despacho a todo Colombia:</b> cuando tu pedido salga de bodega verás el número de guía en Mi cuenta. <a href={waLink(`Hola MARWA, tengo una pregunta sobre: ${product.name} (Ref. ${product.sku}).`)} target="_blank" rel="noopener">¿Necesitas ayuda? Escríbenos ›</a></p>
          </div>

          <h3 className="pp-section-title">Revisa tu selección</h3>
          <div className="pp-review">
            <div className="pp-review-item">
              <span className="pp-review-img"><ProductImage src={product.image} alt="" sizes="64px"/></span>
              <div>
                <b>{product.name}</b>
                <small>{product.unit}</small>
              </div>
              <i>×{qty}</i>
            </div>
            <p className={`pp-stock${out ? ' out' : ''}`}>
              {out ? '• Agotado por ahora' : product.stock <= 5 ? `• Últimas ${product.stock} unidades · Despacho a todo Colombia` : '• Disponible · Despacho a todo Colombia'}
            </p>
            <div className="pp-total"><b>{money(product.price * qty)}</b><span>IVA incluido</span></div>
            <div className="pp-actions">
              <button className="pm-btn ghost" disabled={out} onClick={add}>Agregar al carrito</button>
              <button className="pm-btn" disabled={out} onClick={buy}>Comprar ahora</button>
            </div>
          </div>

          <h3 className="pp-section-title">Servicios y beneficios</h3>
          <a className="pp-more" href={waLink(`Hola MARWA, tengo una pregunta sobre: ${product.name} (Ref. ${product.sku}).`)} target="_blank" rel="noopener">
            <span><Icon name="chat"/></span>Habla con un asesor <Icon name="chevron"/>
          </a>
          <ul className="pp-services">
            <li><Icon name="truck"/>Despacho a todo Colombia</li>
            <li><Icon name="shield"/>Calidad certificada RITEL · RETIE</li>
            <li><Icon name="chat"/>Asesoría experta</li>
            <li><Icon name="tools"/>Respaldo técnico MARWA</li>
            <li className="stack"><span><Icon name="card"/>Medios de pago</span><em><i>Tarjeta débito</i><i>Tarjeta crédito</i><i>PSE</i><i>Nequi</i></em></li>
            <li className="stack"><span><Icon name="pin"/>Envío</span><em><i>Transportadora nacional</i><i>Guía en Mi cuenta</i></em></li>
          </ul>
        </div>
      </section>

      {related.length > 0 && <Related items={related}/>}

      <section className="pp-overview" id="descripcion">
        <div className="pc-wrap">
          <h2 className="pc-h2">{product.name}</h2>
          <p className="pp-overview-lead">{product.description}</p>
        </div>
        <div className="pc-wrap pp-overview-banner">
          <Image src={page.hero} alt="" fill sizes="(max-width: 760px) 100vw, 1280px"/>
          <div><span>MARWA · {categoryName(product.category)}</span><b>Calidad que conecta tu proyecto</b></div>
        </div>
        <div className="pc-wrap pp-feature-grid">
          {product.features.map((f, i) => (
            <div key={f}><span>{String(i + 1).padStart(2, '0')}</span><b>{f}</b></div>
          ))}
        </div>
        <div className="pc-wrap pp-text">
          <p>Ref.: {product.sku}</p>
          <p>{product.name}</p>
          <p>{product.description}</p>
          <h4>Para qué sirve</h4>
          <p>{categories.find(c => c.id === product.category)?.description}</p>
          <h4>Asesoría MARWA</h4>
          <p>¿Tienes dudas sobre esta referencia? Un asesor MARWA te ayuda a elegir el producto correcto para tu red.</p>
        </div>
      </section>

      <section className="pc-wrap pp-specs" id="especificaciones">
        <h2 className="pp-h2">Especificaciones</h2>
        <dl>{specRows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </section>

      <section className="pc-faq" id="preguntas">
        <div className="pc-wrap">
          <h2 className="pc-h2">Preguntas frecuentes</h2>
          <FaqList items={page.faq}/>
        </div>
      </section>

      <div className="pp-bar">
        <div className="pc-wrap">
          <p><Icon name="truck"/>{out ? 'Agotado por ahora — cotízalo con un asesor.' : 'Disponible — despacho a todo Colombia.'}</p>
          <div>
            <b>{money(product.price)}</b>
            <button className="pm-btn ghost" disabled={out} onClick={add}>Agregar al carrito</button>
            <button className="pm-btn" disabled={out} onClick={buy}>Comprar ahora</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Galería: diapositivas grandes con flechas y contador, miniaturas debajo. */
function Gallery({product}: {product: Product}) {
  const page = categoryPages[product.category];
  const slides = [
    {src: product.image, product: true},
    {src: page.hero},
    {src: '/assets/marwa-digital-building.png'},
    {src: '/assets/equipo-marwa-colombia.png'},
  ];
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + slides.length) % slides.length;
    el.scrollTo({left: (el.children[n] as HTMLElement).offsetLeft, behavior: 'smooth'});
    setIndex(n);
  };
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const w = (el.children[0] as HTMLElement).offsetWidth;
    setIndex(Math.round(el.scrollLeft / w));
  };
  return (
    <div className="pp-gallery">
      <div className="pp-stage">
        <div className="pp-slides" ref={track} onScroll={onScroll}>
          {slides.map((s, i) => (
            <div key={s.src + i} className={`pp-slide${s.product ? ' product' : ''}`}>
              {s.product ? <ProductImage src={s.src} alt={product.name} sizes="(max-width: 760px) 90vw, 400px"/> : <Image src={s.src} alt="" fill sizes="(max-width: 760px) 90vw, 400px"/>}
            </div>
          ))}
        </div>
        {product.badge && <span className="pp-flag">{product.badge}</span>}
        <span className="pp-count">{index + 1}/{slides.length}</span>
        <button className="pp-nav prev" onClick={() => goTo(index - 1)} aria-label="Imagen anterior"><Icon name="chevron"/></button>
        <button className="pp-nav next" onClick={() => goTo(index + 1)} aria-label="Imagen siguiente"><Icon name="chevron"/></button>
      </div>
      <div className="pp-thumbs">
        {slides.map((s, i) => (
          <button key={s.src + i} className={i === index ? 'on' : ''} onClick={() => goTo(i)} aria-label={`Ver imagen ${i + 1}`}>
            {s.product ? <ProductImage src={s.src} alt="" sizes="56px"/> : <Image src={s.src} alt="" fill sizes="56px"/>}
          </button>
        ))}
      </div>
      <div className="pp-views"><span className="on"><Icon name="search"/>Vista general</span></div>
    </div>
  );
}

function Related({items}: {items: Product[]}) {
  const track = useRef<HTMLDivElement>(null);
  return (
    <section className="pp-related">
      <div className="pc-wrap">
        <h2 className="pp-h2">También te puede interesar</h2>
        <div className="pm-carousel">
          <div className="pp-related-row" ref={track}>
            {items.map(p => (
              <Link key={p.id} href={`/tienda/producto/${p.id}`} className="pp-related-card">
                <span className="pp-related-img"><ProductImage src={p.image} alt="" sizes="300px"/></span>
                {p.badge && <small>{p.badge}</small>}
                <b>{p.name}</b>
                <em>{money(p.price)}</em>
              </Link>
            ))}
          </div>
          <button className="pm-arrow prev" onClick={() => track.current?.scrollBy({left: -600, behavior: 'smooth'})} aria-label="Anteriores"><Icon name="chevron"/></button>
          <button className="pm-arrow next" onClick={() => track.current?.scrollBy({left: 600, behavior: 'smooth'})} aria-label="Siguientes"><Icon name="chevron"/></button>
        </div>
      </div>
    </section>
  );
}

function FaqList({items}: {items: {q: string; a: string}[]}) {
  const [open, setOpen] = useState(-1);
  return (
    <>
      {items.map((f, i) => (
        <div key={f.q} className={`pc-faq-item${open === i ? ' open' : ''}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{f.q}<Icon name="chevron"/></button>
          {open === i && <p>{f.a}</p>}
        </div>
      ))}
    </>
  );
}
