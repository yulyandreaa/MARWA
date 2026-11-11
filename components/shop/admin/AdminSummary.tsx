'use client';

import Link from 'next/link';
import {useOrders, useProducts, useUsers} from '@/lib/shop';
import {LOW_STOCK} from '@/lib/notifications';
import {date, money} from '@/lib/format';
import {StatusPill} from '../OrderTimeline';
import {SectionHead} from '../account/AccountUI';

export function AdminSummary() {
  const orders = useOrders();
  const products = useProducts();
  const buyers = useUsers().filter(u => u.role === 'comprador');

  const valid = orders.filter(o => o.status !== 'cancelado');
  const sales = valid.reduce((s, o) => s + o.total, 0);
  const todo = orders.filter(o => o.status === 'pagado' || o.status === 'preparando');
  const alerts = products.filter(p => p.visible && p.stock <= LOW_STOCK).sort((a, b) => a.stock - b.stock);

  return (
    <>
      <SectionHead title="Resumen de la tienda" text="Todo lo que pasa en la tienda en línea, en tiempo real."/>

      <div className="kpis">
        <div><small>Ventas</small><b>{money(sales)}</b><span>{valid.length} pedidos no cancelados</span></div>
        <div><small>Por despachar</small><b>{todo.length}</b><span>Pagados o en preparación</span></div>
        <div><small>Ticket promedio</small><b>{money(valid.length ? Math.round(sales / valid.length) : 0)}</b><span>Por pedido</span></div>
        <div><small>Compradores</small><b>{buyers.length}</b><span>Cuentas registradas</span></div>
      </div>

      <div className="admin-two">
        <section className="pa-section">
          <div className="panel-head"><h3>Pedidos por atender</h3><Link href="/tienda/admin?tab=pedidos">Ver todos →</Link></div>
          {todo.length ? (
            <ul className="mini-list">
              {todo.slice(0, 6).map(o => (
                <li key={o.id}>
                  <Link href={`/tienda/admin?tab=pedidos&pedido=${o.id}`}>
                    <b>{o.id}</b><span>{o.customer.name} · {o.customer.city}</span>
                  </Link>
                  <StatusPill status={o.status}/>
                  <small>{date(o.createdAt)}</small>
                </li>
              ))}
            </ul>
          ) : <p className="muted">No hay pedidos pendientes. 🎉</p>}
        </section>

        <section className="pa-section">
          <div className="panel-head"><h3>Alertas de inventario</h3><Link href="/tienda/admin?tab=productos">Inventario →</Link></div>
          {alerts.length ? (
            <ul className="mini-list">
              {alerts.map(p => (
                <li key={p.id}>
                  <Link href={`/tienda/admin?tab=productos&producto=${p.id}`}><b>{p.name}</b><span>Ref. {p.sku}</span></Link>
                  <span className={`stock-tag ${p.stock <= 0 ? 'out' : 'low'}`}>{p.stock <= 0 ? 'Agotado' : `${p.stock} u.`}</span>
                </li>
              ))}
            </ul>
          ) : <p className="muted">Todo el inventario está por encima de {LOW_STOCK} unidades.</p>}
        </section>
      </div>
    </>
  );
}
