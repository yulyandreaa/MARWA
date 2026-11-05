'use client';

import {useState, type FormEvent} from 'react';
import {changePassword} from '@/lib/shop';
import {isStrongPassword, passwordRules} from '@/lib/validation';
import {FormRow, PasswordField} from '@/components/shop/AuthShell';
import {toast} from '@/components/shop/ShopUI';
import {Dialog, SectionHead} from './AccountUI';

type Name = 'current' | 'next' | 'confirm';
const empty = {current: '', next: '', confirm: ''};

export function AccountSecurity({email, onSignOut}: {email: string; onSignOut: () => void}) {
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<Name, string>>>({});
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const bind = (k: Name) => ({
    id: `clave-${k}`, value: v[k], 'aria-label': undefined, 'aria-invalid': !!errors[k],
    'aria-describedby': [errors[k] ? `clave-${k}-error` : '', k === 'next' ? 'clave-reglas' : ''].filter(Boolean).join(' ') || undefined,
    onChange: (e: {target: {value: string}}) => { setV({...v, [k]: e.target.value}); setErrors({...errors, [k]: undefined}); },
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (!v.current) found.current = 'Escribe tu contraseña actual.';
    if (!isStrongPassword(v.next)) found.next = 'Tu contraseña nueva aún no cumple los requisitos.';
    if (v.confirm !== v.next) found.confirm = 'Las contraseñas no coinciden. Escríbela de nuevo.';
    setErrors(found);
    const first = (['current', 'next', 'confirm'] as Name[]).find(k => found[k]);
    if (first) return document.getElementById(`clave-${first}`)?.focus();

    setBusy(true);
    try {
      await changePassword(email, v.current, v.next);
      setV(empty);
      toast('Tu contraseña se actualizó');
    } catch (err) {
      setErrors({current: (err as Error).message});
      document.getElementById('clave-current')?.focus();
    }
    setBusy(false);
  };

  const requestDeletion = () => {
    const text = `Hola MARWA, solicito eliminar mi cuenta de la tienda (${email}).`;
    window.open(`https://wa.me/573102569469?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    setDeleting(false);
    setUnderstood(false);
    toast('Abrimos WhatsApp para enviar tu solicitud');
  };

  return (
    <>
      <SectionHead title="Seguridad" text={<>Ingresas con el correo {email}.</>}/>

      <form className="form pa-section pa-form" onSubmit={submit} noValidate aria-labelledby="clave-titulo">
        <h2 id="clave-titulo">Cambiar contraseña</h2>
        <FormRow id="clave-current" label="Contraseña actual" error={errors.current}>
          <PasswordField {...bind('current')} label="Tu contraseña actual" autoComplete="current-password"/>
        </FormRow>
        <FormRow id="clave-next" label="Contraseña nueva" error={errors.next}>
          <PasswordField {...bind('next')} label="Crea una contraseña" autoComplete="new-password"/>
          <ul className="au-rules" id="clave-reglas" aria-label="Requisitos de la contraseña">
            {passwordRules.map(r => {
              const ok = r.test(v.next);
              return <li key={r.label} className={ok ? 'ok' : ''}>{r.label}<span className="au-sr">{ok ? ' (cumplido)' : ' (pendiente)'}</span></li>;
            })}
          </ul>
        </FormRow>
        <FormRow id="clave-confirm" label="Confirmar contraseña nueva" error={errors.confirm}>
          <PasswordField {...bind('confirm')} label="Repite la contraseña nueva" autoComplete="new-password"/>
        </FormRow>
        <div className="pa-actions">
          <button className="button primary" disabled={busy || !v.current || !v.next || !v.confirm}>{busy ? 'Guardando…' : 'Cambiar contraseña'}</button>
        </div>
      </form>

      <section className="pa-section pa-form pa-split" aria-labelledby="sesion-titulo">
        <div>
          <h2 id="sesion-titulo">Sesión</h2>
          <p className="pa-section-text">Cierra tu sesión en este dispositivo.</p>
        </div>
        <button type="button" className="button ghost" onClick={onSignOut}>Cerrar sesión</button>
      </section>

      <section className="pa-section pa-form pa-split" aria-labelledby="borrar-titulo">
        <div>
          <h2 id="borrar-titulo">Eliminar mi cuenta</h2>
          <p className="pa-section-text">Solicita que MARWA elimine tu cuenta y tus datos.</p>
        </div>
        <button type="button" className="button ghost danger-ghost" onClick={() => setDeleting(true)}>Solicitar eliminación</button>
      </section>

      {deleting && (
        <Dialog
          title="¿Solicitar la eliminación de tu cuenta?"
          onClose={() => { setDeleting(false); setUnderstood(false); }}
          actions={<>
            <button type="button" className="button danger" disabled={!understood} onClick={requestDeletion}>Enviar solicitud por WhatsApp</button>
            <button type="button" className="button ghost" data-autofocus onClick={() => { setDeleting(false); setUnderstood(false); }}>Conservar mi cuenta</button>
          </>}
        >
          <ul className="pa-bullets">
            <li>Perderás el acceso a tu historial de pedidos, direcciones y favoritos.</li>
            <li>Los pedidos en proceso se terminarán de entregar.</li>
            <li>MARWA podría conservar los registros de compra que la ley exija.</li>
            <li>El equipo MARWA confirmará tu solicitud antes de eliminar la cuenta.</li>
          </ul>
          <label className="shop-check"><input type="checkbox" checked={understood} onChange={e => setUnderstood(e.target.checked)}/>Entiendo lo que implica eliminar mi cuenta.</label>
        </Dialog>
      )}
    </>
  );
}
