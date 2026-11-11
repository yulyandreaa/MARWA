'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useRef} from 'react';
import {ensureAddressBook, logout, useFavorites, useOrders, useSessionUser} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {AccountOrders} from '@/components/shop/account/AccountOrders';
import {AccountFavorites} from '@/components/shop/account/AccountFavorites';
import {AccountAddresses} from '@/components/shop/account/AccountAddresses';
import {AccountProfile} from '@/components/shop/account/AccountProfile';
import {AccountSecurity} from '@/components/shop/account/AccountSecurity';
import {AccountPqr} from '@/components/shop/account/AccountPqr';
import {accountTabs} from '@/components/shop/account/accountNav';
import {PanelShell, PanelSkeleton} from '@/components/shop/account/PanelShell';

function BuyerPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const tab = accountTabs.find(t => t.id === params?.get('tab')) ?? accountTabs[0];
  const hydrated = useHydrated();
  const user = useSessionUser();
  const orders = useOrders().filter(o => o.email === user?.email);
  const favorites = useFavorites(user?.email);
  const hadUser = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    // Quien cierra sesión aquí vuelve a la tienda; quien llega sin sesión va a ingresar.
    if (!user) router.replace(hadUser.current ? '/tienda' : '/tienda/ingresar?next=/tienda/cuenta');
    else if (user.role === 'vendedor') router.replace('/tienda/admin');
    else {
      hadUser.current = true;
      ensureAddressBook(user);
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user || user.role !== 'comprador') return <PanelSkeleton label="Cargando tu cuenta"/>;

  const tabs = accountTabs.map(t => ({
    ...t,
    href: `/tienda/cuenta?tab=${t.id}`,
    badge: t.id === 'favoritos' ? favorites.length : undefined,
  }));

  return (
    <PanelShell title="Mi cuenta" tabs={tabs} active={tab.id} onSignOut={logout} helpHref="/tienda/cuenta?tab=pqr">
      {tab.id === 'pedidos' && <AccountOrders key={params?.get('pedido') ?? 'lista'} orders={orders} orderId={params?.get('pedido')}/>}
      {tab.id === 'favoritos' && <AccountFavorites email={user.email}/>}
      {tab.id === 'direcciones' && <AccountAddresses user={user}/>}
      {tab.id === 'datos' && <AccountProfile key={user.email} user={user}/>}
      {tab.id === 'seguridad' && <AccountSecurity email={user.email}/>}
      {tab.id === 'pqr' && <AccountPqr user={user} orders={orders}/>}
    </PanelShell>
  );
}

export default function AccountPage() {
  return <Suspense fallback={<PanelSkeleton label="Cargando tu cuenta"/>}><BuyerPanel/></Suspense>;
}
