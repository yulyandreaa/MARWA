'use client';

import {Suspense, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {logout, useOrders, useProducts, useSessionUser} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {Loading} from '@/components/shop/ShopUI';
import {AdminSummary} from '@/components/shop/admin/AdminSummary';
import {AdminOrders} from '@/components/shop/admin/AdminOrders';
import {AdminProducts} from '@/components/shop/admin/AdminProducts';
import {AdminCustomers} from '@/components/shop/admin/AdminCustomers';

const tabs = {
  resumen: 'Resumen',
  pedidos: 'Pedidos',
  productos: 'Productos e inventario',
  clientes: 'Clientes',
} as const;
type Tab = keyof typeof tabs;

function Admin() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useSessionUser();
  const orders = useOrders();
  const products = useProducts();
  const param = useSearchParams()?.get('tab');
  const tab: Tab = param && param in tabs ? (param as Tab) : 'resumen';

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace('/tienda/ingresar?next=/tienda/admin');
    else if (user.role !== 'vendedor') router.replace('/tienda/cuenta');
  }, [hydrated, user, router]);

  if (!hydrated || !user || user.role !== 'vendedor') return <Loading/>;

  const pending = orders.filter(o => o.status === 'pagado' || o.status === 'preparando').length;
  const out = products.filter(p => p.visible && p.stock <= 0).length;
  const badges: Partial<Record<Tab, number>> = {pedidos: pending, productos: out};

  return (
    <div className="container account admin">
      <aside className="account-nav">
        <p className="eyebrow">Panel vendedor</p>
        <h1>Hola, equipo</h1>
        <p>{user.email}</p>
        <nav>
          {(Object.keys(tabs) as Tab[]).map(t => (
            <Link key={t} href={`/tienda/admin?tab=${t}`} className={tab === t ? 'active' : ''}>
              {tabs[t]} {!!badges[t] && <span className="dot-count">{badges[t]}</span>}
            </Link>
          ))}
          <Link href="/tienda" target="_blank">Ver tienda ↗</Link>
          <button onClick={() => { logout(); router.push('/tienda'); }}>Cerrar sesión</button>
        </nav>
      </aside>
      <section className="account-body">
        {tab === 'resumen' && <AdminSummary/>}
        {tab === 'pedidos' && <AdminOrders/>}
        {tab === 'productos' && <AdminProducts/>}
        {tab === 'clientes' && <AdminCustomers/>}
      </section>
    </div>
  );
}

export default function AdminPage() {
  return <Suspense><Admin/></Suspense>;
}
