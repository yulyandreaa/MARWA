'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {paymentLabel, statusLabel, useProducts, type Order, type OrderStatus} from '@/lib/shop';
import {categories} from '@/data/shopSeed';
import {date, dateTime, money} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {ProductImage} from '@/components/shop/ShopUI';
import {OrderTimeline} from '@/components/shop/OrderTimeline';
import {EmptyState, ReorderDialog, SectionHead, units} from './AccountUI';

const catalogLink = <Link className="button primary" href="/tienda?vista=todos">Ir al catálogo</Link>;

const statusIcon: Record<OrderStatus, string> = {
  pendiente: 'clock', pagado: 'check', preparando: 'box', enviado: 'truck', entregado: 'check', cancelado: 'close',
};
function StatusBadge({status}: {status: OrderStatus}) {
  return <span className={`pill pill-${status} pa-status`}><Icon name={statusIcon[status]}/>{statusLabel[status]}</span>;
}

export function AccountOrders({orders, orderId}: {orders: Order[]; orderId?: string | null}) {
  const [query, setQuery] = useState('');
  const [days, setDays] = useState('');
  const [category, setCategory] = useState('');
  const products = useProducts();
  const [buying, setBuying] = useState<Order | null>(null);

  if (orderId) return <OrderDetail order={orders.find(o => o.id === orderId)} id={orderId}/>;

  const term = query.trim().toLowerCase();
  const matches = (o: Order) => !term || [o.id, ...o.items.flatMap(i => [i.name, i.sku])].some(t => t.toLowerCase().includes(term));
  const inDates = (o: Order) => !days || Date.now() - new Date(o.createdAt).getTime() <= Number(days) * 864e5;
  const inCategory = (o: Order) => !category || o.items.some(i => products.find(p => p.id === i.id)?.category === category);
  const shown = orders
    .filter(o => matches(o) && inDates(o) && inCategory(o))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const clear = () => { setQuery(''); setDays(''); setCategory(''); };

  return (
    <>
      <SectionHead title="Mis compras"/>
      {!orders.length ? (
        <section className="pa-section">
          <EmptyState icon="cart" title="Aún no tienes compras" text="Explora el catálogo y haz tu primer pedido." action={catalogLink}/>
        </section>
      ) : (
        <>
          <div className="pa-tools" role="search">
            <label className="pa-search">
              <Icon name="search"/>
              <span className="au-sr">Buscar en mis compras</span>
              <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Busca por compra, producto o referencia…"/>
            </label>
            <label className="pa-plain-select">
              <span className="au-sr">Fecha de compra</span>
              <select value={days} onChange={e => setDays(e.target.value)}>
                <option value="">Fecha de compra</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 3 meses</option>
                <option value="365">Último año</option>
              </select>
            </label>
            <label className="pa-plain-select">
              <span className="au-sr">Categorías</span>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Categorías</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>

          <p className="au-sr" role="status">{shown.length} {shown.length === 1 ? 'compra' : 'compras'}</p>
          {shown.length ? (
            <ul className="pa-buys">
              {shown.map(o => <PurchaseRow key={o.id} order={o} onBuy={() => setBuying(o)}/>)}
            </ul>
          ) : (
            <section className="pa-section">
              <EmptyState icon="cart" title="Ninguna compra coincide" text="Prueba con otra búsqueda o quita los filtros." action={<button type="button" className="button ghost" onClick={clear}>Limpiar filtros</button>}/>
            </section>
          )}
        </>
      )}
      {buying && <ReorderDialog order={buying} onClose={() => setBuying(null)}/>}
    </>
  );
}

function PurchaseRow({order, onBuy}: {order: Order; onBuy: () => void}) {
  const first = order.items[0];
  const others = order.items.length - 1;
  const href = `/tienda/cuenta?tab=pedidos&pedido=${order.id}`;
  return (
    <li className="pa-buy">
      <span className="pa-buy-img"><ProductImage src={first.image} alt="" sizes="80px"/></span>
      <div className="pa-buy-info">
        <h2><Link href={href}>{first.name}{others > 0 && ` y ${others} ${others === 1 ? 'producto' : 'productos'} más`}</Link></h2>
        <p>Comprado el {date(order.createdAt)} | {money(order.total)} | {statusLabel[order.status]}</p>
      </div>
      <div className="pa-buy-actions">
        <button type="button" className="pa-text-btn" onClick={onBuy}>Volver a comprar<span className="au-sr"> {order.id}</span></button>
        <Link className="pa-buy-detail" href={href}>Ver detalle<span className="au-sr"> de {order.id}</span></Link>
      </div>
    </li>
  );
}

function OrderDetail({order, id}: {order?: Order; id: string}) {
  const [buying, setBuying] = useState(false);
  const back = <Link className="pa-back" href="/tienda/cuenta?tab=pedidos"><Icon name="chevron"/> Volver a mis compras</Link>;

  if (!order) {
    return (
      <>
        {back}
        <section className="pa-section">
          <EmptyState icon="box" title={`No encontramos el pedido ${id}`} text="Revisa el número o búscalo en tu lista de compras."/>
        </section>
      </>
    );
  }

  const c = order.customer;
  return (
    <>
      {back}
      <SectionHead
        title={`Pedido ${order.id}`}
        text={<>{date(order.createdAt)} · {units(order)} {units(order) === 1 ? 'producto' : 'productos'}</>}
        action={<div className="pa-head-actions"><StatusBadge status={order.status}/><button type="button" className="button primary" onClick={() => setBuying(true)}><Icon name="repeat"/> Volver a comprar</button></div>}
      />

      <section className="pa-section" aria-labelledby="pa-seguimiento">
        <h2 id="pa-seguimiento">Seguimiento</h2>
        <OrderTimeline order={order}/>
      </section>

      <section className="pa-section" aria-labelledby="pa-productos">
        <h2 id="pa-productos">Productos</h2>
        <ul className="pa-items">
          {order.items.map(i => (
            <li key={i.id}>
              <span className="pa-thumb"><Image src={i.image} alt="" fill sizes="56px" unoptimized={i.image.startsWith('data:')}/></span>
              <div><Link href={`/tienda/producto/${i.id}`}>{i.name}</Link><small>Ref. {i.sku}</small></div>
              <span>{i.qty} × {money(i.price)}</span>
              <b>{money(i.price * i.qty)}</b>
            </li>
          ))}
        </ul>
        <dl className="pa-totals">
          <div><dt>Subtotal</dt><dd>{money(order.total)}</dd></div>
          <div><dt>Envío</dt><dd>Se coordina al despachar</dd></div>
          <div className="total"><dt>Total pagado</dt><dd>{money(order.total)}</dd></div>
        </dl>
      </section>

      <div className="pa-duo">
        <section className="pa-section" aria-labelledby="pa-entrega">
          <h2 id="pa-entrega">Dirección de entrega</h2>
          <address>
            <b>{c.name}</b>
            {c.address}<br/>
            {c.city}, {c.department}<br/>
            {c.phone}
          </address>
          {order.notes && <p className="pa-note">{order.notes}</p>}
        </section>
        <section className="pa-section" aria-labelledby="pa-pago">
          <h2 id="pa-pago">Pago</h2>
          <dl className="pa-facts">
            <div><dt>Medio de pago</dt><dd>{paymentLabel[order.payment.method]}</dd></div>
            <div><dt>Referencia</dt><dd>{order.payment.reference}</dd></div>
            <div><dt>Fecha</dt><dd>{dateTime(order.createdAt)}</dd></div>
            {order.tracking && <div><dt>Guía de envío</dt><dd>{order.tracking}</dd></div>}
          </dl>
        </section>
      </div>

      {buying && <ReorderDialog order={order} onClose={() => setBuying(false)}/>}
    </>
  );
}
