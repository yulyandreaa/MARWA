'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useMemo, useState} from 'react';
import {paymentLabel, setOrderStatus, statusFlow, statusLabel, useOrders, type Order, type OrderStatus} from '@/lib/shop';
import {date, dateTime, money} from '@/lib/format';
import {OrderTimeline, StatusPill} from '../OrderTimeline';
import {toast} from '../ShopUI';
import {Drawer} from './Drawer';

const filters: ('todos' | OrderStatus)[] = ['todos', ...statusFlow, 'cancelado'];

export function AdminOrders() {
  const orders = useOrders();
  const router = useRouter();
  const openId = useSearchParams()?.get('pedido');
  const [status, setStatus] = useState<(typeof filters)[number]>('todos');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return orders.filter(o =>
      (status === 'todos' || o.status === status) &&
      (!s || `${o.id} ${o.customer.name} ${o.customer.company} ${o.email} ${o.customer.city}`.toLowerCase().includes(s)));
  }, [orders, status, q]);

  const open = orders.find(o => o.id === openId);
  const setOpen = (id: string | null) => router.replace(`/tienda/admin?tab=pedidos${id ? `&pedido=${id}` : ''}`, {scroll: false});

  return (
    <>
      <div className="account-head">
        <h2>Pedidos</h2>
        <p>{orders.length} en total · cambia el estado y el comprador lo ve al instante en su cuenta.</p>
      </div>

      <div className="admin-toolbar">
        <input className="admin-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por pedido, cliente, correo o ciudad"/>
        <div className="chips">
          {filters.map(f => (
            <button key={f} className={status === f ? 'active' : ''} onClick={() => setStatus(f)}>
              {f === 'todos' ? 'Todos' : statusLabel[f]} <span>{f === 'todos' ? orders.length : orders.filter(o => o.status === f).length}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Destino</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {shown.map(o => (
                <tr key={o.id} onClick={() => setOpen(o.id)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(o.id)}>
                  <td><b>{o.id}</b></td>
                  <td>{date(o.createdAt)}</td>
                  <td>{o.customer.name}<small>{o.customer.company || o.email}</small></td>
                  <td>{o.customer.city}<small>{o.customer.department}</small></td>
                  <td><b>{money(o.total)}</b><small>{o.items.reduce((s, i) => s + i.qty, 0)} u.</small></td>
                  <td><StatusPill status={o.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="shop-empty small">
          <h2>{orders.length ? 'Ningún pedido coincide' : 'Aún no hay pedidos'}</h2>
          <p>{orders.length ? 'Prueba con otro filtro.' : 'Cuando un comprador pague, su pedido aparecerá aquí.'}</p>
        </div>
      )}

      {open && <OrderDrawer order={open} onClose={() => setOpen(null)}/>}
    </>
  );
}

function OrderDrawer({order, onClose}: {order: Order; onClose: () => void}) {
  const [tracking, setTracking] = useState(order.tracking ?? '');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const idx = statusFlow.indexOf(order.status);
  const next = order.status === 'cancelado' ? null : statusFlow[idx + 1];
  const c = order.customer;

  const advance = () => {
    if (!next) return;
    if (next === 'enviado' && !tracking.trim()) return toast('Escribe el número de guía para marcarlo como enviado');
    setOrderStatus(order.id, next, next === 'enviado' ? {tracking: tracking.trim()} : {});
    toast(`${order.id}: ${statusLabel[next]}`);
  };

  return (
    <Drawer title={<>Pedido {order.id} <StatusPill status={order.status}/></>} onClose={onClose}>
      <OrderTimeline order={order}/>

      {next && (
        <div className="drawer-action">
          {next === 'enviado' && (
            <label>Número de guía / transportadora
              <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Ej. Servientrega 123456789"/>
            </label>
          )}
          <button className="button primary block" onClick={advance}>Marcar como “{statusLabel[next]}” <span>→</span></button>
        </div>
      )}

      <h3>Cliente</h3>
      <dl className="kv">
        <div><dt>Nombre</dt><dd>{c.name}</dd></div>
        {c.company && <div><dt>Empresa</dt><dd>{c.company}</dd></div>}
        <div><dt>NIT / CC</dt><dd>{c.docId}</dd></div>
        <div><dt>Correo</dt><dd><a href={`mailto:${order.email}`}>{order.email}</a></dd></div>
        <div><dt>Celular</dt><dd><a href={`https://wa.me/57${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener">{c.phone} (WhatsApp)</a></dd></div>
        <div><dt>Entrega</dt><dd>{c.address}, {c.city} ({c.department})</dd></div>
        {order.notes && <div><dt>Indicaciones</dt><dd>{order.notes}</dd></div>}
      </dl>

      <h3>Productos</h3>
      <ul className="summary-items">
        {order.items.map(i => <li key={i.id}><span>{i.qty} × {i.name} <small>Ref. {i.sku} · {money(i.price)} c/u</small></span><b>{money(i.price * i.qty)}</b></li>)}
      </ul>
      <dl className="kv">
        <div><dt>Total</dt><dd><b>{money(order.total)}</b></dd></div>
        <div><dt>Pago</dt><dd>{paymentLabel[order.payment.method]} · {order.payment.reference}</dd></div>
        <div><dt>Creado</dt><dd>{dateTime(order.createdAt)}</dd></div>
      </dl>

      {order.status !== 'cancelado' && order.status !== 'entregado' && (
        confirmCancel ? (
          <div className="danger-box">
            <p>¿Cancelar {order.id}? Las unidades vuelven al inventario. (El reembolso real se gestiona en la pasarela.)</p>
            <div>
              <button className="button danger" onClick={() => { setOrderStatus(order.id, 'cancelado', {note: 'Cancelado por MARWA'}); toast(`${order.id} cancelado`); }}>Sí, cancelar</button>
              <button className="button ghost" onClick={() => setConfirmCancel(false)}>No</button>
            </div>
          </div>
        ) : <button className="link-danger" onClick={() => setConfirmCancel(true)}>Cancelar pedido</button>
      )}
    </Drawer>
  );
}
