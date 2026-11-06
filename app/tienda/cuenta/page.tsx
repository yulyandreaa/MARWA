'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect, useRef, useState} from 'react';
import {ensureAddressBook, logout, useFavorites, useOrders, useSessionUser} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {Icon} from '@/components/premium/Icons';
import {AccountOrders} from '@/components/shop/account/AccountOrders';
import {AccountFavorites} from '@/components/shop/account/AccountFavorites';
import {AccountAddresses} from '@/components/shop/account/AccountAddresses';
import {AccountProfile} from '@/components/shop/account/AccountProfile';
import {AccountSecurity} from '@/components/shop/account/AccountSecurity';
import {accountTabs} from '@/components/shop/account/accountNav';

function PanelSkeleton() {
  return (
    <div className="pa" aria-busy="true">
      <div className="pa-skel bar"/>
      <div className="pa-body">
        <aside className="pa-side"><div className="pa-skel side"/></aside>
        <main className="pa-main"><p className="au-sr" role="status">Cargando tu cuenta</p><div className="pa-skel title"/><div className="pa-skel row"/><div className="pa-skel block"/></main>
      </div>
    </div>
  );
}

function BuyerPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const tab = accountTabs.find(t => t.id === params?.get('tab')) ?? accountTabs[0];
  const hydrated = useHydrated();
  const user = useSessionUser();
  const orders = useOrders().filter(o => o.email === user?.email);
  const favorites = useFavorites(user?.email);
  const [menu, setMenu] = useState(false);
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

  useEffect(() => setMenu(false), [params]);

  if (!hydrated || !user || user.role !== 'comprador') return <PanelSkeleton/>;

  return (
    <div className="pa">

      <div className="pa-body">
        <aside className="pa-side">
          <p className="pa-side-title"><Icon name="menu"/>Mi cuenta</p>
          <button type="button" className="pa-menu-btn" aria-expanded={menu} aria-controls="pa-nav" onClick={() => setMenu(!menu)}>
            <Icon name={tab.icon}/>{tab.label}<Icon name={menu ? 'close' : 'menu'}/>
          </button>
          <div id="pa-nav" className={`pa-nav-wrap${menu ? ' open' : ''}`}>
            <nav className="pa-nav" aria-label="Mi cuenta">
              {accountTabs.map(t => (
                <Link key={t.id} href={`/tienda/cuenta?tab=${t.id}`} className={tab.id === t.id ? 'active' : ''} aria-current={tab.id === t.id ? 'page' : undefined}>
                  <Icon name={t.icon}/>{t.label}
                  {t.id === 'favoritos' && favorites.length > 0 && <small>{favorites.length}</small>}
                </Link>
              ))}
            </nav>
            <hr/>
            <button type="button" className="pa-signout" onClick={logout}><Icon name="logout"/>Cerrar sesión</button>
          </div>
        </aside>

        <main className="pa-main">
          {tab.id === 'pedidos' && <AccountOrders key={params?.get('pedido') ?? 'lista'} orders={orders} orderId={params?.get('pedido')}/>}
          {tab.id === 'favoritos' && <AccountFavorites email={user.email}/>}
          {tab.id === 'direcciones' && <AccountAddresses user={user}/>}
          {tab.id === 'datos' && <AccountProfile key={user.email} user={user}/>}
          {tab.id === 'seguridad' && <AccountSecurity email={user.email} onSignOut={logout}/>}
        </main>
      </div>

      <footer className="pa-foot">
        <div className="pa-wrap">
          <Link href="/tienda" aria-label="MARWA, ir a la tienda"><Image src="/assets/marwa-logo-h.png" alt="" width={358} height={82}/></Link>
          <nav aria-label="Información">
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de privacidad</a>
            <a href="/#contacto">Ayuda / PQR</a>
            <a href="/#contacto">Contacto</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default function AccountPage() {
  return <Suspense fallback={<PanelSkeleton/>}><BuyerPanel/></Suspense>;
}
