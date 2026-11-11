'use client';

import {useMemo} from 'react';
import {read, usePersisted, write} from './persist';
import {useReviews} from './reviews';
import {CANCELLED_BY_MARWA, returnLabel, statusLabel, useOrders, useProducts, useUsers} from './shop';
import {usePqrs} from './pqr';
import {money} from './format';

export const LOW_STOCK = 5;

const NO_READ: string[] = [];
const MAX_ITEMS = 30;
const readKey = (scope: string) => `marwa.notif-read.${scope}`;

export type Notification = {id: string; icon: string; title: string; text: string; href: string; at?: string; read: boolean};
type Draft = Omit<Notification, 'read'> & {kind?: NotifKind};

/* Qué ve el comprador en su campana. Cuando existan los correos, usarán estas mismas preferencias. */
export type NotifKind = 'pedidos' | 'soporte';
export type NotifPrefs = Record<NotifKind, boolean>;
const PREFS_KEY = 'marwa.notif-prefs.v1';
const ALL_ON: NotifPrefs = {pedidos: true, soporte: true};
const NO_PREFS: Record<string, NotifPrefs> = {};
export const useNotifPrefs = (email: string) => usePersisted(PREFS_KEY, NO_PREFS)[email] ?? ALL_ON;
export const saveNotifPrefs = (email: string, prefs: NotifPrefs) => write(PREFS_KEY, {...read(PREFS_KEY, NO_PREFS), [email]: prefs});

function finish(list: Draft[], readIds: string[]) {
  const items = list
    .sort((a, b) => (b.at ?? '').localeCompare(a.at ?? ''))
    .slice(0, MAX_ITEMS)
    .map(n => ({...n, read: readIds.includes(n.id)}));
  return {items, unread: items.filter(n => !n.read).length};
}

export const SELLER_SCOPE = 'vendedor';

/** Novedades del vendedor, calculadas de pedidos, inventario, cuentas y PQR. */
export function useSellerNotifications() {
  const orders = useOrders();
  const products = useProducts();
  const users = useUsers();
  const pqrs = usePqrs();
  const reviews = useReviews();
  const readIds = usePersisted(readKey(SELLER_SCOPE), NO_READ);

  return useMemo(() => {
    const list: Draft[] = [];
    for (const o of orders) {
      const href = `/tienda/admin?tab=pedidos&pedido=${o.id}`;
      list.push({id: `pedido-${o.id}`, icon: 'box', title: `Nuevo pedido ${o.id}`, text: `${o.customer.name} · ${money(o.total)}`, href, at: o.createdAt});
      const cancel = o.history.find(h => h.status === 'cancelado');
      if (cancel && cancel.note !== CANCELLED_BY_MARWA) {
        list.push({id: `cancelado-${o.id}`, icon: 'close', title: `Pedido ${o.id} cancelado`, text: cancel.note ?? o.customer.name, href, at: cancel.at});
      }
      if (o.returnRequest) {
        list.push({id: `devolucion-${o.id}`, icon: 'repeat', title: `Devolución de ${o.id}`, text: `${o.customer.name} · ${o.returnRequest.reason}`, href, at: o.returnRequest.at});
      }
    }
    for (const p of products) {
      if (!p.visible || p.stock > LOW_STOCK) continue;
      const out = p.stock <= 0;
      list.push({
        id: `stock-${p.id}-${out ? 'agotado' : 'bajo'}`,
        icon: 'tag',
        title: out ? 'Producto agotado' : 'Stock bajo',
        text: out ? p.name : `${p.name} · ${p.stock} u.`,
        href: `/tienda/admin?tab=productos&producto=${p.id}`,
        at: orders.find(o => o.items.some(i => i.id === p.id))?.createdAt,
      });
    }
    for (const u of users) {
      if (u.role === 'comprador') list.push({id: `cliente-${u.email}`, icon: 'user', title: 'Nuevo cliente', text: u.name, href: '/tienda/admin?tab=clientes', at: u.createdAt});
    }
    for (const q of pqrs) {
      const href = `/tienda/admin?tab=pqr&pqr=${q.id}`;
      q.messages.forEach((m, i) => {
        if (m.from === 'cliente') list.push({id: `pqr-${q.id}-${i}`, icon: 'help', title: i ? `Respuesta en ${q.id}` : `${q.type} ${q.id}`, text: `${q.name} · ${q.subject}`, href, at: m.at});
      });
    }
    for (const r of reviews) {
      list.push({id: `opinion-${r.id}`, icon: 'star', title: `Nueva opinión: ${r.rating} de 5`, text: r.productName, href: '/tienda/admin?tab=opiniones', at: r.at});
    }
    return finish(list, readIds);
  }, [orders, products, users, pqrs, reviews, readIds]);
}

/** Novedades del comprador: avances de sus pedidos y respuestas del equipo MARWA. */
export function useBuyerNotifications(email: string) {
  const orders = useOrders();
  const pqrs = usePqrs();
  const prefs = useNotifPrefs(email);
  const readIds = usePersisted(readKey(email), NO_READ);

  return useMemo(() => {
    const list: Draft[] = [];
    for (const o of orders) {
      if (o.email !== email) continue;
      const href = `/tienda/cuenta?tab=pedidos&pedido=${o.id}`;
      for (const h of o.history) {
        if (h.status === 'pagado' || (h.status === 'cancelado' && h.note !== CANCELLED_BY_MARWA)) continue;
        list.push({id: `${o.id}-${h.status}`, kind: 'pedidos', icon: h.status === 'enviado' ? 'truck' : 'box', title: `Pedido ${o.id}: ${statusLabel[h.status]}`, text: o.items[0]?.name ?? '', href, at: h.at});
      }
      for (const c of o.corrections ?? []) {
        list.push({id: `${o.id}-correccion-${c.at}`, kind: 'pedidos', icon: 'repeat', title: `Corregimos el estado de ${o.id}`, text: `Ahora está: ${statusLabel[c.status]}`, href, at: c.at});
      }
      const r = o.returnRequest;
      if (r?.answeredAt) list.push({id: `${o.id}-devolucion`, kind: 'pedidos', icon: 'repeat', title: `${returnLabel[r.status]} · ${o.id}`, text: r.answer ?? '', href, at: r.answeredAt});
    }
    for (const q of pqrs) {
      if (q.email !== email) continue;
      q.messages.forEach((m, i) => {
        if (m.from === 'marwa') list.push({id: `${q.id}-respuesta-${i}`, kind: 'soporte', icon: 'help', title: `Respondimos tu ${q.type.toLowerCase()} ${q.id}`, text: q.subject, href: `/tienda/cuenta?tab=pqr&pqr=${q.id}`, at: m.at});
      });
    }
    return finish(list.filter(n => !n.kind || prefs[n.kind]), readIds);
  }, [orders, pqrs, email, prefs, readIds]);
}

export function markNotificationRead(scope: string, id: string) {
  const ids = read(readKey(scope), NO_READ);
  if (!ids.includes(id)) write(readKey(scope), [...ids, id]);
}

export const markAllNotificationsRead = (scope: string, items: Notification[]) =>
  write(readKey(scope), items.map(n => n.id));
