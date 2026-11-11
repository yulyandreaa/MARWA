'use client';

import Link from 'next/link';
import {useCallback, useRef, useState} from 'react';
import type {User} from '@/lib/shop';
import {Icon} from '@/components/premium/Icons';
import {accountTabs, useDismiss} from './accountNav';

/** Primer nombre con mayúscula inicial: "yuly andrea" → "Yuly". */
const firstName = (name: string) => { const n = name.trim().split(/\s+/)[0] || ''; return n.charAt(0).toUpperCase() + n.slice(1); };

/** Menú del usuario en el encabezado de la tienda: saluda con el nombre con que se registró. */
export function AccountMenu({user, onSignOut}: {user: User; onSignOut: () => void}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div className="pa-account" ref={ref}>
      <button type="button" aria-expanded={open} aria-label={`Menú de ${user.name}`} onClick={() => setOpen(!open)}><Icon name="user"/><span>Hola, {firstName(user.name) || 'bienvenido'}</span><Icon name="chevron"/></button>
      {open && (
        <div className="pa-account-menu">
          <div className="pa-account-id">
            <i><Icon name="user"/></i>
            <div><b>{user.name}</b><span>{user.email}</span></div>
          </div>
          {accountTabs.map(t => (
            <Link key={t.id} href={`/tienda/cuenta?tab=${t.id}`} onClick={close}><Icon name={t.icon}/>{t.label}</Link>
          ))}
          <hr/>
          <button type="button" onClick={() => { close(); onSignOut(); }}><Icon name="logout"/>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
