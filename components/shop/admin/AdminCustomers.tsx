'use client';

import {useMemo, useState} from 'react';
import {useOrders, useUsers, type Order} from '@/lib/shop';
import {date, money} from '@/lib/format';
import {StatusPill} from '../OrderTimeline';
import {EmptyState, SectionHead} from '../account/AccountUI';
import {Icon} from '@/components/premium/Icons';
import {Modal} from './Drawer';
import {PlainSelect} from '../account/PlainSelect';
import {usePaged} from '../account/Pager';
import {downloadCsv} from '@/lib/csv';

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

type Sort = 'total' | 'nombre' | 'pedidos' | 'reciente';
const sortOptions: {value: Sort; label: string}[] = [
  {value: 'total', label: 'Mayor compra'},
  {value: 'pedidos', label: 'Más pedidos'},
  {value: 'reciente', label: 'Compra más reciente'},
  {value: 'nombre', label: 'Nombre (A-Z)'},
];
const lastOrder = (c: Customer) => c.orders[0]?.createdAt ?? '';
const sorters: Record<Sort, (a: Customer, b: Customer) => number> = {
  total: (a, b) => b.spent - a.spent,
  pedidos: (a, b) => b.orders.length - a.orders.length,
  reciente: (a, b) => lastOrder(b).localeCompare(lastOrder(a)),
  nombre: (a, b) => a.name.localeCompare(b.name, 'es'),
};

export function AdminCustomers() {
  const users = useUsers();
  const orders = useOrders();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('total');

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
  const shown = customers
    .filter(c => !s || `${c.name} ${c.company} ${c.email} ${c.city}`.toLowerCase().includes(s))
    .sort(sorters[sort]);
  const {items, pager} = usePaged(shown);
  const exportAll = () => downloadCsv(
    'clientes-marwa',
    ['Nombre', 'Empresa', 'Correo', 'Celular', 'Ciudad', 'Departamento', 'Pedidos', 'Total comprado'],
    shown.map(c => [c.name, c.company, c.email, c.phone, c.city, c.department, c.orders.length, c.spent]),
  );
  const current = customers.find(c => c.email === open);

  return (
    <>
      <SectionHead title="Clientes" text={`${customers.length} compradores · ${customers.filter(c => c.orders.length).length} con compras`} action={<button type="button" className="button ghost" disabled={!shown.length} onClick={exportAll}>Exportar a Excel</button>}/>
      <div className="pa-tools" role="search">
        <label className="pa-search">
          <Icon name="search"/>
          <span className="au-sr">Buscar clientes</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Busca por nombre, empresa, correo o ciudad..."/>
        </label>
        <PlainSelect label="Ordenar por" value={sort} onChange={setSort} options={sortOptions}/>
      </div>

      {shown.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Cliente</th><th>Ciudad</th><th>Pedidos</th><th>Total comprado</th><th>Última compra</th></tr></thead>
            <tbody>
              {items.map(c => (
                <tr key={c.email} onClick={() => setOpen(c.email)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(c.email)}>
                  <td><b>{c.name}</b><small>{c.company || c.email}</small></td>
                  <td data-label="Ciudad">{c.city}<small>{c.department}</small></td>
                  <td data-label="Pedidos">{c.orders.length}</td>
                  <td data-label="Total comprado"><b>{money(c.spent)}</b></td>
                  <td data-label="Última compra">{c.orders[0] ? date(c.orders[0].createdAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="pa-section">
          <EmptyState icon="user" title={customers.length ? 'Ningún cliente coincide' : 'Aún no hay compradores'} text="Las cuentas creadas en la tienda aparecerán aquí."/>
        </section>
      )}

      {pager}

      {current && (
        <Modal
          title={current.name}
          onClose={() => setOpen(null)}
          footer={<button type="button" className="button primary" onClick={() => setOpen(null)}>Cerrar</button>}
        >
          <div className="form pe-form">
            <div className="pe-fields">
              <section>
                <h3>Datos del cliente</h3>
                <dl className="pa-facts">
                  {current.company && <div><dt>Empresa</dt><dd>{current.company}</dd></div>}
                  <div><dt>Correo</dt><dd><a href={`mailto:${current.email}`}>{current.email}</a></dd></div>
                  <div><dt>Celular</dt><dd><a href={`https://wa.me/57${current.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener">{current.phone} (WhatsApp)</a></dd></div>
                  <div><dt>Ubicación</dt><dd>{[current.city, current.department].filter(Boolean).join(', ') || 'Sin registrar'}</dd></div>
                  <div><dt>Cuenta</dt><dd>{current.registered ? `Registrado desde ${date(current.since!)}` : 'Sin cuenta'}</dd></div>
                  <div><dt>Total comprado</dt><dd><b>{money(current.spent)}</b></dd></div>
                </dl>
              </section>
            </div>
            <div className="pe-fields">
              <section>
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
                ) : <p className="pe-empty">Todavía no ha comprado.</p>}
              </section>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
