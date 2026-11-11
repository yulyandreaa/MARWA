'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {
  canCancelOrder, canRequestReturn, cancelOrderByBuyer, cancelReasons, carriers, isDispatched, paymentLabel, requestReturn, returnLabel, returnReasons,
  statusFlow, statusLabel, useProducts, type Order, type OrderStatus,
} from '@/lib/shop';
import {categories} from '@/data/shopSeed';
import {compressPhoto, date, dateTime, money} from '@/lib/format';
import {saveReview, useReviews} from '@/lib/reviews';
import {shippingText} from '@/lib/settings';
import {Icon} from '@/components/premium/Icons';
import {ProductImage, toast} from '@/components/shop/ShopUI';
import {OrderTimeline} from '@/components/shop/OrderTimeline';
import {Dialog, EmptyState, ReorderDialog, SectionHead, units} from './AccountUI';
import {PlainSelect} from './PlainSelect';

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
  const [status, setStatus] = useState('');
  const products = useProducts();
  const [buying, setBuying] = useState<Order | null>(null);

  if (orderId) return <OrderDetail order={orders.find(o => o.id === orderId)} id={orderId}/>;

  const term = query.trim().toLowerCase();
  const matches = (o: Order) => !term || [o.id, ...o.items.flatMap(i => [i.name, i.sku])].some(t => t.toLowerCase().includes(term));
  const inDates = (o: Order) => !days || Date.now() - new Date(o.createdAt).getTime() <= Number(days) * 864e5;
  const inStatus = (o: Order) => !status || (status === 'devolucion' ? !!o.returnRequest : o.status === status);
  const inCategory = (o: Order) => !category || o.items.some(i => products.find(p => p.id === i.id)?.category === category);
  const shown = orders
    .filter(o => matches(o) && inDates(o) && inCategory(o) && inStatus(o))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const clear = () => { setQuery(''); setDays(''); setCategory(''); setStatus(''); };
  

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
            <PlainSelect
              label="Fecha de compra"
              value={days}
              onChange={setDays}
              options={[
                {value: '', label: 'Fecha de compra'},
                {value: '30', label: 'Últimos 30 días'},
                {value: '90', label: 'Últimos 3 meses'},
                {value: '365', label: 'Último año'},
              ]}
            />
            <PlainSelect
              label="Categorías"
              value={category}
              onChange={setCategory}
              options={[{value: '', label: 'Categorías'}, ...categories.map(c => ({value: c.id as string, label: c.name}))]}
            />
            <PlainSelect
              label="Estado"
              value={status}
              onChange={setStatus}
              options={[
                {value: '', label: 'Estado'},
                ...statusFlow.map(v => ({value: v as string, label: statusLabel[v]})),
                {value: 'cancelado', label: statusLabel.cancelado},
                {value: 'devolucion', label: 'Con devolución'},
              ]}
            />
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
        <p>Comprado el {date(order.createdAt)} | {money(order.total)} | {order.returnRequest ? returnLabel[order.returnRequest.status] : statusLabel[order.status]}</p>
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
  const [cancelling, setCancelling] = useState(false);
  const [returning, setReturning] = useState(false);
  const [rating, setRating] = useState<Order['items'][number] | null>(null);
  const reviews = useReviews();
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
        {order.tracking && isDispatched(order) && <Tracking order={order}/>}
      </section>

      {order.returnRequest && <ReturnStatus order={order}/>}

      <div className="pa-order-actions">
        <a className="pa-text-btn" href={`/tienda/comprobante/${order.id}`} target="_blank" rel="noopener">Ver comprobante de compra</a>
        {canRequestReturn(order) && <button type="button" className="pa-text-btn" onClick={() => setReturning(true)}>Solicitar devolución</button>}
        {canCancelOrder(order) && <button type="button" className="pa-text-btn danger" onClick={() => setCancelling(true)}>Cancelar pedido</button>}
      </div>

      <section className="pa-section" aria-labelledby="pa-productos">
        <h2 id="pa-productos">Productos</h2>
        <ul className="pa-items">
          {order.items.map(i => (
            <li key={i.id}>
              <span className="pa-thumb"><Image src={i.image} alt="" fill sizes="56px" unoptimized={i.image.startsWith('data:')}/></span>
              <div>
                <Link href={`/tienda/producto/${i.id}`}>{i.name}</Link>
                <small>Ref. {i.sku}</small>
                {order.status === 'entregado' && !reviews.some(r => r.id === `${order.id}-${i.id}`) && <button type="button" className="pa-text-btn" onClick={() => setRating(i)}>Opinar</button>}
              </div>
              <span>{i.qty} × {money(i.price)}</span>
              <b>{money(i.price * i.qty)}</b>
            </li>
          ))}
        </ul>
        <dl className="pa-totals">
          <div><dt>Subtotal</dt><dd>{money(order.total - (order.shipping ?? 0))}</dd></div>
          <div><dt>Envío</dt><dd>{shippingText(order.shipping ?? null, money)}</dd></div>
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
          </dl>
        </section>
      </div>

      {buying && <ReorderDialog order={order} onClose={() => setBuying(false)}/>}
      {cancelling && <CancelDialog order={order} onClose={() => setCancelling(false)}/>}
      {returning && <ReturnDialog order={order} onClose={() => setReturning(false)}/>}
      {rating && <ReviewDialog order={order} item={rating} user={c.name} onClose={() => setRating(null)}/>}
    </>
  );
}

function Tracking({order}: {order: Order}) {
  const carrier = carriers.find(c => c.name === order.carrier);
  const copy = async () => {
    await navigator.clipboard.writeText(order.tracking ?? '');
    toast('Número de guía copiado');
  };
  return (
    <div className="pa-tracking">
      <div>
        <small>{order.carrier ?? 'Guía de envío'}</small>
        <b>{order.tracking}</b>
      </div>
      <button type="button" className="pa-text-btn" onClick={copy}>Copiar guía</button>
      {carrier?.url && <a className="pa-buy-detail" href={carrier.url} target="_blank" rel="noopener">Rastrear en {carrier.name}</a>}
    </div>
  );
}

function ReturnStatus({order}: {order: Order}) {
  const r = order.returnRequest!;
  return (
    <section className="pa-section" aria-labelledby="pa-devolucion">
      <h2 id="pa-devolucion">{returnLabel[r.status]}</h2>
      <dl className="pa-facts">
        <div><dt>Motivo</dt><dd>{r.reason}</dd></div>
        {r.items?.map(i => <div key={i.id}><dt>Devuelves</dt><dd>{i.qty} × {i.name}</dd></div>)}
        {r.detail && <div><dt>Detalle</dt><dd>{r.detail}</dd></div>}
        <div><dt>Fecha</dt><dd>{dateTime(r.at)}</dd></div>
        {r.answer && <div><dt>Respuesta de MARWA</dt><dd>{r.answer}</dd></div>}
      </dl>
    </section>
  );
}

function CancelDialog({order, onClose}: {order: Order; onClose: () => void}) {
  const [reason, setReason] = useState(cancelReasons[0]);
  const confirm = () => {
    cancelOrderByBuyer(order.id, reason);
    toast(`Cancelaste el pedido ${order.id}`);
    onClose();
  };
  return (
    <Dialog
      title={`¿Cancelar el pedido ${order.id}?`}
      onClose={onClose}
      actions={<>
        <button type="button" className="button danger" onClick={confirm}>Sí, cancelar</button>
        <button type="button" className="button ghost" data-autofocus onClick={onClose}>Conservar pedido</button>
      </>}
    >
      <p>El equipo MARWA recibirá el aviso y gestionará la devolución de tu dinero.</p>
      <PlainSelect field caption="¿Por qué lo cancelas?" label="Motivo de la cancelación" value={reason} onChange={setReason} options={cancelReasons.map(r => ({value: r, label: r}))}/>
    </Dialog>
  );
}

const MAX_RETURN_PHOTOS = 3;

function ReturnDialog({order, onClose}: {order: Order; onClose: () => void}) {
  const [reason, setReason] = useState(returnReasons[0]);
  const [detail, setDetail] = useState('');
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(order.items.map(i => [i.id, i.qty])));
  const [picked, setPicked] = useState<string[]>(order.items.length === 1 ? [order.items[0].id] : []);
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');

  const addPhotos = async (files: File[]) => {
    try {
      const added = await Promise.all(files.slice(0, MAX_RETURN_PHOTOS - photos.length).map(f => compressPhoto(f, 700)));
      setPhotos(list => [...list, ...added]);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const send = () => {
    if (!picked.length) return setError('Elige al menos un producto.');
    const items = order.items.filter(i => picked.includes(i.id)).map(i => ({id: i.id, name: i.name, qty: qty[i.id]}));
    const ok = requestReturn(order.id, {reason, detail: detail.trim(), items, photos});
    if (!ok) return setError('No hay espacio para guardar las fotos. Quita alguna e intenta de nuevo.');
    toast('Enviamos tu solicitud de devolución');
    onClose();
  };

  return (
    <Dialog
      title={`Devolución del pedido ${order.id}`}
      onClose={onClose}
      actions={<>
        <button type="button" className="button primary" onClick={send}>Enviar solicitud</button>
        <button type="button" className="button ghost" onClick={onClose}>Cancelar</button>
      </>}
    >
      <p>¿Qué productos quieres devolver?</p>
      <ul className="pa-return-items">
        {order.items.map(i => (
          <li key={i.id}>
            <label className="shop-check">
              <input type="checkbox" checked={picked.includes(i.id)} onChange={e => { setError(''); setPicked(list => (e.target.checked ? [...list, i.id] : list.filter(x => x !== i.id))); }}/>
              {i.name}
            </label>
            {i.qty > 1 && (
              <input
                type="number" min={1} max={i.qty} aria-label={`Unidades de ${i.name}`} disabled={!picked.includes(i.id)}
                value={qty[i.id]} onChange={e => setQty(q => ({...q, [i.id]: Math.min(i.qty, Math.max(1, Number(e.target.value) || 1))}))}
              />
            )}
          </li>
        ))}
      </ul>
      <PlainSelect field caption="Motivo" label="Motivo de la devolución" value={reason} onChange={setReason} options={returnReasons.map(r => ({value: r, label: r}))}/>
      <label className="pa-field">Cuéntanos qué pasó <em>(opcional)</em>
        <textarea rows={3} value={detail} onChange={e => setDetail(e.target.value)}/>
      </label>
      <div className="pa-return-photos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photos.map((src, i) => <span key={i}><img src={src} alt={`Foto ${i + 1}`}/><button type="button" aria-label={`Quitar foto ${i + 1}`} onClick={() => setPhotos(list => list.filter((_, n) => n !== i))}>×</button></span>)}
        {photos.length < MAX_RETURN_PHOTOS && (
          <label className="pa-text-btn">
            Adjuntar fotos del producto
            <input type="file" accept="image/*" multiple hidden onChange={e => { addPhotos(Array.from(e.target.files ?? [])); e.target.value = ''; }}/>
          </label>
        )}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </Dialog>
  );
}

function ReviewDialog({order, item, user, onClose}: {order: Order; item: Order['items'][number]; user: string; onClose: () => void}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const send = () => {
    if (!rating) return toast('Elige de 1 a 5 estrellas');
    saveReview({productId: item.id, productName: item.name, orderId: order.id, email: order.email, name: user, rating, text: text.trim()});
    toast('Gracias por tu opinión');
    onClose();
  };
  return (
    <Dialog
      title="Opina sobre tu compra"
      onClose={onClose}
      actions={<>
        <button type="button" className="button primary" onClick={send}>Publicar opinión</button>
        <button type="button" className="button ghost" onClick={onClose}>Cancelar</button>
      </>}
    >
      <p>{item.name}</p>
      <div className="pa-rate" role="radiogroup" aria-label="Calificación">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} de 5`} className={n <= rating ? 'on' : ''} onClick={() => setRating(n)}><Icon name="star"/></button>
        ))}
      </div>
      <label className="pa-field">Tu comentario <em>(opcional)</em>
        <textarea rows={3} value={text} onChange={e => setText(e.target.value)}/>
      </label>
    </Dialog>
  );
}
