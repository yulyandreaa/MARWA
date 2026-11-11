'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useEffect, useState, type ReactNode} from 'react';
import {Icon} from '@/components/premium/Icons';

export type PanelTab = {id: string; label: string; icon: string; href: string; badge?: number};

export function PanelSkeleton({label}: {label: string}) {
  return (
    <div className="pa" aria-busy="true">
      <div className="pa-skel bar"/>
      <div className="pa-body">
        <aside className="pa-side"><div className="pa-skel side"/></aside>
        <main className="pa-main"><p className="au-sr" role="status">{label}</p><div className="pa-skel title"/><div className="pa-skel row"/><div className="pa-skel block"/></main>
      </div>
    </div>
  );
}

/** Marco común de Mi cuenta y del panel del vendedor: menú lateral, contenido y pie. */
export function PanelShell({title, tabs, active, onSignOut, extra, helpHref, children}: {
  title: string;
  tabs: PanelTab[];
  active: string;
  onSignOut: () => void;
  extra?: ReactNode;
  helpHref: string;
  children: ReactNode;
}) {
  const params = useSearchParams();
  const [menu, setMenu] = useState(false);
  const current = tabs.find(t => t.id === active) ?? tabs[0];

  useEffect(() => setMenu(false), [params]);

  return (
    <div className="pa">
      <div className="pa-body">
        <aside className="pa-side">
          <p className="pa-side-title"><Icon name="menu"/>{title}</p>
          <button type="button" className="pa-menu-btn" aria-expanded={menu} aria-controls="pa-nav" onClick={() => setMenu(!menu)}>
            <Icon name={current.icon}/>{current.label}<Icon name={menu ? 'close' : 'menu'}/>
          </button>
          <div id="pa-nav" className={`pa-nav-wrap${menu ? ' open' : ''}`}>
            <nav className="pa-nav" aria-label={title}>
              {tabs.map(t => (
                <Link key={t.id} href={t.href} className={current.id === t.id ? 'active' : ''} aria-current={current.id === t.id ? 'page' : undefined}>
                  <Icon name={t.icon}/>{t.label}
                  {!!t.badge && <small>{t.badge}</small>}
                </Link>
              ))}
            </nav>
            <hr/>
            {extra}
            <button type="button" className="pa-signout" onClick={onSignOut}><Icon name="logout"/>Cerrar sesión</button>
          </div>
        </aside>

        <main className="pa-main">{children}</main>
      </div>

      <footer className="pa-foot">
        <div className="pa-wrap">
          <Link href="/tienda" aria-label="MARWA, ir a la tienda"><Image src="/assets/marwa-logo-oficial.png" alt="" width={900} height={445}/></Link>
          <nav aria-label="Información">
            <a href="/tienda/terminos-y-condiciones">Términos y condiciones</a>
            <a href="/tienda/tratamiento-de-datos">Política de privacidad</a>
            <Link href={helpHref}>Ayuda / PQR</Link>
            <a href="/#contacto">Contacto</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
