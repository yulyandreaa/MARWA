'use client';

import {Suspense, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {logout, useOrders, useProducts, useSessionUser} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {Icon} from '@/components/premium/Icons';
import {PanelShell, PanelSkeleton} from '@/components/shop/account/PanelShell';
import {AdminSummary} from '@/components/shop/admin/AdminSummary';
import {AdminOrders} from '@/components/shop/admin/AdminOrders';
import {AdminProducts} from '@/components/shop/admin/AdminProducts';
import {AdminCustomers} from '@/components/shop/admin/AdminCustomers';
import {AdminReports} from '@/components/shop/admin/AdminReports';
import {AdminPqr} from '@/components/shop/admin/AdminPqr';
import {AdminReviews} from '@/components/shop/admin/AdminReviews';
import {AdminSettings} from '@/components/shop/admin/AdminSettings';
import {usePqrs} from '@/lib/pqr';

const tabs = {
  resumen: {label: 'Resumen', icon: 'grid'},
  pedidos: {label: 'Pedidos', icon: 'box'},
  productos: {label: 'Productos', icon: 'tag'},
  clientes: {label: 'Clientes', icon: 'user'},
  reportes: {label: 'Reportes', icon: 'layers'},
  pqr: {label: 'PQR', icon: 'help'},
  opiniones: {label: 'Opiniones', icon: 'star'},
  ajustes: {label: 'Ajustes', icon: 'tools'},
} as const;
type Tab = keyof typeof tabs;

function Admin() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useSessionUser();
  const orders = useOrders();
  const products = useProducts();
  const pqrs = usePqrs();
  const param = useSearchParams()?.get('tab');
  const tab: Tab = param && param in tabs ? (param as Tab) : 'resumen';

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace('/tienda/ingresar?next=/tienda/admin');
    else if (user.role !== 'vendedor') router.replace('/tienda/cuenta');
  }, [hydrated, user, router]);

  if (!hydrated || !user || user.role !== 'vendedor') return <PanelSkeleton label="Cargando el panel"/>;

  const pending = orders.filter(o => o.status === 'pagado' || o.status === 'preparando' || o.returnRequest?.status === 'solicitada').length;
  const out = products.filter(p => p.visible && p.stock <= 0).length;
  const badges: Partial<Record<Tab, number>> = {pedidos: pending, productos: out, pqr: pqrs.filter(q => q.status === 'abierta').length};

  const items = (Object.keys(tabs) as Tab[]).map(t => ({
    id: t,
    ...tabs[t],
    href: `/tienda/admin?tab=${t}`,
    badge: badges[t],
  }));

  return (
    <PanelShell
      title="Panel vendedor"
      tabs={items}
      active={tab}
      helpHref="/tienda/admin?tab=pqr"
      onSignOut={() => { logout(); router.push('/tienda'); }}
      extra={<Link className="pa-signout" href="/tienda"><Icon name="bag"/>Ver tienda</Link>}
    >
      {tab === 'resumen' && <AdminSummary/>}
      {tab === 'pedidos' && <AdminOrders/>}
      {tab === 'productos' && <AdminProducts/>}
      {tab === 'clientes' && <AdminCustomers/>}
      {tab === 'reportes' && <AdminReports/>}
      {tab === 'pqr' && <AdminPqr/>}
      {tab === 'opiniones' && <AdminReviews/>}
      {tab === 'ajustes' && <AdminSettings/>}
    </PanelShell>
  );
}

export default function AdminPage() {
  return <Suspense><Admin/></Suspense>;
}
