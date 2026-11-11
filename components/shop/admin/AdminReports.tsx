'use client';

import {useMemo, useState} from 'react';
import {categoryName, type Product} from '@/data/shopSeed';
import {paymentLabel, statusLabel, useOrders, useProducts, type Order} from '@/lib/shop';
import {date, money} from '@/lib/format';
import {downloadCsv} from '@/lib/csv';
import {EmptyState, SectionHead} from '../account/AccountUI';
import {PlainSelect} from '../account/PlainSelect';

const ranges = [
  {days: 7, label: 'Últimos 7 días'},
  {days: 30, label: 'Últimos 30 días'},
  {days: 90, label: 'Últimos 3 meses'},
  {days: 365, label: 'Último año'},
  {days: 0, label: 'Todo el tiempo'},
];

type Row = {name: string; units: number; total: number};

function group(orders: Order[], key: (o: Order, item: Order['items'][number]) => string) {
  const map = new Map<string, Row>();
  for (const o of orders) {
    for (const item of o.items) {
      const name = key(o, item);
      const row = map.get(name) ?? {name, units: 0, total: 0};
      row.units += item.qty;
      row.total += item.price * item.qty;
      map.set(name, row);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function exportOrders(orders: Order[]) {
  downloadCsv(
    'ventas-marwa',
    ['Pedido', 'Fecha', 'Cliente', 'Empresa', 'Correo', 'Ciudad', 'Departamento', 'Unidades', 'Envío', 'Total', 'Pago', 'Estado', 'Guía'],
    orders.map(o => [
      o.id, date(o.createdAt), o.customer.name, o.customer.company, o.email, o.customer.city, o.customer.department,
      o.items.reduce((s, i) => s + i.qty, 0), o.shipping ?? '', o.total, paymentLabel[o.payment.method], statusLabel[o.status], o.tracking ?? '',
    ]),
  );
}

type Bucket = {key: string; label: string; total: number};
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
const dayName = new Intl.DateTimeFormat('es-CO', {day: 'numeric', month: 'short'});
const monthName = new Intl.DateTimeFormat('es-CO', {month: 'short', year: 'numeric'});

/** Hasta tres meses, una barra por día; más que eso, una por mes. */
function salesSeries(orders: Order[], days: number): {unit: string; buckets: Bucket[]} {
  const oldest = orders.reduce((m, o) => Math.min(m, new Date(o.createdAt).getTime()), Date.now());
  const span = days || Math.ceil((Date.now() - oldest) / 864e5) + 1;
  const byDay = span <= 90;
  const key = byDay ? dayKey : monthKey;
  const buckets = new Map<string, Bucket>();
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!byDay) cursor.setDate(1);
  const steps = byDay ? span : Math.ceil(span / 30) + 1;
  for (let i = 0; i < steps; i++) {
    buckets.set(key(cursor), {key: key(cursor), label: (byDay ? dayName : monthName).format(cursor), total: 0});
    if (byDay) cursor.setDate(cursor.getDate() - 1);
    else cursor.setMonth(cursor.getMonth() - 1);
  }
  for (const o of orders) {
    const bucket = buckets.get(key(new Date(o.createdAt)));
    if (bucket) bucket.total += o.total;
  }
  return {unit: byDay ? 'día' : 'mes', buckets: Array.from(buckets.values()).reverse()};
}

function niceMax(n: number) {
  if (n <= 0) return 1;
  const step = 10 ** Math.floor(Math.log10(n));
  return [1, 2, 5, 10].map(m => m * step).find(v => v >= n) ?? n;
}
const shortMoney = (n: number) => (n >= 1e6 ? `$ ${(n / 1e6).toLocaleString('es-CO')} M` : n >= 1e3 ? `$ ${(n / 1e3).toLocaleString('es-CO')} mil` : `$ ${n}`);

function SalesChart({orders, days}: {orders: Order[]; days: number}) {
  const {unit, buckets} = useMemo(() => salesSeries(orders, days), [orders, days]);
  const [hover, setHover] = useState<number | null>(null);
  const top = niceMax(Math.max(...buckets.map(b => b.total)));
  const shown = hover === null ? null : buckets[hover];
  const every = Math.ceil(buckets.length / 6);

  return (
    <section className="pa-section">
      <div className="panel-head"><h3>Ventas por {unit}</h3></div>
      <div className="rc">
        <div className="rc-grid" aria-hidden="true">
          {[top, top / 2, 0].map(v => <span key={v}><i>{shortMoney(v)}</i></span>)}
        </div>
        <div className="rc-bars" onMouseLeave={() => setHover(null)}>
          {buckets.map((b, i) => (
            <button
              key={b.key}
              type="button"
              aria-label={`${b.label}: ${money(b.total)}`}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
            >
              <span className={hover === i ? 'on' : ''} style={{height: b.total ? `max(${(b.total / top) * 100}%, 3px)` : 0}}/>
            </button>
          ))}
          {shown && (
            <div className="rc-tip" style={{left: `${((hover! + .5) / buckets.length) * 100}%`}}>
              <small>{shown.label}</small><b>{money(shown.total)}</b>
            </div>
          )}
        </div>
        <div className="rc-axis" aria-hidden="true">
          {buckets.map((b, i) => <span key={b.key}>{i % every === 0 ? b.label : ''}</span>)}
        </div>
      </div>
      <details className="rc-table">
        <summary>Ver como tabla</summary>
        <div className="table-wrap">
          <table className="admin-table static">
            <thead><tr><th>Periodo</th><th>Ventas</th></tr></thead>
            <tbody>{buckets.filter(b => b.total).map(b => <tr key={b.key}><td>{b.label}</td><td><b>{money(b.total)}</b></td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function Table({title, first, rows}: {title: string; first: string; rows: Row[]}) {
  return (
    <section className="pa-section">
      <div className="panel-head"><h3>{title}</h3></div>
      <div className="table-wrap">
        <table className="admin-table static">
          <thead><tr><th>{first}</th><th>Unidades</th><th>Ventas</th></tr></thead>
          <tbody>
            {rows.map(r => <tr key={r.name}><td>{r.name}</td><td>{r.units}</td><td><b>{money(r.total)}</b></td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AdminReports() {
  const orders = useOrders();
  const products = useProducts();
  const [days, setDays] = useState(30);

  const valid = useMemo(
    () => orders.filter(o => o.status !== 'cancelado' && (!days || Date.now() - new Date(o.createdAt).getTime() <= days * 864e5)),
    [orders, days],
  );
  const sales = valid.reduce((s, o) => s + o.total, 0);
  const units = valid.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0);
  const byId = useMemo(() => new Map<string, Product>(products.map(p => [p.id, p])), [products]);

  return (
    <>
      <SectionHead
        title="Reportes"
        text="Ventas de la tienda, sin contar los pedidos cancelados."
        action={<button type="button" className="button primary" disabled={!valid.length} onClick={() => exportOrders(valid)}>Exportar a Excel</button>}
      />
      <div className="pa-tools">
        <PlainSelect
          label="Periodo"
          value={String(days)}
          onChange={v => setDays(Number(v))}
          options={ranges.map(r => ({value: String(r.days), label: r.label}))}
        />
      </div>
      <div className="kpis">
        <div><small>Ventas</small><b>{money(sales)}</b></div>
        <div><small>Pedidos</small><b>{valid.length}</b></div>
        <div><small>Ticket promedio</small><b>{money(valid.length ? Math.round(sales / valid.length) : 0)}</b></div>
        <div><small>Unidades vendidas</small><b>{units}</b></div>
      </div>
      {valid.length ? (
        <>
          <SalesChart orders={valid} days={days}/>
          <Table title="Productos más vendidos" first="Producto" rows={group(valid, (_, i) => i.name).slice(0, 10)}/>
          <div className="admin-two">
            <Table title="Ventas por categoría" first="Categoría" rows={group(valid, (_, i) => { const p = byId.get(i.id); return p ? categoryName(p.category) : 'Sin categoría'; })}/>
            <Table title="Ventas por ciudad" first="Ciudad" rows={group(valid, o => o.customer.city).slice(0, 10)}/>
          </div>
        </>
      ) : (
        <section className="pa-section">
          <EmptyState icon="layers" title="No hay ventas en este periodo" text="Prueba con un periodo más amplio."/>
        </section>
      )}
    </>
  );
}
