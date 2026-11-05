'use client';

import {useMemo, useState} from 'react';
import {useOrders, useUsers, type Order} from '@/lib/shop';
import {date, money} from '@/lib/format';
import {StatusPill} from '../OrderTimeline';
import {Drawer} from './Drawer';

type Customer = {
  email: string;
  name: string;
  company: string;
  phone: string;
  city: string;
  department: string;
  registered: boolean;
  since?: string;
  orders: Order[];
  spent: number;
};

export function AdminCustomers() {
  const users = useUsers();
  const orders = useOrders();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const customers = useMemo(() => {
    const map = new Map<string, Customer>();
    users.filter(u => u.role === 'comprador').forEach(u => map.set(u.email, {
      email: u.email, name: u.name, company: u.company, phone: u.phone, city: u.city, department: u.department,
      registered: true, since: u.createdAt, orders: [], spent: 0,
    }));
    orders.forEach(o => {
      const c = map.get(o.email) ?? {
        email: o.email, name: o.customer.name, company: o.customer.company, phone: o.customer.phone,
        city: o.customer.city, department: o.customer.department, registered: false, orders: [], spent: 0,
      };
      c.orders.push(o);
      if (o.status !== 'cancelado') c.spent += o.total;
      map.set(o.email, c);
    });
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent);
  }, [users, orders]);

  const s = q.trim().toLowerCase();
  const shown = customers.filter(c => !s || `${c.name} ${c.company} ${c.email} ${c.city}`.toLowerCase().includes(s));
  const current = customers.find(c => c.email === open);

  return (
    <>
      <div className="account-head">
        <h2>Clientes</h2>
        <p>{customers.length} compradores · {customers.filter(c => c.orders.length).length} con compras</p>
      </div>
      <div className="admin-toolbar">
        <input className="admin-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre, empresa, correo o ciudad"/>
      </div>

      {shown.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Cliente</th><th>Ciudad</th><th>Pedidos</th><th>Total comprado</th><th>Última compra</th></tr></thead>
            <tbody>
              {shown.map(c => (
                <tr key={c.email} onClick={() => setOpen(c.email)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(c.email)}>
                  <td><b>{c.name}</b><small>{c.company || c.email}</small></td>
                  <td>{c.city}<small>{c.department}</small></td>
                  <td>{c.orders.length}</td>
                  <td><b>{money(c.spent)}</b></td>
                  <td>{c.orders[0] ? date(c.orders[0].createdAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="shop-empty small">
          <h2>{customers.length ? 'Ningún cliente coincide' : 'Aún no hay compradores'}</h2>
          <p>Las cuentas creadas en la tienda aparecerán aquí.</p>
        </div>
      )}

      {current && (
        <Drawer title={current.name} onClose={() => setOpen(null)}>
          <dl className="kv">
            {current.company && <div><dt>Empresa</dt><dd>{current.company}</dd></div>}
            <div><dt>Correo</dt><dd><a href={`mailto:${current.email}`}>{current.email}</a></dd></div>
            <div><dt>Celular</dt><dd><a href={`https://wa.me/57${current.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener">{current.phone} (WhatsApp)</a></dd></div>
            <div><dt>Ubicación</dt><dd>{[current.city, current.department].filter(Boolean).join(', ') || 'Sin registrar'}</dd></div>
            <div><dt>Cuenta</dt><dd>{current.registered ? `Registrado desde ${date(current.since!)}` : 'Sin cuenta'}</dd></div>
            <div><dt>Total comprado</dt><dd><b>{money(current.spent)}</b></dd></div>
          </dl>
          <h3>Pedidos</h3>
          {current.orders.length ? (
            <ul className="mini-list">
              {current.orders.map(o => (
                <li key={o.id}>
                  <a href={`/tienda/admin?tab=pedidos&pedido=${o.id}`}><b>{o.id}</b><span>{date(o.createdAt)} · {money(o.total)}</span></a>
                  <StatusPill status={o.status}/>
                </li>
              ))}
            </ul>
          ) : <p className="muted">Todavía no ha comprado.</p>}
        </Drawer>
      )}
    </>
  );
}
