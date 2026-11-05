'use client';

import Link from 'next/link';
import {useEffect, useRef, useState, type MouseEvent} from 'react';
import {onCartOpen} from '@/lib/cartDrawer';
import {detailCart, setCartQty, useCart, useProducts} from '@/lib/shop';
import {money} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {ProductImage, QtyStepper} from './ShopUI';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  useEffect(() => onCartOpen(() => setOpen(true)), []);
  return open ? <Panel onClose={() => setOpen(false)}/> : null;
}

function Panel({onClose}: {onClose: () => void}) {
  const ref = useRef<HTMLDialogElement>(null);
  const {lines, subtotal, units} = detailCart(useCart(), useProducts());

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, []);

  const clickOutside = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog ref={ref} className="cd" aria-labelledby="cd-title" onClose={onClose} onClick={clickOutside}>
      <div className="cd-box">
        <header className="cd-head">
          <h2 id="cd-title">Mi carrito <span>({units})</span></h2>
          <button type="button" onClick={onClose} aria-label="Cerrar carrito"><Icon name="close"/></button>
        </header>

        {!lines.length ? (
          <div className="cd-empty">
            <Icon name="cart"/>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para verlos aquí.</p>
            <Link className="button primary" href="/tienda?vista=todos" onClick={onClose}>Ir al catálogo</Link>
          </div>
        ) : (
          <>
            <ul className="cd-lines">
              {lines.map(({id, qty, product: p}) => (
                <li key={id}>
                  <Link className="cd-img" href={`/tienda/producto/${id}`} onClick={onClose} tabIndex={-1} aria-hidden="true">
                    <ProductImage src={p.image} alt="" sizes="120px"/>
                  </Link>
                  <div className="cd-info">
                    <Link className="cd-name" href={`/tienda/producto/${id}`} onClick={onClose}>{p.name}</Link>
                    <small>Ref. {p.sku}</small>
                    <div className="cd-qty">
                      <QtyStepper value={qty} max={p.stock} onChange={n => setCartQty(id, Math.max(1, n || 1))}/>
                      <button type="button" className="cd-remove" onClick={() => setCartQty(id, 0)} aria-label={`Quitar ${p.name} del carrito`}><Icon name="trash"/></button>
                    </div>
                    {qty >= p.stock && <small className="cd-stock">Solo hay {p.stock} disponibles</small>}
                    <b>{money(p.price * qty)}</b>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="cd-foot">
              <dl>
                <div><dt>Envío</dt><dd>Se coordina al despachar</dd></div>
                <div className="total"><dt>Total</dt><dd>{money(subtotal)}</dd></div>
              </dl>
              <div className="cd-actions">
                <Link className="cd-details" href="/tienda/carrito" onClick={onClose}>Ver carrito</Link>
                <Link className="button primary" href="/tienda/checkout" onClick={onClose}>Ir a pagar</Link>
              </div>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
