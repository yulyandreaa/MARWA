'use client';

import {useState, type FormEvent} from 'react';
import {departments} from '@/data/shopSeed';
import {addressUsage, deleteAddress, saveAddress, setDefaultAddress, useAddresses, type Address, type User} from '@/lib/shop';
import {isValidPhone, phoneDigits, phoneError} from '@/lib/validation';
import {Icon} from '@/components/premium/Icons';
import {FormRow} from '@/components/shop/AuthShell';
import {toast} from '@/components/shop/ShopUI';
import {Dialog, EmptyState, SectionHead} from './AccountUI';

type Draft = Pick<Address, 'label' | 'department' | 'city' | 'address' | 'notes' | 'recipient' | 'phone'> & {id?: string};
const required: [keyof Draft, string][] = [
  ['label', 'Ponle un nombre, por ejemplo Oficina o Bodega.'],
  ['recipient', 'Escribe quién recibe el pedido.'],
  ['phone', 'Escribe un número de contacto.'],
  ['department', 'Selecciona el departamento.'],
  ['city', 'Escribe la ciudad o municipio.'],
  ['address', 'Escribe la dirección completa.'],
];
const failed = 'No pudimos guardar el cambio. Inténtalo de nuevo.';

export function AccountAddresses({user}: {user: User}) {
  const addresses = useAddresses(user.email);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [removing, setRemoving] = useState<Address | null>(null);

  if (draft) return <AddressForm user={user} draft={draft} onDone={() => setDraft(null)}/>;

  const blank: Draft = {label: '', department: '', city: '', address: '', notes: '', recipient: user.name, phone: user.phone};
  const add = <button type="button" className="button primary" onClick={() => setDraft(blank)}>Agregar dirección</button>;
  const usage = removing ? addressUsage(removing) : null;

  return (
    <>
      <SectionHead title="Mis direcciones" text="La dirección principal se usa por defecto en tus compras." action={addresses.length > 0 ? add : undefined}/>
      {!addresses.length ? (
        <section className="pa-section">
          <EmptyState icon="pin" title="Aún no tienes direcciones" text="Agrega una para comprar más rápido." action={add}/>
        </section>
      ) : (
        <ul className="pa-addresses">
          {addresses.map(a => (
            <li key={a.id} className={a.isDefault ? 'main' : ''}>
              <div className="pa-address-top">
                <h2>{a.label}</h2>
                {a.isDefault && <span className="pa-tag">Principal</span>}
              </div>
              <address>
                <b>{a.recipient}</b>
                {a.address}<br/>
                {a.city}, {a.department}<br/>
                {a.phone}
              </address>
              {a.notes && <p className="pa-note">{a.notes}</p>}
              <div className="pa-row-actions">
                <button type="button" className="pa-text-btn" onClick={() => setDraft(a)}>Editar<span className="au-sr"> {a.label}</span></button>
                <button type="button" className="pa-text-btn danger" onClick={() => setRemoving(a)}>Eliminar<span className="au-sr"> {a.label}</span></button>
                {!a.isDefault && (
                  <button type="button" className="pa-text-btn" onClick={() => toast(setDefaultAddress(user.email, a.id) ? `${a.label} es tu dirección principal` : failed)}>
                    Usar como principal<span className="au-sr">: {a.label}</span>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {removing && usage && (
        <Dialog
          title={`¿Eliminar ${removing.label}?`}
          onClose={() => setRemoving(null)}
          actions={<>
            <button type="button" className="button danger" onClick={() => { toast(deleteAddress(user.email, removing.id) ? 'Dirección eliminada' : failed); setRemoving(null); }}>Eliminar dirección</button>
            <button type="button" className="button ghost" data-autofocus onClick={() => setRemoving(null)}>Conservar</button>
          </>}
        >
          <p>{removing.address}, {removing.city}</p>
          {usage.total > 0
            ? <p className="pa-alert"><Icon name="box"/><span>Esta dirección está en {usage.total} {usage.total === 1 ? 'pedido' : 'pedidos'}{usage.active > 0 ? `, ${usage.active} todavía en proceso` : ''}. Esos pedidos se entregarán igual, porque guardan su propia copia.</span></p>
            : <p>No está asociada a ningún pedido.</p>}
          {removing.isDefault && addresses.length > 1 && <p>Otra de tus direcciones pasará a ser la principal.</p>}
        </Dialog>
      )}
    </>
  );
}

function AddressForm({user, draft, onDone}: {user: User; draft: Draft; onDone: () => void}) {
  const [v, setV] = useState(draft);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [busy, setBusy] = useState(false);
  const bind = (k: keyof Draft) => ({
    id: `dir-${k}`, value: v[k] ?? '', 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `dir-${k}-error` : undefined,
    onChange: (e: {target: {value: string}}) => { setV({...v, [k]: e.target.value}); setErrors({...errors, [k]: undefined}); },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    required.forEach(([k, message]) => { if (!String(v[k] ?? '').trim()) found[k] = message; });
    if (!found.phone && !isValidPhone(v.phone)) found.phone = phoneError;
    setErrors(found);
    const first = required.find(([k]) => found[k]);
    if (first) return document.getElementById(`dir-${first[0]}`)?.focus();

    setBusy(true);
    const ok = saveAddress({...v, email: user.email, phone: phoneDigits(v.phone)});
    toast(ok ? (v.id ? 'Dirección actualizada' : 'Dirección agregada') : failed);
    if (ok) onDone();
    else setBusy(false);
  };

  return (
    <>
      <SectionHead title={v.id ? 'Editar dirección' : 'Agregar dirección'} text="Los campos son obligatorios, salvo los que dicen opcional."/>
      <form className="form pa-section pa-form" onSubmit={submit} noValidate>
        <FormRow id="dir-label" label="Nombre de la dirección" error={errors.label}><input {...bind('label')} placeholder="Ej: Oficina, Bodega"/></FormRow>
        <div className="form-grid">
          <FormRow id="dir-recipient" label="Nombre del destinatario" error={errors.recipient}><input {...bind('recipient')} autoComplete="name"/></FormRow>
          <FormRow id="dir-phone" label="Número de contacto" error={errors.phone}><input {...bind('phone')} type="tel" inputMode="tel" autoComplete="tel"/></FormRow>
          <FormRow id="dir-department" label="Departamento" error={errors.department}>
            <select {...bind('department')}>
              <option value="">Selecciona…</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
          </FormRow>
          <FormRow id="dir-city" label="Ciudad o municipio" error={errors.city}><input {...bind('city')} autoComplete="address-level2"/></FormRow>
        </div>
        <FormRow id="dir-address" label="Dirección completa" error={errors.address}><input {...bind('address')} autoComplete="street-address" placeholder="Calle, número, barrio"/></FormRow>
        <FormRow id="dir-notes" label={<>Complemento o indicaciones <em>(opcional)</em></>}><input {...bind('notes')} placeholder="Ej: Bodega 3, recibe de 8 a. m. a 5 p. m."/></FormRow>
        <div className="pa-actions">
          <button className="button primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar dirección'}</button>
          <button type="button" className="button ghost" onClick={onDone}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
