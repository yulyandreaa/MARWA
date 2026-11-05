'use client';

import Link from 'next/link';
import {Suspense, useRef, useState, type FormEvent, type MouseEvent} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {isEmailTaken, register} from '@/lib/shop';
import {isStrongPassword, isValidPhone, passwordRules, phoneDigits, phoneError} from '@/lib/validation';
import {AuthField, AuthShell, FormRow, PasswordField} from '@/components/shop/AuthShell';
import {emptyProfile} from '@/components/shop/ProfileFields';

type FieldName = 'name' | 'email' | 'phone' | 'password' | 'confirm';
type Values = Record<FieldName, string>;

const fieldOrder: FieldName[] = ['name', 'email', 'phone', 'password', 'confirm'];
function validate(v: Values): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  const name = v.name.trim();
  const email = v.email.trim();

  if (!name) errors.name = 'Escribe tu nombre completo.';
  else if (name.split(/\s+/).length < 2) errors.name = 'Incluye tu nombre y tu apellido.';

  if (!email) errors.email = 'Escribe tu correo electrónico.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Revisa el correo. Debe verse así: nombre@empresa.com.';
  else if (isEmailTaken(email)) errors.email = 'Ya hay una cuenta con este correo. Inicia sesión o usa otro.';

  if (!phoneDigits(v.phone)) errors.phone = 'Escribe tu número de contacto.';
  else if (!isValidPhone(v.phone)) errors.phone = phoneError;

  if (!v.password) errors.password = 'Crea una contraseña.';
  else if (!isStrongPassword(v.password)) errors.password = 'Tu contraseña aún no cumple los requisitos de abajo.';

  if (!v.confirm) errors.confirm = 'Repite tu contraseña.';
  else if (v.confirm !== v.password) errors.confirm = 'Las contraseñas no coinciden. Escríbela de nuevo.';

  return errors;
}

/* Pendiente: aún no existen las páginas legales. Cuando estén, reemplazar estas rutas. */
const TERMS_URL = '#';
const PRIVACY_URL = '#';
const pendingLegal = (e: MouseEvent) => e.preventDefault();

function RegisterForm() {
  const router = useRouter();
  const next = useSearchParams()?.get('next');
  const [values, setValues] = useState<Values>({name: '', email: '', phone: '', password: '', confirm: ''});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formError, setFormError] = useState('');
  const sending = useRef(false);

  const errors = validate(values);
  const shown = (k: FieldName) => (touched[k] ? errors[k] : undefined);
  const complete = fieldOrder.every(k => values[k].trim()) && accepted;
  const started = accepted || fieldOrder.some(k => values[k]);

  const field = (k: FieldName) => ({
    id: `registro-${k}`,
    name: k,
    value: values[k],
    required: true,
    disabled: status !== 'idle',
    'aria-label': undefined,
    'aria-invalid': !!shown(k),
    'aria-describedby': [shown(k) ? `registro-${k}-error` : '', k === 'password' ? 'registro-reglas' : ''].filter(Boolean).join(' ') || undefined,
    onChange: (e: {target: {value: string}}) => setValues(v => ({...v, [k]: e.target.value})),
    onBlur: () => setTouched(t => ({...t, [k]: true})),
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending.current || !complete) return;
    setTouched({name: true, email: true, phone: true, password: true, confirm: true});
    const firstError = fieldOrder.find(k => errors[k]);
    if (firstError) return document.getElementById(`registro-${firstError}`)?.focus();

    sending.current = true;
    setStatus('loading');
    setFormError('');
    try {
      await register({...emptyProfile, name: values.name.trim(), phone: phoneDigits(values.phone), email: values.email, password: values.password});
      setStatus('success');
      setTimeout(() => router.push(next?.startsWith('/tienda') ? next : '/tienda/cuenta'), 700);
    } catch (err) {
      sending.current = false;
      setStatus('idle');
      setFormError((err as Error).message);
    }
  };

  return (
    <AuthShell
      className="au-register"
      heading={<>Crea tu cuenta en <span>MARWA</span></>}
      intro="Accede a nuestro portafolio, realiza compras y gestiona tus pedidos de forma sencilla."
      title="Crear una cuenta"
      lead="Completa tus datos para comenzar a disfrutar de MARWA."
    >
      <form onSubmit={submit} className="form" noValidate>
        <FormRow id="registro-name" label="Nombre completo" error={shown('name')}>
          <AuthField {...field('name')} icon="user" label="Ej: Ana Gómez" autoComplete="name"/>
        </FormRow>
        <FormRow id="registro-email" label="Correo electrónico" error={shown('email')}>
          <AuthField {...field('email')} icon="mail" label="nombre@empresa.com" type="email" autoComplete="email"/>
        </FormRow>
        <FormRow id="registro-phone" label="Número de contacto" error={shown('phone')}>
          <AuthField {...field('phone')} icon="phone" label="310 256 9469" type="tel" inputMode="tel" autoComplete="tel"/>
        </FormRow>
        <FormRow id="registro-password" label="Contraseña" error={shown('password')}>
          <PasswordField {...field('password')} label="Crea una contraseña" autoComplete="new-password"/>
          <ul className="au-rules" id="registro-reglas" aria-label="Requisitos de la contraseña">
            {passwordRules.map(r => {
              const ok = r.test(values.password);
              return <li key={r.label} className={ok ? 'ok' : ''}>{r.label}<span className="au-sr">{ok ? ' (cumplido)' : ' (pendiente)'}</span></li>;
            })}
          </ul>
        </FormRow>
        <FormRow id="registro-confirm" label="Confirmar contraseña" error={shown('confirm')}>
          <PasswordField {...field('confirm')} label="Repite tu contraseña" autoComplete="new-password"/>
        </FormRow>

        <label className="shop-check">
          <input type="checkbox" checked={accepted} disabled={status !== 'idle'} onChange={e => setAccepted(e.target.checked)}/>
          <span>Acepto los <a href={TERMS_URL} onClick={pendingLegal}>términos y condiciones</a> y la <a href={PRIVACY_URL} onClick={pendingLegal}>política de privacidad</a>.</span>
        </label>

        {formError && <p className="form-error" role="alert">{formError}</p>}
        <button className={`button primary block${status === 'success' ? ' is-success' : ''}`} disabled={!complete || status !== 'idle'} aria-busy={status === 'loading'}>
          {status === 'loading' && <><i className="au-spinner" aria-hidden="true"/>Creando cuenta…</>}
          {status === 'success' && '✓ ¡Cuenta creada!'}
          {status === 'idle' && 'Crear cuenta'}
        </button>
        {started && !complete && status === 'idle' && <p className="au-hint">Completa todos los campos y acepta los términos para continuar.</p>}
        <p className="au-sr" role="status">{status === 'loading' ? 'Creando tu cuenta' : status === 'success' ? 'Cuenta creada. Te llevamos a tu panel.' : ''}</p>
      </form>
      <p className="au-login">¿Ya tienes una cuenta? <Link href={`/tienda/ingresar${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Iniciar sesión</Link></p>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm/></Suspense>;
}
