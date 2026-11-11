'use client';

import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useMemo, useState} from 'react';
import {
  CANCELLED_BY_MARWA, answerReturn, carriers, isDispatched, paymentLabel, returnLabel, setOrderStatus, setSellerNote, statusFlow, statusLabel,
  useOrders, type Order, type OrderStatus,
} from '@/lib/shop';
import {date, dateTime, money} from '@/lib/format';
import {OrderTimeline, StatusPill} from '../OrderTimeline';
import {ProductImage, toast} from '../ShopUI';
import {EmptyState, SectionHead} from '../account/AccountUI';
import {PlainSelect} from '../account/PlainSelect';
import {usePaged} from '../account/Pager';
import {Icon} from '@/components/premium/Icons';
import {Modal} from './Drawer';
import {shippingText} from '@/lib/settings';

type StatusFilter = 'todos' | 'devoluciones' | OrderStatus;
const filters: StatusFilter[] = ['todos', ...statusFlow, 'cancelado', 'devoluciones'];
const pendingReturn = (o: Order) => o.returnRequest?.status === 'solicitada';

type Sort = 'reciente' | 'antiguo' | 'valor';
const sorters: Record<Sort, (a: Order, b: Order) => number> = {
  reciente: (a, b) => b.createdAt.localeCompare(a.createdAt),
  antiguo: (a, b) => a.createdAt.localeCompare(b.createdAt),
  valor: (a, b) => b.total - a.total,
};

export function AdminOrders() {
  const orders = useOrders();
  const router = useRouter();
  const openId = useSearchParams()?.get('pedido');
  const [status, setStatus] = useState<StatusFilter>('todos');
  const [q, setQ] = useState('');
  const [days, setDays] = useState('');
  const [sort, setSort] = useState<Sort>('reciente');

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return orders.filter(o =>
      (status === 'todos' || (status === 'devoluciones' ? pendingReturn(o) : o.status === status)) &&
      (!days || Date.now() - new Date(o.createdAt).getTime() <= Number(days) * 864e5) &&
      (!s || `${o.id} ${o.customer.name} ${o.customer.company} ${o.email} ${o.customer.city}`.toLowerCase().includes(s)))
      .sort(sorters[sort]);
  }, [orders, status, q, days, sort]);
  const {items, pager} = usePaged(shown);

  const open = orders.find(o => o.id === openId);
  const setOpen = (id: string | null) => router.replace(`/tienda/admin?tab=pedidos${id ? `&pedido=${id}` : ''}`, {scroll: false});

  return (
    <>
      <SectionHead title="Pedidos" text={`${orders.length} en total · cambia el estado y el comprador lo ve al instante en su cuenta.`}/>

      <div className="pa-tools" role="search">
        <label className="pa-search">
          <Icon name="search"/>
          <span className="au-sr">Buscar pedidos</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Busca por pedido, cliente, correo o ciudad..."/>
        </label>
        <PlainSelect
          label="Estado"
          value={status}
          onChange={setStatus}
          options={filters.map(f => ({
            value: f,
            label: f === 'todos' ? 'Estado' : f === 'devoluciones' ? `Devoluciones por revisar (${orders.filter(pendingReturn).length})` : `${statusLabel[f]} (${orders.filter(o => o.status === f).length})`,
          }))}
        />
        <PlainSelect
          label="Fecha"
          value={days}
          onChange={setDays}
          options={[
            {value: '', label: 'Fecha'},
            {value: '1', label: 'Hoy'},
            {value: '7', label: 'Últimos 7 días'},
            {value: '30', label: 'Últimos 30 días'},
            {value: '90', label: 'Últimos 3 meses'},
          ]}
        />
        <PlainSelect
          label="Ordenar por"
          value={sort}
          onChange={setSort}
          options={[
            {value: 'reciente', label: 'Más recientes'},
            {value: 'antiguo', label: 'Más antiguos'},
            {value: 'valor', label: 'Mayor valor'},
          ]}
        />
      </div>

      {shown.length ? (
        <ul className="pa-buys">
          {items.map(o => <OrderRow key={o.id} order={o}/>)}
        </ul>
      ) : (
        <section className="pa-section">
          <EmptyState
            icon="box"
            title={orders.length ? 'Ningún pedido coincide' : 'Aún no hay pedidos'}
            text={orders.length ? 'Prueba con otro filtro.' : 'Cuando un comprador pague, su pedido aparecerá aquí.'}
          />
        </section>
      )}

      {pager}

      {open && <OrderModal key={open.id} order={open} onClose={() => setOpen(null)}/>}
    </>
  );
}

function OrderRow({order}: {order: Order}) {
  const first = order.items[0];
  const href = `/tienda/admin?tab=pedidos&pedido=${order.id}`;
  return (
    <li className="pa-buy">
      <span className="pa-buy-img"><ProductImage src={first.image} alt="" sizes="80px"/></span>
      <div className="pa-buy-info">
        <h2><Link href={href} scroll={false}>{order.id} · {order.customer.name}</Link></h2>
        <p>{date(order.createdAt)} | {money(order.total)} | {order.customer.city} | {order.returnRequest ? returnLabel[order.returnRequest.status] : statusLabel[order.status]}</p>
      </div>
      <div className="pa-buy-actions">
        <Link className="pa-buy-detail" href={href} scroll={false}>Ver detalle<span className="au-sr"> de {order.id}</span></Link>
      </div>
    </li>
  );
}

const statusOptions = [...statusFlow, 'cancelado' as const].map(value => ({value, label: statusLabel[value]}));

function OrderModal({order, onClose}: {order: Order; onClose: () => void}) {
  const c = order.customer;
  const [pending, setPending] = useState<OrderStatus | null>(null);
  return (
    <Modal
      title={<>Pedido {order.id} <StatusPill status={order.status}/></>}
      onClose={onClose}
      footer={<>
        <a className="button ghost" href={`/tienda/comprobante/${order.id}`} target="_blank" rel="noopener">Imprimir pedido</a>
        <button type="button" className="button primary" onClick={onClose}>Cerrar</button>
      </>}
    >
      <div className="pe-timeline"><OrderTimeline order={pending ? {...order, status: pending} : order}/></div>
      <div className="form pe-form">
        <div className="pe-fields">
          <StatusEditor order={order} onPending={setPending}/>
          {order.returnRequest && <ReturnPanel order={order}/>}
          <section>
            <h3>Notas internas</h3>
            <label>Solo las ve el equipo MARWA
              <textarea rows={3} defaultValue={order.sellerNote ?? ''} onBlur={e => { if (e.target.value !== (order.sellerNote ?? '')) { setSellerNote(order.id, e.target.value); toast('Nota guardada'); } }}/>
            </label>
          </section>
        </div>

        <div className="pe-fields">
          <section>
            <h3>Cliente</h3>
            <dl className="pa-facts">
              <div><dt>Nombre</dt><dd>{c.name}</dd></div>
              {c.company && <div><dt>Empresa</dt><dd>{c.company}</dd></div>}
              <div><dt>NIT / CC</dt><dd>{c.docId}</dd></div>
              <div><dt>Correo</dt><dd><a href={`mailto:${order.email}`}>{order.email}</a></dd></div>
              <div><dt>Celular</dt><dd><a href={`https://wa.me/57${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener">{c.phone} (WhatsApp)</a></dd></div>
              <div><dt>Entrega</dt><dd>{c.address}, {c.city} ({c.department})</dd></div>
              {order.notes && <div><dt>Indicaciones</dt><dd>{order.notes}</dd></div>}
            </dl>
          </section>
          <section>
            <h3>Productos</h3>
            <ul className="pe-items">
              {order.items.map(i => (
                <li key={i.id}>
                  <span className="pe-item-img"><ProductImage src={i.image} alt="" sizes="48px"/></span>
                  <span>{i.name}<small>{i.qty} × {money(i.price)} · Ref. {i.sku}</small></span>
                  <b>{money(i.price * i.qty)}</b>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Pago</h3>
            <dl className="pa-facts">
              {order.shipping !== undefined && <div><dt>Envío</dt><dd>{shippingText(order.shipping, money)}</dd></div>}
              <div><dt>Total</dt><dd><b>{money(order.total)}</b></dd></div>
              <div><dt>Medio de pago</dt><dd>{paymentLabel[order.payment.method]}</dd></div>
              <div><dt>Referencia</dt><dd>{order.payment.reference}</dd></div>
              <div><dt>Creado</dt><dd>{dateTime(order.createdAt)}</dd></div>
            </dl>
          </section>
        </div>
      </div>
    </Modal>
  );
}

/** Cada cambio se aplica al elegirlo. Solo Despachado sin guía espera a que la escriban. */
function StatusEditor({order, onPending}: {order: Order; onPending: (status: OrderStatus | null) => void}) {
  const [waitingGuide, setWaitingGuide] = useState(false);
  const [carrier, setCarrier] = useState(order.carrier ?? carriers[0].name);
  const [tracking, setTracking] = useState(order.tracking ?? '');

  const apply = (status: OrderStatus, shipping?: {tracking: string; carrier: string}) => {
    try {
      setOrderStatus(order.id, status, {...shipping, ...(status === 'cancelado' ? {note: CANCELLED_BY_MARWA} : {})});
      toast(`${order.id}: ${statusLabel[status]}`);
    } catch (e) {
      toast((e as Error).message);
    }
    setWaitingGuide(false);
    onPending(null);
  };

  const choose = (status: OrderStatus) => {
    if (status === 'enviado' && !order.tracking) {
      setWaitingGuide(true);
      onPending('enviado');
      return;
    }
    if (status === order.status) {
      setWaitingGuide(false);
      onPending(null);
      return;
    }
    apply(status);
  };

  const saveGuide = () => {
    if (!tracking.trim()) return toast('Escribe el número de guía para marcarlo como despachado');
    apply('enviado', {tracking: tracking.trim(), carrier});
  };

  return (
    <section>
      <h3>Estado del pedido</h3>
      <PlainSelect field label="Estado del pedido" value={waitingGuide ? 'enviado' : order.status} onChange={choose} options={statusOptions}/>
      {waitingGuide && (
        <>
          <PlainSelect field caption="Transportadora" label="Transportadora" value={carrier} onChange={setCarrier} options={carriers.map(c => ({value: c.name, label: c.name}))}/>
          <label>Número de guía
            <input autoFocus value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Ej. 123456789"/>
          </label>
          <button type="button" className="button primary" onClick={saveGuide}>Guardar guía</button>
        </>
      )}
      {isDispatched(order) && order.tracking && <p className="pe-hint">{order.carrier ?? 'Guía'}: {order.tracking}</p>}
    </section>
  );
}

function ReturnPanel({order}: {order: Order}) {
  const r = order.returnRequest!;
  const [answer, setAnswer] = useState('');
  const decide = (approved: boolean) => {
    if (!answer.trim()) return toast('Escribe una respuesta para el cliente');
    answerReturn(order.id, approved, answer.trim());
    toast(approved ? 'Devolución aprobada' : 'Devolución rechazada');
  };
  return (
    <section>
      <h3>{returnLabel[r.status]}</h3>
      <dl className="pa-facts">
        <div><dt>Motivo</dt><dd>{r.reason}</dd></div>
        {r.items?.map(i => <div key={i.id}><dt>Devuelve</dt><dd>{i.qty} × {i.name}</dd></div>)}
        {r.detail && <div><dt>Detalle</dt><dd>{r.detail}</dd></div>}
        <div><dt>Fecha</dt><dd>{dateTime(r.at)}</dd></div>
        {r.answer && <div><dt>Respuesta</dt><dd>{r.answer}</dd></div>}
      </dl>
      {r.photos?.length > 0 && (
        <div className="pe-return-photos">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {r.photos.map((src, i) => <a key={i} href={src} target="_blank" rel="noopener"><img src={src} alt={`Foto ${i + 1} de la devolución`}/></a>)}
        </div>
      )}
      {r.status === 'solicitada' && (
        <>
          <label>Respuesta para el cliente
            <textarea rows={2} value={answer} onChange={e => setAnswer(e.target.value)}/>
          </label>
          <p className="pe-hint">Al aprobar, las unidades vuelven al inventario. El reembolso real se hace en la pasarela.</p>
          <div className="pe-buttons">
            <button type="button" className="button primary" onClick={() => decide(true)}>Aprobar</button>
            <button type="button" className="button ghost" onClick={() => decide(false)}>Rechazar</button>
          </div>
        </>
      )}
    </section>
  );
}
