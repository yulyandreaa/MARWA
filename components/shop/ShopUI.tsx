'use client';

import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState, type FormEvent, type ReactNode} from 'react';
import {categoryName, type Product} from '@/data/shopSeed';
import {CategoryMega} from '@/components/shop/CategoryMega';
import {Icon} from '@/components/premium/Icons';
import {AccountMenu} from '@/components/shop/account/AccountMenu';
import {BuyerBell, SellerBell} from '@/components/shop/NotificationBell';
import {addToCart, isOnOffer, logout, toggleFavorite, useAddresses, useCart, useFavorites, useSessionUser} from '@/lib/shop';
import {openCart} from '@/lib/cartDrawer';
import {useHydrated} from '@/lib/persist';
import {useSettings} from '@/lib/settings';
import {WhatsAppButton} from '@/components/WhatsAppButton';
import {money} from '@/lib/format';

export function ProductImage({src, alt, sizes, quality, priority}: {src: string; alt: string; sizes: string; quality?: number; priority?: boolean}) {
  return <Image src={src} alt={alt} fill sizes={sizes} quality={quality} priority={priority} unoptimized={src.startsWith('data:')}/>;
}

export function StockTag({stock}: {stock: number}) {
  if (stock <= 0) return <span className="stock-tag out">Agotado</span>;
  if (stock <= 5) return <span className="stock-tag low">Últimas {stock} unidades</span>;
  return <span className="stock-tag ok">Disponible</span>;
}

/* ---------- toast ---------- */
let pushToast: (msg: string) => void = () => {};
export const toast = (msg: string) => pushToast(msg);
export function Toaster() {
  const [msg, setMsg] = useState<{text: string; id: number} | null>(null);
  useEffect(() => {
    pushToast = text => setMsg({text, id: Date.now()});
  }, []);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2600);
    return () => clearTimeout(t);
  }, [msg]);
  return msg ? <div key={msg.id} className="shop-toast" role="status">{msg.text}</div> : null;
}

export function AddButton({product, qty = 1, block = false}: {product: Product; qty?: number; block?: boolean}) {
  const out = product.stock <= 0;
  return (
    <button
      className={`button primary${block ? ' block' : ''}`}
      disabled={out}
      onClick={() => {
        const n = addToCart(product.id, qty);
        toast(n ? `${product.name} · ${n} en el carrito` : 'Producto agotado');
      }}
    >
      {out ? 'Agotado' : <>Agregar al carrito <span>＋</span></>}
    </button>
  );
}

export function quickAdd(product: Product, qty = 1) {
  const n = addToCart(product.id, qty);
  toast(n ? `${product.name} · ${n} en el carrito` : 'Producto agotado');
}

export function FavoriteButton({product, className = ''}: {product: Product; className?: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const user = useSessionUser();
  const saved = useFavorites(user?.email).includes(product.id);
  if (!hydrated || user?.role === 'vendedor') return null;

  const toggle = () => {
    if (!user) {
      toast('Ingresa para guardar tus favoritos');
      return router.push(`/tienda/ingresar?next=${encodeURIComponent(pathname ?? '/tienda')}`);
    }
    toast(toggleFavorite(user.email, product.id) ? 'Guardado en favoritos' : 'Quitado de favoritos');
  };
  return (
    <button
      type="button" className={`fav-btn${saved ? ' on' : ''} ${className}`} onClick={toggle} aria-pressed={saved}
      aria-label={`${saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${product.name}`} title={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      <Icon name="heart"/>
    </button>
  );
}

export function ProductCard({product}: {product: Product}) {
  const out = product.stock <= 0;
  return (
    <article className={`shop-card${out ? ' is-out' : ''}`}>
      <div className="shop-card-img">
        <Link href={`/tienda/producto/${product.id}`} tabIndex={-1} aria-hidden="true">
          <ProductImage src={product.image} alt="" sizes="(max-width: 700px) 46vw, (max-width: 1100px) 30vw, 280px"/>
        </Link>
        {product.badge && <small>{product.badge}</small>}
        <FavoriteButton product={product}/>
        <div className="card-actions">
          <Link href={`/tienda/producto/${product.id}`} aria-label={`Ver detalle de ${product.name}`} title="Ver detalle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </Link>
          <button disabled={out} onClick={() => quickAdd(product)} aria-label={`Agregar ${product.name} al carrito`} title="Agregar al carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
          </button>
        </div>
      </div>
      <div className="shop-card-body">
        <div className="shop-card-meta">
          <span>{categoryName(product.category)}</span>
          <StockTag stock={product.stock}/>
        </div>
        <h3><Link href={`/tienda/producto/${product.id}`}>{product.name}</Link></h3>
        <div className="shop-card-price">
          <b>{money(product.price)}</b>{isOnOffer(product) && <s className="old-price">{money(product.listPrice!)}</s>}
          <small>/ {product.unit}</small>
        </div>
      </div>
    </article>
  );
}

/** Wholesale list row: quantity + add without leaving the catalog. */
export function ProductRow({product}: {product: Product}) {
  const [qty, setQty] = useState(1);
  const out = product.stock <= 0;
  const max = Math.max(1, product.stock);
  return (
    <li className={`shop-row${out ? ' is-out' : ''}`}>
      <Link href={`/tienda/producto/${product.id}`} className="shop-row-img"><ProductImage src={product.image} alt="" sizes="72px"/></Link>
      <div className="shop-row-info">
        <Link href={`/tienda/producto/${product.id}`}><b>{product.name}</b></Link>
        <small>Ref. {product.sku} · {product.unit} · {categoryName(product.category)}</small>
      </div>
      <StockTag stock={product.stock}/>
      <b className="shop-row-price">{money(product.price)}</b>
      {out ? <span className="shop-row-out">Agotado</span> : (
        <div className="shop-row-buy">
          <QtyStepper value={qty} max={max} onChange={n => setQty(Math.max(1, Math.min(max, n || 1)))}/>
          <button className="add-round" onClick={() => { quickAdd(product, qty); setQty(1); }} aria-label={`Agregar ${qty} de ${product.name}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      )}
    </li>
  );
}

export function QtyStepper({value, max, onChange}: {value: number; max: number; onChange: (n: number) => void}) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Quitar uno" disabled={value <= 1}>−</button>
      <input
        type="number" min={1} max={max} value={value} aria-label="Cantidad"
        onChange={e => onChange(Number(e.target.value))}
      />
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Agregar uno" disabled={value >= max}>+</button>
    </div>
  );
}

/* ---------- header (mismo lenguaje del sitio premium) ---------- */
export function ShopHeader() {
  const cart = useCart();
  const user = useSessionUser();
  const hydrated = useHydrated();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params?.get('q') ?? '');
  const [menu, setMenu] = useState(false);
  const units = cart.reduce((s, l) => s + l.qty, 0);
  const view = params?.get('vista');
  const addresses = useAddresses(user?.email);

  useEffect(() => { setQ(params?.get('q') ?? ''); setMenu(false); }, [params]);

  const search = (e: FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/tienda?q=${encodeURIComponent(q.trim())}` : '/tienda');
  };

  const signOut = () => { logout(); router.push('/tienda'); };
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 40);
    check();
    addEventListener('scroll', check, {passive: true});
    return () => removeEventListener('scroll', check);
  }, []);
  const buyer = hydrated && user?.role === 'comprador' ? user : null;
  const guest = hydrated && !user;
  const place = addresses.find(a => a.isDefault) ?? (user?.address ? user : undefined);

  return (
    <header className={`pm-header shop-pm-header mh${guest ? ' guest' : ''}${menu ? ' menu-open' : ''}${scrolled ? ' scrolled' : ''}`}>
      <div className="pm-wrap mh-top">
        <Link href="/tienda" className="mh-logo" aria-label="Tienda MARWA, inicio">
          <Image src="/assets/marwa-logo-oficial.png" alt="MARWA Redes y Energía" width={900} height={445} priority/>
        </Link>

        {/* Escritorio ancho: Categorías, Ofertas y Novedades van en la misma fila del buscador */}
        <div className="mh-inline-cats"><CategoryMega/></div>

        <div className="mh-ship">
          {buyer && (
            <Link href="/tienda/cuenta?tab=direcciones">
              <Icon name="pin"/>
              <span>
                <b>Enviar a {place?.city || 'Colombia'}</b>
                <small>{place?.address || 'Agregar dirección'}</small>
              </span>
            </Link>
          )}
        </div>

        <form className="mh-search" onSubmit={search} role="search">
          {guest && <Icon name="search" className="mh-search-ico"/>}
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar productos, referencias o códigos…" aria-label="Buscar productos"/>
          <button aria-label="Buscar"><Icon name="search"/></button>
        </form>

        <nav className="mh-inline-nav" aria-label="Accesos">
          <Link className={view === 'ofertas' ? 'active' : ''} href="/tienda?vista=ofertas"><Icon name="tag"/>Ofertas</Link>
          <Link className={view === 'novedades' ? 'active' : ''} href="/tienda?vista=novedades"><Icon name="star"/>Novedades</Link>
        </nav>

        <div className="mh-account">
          {buyer ? (
            <>
              <AccountMenu user={buyer} onSignOut={signOut}/>
              <BuyerBell email={buyer.email} onArrive={toast}/>
              <Link className="mh-link mh-fav" href="/tienda/cuenta?tab=favoritos"><Icon name="heart"/><span>Favoritos</span></Link>
            </>
          ) : hydrated && user ? (
            <>
              <SellerBell onArrive={toast}/>
              {!pathname?.startsWith('/tienda/admin') && <Link className="mh-link" href="/tienda/admin">Panel</Link>}
              <button type="button" className="mh-link" onClick={signOut}>Salir</button>
            </>
          ) : guest ? (
            <>
              <Link className="mh-link mh-login" href="/tienda/ingresar" aria-label="Ingresar"><Icon name="login"/><span>Ingresar</span></Link>
              <Link className="mh-link mh-signup" href="/tienda/registro">Registrarme</Link>
            </>
          ) : null}
          {(buyer || (guest && units > 0)) && (
            <Link className="mh-cart" href="/tienda/carrito" aria-label={`Carrito, ${units} productos`} onClick={e => { e.preventDefault(); openCart(); }}>
              <Icon name="cart"/>
              {hydrated && units > 0 && <b>{units}</b>}
            </Link>
          )}
          <button className="pm-burger" onClick={() => setMenu(!menu)} aria-label="Menú" aria-expanded={menu}>
            <Icon name={menu ? 'close' : 'menu'}/>
          </button>
        </div>
      </div>

      <div className="mh-sub">
        <div className="pm-wrap mh-sub-in">
          <CategoryMega onNavigate={() => setMenu(false)}/>
          <nav aria-label="Principal">
            <i className="mh-sep" aria-hidden="true"/>
            <Link className={view === 'ofertas' ? 'active' : ''} href="/tienda?vista=ofertas"><Icon name="tag"/>Ofertas</Link>
            <Link className={view === 'novedades' ? 'active' : ''} href="/tienda?vista=novedades"><Icon name="star"/>Novedades</Link>
            <i aria-hidden="true"/>
            <Link href={buyer ? '/tienda/cuenta?tab=pqr' : hydrated && user ? '/tienda/admin?tab=pqr' : '/#contacto'}><Icon name="help"/>Ayuda / PQR</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function PageTitle({eyebrow, title, children}: {eyebrow: string; title: ReactNode; children?: ReactNode}) {
  return (
    <div className="shop-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export function Loading() {
  return <div className="container shop-loading" aria-busy="true">Cargando…</div>;
}

export function ShopWhatsApp({message}: {message: string}) {
  const {whatsapp} = useSettings();
  return <WhatsAppButton number={whatsapp} message={message}/>;
}

/* Tarjeta de producto MARWA (la de "Lo más vendido"): redondeada, etiqueta con ícono,
   precio con divisor y unidad, botones "Agregar" (carrito) y "Comprar →".
   `badge`: en "Lo más vendido" siempre hay etiqueta (por defecto "Más vendido"); en las categorías solo si el producto la tiene. */
export function MarwaCard({p, badge = false, fav = false, sizes = '(max-width: 760px) 70vw, 300px'}: {p: Product; badge?: boolean; fav?: boolean; sizes?: string}) {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);
  const href = `/tienda/producto/${p.id}`;
  const out = p.stock <= 0;
  const isNew = p.badge === 'Nuevo';
  const label = badge ? (isNew ? 'Nuevo' : 'Más vendido') : (p.badge ?? '');
  const unit = p.unit.charAt(0).toUpperCase() + p.unit.slice(1);
  return (
    <article className="lx-best-card">
      <a href={href} className="lx-best-img" tabIndex={-1} aria-hidden="true">
        <ProductImage src={p.image} alt="" sizes={sizes}/>
      </a>
      {fav && <FavoriteButton product={p} className="lx-best-fav"/>}
      {label && (
        <small className={`lx-best-tag ${tagTone(label)}`}>
          <TagIcon label={label}/>
          {label}
        </small>
      )}
      <h3><a href={href}>{p.name}</a></h3>
      <p>{p.description}</p>
      <div className="lx-best-price"><b>{money(p.price)}</b>{isOnOffer(p) && <s>{money(p.listPrice!)}</s>}<i aria-hidden="true"/><span>{unit}</span></div>
      <div className="lx-best-actions">
        <button type="button" className="lx-best-add" disabled={out} title={out ? 'Agotado' : 'Agregar al carrito'} aria-label={out ? 'Agotado' : added ? 'Agregado al carrito' : `Agregar ${p.name} al carrito`} onClick={() => { if (addToCart(p.id, 1)) setAdded(true); }}>
          <Icon name="cart"/>{out ? 'Agotado' : added ? 'Agregado' : 'Agregar'}
        </button>
        <a className="lx-best-buy" href={href}>Comprar <Icon name="arrow"/></a>
      </div>
    </article>
  );
}

/* Etiquetas suaves (fondo con opacidad, texto e ícono del color): rojo para venta/recomendación, azul para lo nuevo. */
const tagTone = (label: string) => (label === 'Nuevo' ? 'is-blue' : 'is-red');
function TagIcon({label}: {label: string}) {
  if (label === 'Nuevo') return <Icon name="box"/>;
  if (label === 'Profesional' || label === 'Destacado') return <Icon name="star"/>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M12 22c4 0 7-2.7 7-6.6 0-3.1-2-5.6-3.6-7.2-.3 1.6-1.2 2.8-2.4 3.4.3-3.3-1.3-6.4-4-8.6.1 3-1.3 5-2.8 6.8C4.9 11.4 5 13.4 5 15.4 5 19.3 8 22 12 22Z"/></svg>;
}
