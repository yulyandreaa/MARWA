'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useRef, useState, type MouseEvent} from 'react';
import {categories, categoryName, type Product} from '@/data/shopSeed';
import {categoryPages} from '@/data/catalogRefs';
import {addToCart, isOnOffer, useProducts, useSessionUser} from '@/lib/shop';
import {useReviews} from '@/lib/reviews';
import {date, fileSize, money, openFile, priceText} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {waLink} from '@/components/premium/SiteChrome';
import {Stars} from './Stars';
import {FavoriteButton, ProductImage, QtyStepper, toast} from './ShopUI';

/**
 * Ficha de producto con la estructura de Mercado Libre:
 * tarjeta blanca con tres columnas — galería | información del producto | caja de compra —
 * y debajo características, descripción, opiniones y preguntas.
 */
export function ProductDetail({product}: {product: Product}) {
  const router = useRouter();
  const user = useSessionUser();
  const products = useProducts();
  const reviews = useReviews().filter(r => r.productId === product.id && r.visible);
  const [qty, setQty] = useState(1);
  const [payOpen, setPayOpen] = useState(false);
  const [active, setActive] = useState('descripcion');
  const [subnav, setSubnav] = useState(false);
  const [bar, setBar] = useState(false);
  const top = useRef<HTMLElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const page = categoryPages[product.category];
  /* Precio 0 = precio por confirmar: no se vende en línea, se cotiza con un asesor. */
  const pending = product.price <= 0;
  const out = pending || product.stock <= 0;
  const low = !out && product.stock <= 5;
  const max = Math.max(1, product.stock);
  const offer = isOnOffer(product);
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const ask = waLink(`Hola MARWA, tengo una pregunta sobre: ${product.name} (Ref. ${product.sku}).`);

  const sections = [
    {id: 'descripcion', label: 'Descripción'},
    {id: 'caracteristicas', label: 'Características'},
    ...(reviews.length ? [{id: 'opiniones', label: `Opiniones (${reviews.length})`}] : []),
    {id: 'preguntas', label: 'Preguntas'},
  ];

  const related = useMemo(() => {
    const same = products.filter(p => p.visible && p.id !== product.id && p.category === product.category);
    const other = products.filter(p => p.visible && p.id !== product.id && p.category !== product.category && p.badge);
    return [...same, ...other].slice(0, 8);
  }, [products, product]);

  const labels = useMemo(() => Object.fromEntries(page.filters.map(f => [f.key, f.label])), [page.filters]);
  /* Atributos del producto sin repetir etiquetas (la presentación se toma de `unit`). */
  const attributes = useMemo(() => {
    const rows = [
      ...Object.entries(product.specs ?? {}).filter(([k]) => k !== 'presentacion').map(([k, v]) => [k === 'tipo' ? 'Tipo' : labels[k] ?? k, v]),
      ['Presentación', product.unit],
    ] as [string, string][];
    return rows.filter(([k, v], i) => v && rows.findIndex(r => r[0] === k) === i);
  }, [product, labels]);
  const specRows: [string, string][] = [
    ['Referencia', product.sku],
    ['Línea', categoryName(product.category)],
    ...attributes,
    ['Disponibilidad', pending ? 'Por cotizar' : out ? 'Agotado' : low ? `Últimas ${product.stock} unidades` : 'Disponible'],
  ];
  /* "Lo que tienes que saber": datos clave + características, como en Mercado Libre. */
  const mentioned = (v: string) => product.features.some(f => f.toLowerCase().includes(v.toLowerCase()));
  const know = [
    ...attributes.filter(([k, v]) => k !== 'Presentación' && !mentioned(v)).slice(0, 3).map(([k, v]) => `${k}: ${v}`),
    ...product.features,
  ].slice(0, 6);

  /* Pestañas fijas: aparecen al pasar la tarjeta de compra y marcan la sección visible. */
  useEffect(() => {
    const onScroll = () => {
      const el = top.current;
      setSubnav(!!el && el.getBoundingClientRect().bottom < 140);
      let current = 'descripcion';
      document.querySelectorAll<HTMLElement>('[data-pp-section]').forEach(s => {
        if (s.getBoundingClientRect().top < 220) current = s.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Barra de compra inferior (solo celular): cuando los botones quedan fuera de la vista. */
  useEffect(() => {
    const el = cta.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
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
          <nav aria-label="Secciones del producto">
            {sections.map(s => <button key={s.id} className={active === s.id ? 'on' : ''} onClick={() => go(s.id)}>{s.label}</button>)}
          </nav>
        </div>
      </div>

      <nav className="pc-wrap pc-crumbs" aria-label="Ruta">
        <Link href="/">Inicio</Link><span>/</span><Link href="/tienda">Tienda</Link><span>/</span>
        <Link href={`/tienda?categoria=${product.category}`}>{categoryName(product.category)}</Link><span>/</span><b>{product.name}</b>
      </nav>

      <section className="pc-wrap pp-card pp-top" ref={top}>
        <Gallery product={product}/>

        {/* columna central: información */}
        <div className="pp-info">
          <div className="pp-meta">
            <span>Nuevo | Ref. {product.sku}</span>
            <FavoriteButton product={product}/>
          </div>
          <p className="pp-tags">
            {product.badge && <em>{product.badge}</em>}
            <Link href={`/tienda?categoria=${product.category}`}>{product.specs?.tipo ?? categoryName(product.category)} {product.specs?.Marca ?? 'MARWA'}</Link>
          </p>
          <h1>{product.name}</h1>
          {reviews.length > 0 && (
            <button className="pp-rating" onClick={() => go('opiniones')}>{average.toFixed(1)} <Stars value={average}/> ({reviews.length})</button>
          )}

          <div className={`pp-price${pending ? ' is-pending' : ''}`}>
            {offer && <s>{money(product.listPrice!)}</s>}
            <p><b>{priceText(product.price)}</b>{offer && <em>{Math.round((1 - product.price / product.listPrice!) * 100)}% OFF</em>}</p>
            <small>{pending ? 'Escríbenos y un asesor te cotiza' : 'IVA incluido'}</small>
          </div>
          {!pending && <button className="pp-link" aria-expanded={payOpen} onClick={() => setPayOpen(o => !o)}>Ver los medios de pago</button>}
          {payOpen && (
            <ul className="pp-pay">
              <li>PSE</li><li>Nequi</li><li>Tarjeta débito</li><li>Tarjeta crédito</li>
            </ul>
          )}

          <div className="pp-variant">
            <p>Presentación: <b>{product.unit}</b></p>
            <div className="pp-chips"><span className="on">{product.unit}</span></div>
          </div>

          <h2 className="pp-know-title">Lo que tienes que saber de este producto</h2>
          <ul className="pp-know">{know.map(k => <li key={k}>{k}</li>)}</ul>
          <button className="pp-link" onClick={() => go('caracteristicas')}>Ver características</button>
        </div>

        {/* columna derecha: compra */}
        <aside className="pp-side">
          <div className="pp-box">
            <p className="pp-ship"><b><Icon name="truck"/>Envío a todo Colombia</b><span>Despachamos desde nuestra bodega y ves la guía en Mi cuenta.</span></p>

            <p className={`pp-stock${pending ? ' pending' : out ? ' out' : ''}`}>
              <b>{pending ? 'Precio por confirmar' : out ? 'Sin stock por ahora' : 'Stock disponible'}</b>
              {pending && <span>Un asesor te cotiza este producto.</span>}
              {low && <span>¡Últimas {product.stock} unidades!</span>}
            </p>

            {!out && (
              <div className="pp-qty">
                <span>Cantidad:</span>
                <QtyStepper value={qty} max={max} onChange={n => setQty(Math.max(1, Math.min(max, n || 1)))}/>
                <small>({product.stock} disponibles)</small>
              </div>
            )}

            <div className="pp-actions" ref={cta}>
              {out ? (
                <a className="pm-btn" href={ask} target="_blank" rel="noopener">Cotizar con un asesor</a>
              ) : (
                <>
                  <button className="pm-btn" onClick={buy}>Comprar ahora</button>
                  <button className="pm-btn soft" onClick={add}>Agregar al carrito</button>
                </>
              )}
            </div>

            <div className="pp-seller">
              <span className="pp-seller-logo"><Image src="/assets/marwa-hex-logo.svg" alt="" width={30} height={30}/></span>
              <p><span>Tienda oficial <b>MARWA</b> <Icon name="check"/></span><small>Redes y energía · Colombia</small></p>
            </div>

            <ul className="pp-perks">
              <li><Icon name="shield"/><span><b>Compra protegida.</b> Si hay un problema con tu pedido, te respondemos por PQR.</span></li>
              <li><Icon name="tools"/><span><b>Respaldo técnico MARWA.</b> Calidad certificada RITEL · RETIE.</span></li>
            </ul>
          </div>

          <div className="pp-box">
            <DatasheetCard product={product}/>
            <a className="pp-advisor" href={ask} target="_blank" rel="noopener">
              <Icon name="chat"/><span><b>¿Dudas con esta referencia?</b>Habla con un asesor MARWA</span><Icon name="chevron"/>
            </a>
            {!user && <p className="pp-login"><Link href="/tienda/ingresar">Ingresa</Link> para comprar más rápido y seguir tus pedidos.</p>}
          </div>
        </aside>
      </section>

      <section className="pc-wrap pp-card pp-block">
        <div id="descripcion" data-pp-section className="pp-desc">
          <h2 className="pp-h2">Descripción</h2>
          <p>{product.description}</p>
          <p>{categories.find(c => c.id === product.category)?.description}</p>
          <ul>{product.features.map(f => <li key={f}>{f}</li>)}</ul>
        </div>

        <hr/>

        <div id="caracteristicas" data-pp-section className="pp-specs">
          <h2 className="pp-h2">Características del producto</h2>
          <div className="pp-spec-grid">
            <table className="pp-spec-table">
              <tbody>{specRows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
            </table>
            <aside className="pp-docs">
              <h3>Documentos</h3>
              <DatasheetCard product={product} large/>
              <p>¿Necesitas certificados, planos o una cotización por volumen? <a href={ask} target="_blank" rel="noopener">Escríbenos</a></p>
            </aside>
          </div>
        </div>

        {reviews.length > 0 && (
          <>
            <hr/>
            <div className="pp-reviews" id="opiniones" data-pp-section aria-labelledby="pp-opiniones">
              <h2 className="pp-h2" id="pp-opiniones">Opiniones del producto</h2>
              <p className="pp-reviews-avg"><b>{average.toFixed(1)}</b><Stars value={average}/><span>{reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'} de compras verificadas</span></p>
              <ul>
                {reviews.map(r => (
                  <li key={r.id}>
                    <Stars value={r.rating}/>
                    {r.text && <p>{r.text}</p>}
                    <small>{r.name.split(' ')[0]} | {date(r.at)}</small>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <hr/>

        <div id="preguntas" data-pp-section className="pp-faq">
          <h2 className="pp-h2">Preguntas frecuentes</h2>
          <FaqList items={page.faq}/>
          <a className="pp-link" href={ask} target="_blank" rel="noopener">¿No encuentras tu respuesta? Pregúntale a un asesor</a>
        </div>
      </section>

      {related.length > 0 && <Related items={related}/>}

      <div className={`pp-bar${bar ? ' show' : ''}`} aria-hidden={!bar}>
        <div className="pc-wrap">
          <b>{pending ? priceText(0) : money(product.price * qty)}</b>
          <button className="pm-btn soft" disabled={out} onClick={add} tabIndex={bar ? 0 : -1}>Agregar al carrito</button>
          <button className="pm-btn" disabled={out} onClick={buy} tabIndex={bar ? 0 : -1}>Comprar ahora</button>
        </div>
      </div>
    </div>
  );
}

/* Ficha técnica: ver o descargar el PDF; si no hay, se pide a un asesor. */
function DatasheetCard({product, large = false}: {product: Product; large?: boolean}) {
  const sheet = product.datasheet;
  if (!sheet) {
    return (
      <a className={`pp-sheet empty${large ? ' large' : ''}`} href={waLink(`Hola MARWA, ¿me pueden enviar la ficha técnica de ${product.name} (Ref. ${product.sku})?`)} target="_blank" rel="noopener">
        <span className="pp-sheet-ico"><Icon name="file"/></span>
        <span className="pp-sheet-text"><b>Ficha técnica</b><small>Solicítala a un asesor MARWA</small></span>
        <Icon name="chevron"/>
      </a>
    );
  }
  return (
    <div className={`pp-sheet${large ? ' large' : ''}`}>
      <span className="pp-sheet-ico"><Icon name="file"/><em>PDF</em></span>
      <span className="pp-sheet-text"><b>Ficha técnica</b><small>{large ? sheet.name : 'PDF'}{sheet.size ? ` · ${fileSize(sheet.size)}` : ''}</small></span>
      <span className="pp-sheet-actions">
        <button type="button" onClick={() => openFile(sheet.url)}>Ver</button>
        <a href={sheet.url} download={sheet.name}><Icon name="download"/>Descargar</a>
      </span>
    </div>
  );
}

/* Galería: miniaturas en columna (cambian al pasar el mouse) + imagen grande con zoom al clic. */
function Gallery({product}: {product: Product}) {
  const slides = [product.image, ...(product.gallery ?? [])].filter(Boolean);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const many = slides.length > 1;

  const goTo = (i: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    const n = (i + slides.length) % slides.length;
    el.scrollTo({left: (el.children[n] as HTMLElement).offsetLeft, behavior: smooth ? 'smooth' : 'auto'});
    setIndex(n);
    setZoom(false);
  };
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const pan = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className={`pp-gallery${many ? '' : ' single'}`}>
      {many && (
        <div className="pp-thumbs" role="tablist" aria-label="Fotos del producto">
          {slides.map((src, i) => (
            <button
              key={src + i} role="tab" aria-selected={i === index} className={i === index ? 'on' : ''}
              onClick={() => goTo(i)} onMouseEnter={() => goTo(i, false)} aria-label={`Ver foto ${i + 1}`}
            >
              <ProductImage src={src} alt="" sizes="80px" quality={85}/>
            </button>
          ))}
        </div>
      )}
      <div className={`pp-stage${zoom ? ' zoom' : ''}`} onMouseMove={pan} onMouseLeave={() => setZoom(false)}>
        <div className="pp-slides" ref={track} onScroll={onScroll}>
          {slides.map((src, i) => (
            <div key={src + i} className={`pp-slide${i === index ? ' on' : ''}`} onClick={() => setZoom(z => !z)}>
              <ProductImage src={src} alt={`${product.name} — foto ${i + 1}`} sizes="(max-width: 860px) 100vw, 560px" quality={92} priority={i === 0}/>
            </div>
          ))}
        </div>
        {many && <span className="pp-count">{index + 1} / {slides.length}</span>}
        {many && <>
          <button className="pp-nav prev" onClick={() => goTo(index - 1)} aria-label="Foto anterior"><Icon name="chevron"/></button>
          <button className="pp-nav next" onClick={() => goTo(index + 1)} aria-label="Foto siguiente"><Icon name="chevron"/></button>
        </>}
      </div>
    </div>
  );
}

function Related({items}: {items: Product[]}) {
  const track = useRef<HTMLDivElement>(null);
  return (
    <section className="pc-wrap pp-card pp-related">
      <h2 className="pp-h2">Productos relacionados</h2>
      <div className="pm-carousel">
        <div className="pp-related-row" ref={track}>
          {items.map(p => (
            <Link key={p.id} href={`/tienda/producto/${p.id}`} className="pp-related-card">
              <span className="pp-related-img"><ProductImage src={p.image} alt="" sizes="220px"/></span>
              <b>{p.name}</b>
              <em>{priceText(p.price)}</em>
              {p.badge && <small>{p.badge}</small>}
            </Link>
          ))}
        </div>
        <button className="pm-arrow prev" onClick={() => track.current?.scrollBy({left: -600, behavior: 'smooth'})} aria-label="Anteriores"><Icon name="chevron"/></button>
        <button className="pm-arrow next" onClick={() => track.current?.scrollBy({left: 600, behavior: 'smooth'})} aria-label="Siguientes"><Icon name="chevron"/></button>
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
