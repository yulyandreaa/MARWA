'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useMemo, useState} from 'react';
import {closePqr, pqrStatusLabel, usePqrs, type Pqr, type PqrStatus} from '@/lib/pqr';
import {date, dateTime} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {toast} from '../ShopUI';
import {EmptyState, SectionHead} from '../account/AccountUI';
import {PlainSelect} from '../account/PlainSelect';
import {PqrThread} from '../account/PqrThread';
import {usePaged} from '../account/Pager';
import {Modal} from './Drawer';

const statuses = Object.keys(pqrStatusLabel) as PqrStatus[];

export function AdminPqr() {
  const pqrs = usePqrs();
  const router = useRouter();
  const openId = useSearchParams()?.get('pqr');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'' | PqrStatus>('');

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return pqrs.filter(p => (!status || p.status === status) && (!s || `${p.id} ${p.name} ${p.email} ${p.subject}`.toLowerCase().includes(s)));
  }, [pqrs, q, status]);

  const {items, pager} = usePaged(shown);
  const open = pqrs.find(p => p.id === openId);
  const setOpen = (id: string | null) => router.replace(`/tienda/admin?tab=pqr${id ? `&pqr=${id}` : ''}`, {scroll: false});

  return (
    <>
      <SectionHead title="PQR" text={`${pqrs.filter(p => p.status === 'abierta').length} por responder · ${pqrs.length} en total`}/>
      <div className="pa-tools" role="search">
        <label className="pa-search">
          <Icon name="search"/>
          <span className="au-sr">Buscar solicitudes</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Busca por número, cliente o asunto..."/>
        </label>
        <PlainSelect
          label="Estado"
          value={status}
          onChange={setStatus}
          options={[{value: '' as typeof status, label: 'Estado'}, ...statuses.map(s => ({value: s as typeof status, label: pqrStatusLabel[s]}))]}
        />
      </div>

      {shown.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Solicitud</th><th>Cliente</th><th>Fecha</th><th>Estado</th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} onClick={() => setOpen(p.id)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(p.id)}>
                  <td><b>{p.subject}</b><small>{p.type} {p.id}{p.orderId ? ` · ${p.orderId}` : ''}</small></td>
                  <td data-label="Cliente">{p.name}<small>{p.email}</small></td>
                  <td data-label="Fecha">{date(p.createdAt)}</td>
                  <td data-label="Estado"><em className={`pa-pqr-status ${p.status}`}>{pqrStatusLabel[p.status]}</em></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="pa-section">
          <EmptyState icon="help" title={pqrs.length ? 'Ninguna solicitud coincide' : 'Aún no hay solicitudes'} text="Las peticiones, quejas y reclamos de los compradores llegarán aquí."/>
        </section>
      )}

      {pager}

      {open && <PqrModal key={open.id} pqr={open} onClose={() => setOpen(null)}/>}
    </>
  );
}

function PqrModal({pqr, onClose}: {pqr: Pqr; onClose: () => void}) {
  return (
    <Modal
      title={`${pqr.type} ${pqr.id}`}
      onClose={onClose}
      footer={<>
        {pqr.status !== 'cerrada' && <button type="button" className="button ghost" onClick={() => { closePqr(pqr.id); toast('Solicitud cerrada'); }}>Cerrar solicitud</button>}
        <button type="button" className="button primary" onClick={onClose}>Listo</button>
      </>}
    >
      <div className="form pe-form">
        <div className="pe-fields">
          <section>
            <h3>Datos</h3>
            <dl className="pa-facts">
              <div><dt>Cliente</dt><dd>{pqr.name}</dd></div>
              <div><dt>Correo</dt><dd><a href={`mailto:${pqr.email}`}>{pqr.email}</a></dd></div>
              {pqr.orderId && <div><dt>Pedido</dt><dd><a href={`/tienda/admin?tab=pedidos&pedido=${pqr.orderId}`}>{pqr.orderId}</a></dd></div>}
              <div><dt>Recibida</dt><dd>{dateTime(pqr.createdAt)}</dd></div>
              <div><dt>Estado</dt><dd>{pqrStatusLabel[pqr.status]}</dd></div>
            </dl>
          </section>
        </div>
        <div className="pe-fields">
          <section>
            <h3>{pqr.subject}</h3>
            <PqrThread pqr={pqr} as="marwa"/>
          </section>
        </div>
      </div>
    </Modal>
  );
}
