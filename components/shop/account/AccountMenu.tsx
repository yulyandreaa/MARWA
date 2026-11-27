'use client';

import Link from 'next/link';
import {useCallback, useRef, useState} from 'react';
import type {User} from '@/lib/shop';
import {Icon} from '@/components/premium/Icons';
import {accountTabs, adminTabs, useDismiss} from './accountNav';

/** Primer nombre con mayúscula inicial: "yuly andrea" → "Yuly". */
const firstName = (name: string) => { const n = name.trim().split(/\s+/)[0] || ''; return n.charAt(0).toUpperCase() + n.slice(1); };

/** Menú del usuario en el encabezado de la tienda: saluda con el nombre con que se registró. */
/** Menú de la persona en el encabezado. admin = panel administrativo (sus secciones + Ver tienda). */
export function AccountMenu({user, onSignOut, admin = false}: {user: User; onSignOut: () => void; admin?: boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div className="pa-account" ref={ref}>
      {/* en celular el menú va fijo a lo ancho: se ubica justo debajo del botón (27-nov-2026) */}
      <button type="button" aria-expanded={open} aria-label={`Menú de ${user.name}`} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); ref.current?.style.setProperty('--acm-top', `${Math.round(r.bottom + 8)}px`); setOpen(!open); }}><Avatar user={user}/><span>Hola, {firstName(user.name) || 'bienvenido'}</span><Icon name="chevron"/></button>
      {open && (
        <div className="pa-account-menu">
          <div className="pa-account-id">
            <i><Avatar user={user}/></i>
            <div><b>{user.name}</b><span>{user.email}</span></div>
          </div>
          {(admin ? adminTabs : accountTabs).map(t => (
            <Link key={t.id} href={`/tienda/${admin ? 'admin' : 'cuenta'}?tab=${t.id}`} onClick={close}><Icon name={t.icon}/>{t.label}</Link>
          ))}
          {admin && <><hr/><Link href="/tienda" onClick={close}><Icon name="bag"/>Ver tienda</Link></>}
          <hr/>
          <button type="button" onClick={() => { close(); onSignOut(); }}><Icon name="logout"/>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

/** Foto de perfil del cliente o, si no tiene, el ícono de persona (27-nov-2026). */
export function Avatar({user}: {user: User}) {
  // eslint-disable-next-line @next/next/no-img-element
  return user.photo ? <img className="pa-avatar" src={user.photo} alt=""/> : <Icon name="user"/>;
}
