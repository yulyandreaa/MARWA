'use client';

import Link from 'next/link';
import {Icon} from '@/components/premium/Icons';
import {useAddresses, useSessionUser} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';

/** "Enviar a" del comprador en la barra superior (en escritorio ancho; en pantallas menores va en el menú). */
export function ShipToBar() {
  const user = useSessionUser();
  const hydrated = useHydrated();
  const addresses = useAddresses(user?.email);
  if (!hydrated || user?.role !== 'comprador') return null;
  const place = addresses.find(a => a.isDefault) ?? (user.address ? user : undefined);
  return (
    <Link className="mh-bar-ship" href="/tienda/cuenta?tab=direcciones">
      <Icon name="pin"/><b>Enviar a {place?.city || 'Colombia'}</b>{place?.address && <span>· {place.address}</span>}
    </Link>
  );
}
