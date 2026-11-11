'use client';

import {useSearchParams} from 'next/navigation';
import {useState, type FormEvent} from 'react';
import type {Order, User} from '@/lib/shop';
import {createPqr, pqrStatusLabel, pqrTypes, usePqrs, type Pqr, type PqrType} from '@/lib/pqr';
import {compressPhoto, date} from '@/lib/format';
import {toast} from '@/components/shop/ShopUI';
import {EmptyState, SectionHead} from './AccountUI';
import {PlainSelect} from './PlainSelect';
import {PqrThread} from './PqrThread';

export function AccountPqr({user, orders}: {user: User; orders: Order[]}) {
  const mine = usePqrs().filter(p => p.email === user.email);
  const openId = useSearchParams()?.get('pqr');
  const [writing, setWriting] = useState(false);

  if (writing) return <PqrForm user={user} orders={orders} onDone={() => setWriting(false)}/>;

  return (
    <>
      <SectionHead
        title="Ayuda / PQR"
        text="Envía tus peticiones, quejas, reclamos o sugerencias. Aquí verás la respuesta del equipo MARWA."
        action={<button type="button" className="button primary" onClick={() => setWriting(true)}>Nueva solicitud</button>}
      />
      {mine.length ? (
        <ul className="pa-pqrs">
          {mine.map(p => <PqrRow key={p.id} pqr={p} open={p.id === openId}/>)}
        </ul>
      ) : (
        <section className="pa-section">
          <EmptyState icon="help" title="No tienes solicitudes" text="Cuando envíes una, podrás seguirla desde aquí."/>
        </section>
      )}
    </>
  );
}

function PqrRow({pqr, open}: {pqr: Pqr; open: boolean}) {
  return (
    <li>
      <details open={open}>
        <summary>
          <span>
            <b>{pqr.subject}</b>
            <small>{pqr.type} {pqr.id} | {date(pqr.createdAt)}{pqr.orderId ? ` | Pedido ${pqr.orderId}` : ''}</small>
          </span>
          <em className={`pa-pqr-status ${pqr.status}`}>{pqrStatusLabel[pqr.status]}</em>
        </summary>
        <PqrThread pqr={pqr} as="cliente"/>
      </details>
    </li>
  );
}

function PqrForm({user, orders, onDone}: {user: User; orders: Order[]; onDone: () => void}) {
  const [type, setType] = useState<PqrType>('Petición');
  const [orderId, setOrderId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState<string>();

  const attach = async (file?: File) => {
    if (!file) return;
    try {
      setPhoto(await compressPhoto(file, 700));
    } catch (err) {
      toast((err as Error).message);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const pqr = createPqr({email: user.email, name: user.name, type, orderId: orderId || undefined, subject: subject.trim(), message: message.trim(), photo});
    if (!pqr) return toast('No hay espacio para guardar la foto. Quítala e intenta de nuevo.');
    toast(`Recibimos tu solicitud ${pqr.id}`);
    onDone();
  };

  return (
    <>
      <SectionHead title="Nueva solicitud" text="Cuéntanos qué necesitas y te responderemos por este medio."/>
      <form className="form pa-form pa-section" onSubmit={submit}>
        <div className="form-grid">
          <PlainSelect field caption="Tipo de solicitud" label="Tipo de solicitud" value={type} onChange={setType} options={pqrTypes.map(t => ({value: t, label: t}))}/>
          <PlainSelect
            field
            caption={<>Pedido relacionado <em>(opcional)</em></>}
            label="Pedido relacionado"
            value={orderId}
            onChange={setOrderId}
            options={[{value: '', label: 'Ninguno'}, ...orders.map(o => ({value: o.id, label: o.id}))]}
          />
        </div>
        <label>Asunto<input required maxLength={80} value={subject} onChange={e => setSubject(e.target.value)}/></label>
        <label>Mensaje<textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)}/></label>
        <div className="pq-actions start">
          <label className="pa-text-btn">
            {photo ? 'Cambiar foto' : 'Adjuntar foto (opcional)'}
            <input type="file" accept="image/*" hidden onChange={e => { attach(e.target.files?.[0]); e.target.value = ''; }}/>
          </label>
          {photo && <button type="button" className="pa-text-btn danger" onClick={() => setPhoto(undefined)}>Quitar foto</button>}
        </div>
        <div className="pa-actions">
          <button className="button primary">Enviar solicitud</button>
          <button type="button" className="button ghost" onClick={onDone}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
