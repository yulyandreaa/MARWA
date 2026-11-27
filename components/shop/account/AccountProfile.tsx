'use client';

import {saveNotifPrefs, useNotifPrefs, type NotifKind} from '@/lib/notifications';
import {useRef, useState, type ChangeEvent, type FormEvent} from 'react';
import {updateAccount, updatePhoto, type User} from '@/lib/shop';
import {isValidPhone, phoneDigits, phoneError} from '@/lib/validation';
import {Icon} from '@/components/premium/Icons';
import {FormRow} from '@/components/shop/AuthShell';
import {toast} from '@/components/shop/ShopUI';
import {SectionHead} from './AccountUI';
import {Avatar} from './AccountMenu';

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
      <PhotoCard user={user}/>
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
      <NotifPrefsCard email={user.email}/>
    </>
  );
}

function NotifPrefsCard({email}: {email: string}) {
  const prefs = useNotifPrefs(email);
  const toggle = (kind: NotifKind) => saveNotifPrefs(email, {...prefs, [kind]: !prefs[kind]});
  return (
    <section className="pa-section pa-form" aria-labelledby="datos-avisos">
      <h2 id="datos-avisos">Avisos</h2>
      <p className="pa-section-text">Elige qué novedades ves en tu campana.</p>
      <label className="shop-check"><input type="checkbox" checked={prefs.pedidos} onChange={() => toggle('pedidos')}/>Mis pedidos y devoluciones</label>
      <label className="shop-check"><input type="checkbox" checked={prefs.soporte} onChange={() => toggle('soporte')}/>Respuestas a mis solicitudes</label>
    </section>
  );
}

/* ── Foto de perfil (27-nov-2026), como en Mercado Libre: se recorta en cuadrado y se reduce a 320 px ── */
const MAX_MB = 8;
function squareJpeg(file: File, size = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(url); return reject(new Error('canvas')); }
      ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('imagen')); };
    img.src = url;
  });
}

function PhotoCard({user}: {user: User}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast('Elige una imagen (JPG, PNG o similar).');
    if (file.size > MAX_MB * 1024 * 1024) return toast(`La imagen pesa más de ${MAX_MB} MB. Elige una más liviana.`);
    setBusy(true);
    try {
      const ok = updatePhoto(user.email, await squareJpeg(file));
      toast(ok ? 'Tu foto de perfil se actualizó' : 'No pudimos guardar la foto. Inténtalo de nuevo.');
    } catch {
      toast('No pudimos leer esa imagen. Prueba con otra.');
    } finally {
      setBusy(false);
    }
  };
  const remove = () => { if (updatePhoto(user.email, undefined)) toast('Quitaste tu foto de perfil'); };
  return (
    <section className="pa-section pa-photo" aria-labelledby="datos-foto">
      <span className="pa-photo-pic"><Avatar user={user}/></span>
      <div className="pa-photo-copy">
        <h2 id="datos-foto">Foto de perfil</h2>
        <p className="pa-section-text">Usa una foto tuya o el logo de tu empresa. JPG o PNG, hasta {MAX_MB} MB.</p>
        <div className="pa-photo-actions">
          <button type="button" className="button primary" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? 'Subiendo…' : user.photo ? 'Cambiar foto' : 'Subir foto'}
          </button>
          {user.photo && <button type="button" className="button ghost" onClick={remove}>Quitar</button>}
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={pick}/>
      </div>
    </section>
  );
}
