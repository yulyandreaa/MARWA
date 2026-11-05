'use client';

import {Suspense, useState, type FormEvent} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {login} from '@/lib/shop';
import {AuthAlt, AuthField, AuthShell, PasswordField} from '@/components/shop/AuthShell';

const recover = `https://wa.me/573102569469?text=${encodeURIComponent('Hola MARWA, olvidé la contraseña de mi cuenta en la tienda.')}`;

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams()?.get('next');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const user = await login(String(f.get('email')), String(f.get('password')));
      router.push(user.role === 'vendedor' ? '/tienda/admin' : next?.startsWith('/tienda') ? next : '/tienda/cuenta');
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Accede a tu cuenta" lead="Ingresa o crea tu cuenta para continuar.">
      <form onSubmit={submit} className="form">
        <AuthField icon="mail" label="Correo electrónico" required type="email" name="email" autoComplete="email"/>
        <PasswordField label="Contraseña" required name="password" autoComplete="current-password"/>
        <a className="au-forgot" href={recover} target="_blank" rel="noreferrer">¿Olvidaste tu contraseña?</a>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button primary block" disabled={busy}>{busy ? 'Ingresando…' : 'Iniciar sesión'}</button>
      </form>
      <AuthAlt question="¿Es tu primera vez en MARWA?" href={`/tienda/registro${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Crear una cuenta</AuthAlt>
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm/></Suspense>;
}
