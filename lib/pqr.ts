'use client';

import {useMemo} from 'react';
import {read, usePersisted, write} from './persist';

/* INTEGRACIÓN PENDIENTE: al conectar la base de datos, cada PQR se liga al cliente y avisa por correo. */
const KEY = 'marwa.pqr.v1';
const NONE: StoredPqr[] = [];

export const pqrTypes = ['Petición', 'Queja', 'Reclamo', 'Sugerencia'] as const;
export type PqrType = (typeof pqrTypes)[number];
export type PqrStatus = 'abierta' | 'respondida' | 'cerrada';
export const pqrStatusLabel: Record<PqrStatus, string> = {abierta: 'En revisión', respondida: 'Respondida', cerrada: 'Cerrada'};

export type PqrMessage = {from: 'cliente' | 'marwa'; text: string; at: string; photo?: string};

export type Pqr = {
  id: string;
  email: string;
  name: string;
  type: PqrType;
  orderId?: string;
  subject: string;
  status: PqrStatus;
  messages: PqrMessage[];
  createdAt: string;
};

/* Las PQR creadas antes del hilo de mensajes guardaban un solo mensaje y una respuesta. */
type StoredPqr = Omit<Pqr, 'messages'> & {messages?: PqrMessage[]; message?: string; answer?: string; answeredAt?: string};

function normalize({message, answer, answeredAt, ...p}: StoredPqr): Pqr {
  if (p.messages) return p as Pqr;
  const messages: PqrMessage[] = [{from: 'cliente', text: message ?? '', at: p.createdAt}];
  if (answer) messages.push({from: 'marwa', text: answer, at: answeredAt ?? p.createdAt});
  return {...p, messages};
}

const readAll = () => read<StoredPqr[]>(KEY, NONE).map(normalize);

export function usePqrs() {
  const stored = usePersisted<StoredPqr[]>(KEY, NONE);
  return useMemo(() => stored.map(normalize), [stored]);
}

export function createPqr(input: Pick<Pqr, 'email' | 'name' | 'type' | 'orderId' | 'subject'> & {message: string; photo?: string}) {
  const list = readAll();
  const last = list.reduce((m, p) => Math.max(m, Number(p.id.split('-')[1]) || 1000), 1000);
  const {message, photo, ...data} = input;
  const at = new Date().toISOString();
  const pqr: Pqr = {...data, id: `PQR-${last + 1}`, status: 'abierta', messages: [{from: 'cliente', text: message, at, photo}], createdAt: at};
  return write(KEY, [pqr, ...list]) ? pqr : null;
}

const patch = (id: string, change: (p: Pqr) => Pqr) => write(KEY, readAll().map(p => (p.id === id ? change(p) : p)));

export const replyPqr = (id: string, from: PqrMessage['from'], text: string, photo?: string) =>
  patch(id, p => ({
    ...p,
    status: from === 'marwa' ? 'respondida' : 'abierta',
    messages: [...p.messages, {from, text, photo, at: new Date().toISOString()}],
  }));

export const closePqr = (id: string) => patch(id, p => ({...p, status: 'cerrada'}));
