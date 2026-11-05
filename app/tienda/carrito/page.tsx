'use client';

import Link from 'next/link';
import {detailCart, setCartQty, useCart, useProducts, useSessionUser} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {money} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {Loading, ProductCard, ProductImage, QtyStepper} from '@/components/shop/ShopUI';

const LOW_STOCK = 10;

export default function CartPage() {
  const cart = useCart();
  const products = useProducts();
  const user = useSessionUser();
  const hydrated = useHydrated();
  const {lines, subtotal, units} = detailCart(cart, products);

  if (!hydrated) return <Loading/>;

  if (!lines.length) {
    return (
      <div className="container shop-empty">
        <h2>Tu carrito está vacío</h2>
        <p>Explora el catálogo y agrega los productos para tu próximo proyecto.</p>
        <div><Link className="button primary" href="/tienda">Ir al catálogo <span>→</span></Link></div>
      </div>
    );
  }

  const inCart = new Set(lines.map(l => l.id));
  const categories = new Set(lines.map(l => l.product.category));
  const recommended = products
    .filter(p => p.visible && p.stock > 0 && !inCart.has(p.id))
    .sort((a, b) => Number(categories.has(b.category)) - Number(categories.has(a.category)))
    .slice(0, 4);
  const label = units === 1 ? 'producto' : 'productos';

  return (
    <div className="ct">
      <div className="ct-band">
        <div className="container ct-grid">
          <div className="ct-main">
            <div className="ct-card ct-title">
              <h1>Mi carrito <span>({units} {label})</span></h1>
            </div>

            <div className="ct-card">
              <ul className="ct-lines">
                {lines.map(({product: p, qty}) => (
                  <li key={p.id}>
                    <Link href={`/tienda/producto/${p.id}`} className="ct-img" tabIndex={-1} aria-hidden="true">
                      <ProductImage src={p.image} alt="" sizes="112px"/>
                      {p.stock <= LOW_STOCK && <small>Quedan {p.stock}</small>}
                    </Link>
                    <div className="ct-info">
                      <div className="ct-name">
                        <Link href={`/tienda/producto/${p.id}`}>{p.name}</Link>
                        <button type="button" className="ct-remove" onClick={() => setCartQty(p.id, 0)} aria-label={`Quitar ${p.name} del carrito`}><Icon name="trash"/></button>
                      </div>
                      <small>Ref. {p.sku} · {p.unit}</small>
                      <QtyStepper value={qty} max={p.stock} onChange={n => setCartQty(p.id, Math.max(1, n))}/>
                      {qty >= p.stock && <small className="warn">Máximo disponible: {p.stock}</small>}
                    </div>
                    <div className="ct-price">
                      <b>{money(p.price * qty)}</b>
                      {qty > 1 && <small>{money(p.price)} c/u</small>}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="ct-ship"><span>Envío</span><span>Se coordina al despachar</span></div>
            </div>
          </div>

          <aside className="ct-card ct-sum">
            <h2>Resumen de compra</h2>
            <div className="ct-sum-body">
              <dl>
                <div><dt>{units === 1 ? 'Producto' : `Productos (${units})`}</dt><dd>{money(subtotal)}</dd></div>
                <div><dt>Envío</dt><dd className="soft">Se coordina al despachar</dd></div>
                <div className="total"><dt>Total</dt><dd>{money(subtotal)}</dd></div>
              </dl>
              <p>Precios en COP, IVA incluido.</p>
              <Link className="button primary" href={user ? '/tienda/checkout' : '/tienda/ingresar?next=/tienda/checkout'}>
                {user ? `Continuar (${units})` : 'Ingresar para comprar'}
              </Link>
              <Link className="ct-more" href="/tienda">Seguir comprando</Link>
            </div>
          </aside>
        </div>
      </div>

      {recommended.length > 0 && (
        <section className="ct-reco">
          <div className="container">
            <h2>Recomendaciones para ti</h2>
            <div className="ct-reco-grid">
              {recommended.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
