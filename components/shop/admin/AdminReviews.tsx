'use client';

import {setReviewVisible, useReviews} from '@/lib/reviews';
import {date} from '@/lib/format';
import {toast} from '../ShopUI';
import {EmptyState, SectionHead} from '../account/AccountUI';
import {Stars} from '../Stars';
import {usePaged} from '../account/Pager';

export function AdminReviews() {
  const reviews = useReviews();
  const {items, pager} = usePaged(reviews);
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <>
      <SectionHead title="Opiniones" text={reviews.length ? `${reviews.length} opiniones · ${average.toFixed(1)} de 5 en promedio` : 'Solo opinan quienes recibieron el producto.'}/>
      {items.length ? (
        <ul className="pa-reviews">
          {items.map(r => (
            <li key={r.id} className={r.visible ? '' : 'hidden'}>
              <div>
                <Stars value={r.rating}/>
                <b>{r.productName}</b>
                {r.text && <p>{r.text}</p>}
                <small>{r.name} | {date(r.at)} | Pedido {r.orderId}{r.visible ? '' : ' | Oculta en la tienda'}</small>
              </div>
              <button
                type="button"
                className="pa-text-btn"
                onClick={() => { setReviewVisible(r.id, !r.visible); toast(r.visible ? 'Opinión oculta' : 'Opinión visible'); }}
              >{r.visible ? 'Ocultar' : 'Mostrar'}</button>
            </li>
          ))}
        </ul>
      ) : (
        <section className="pa-section">
          <EmptyState icon="star" title="Aún no hay opiniones" text="Cuando un cliente opine sobre un producto entregado, aparecerá aquí."/>
        </section>
      )}
      {pager}
    </>
  );
}
