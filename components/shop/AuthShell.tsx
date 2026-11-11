'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState, type InputHTMLAttributes, type ReactNode} from 'react';
import {Icon} from '@/components/premium/Icons';

type ShellProps = {title: string; lead: string; children: ReactNode; heading?: ReactNode; intro?: ReactNode; className?: string};

const loginIntro = <>Tu plataforma para acceder a<br/> nuestro portafolio y gestionar<br/> tus pedidos.</>;

export function AuthShell({title, lead, children, heading = <>Bienvenido a <span>MARWA</span></>, intro = loginIntro, className = ''}: ShellProps) {
  return (
    <div className={`au ${className}`}>
      <svg className="au-waves" viewBox="0 0 1672 301" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="au-w" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="780" y2="0"><stop offset="0" stopColor="#c0d5f9"/><stop offset=".55" stopColor="#c6d9fa"/><stop offset="1" stopColor="#c6d9fa" stopOpacity="0"/></linearGradient>
          <linearGradient id="au-b" gradientUnits="userSpaceOnUse" x1="140" y1="0" x2="1290" y2="0"><stop offset="0" stopColor="#dbe6fb"/><stop offset=".65" stopColor="#e2eafb"/><stop offset="1" stopColor="#e2eafb" stopOpacity="0"/></linearGradient>
          <linearGradient id="au-r" x1="0" y1="0" x2="1" y2="0"><stop offset=".55" stopColor="#e52332"/><stop offset="1" stopColor="#e52332" stopOpacity=".1"/></linearGradient>
        </defs>
        <path d="M140 301C360 240 640 100 900 72c120-12 240 110 390 229z" fill="url(#au-b)"/>
        <path d="M1290 301c140-61 270-111 382-196v196z" fill="#dfe9fb"/>
        <path d="M0 215C90 150 200 115 300 115c170 0 300 90 480 186H0z" fill="url(#au-w)"/>
        <path className="au-line" d="M0 87c60-19 110-25 155-25 175 0 305 78 465 153 100 47 210 75 330 86" stroke="url(#au-r)" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
      </svg>
      <div className="au-intro">
        <Image className="au-logo" src="/assets/marwa-logo-oficial.png" alt="MARWA Redes y Energía" width={900} height={445} priority/>
        <h1>{heading}</h1>
        <p>{intro}</p>
      </div>
      <div className="au-card">
        <h2>{title}</h2>
        <p className="au-lead">{lead}</p>
        {children}
      </div>
    </div>
  );
}

/** Separador con pregunta y botón secundario, al pie de la tarjeta. */
export function AuthAlt({question, href, children}: {question: string; href: string; children: ReactNode}) {
  return (
    <>
      <p className="au-divider"><span>{question}</span></p>
      <Link className="button ghost block" href={href}>{children}</Link>
    </>
  );
}

/** Etiqueta permanente + campo + ayuda o error, compartido por registro y panel. */
export function FormRow({id, label, error, hint, children}: {id: string; label: ReactNode; error?: string; hint?: ReactNode; children: ReactNode}) {
  return (
    <div className={`au-row${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="pa-hint">{hint}</p>}
      {error && <p className="au-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {icon: string; label: string};

export function AuthField({icon, label, ...input}: FieldProps) {
  return (
    <span className="au-field">
      <Icon name={icon}/>
      <input placeholder={label} aria-label={label} {...input}/>
    </span>
  );
}

export function PasswordField({label, ...input}: Omit<FieldProps, 'icon' | 'type'>) {
  const [shown, setShown] = useState(false);
  return (
    <span className="au-field">
      <Icon name="lock"/>
      <input placeholder={label} aria-label={label} {...input} type={shown ? 'text' : 'password'}/>
      <button type="button" className="au-eye" onClick={() => setShown(!shown)} aria-label={shown ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={shown}>
        <Icon name={shown ? 'eye' : 'eyeOff'}/>
      </button>
    </span>
  );
}
