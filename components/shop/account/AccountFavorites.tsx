'use client';

import Link from 'next/link';
import {toggleFavorite, useFavorites, useProducts} from '@/lib/shop';
import {money, priceText} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {AddButton, ProductImage, StockTag, toast} from '@/components/shop/ShopUI';
import {EmptyState, SectionHead} from './AccountUI';

export function AccountFavorites({email}: {email: string}) {
  const ids = useFavorites(email);
  const products = useProducts();
  const items = ids.flatMap(id => products.filter(p => p.id === id));

  const remove = (id: string, name: string) => {
    toggleFavorite(email, id);
    toast(`${name} salió de tus favoritos`);
  };

  return (
    <>
      <SectionHead title="Mis favoritos" text="Tus productos guardados, con precio y disponibilidad de hoy."/>
      {!items.length ? (
        <section className="pa-section">
          <EmptyState
            icon="heart" title="Aún no tienes favoritos" text="Toca el corazón de un producto para guardarlo aquí."
            action={<Link className="button primary" href="/tienda?vista=todos">Explorar el catálogo</Link>}
          />
        </section>
      ) : (
        <ul className="pa-favs">
          {items.map(p => (
            <li key={p.id}>
              <Link className="pa-fav-img" href={`/tienda/producto/${p.id}`} tabIndex={-1} aria-hidden="true">
                <ProductImage src={p.image} alt="" sizes="(max-width: 640px) 90px, 240px"/>
              </Link>
              <div className="pa-fav-body">
                <Link href={`/tienda/producto/${p.id}`}><b>{p.name}</b></Link>
                <small>Ref. {p.sku}</small>
                <strong>{priceText(p.price)}</strong>
                {p.visible ? <StockTag stock={p.stock} price={p.price}/> : <span className="stock-tag out">No disponible</span>}
              </div>
              <div className="pa-fav-actions">
                {p.visible ? <AddButton product={p} block/> : <button type="button" className="button primary block" disabled>No disponible</button>}
                <button type="button" className="pa-text-btn" onClick={() => remove(p.id, p.name)}>Eliminar<span className="au-sr"> {p.name} de favoritos</span></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
