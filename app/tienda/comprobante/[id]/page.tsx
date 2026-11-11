'use client';

import Image from 'next/image';
import {useParams} from 'next/navigation';
import {isDispatched, paymentLabel, statusLabel, useOrders, useSessionUser} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {shippingText, useSettings} from '@/lib/settings';
import {dateTime, money} from '@/lib/format';
import {Loading} from '@/components/shop/ShopUI';

export default function ReceiptPage() {
  const {id} = useParams<{id: string}>();
  const hydrated = useHydrated();
  const user = useSessionUser();
  const order = useOrders().find(o => o.id === id);
  const settings = useSettings();

  if (!hydrated) return <Loading/>;
  if (!order || !user || (user.role !== 'vendedor' && user.email !== order.email)) {
    return <div className="cp"><p className="cp-none">No encontramos este comprobante en tu cuenta.</p></div>;
  }

  const c = order.customer;
  return (
    <div className="cp">
      <div className="cp-sheet">
        <header>
          <Image src="/assets/marwa-logo-oficial.png" alt="MARWA Redes y Energía" width={162} height={80}/>
          <div>
            <h1>Comprobante de compra</h1>
            <p>Pedido {order.id} · {dateTime(order.createdAt)}</p>
          </div>
        </header>
        <p className="cp-company">{[settings.company, settings.nit && `NIT ${settings.nit}`, settings.address, settings.email].filter(Boolean).join(' · ')}</p>

        <div className="cp-duo">
          <section>
            <h2>Cliente</h2>
            <p>{c.name}{c.company ? ` · ${c.company}` : ''}<br/>NIT / CC {c.docId}<br/>{order.email}<br/>{c.phone}</p>
          </section>
          <section>
            <h2>Entrega</h2>
            <p>{c.address}<br/>{c.city}, {c.department}{order.tracking && isDispatched(order) ? <><br/>{order.carrier ?? 'Guía'}: {order.tracking}</> : null}</p>
          </section>
        </div>

        <table>
          <thead><tr><th>Producto</th><th>Ref.</th><th>Cant.</th><th>Precio</th><th>Total</th></tr></thead>
          <tbody>
            {order.items.map(i => (
              <tr key={i.id}><td>{i.name}</td><td>{i.sku}</td><td>{i.qty}</td><td>{money(i.price)}</td><td>{money(i.price * i.qty)}</td></tr>
            ))}
          </tbody>
          <tfoot>
            {order.shipping !== undefined && <tr className="cp-sub"><td colSpan={4}>Envío</td><td>{shippingText(order.shipping, money)}</td></tr>}
            <tr><td colSpan={4}>Total (IVA incluido)</td><td>{money(order.total)}</td></tr>
          </tfoot>
        </table>

        <p className="cp-meta">Pago: {paymentLabel[order.payment.method]} · Ref. {order.payment.reference} · Estado: {statusLabel[order.status]}</p>
        <p className="cp-note">Este documento no es una factura electrónica.</p>
      </div>
      <button type="button" className="button primary cp-print" onClick={() => window.print()}>Imprimir o guardar en PDF</button>
    </div>
  );
}
