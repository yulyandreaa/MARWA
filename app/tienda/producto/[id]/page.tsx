'use client';

import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useProducts} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {Loading} from '@/components/shop/ShopUI';
import {ProductDetail} from '@/components/shop/ProductDetail';

export default function ProductPage() {
  const id = useParams<{id: string}>()?.id;
  const products = useProducts();
  const hydrated = useHydrated();
  const product = products.find(p => p.id === id && p.visible);

  if (!hydrated) return <Loading/>;
  if (!product) {
    return (
      <div className="container shop-empty">
        <h2>Este producto no está disponible</h2>
        <p>Puede que se haya retirado del catálogo.</p>
        <div><Link className="button primary" href="/tienda">Volver a la tienda <span>→</span></Link></div>
      </div>
    );
  }
  return <ProductDetail key={product.id} product={product}/>;
}
