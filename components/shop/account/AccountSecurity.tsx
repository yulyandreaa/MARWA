'use client';

import {useState, type FormEvent} from 'react';
import {changePassword, deleteAccount} from '@/lib/shop';
import {isStrongPassword, passwordRules} from '@/lib/validation';
import {FormRow, PasswordField} from '@/components/shop/AuthShell';
import {toast} from '@/components/shop/ShopUI';
import {Dialog, SectionHead} from './AccountUI';

type Name = 'current' | 'next' | 'confirm';
const empty = {current: '', next: '', confirm: ''};

export function AccountSecurity({email}: {email: string}) {
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<Name, string>>>({});
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [deletePass, setDeletePass] = useState('');
  const [deleteError, setDeleteError] = useState('');

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

  const closeDeletion = () => { setDeleting(false); setUnderstood(false); setDeletePass(''); setDeleteError(''); };
  const confirmDeletion = async () => {
    try {
      await deleteAccount(email, deletePass);
      toast('Tu cuenta fue eliminada');
    } catch (err) {
      setDeleteError((err as Error).message);
    }
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

      <section className="pa-section pa-form pa-split" aria-labelledby="borrar-titulo">
        <div>
          <h2 id="borrar-titulo">Eliminar mi cuenta</h2>
          <p className="pa-section-text">Borra tu cuenta, tus direcciones y tus favoritos.</p>
        </div>
        <button type="button" className="button ghost danger-ghost" onClick={() => setDeleting(true)}>Eliminar cuenta</button>
      </section>

      {deleting && (
        <Dialog
          title="¿Eliminar tu cuenta?"
          onClose={closeDeletion}
          actions={<>
            <button type="button" className="button danger" disabled={!understood} onClick={confirmDeletion}>Eliminar mi cuenta</button>
            <button type="button" className="button ghost" data-autofocus onClick={closeDeletion}>Conservar mi cuenta</button>
          </>}
        >
          <ul className="pa-bullets">
            <li>Perderás el acceso a tu historial de pedidos, direcciones y favoritos.</li>
            <li>Los pedidos en proceso se terminarán de entregar.</li>
            <li>MARWA conserva los registros de compra que la ley exija.</li>
          </ul>
          <label className="pa-field">Confirma tu contraseña
            <input type="password" autoComplete="current-password" value={deletePass} onChange={e => { setDeletePass(e.target.value); setDeleteError(''); }}/>
          </label>
          {deleteError && <p className="form-error" role="alert">{deleteError}</p>}
          <label className="shop-check"><input type="checkbox" checked={understood} onChange={e => setUnderstood(e.target.checked)}/>Entiendo que esto no se puede deshacer</label>
        </Dialog>
      )}
    </>
  );
}
