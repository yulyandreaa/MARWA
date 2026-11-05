'use client';

import Link from 'next/link';
import {useParams} from 'next/navigation';
import {paymentLabel, useOrders, useSessionUser} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {dateTime, money} from '@/lib/format';
import {Loading} from '@/components/shop/ShopUI';
import {OrderTimeline} from '@/components/shop/OrderTimeline';

export default function OrderPage() {
  const id = useParams<{id: string}>()?.id;
  const hydrated = useHydrated();
  const user = useSessionUser();
  const order = useOrders().find(o => o.id === id);

  if (!hydrated) return <Loading/>;
  if (!order || !user || (user.role !== 'vendedor' && user.email !== order.email)) {
    return (
      <div className="container shop-empty">
        <h2>No encontramos este pedido</h2>
        <p>Ingresa con la cuenta con la que hiciste la compra.</p>
        <div><Link className="button primary" href="/tienda/cuenta?tab=pedidos">Ver mis pedidos <span>→</span></Link></div>
      </div>
    );
  }

  return (
    <div className="container order-done">
      <div className="order-hero">
        <span className="order-check">✓</span>
        <p className="eyebrow">Pedido {order.id}</p>
        <h1>¡Gracias por tu compra, {order.customer.name.split(' ')[0]}!</h1>
        <p>Recibimos tu pago y nuestro equipo ya está preparando el despacho a {order.customer.city}, {order.customer.department}.</p>
      </div>

      <div className="cart-layout">
        <section className="panel">
          <h2>Seguimiento</h2>
          <OrderTimeline order={order}/>
          <h2>Productos</h2>
          <ul className="summary-items">
            {order.items.map(i => <li key={i.id}><span>{i.qty} × {i.name} <small>Ref. {i.sku}</small></span><b>{money(i.price * i.qty)}</b></li>)}
          </ul>
        </section>
        <aside className="summary">
          <h2>Resumen</h2>
          <dl>
            <div><dt>Fecha</dt><dd>{dateTime(order.createdAt)}</dd></div>
            <div><dt>Medio de pago</dt><dd>{paymentLabel[order.payment.method]}</dd></div>
            <div><dt>Referencia</dt><dd>{order.payment.reference}</dd></div>
            <div><dt>Entrega</dt><dd>{order.customer.address}</dd></div>
            <div className="total"><dt>Total pagado</dt><dd>{money(order.total)}</dd></div>
          </dl>
          <Link className="button primary block" href={user.role === 'vendedor' ? '/tienda/admin?tab=pedidos' : '/tienda/cuenta?tab=pedidos'}>Ver mis pedidos <span>→</span></Link>
          <Link className="summary-link" href="/tienda">Seguir comprando</Link>
        </aside>
      </div>
    </div>
  );
}
