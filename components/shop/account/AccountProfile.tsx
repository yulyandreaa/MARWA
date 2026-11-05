'use client';

import {useState, type FormEvent} from 'react';
import {updateAccount, type User} from '@/lib/shop';
import {isValidPhone, phoneDigits, phoneError} from '@/lib/validation';
import {Icon} from '@/components/premium/Icons';
import {FormRow} from '@/components/shop/AuthShell';
import {toast} from '@/components/shop/ShopUI';
import {SectionHead} from './AccountUI';

const emailHelp = `https://wa.me/573102569469?text=${encodeURIComponent('Hola MARWA, quiero cambiar el correo de mi cuenta.')}`;
const valuesOf = (u: User) => ({name: u.name, phone: u.phone, company: u.company, docId: u.docId, billingAddress: u.billingAddress ?? ''});
type Values = ReturnType<typeof valuesOf>;

export function AccountProfile({user}: {user: User}) {
  const saved = valuesOf(user);
  const [v, setV] = useState<Values>(saved);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const dirty = (Object.keys(v) as (keyof Values)[]).some(k => v[k] !== saved[k]);

  const bind = (k: keyof Values) => ({
    id: `datos-${k}`, value: v[k], 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `datos-${k}-error` : undefined,
    onChange: (e: {target: {value: string}}) => { setV({...v, [k]: e.target.value}); setErrors({...errors, [k]: undefined}); },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (v.name.trim().split(/\s+/).length < 2) found.name = 'Incluye tu nombre y tu apellido.';
    if (!isValidPhone(v.phone)) found.phone = phoneError;
    if (v.docId.trim() && !/^[0-9.\-\s]{5,15}$/.test(v.docId.trim())) found.docId = 'Usa solo números, por ejemplo 900123456-7.';
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) return document.getElementById(`datos-${first}`)?.focus();

    const clean = {...v, name: v.name.trim(), phone: phoneDigits(v.phone), company: v.company.trim(), docId: v.docId.trim(), billingAddress: v.billingAddress.trim()};
    const ok = updateAccount(user.email, clean);
    if (ok) setV(clean);
    toast(ok ? 'Tus datos se guardaron' : 'No pudimos guardar los cambios. Inténtalo de nuevo.');
  };

  return (
    <>
      <SectionHead title="Mis datos" text="Mantén actualizada tu información de contacto y facturación."/>
      <form className="form pa-form" onSubmit={submit} noValidate>
        <section className="pa-section" aria-labelledby="datos-personales">
          <h2 id="datos-personales">Datos personales</h2>
          <FormRow id="datos-name" label="Nombre completo" error={errors.name}><input {...bind('name')} autoComplete="name"/></FormRow>
          <FormRow id="datos-email" label="Correo electrónico" hint={<>Es tu usuario de ingreso y requiere verificación. <a href={emailHelp} target="_blank" rel="noreferrer">Solicitar cambio</a></>}>
            <div className="pa-locked"><Icon name="lock"/><input id="datos-email" value={user.email} readOnly/></div>
          </FormRow>
          <FormRow id="datos-phone" label="Número de contacto" error={errors.phone}><input {...bind('phone')} type="tel" inputMode="tel" autoComplete="tel"/></FormRow>
        </section>

        <section className="pa-section" aria-labelledby="datos-factura">
          <h2 id="datos-factura">Facturación <em>(opcional)</em></h2>
          <p className="pa-section-text">Complétala solo si necesitas factura a nombre de una empresa.</p>
          <FormRow id="datos-company" label="Nombre o razón social"><input {...bind('company')} autoComplete="organization"/></FormRow>
          <FormRow id="datos-docId" label="NIT" error={errors.docId}><input {...bind('docId')} inputMode="numeric"/></FormRow>
          <FormRow id="datos-billingAddress" label="Dirección de facturación"><input {...bind('billingAddress')}/></FormRow>
        </section>

        <div className="pa-actions">
          <button className="button primary" disabled={!dirty}>Guardar cambios</button>
          <button type="button" className="button ghost" disabled={!dirty} onClick={() => { setV(saved); setErrors({}); }}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
