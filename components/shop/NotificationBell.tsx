'use client';

import Link from 'next/link';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Icon} from '@/components/premium/Icons';
import {useDismiss} from '@/components/shop/account/accountNav';
import {
  SELLER_SCOPE, markAllNotificationsRead, markNotificationRead, useBuyerNotifications, useSellerNotifications,
  type Notification,
} from '@/lib/notifications';
import {date} from '@/lib/format';

function timeAgo(at: string) {
  const minutes = Math.floor((Date.now() - new Date(at).getTime()) / 60000);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `Hace ${hours} h` : date(at);
}

type Props = {onArrive: (title: string) => void};

export function SellerBell({onArrive}: Props) {
  return <Bell scope={SELLER_SCOPE} {...useSellerNotifications()} onArrive={onArrive}/>;
}

export function BuyerBell({email, onArrive}: Props & {email: string}) {
  return <Bell scope={email} {...useBuyerNotifications(email)} onArrive={onArrive}/>;
}

/** Campana del encabezado. Avisa con `onArrive` lo que llega con la página abierta. */
function Bell({scope, items, unread, onArrive}: Props & {scope: string; items: Notification[]; unread: number}) {
  const ref = useRef<HTMLDivElement>(null);
  const known = useRef<Set<string> | null>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  useEffect(() => {
    const fresh = known.current && items.find(n => !known.current?.has(n.id));
    if (fresh) onArrive(fresh.title);
    known.current = new Set(items.map(n => n.id));
  }, [items, onArrive]);

  return (
    <div className="nb" ref={ref}>
      <button type="button" className="nb-btn" aria-expanded={open} aria-label={unread ? `Notificaciones, ${unread} sin leer` : 'Notificaciones'} onClick={() => setOpen(!open)}>
        <Icon name="bell"/>
        {unread > 0 && <b>{unread > 9 ? '9+' : unread}</b>}
      </button>
      {open && (
        <div className="nb-pop">
          <header>
            <h2>Notificaciones</h2>
            {unread > 0 && <button type="button" onClick={() => markAllNotificationsRead(scope, items)}>Marcar todas como leídas</button>}
          </header>
          {items.length ? (
            <ul>
              {items.map(n => (
                <li key={n.id} className={n.read ? '' : 'unread'}>
                  <Link href={n.href} onClick={() => { markNotificationRead(scope, n.id); close(); }}>
                    <i><Icon name={n.icon}/></i>
                    <span>
                      <b>{n.title}</b>
                      <small>{n.text}</small>
                      {n.at && <small>{timeAgo(n.at)}</small>}
                    </span>
                    {!n.read && <em aria-label="Sin leer"/>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p>Aún no tienes novedades.</p>}
        </div>
      )}
    </div>
  );
}
