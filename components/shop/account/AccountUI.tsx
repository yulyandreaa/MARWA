'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useRef, useState, type ReactNode} from 'react';
import {reorder, useProducts, type Order} from '@/lib/shop';
import {money} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {toast} from '@/components/shop/ShopUI';

export const units = (o: Order) => o.items.reduce((s, i) => s + i.qty, 0);

export function SectionHead({title, text, action}: {title: string; text?: ReactNode; action?: ReactNode}) {
  return (
    <header className="pa-head">
      <div>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {action}
    </header>
  );
}

export function EmptyState({icon, title, text, action}: {icon: string; title: string; text: string; action?: ReactNode}) {
  return (
    <div className="pa-empty">
      <Icon name={icon}/>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

/** Modal nativo: atrapa el foco y cierra con Esc. */
export function Dialog({title, children, actions, onClose}: {title: string; children: ReactNode; actions: ReactNode; onClose: () => void}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
    el?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  }, []);
  return (
    <dialog ref={ref} className="pa-dialog" aria-labelledby="pa-dialog-title" onClose={onClose}>
      <h2 id="pa-dialog-title">{title}</h2>
      <div className="pa-dialog-body">{children}</div>
      <div className="pa-actions">{actions}</div>
    </dialog>
  );
}

/** Revisa stock y precios actuales antes de volver a llenar el carrito. */
export function ReorderDialog({order, onClose}: {order: Order; onClose: () => void}) {
  const router = useRouter();
  const products = useProducts();
  const [busy, setBusy] = useState(false);
  const lines = order.items.map(item => {
    const product = products.find(p => p.id === item.id);
    const stock = product?.visible ? product.stock : 0;
    return {item, price: product?.price ?? item.price, stock, qty: Math.min(item.qty, stock)};
  });
  const available = lines.filter(l => l.qty > 0);
  const total = available.reduce((s, l) => s + l.price * l.qty, 0);

  const confirm = () => {
    setBusy(true);
    const {added} = reorder(order);
    toast(added ? `${added} ${added === 1 ? 'producto agregado' : 'productos agregados'} al carrito` : 'No se pudo agregar ningún producto');
    router.push('/tienda/carrito');
  };

  return (
    <Dialog
      title={`Volver a comprar ${order.id}`}
      onClose={onClose}
      actions={<>
        <button type="button" className="button primary" disabled={!available.length || busy} onClick={confirm}>{busy ? 'Agregando…' : 'Agregar al carrito'}</button>
        <button type="button" className="button ghost" onClick={onClose}>Cancelar</button>
      </>}
    >
      <p>Revisamos disponibilidad y precios de hoy.</p>
      <ul className="pa-check-list">
        {lines.map(({item, price, stock, qty}) => (
          <li key={item.id}>
            <div>
              <b>{item.name}</b>
              {stock <= 0 && <small className="warn">No disponible, no se agregará</small>}
              {stock > 0 && qty < item.qty && <small className="warn">Solo hay {stock} de {item.qty} {item.unit}</small>}
              {stock > 0 && price !== item.price && <small className="warn">Precio cambió: antes {money(item.price)}</small>}
            </div>
            {qty > 0 && <span>{qty} × {money(price)}</span>}
          </li>
        ))}
      </ul>
      {available.length > 0 && <p className="pa-dialog-total">Total estimado <b>{money(total)}</b></p>}
    </Dialog>
  );
}
