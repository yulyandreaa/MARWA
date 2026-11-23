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
      {/* Fondo 23-nov-2026 (referencia «Banner moderno de inicio y registro Marwa»): velos claros arriba a la izquierda
          y onda inferior azul que pasa a rojo, con brillo */}
      <svg className="au-veil" viewBox="0 0 800 600" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="au-v1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dfe8fb"/><stop offset="1" stopColor="#ffffff" stopOpacity="0"/></linearGradient>
          <linearGradient id="au-v2" x1="0" y1="0" x2="1" y2=".6"><stop offset="0" stopColor="#ffffff" stopOpacity=".95"/><stop offset="1" stopColor="#ffffff" stopOpacity="0"/></linearGradient>
        </defs>
        <path d="M0 0h430C300 40 150 140 0 330z" fill="url(#au-v1)"/>
        <path d="M0 250C120 120 280 40 520 0h-90C280 40 140 120 0 210z" fill="url(#au-v2)"/>
        <path d="M0 360C70 230 190 120 360 60" stroke="#ffffff" strokeOpacity=".9" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
      </svg>
      <svg className="au-waves" viewBox="0 0 1672 260" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="au-pale" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity=".9"/><stop offset=".6" stopColor="#e9effc" stopOpacity=".9"/><stop offset="1" stopColor="#ffffff" stopOpacity=".6"/></linearGradient>
          <linearGradient id="au-blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0a35d6"/><stop offset=".35" stopColor="#1f5cf5"/><stop offset=".62" stopColor="#5d8cff" stopOpacity=".55"/><stop offset=".78" stopColor="#9db8ff" stopOpacity="0"/></linearGradient>
          <linearGradient id="au-red" x1="0" y1="0" x2="1" y2="0"><stop offset=".5" stopColor="#ff6b78" stopOpacity="0"/><stop offset=".72" stopColor="#f04050" stopOpacity=".7"/><stop offset="1" stopColor="#e52332"/></linearGradient>
          <linearGradient id="au-shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity=".2"/><stop offset=".3" stopColor="#ffffff" stopOpacity=".95"/><stop offset=".7" stopColor="#ffffff" stopOpacity=".5"/><stop offset="1" stopColor="#ffffff" stopOpacity=".1"/></linearGradient>
        </defs>
        <path d="M0 110C320 40 660 60 1000 120s500 30 672-60v200H0z" fill="url(#au-pale)"/>
        <path d="M0 200C300 150 640 150 1000 200s480 30 672-110v170H0z" fill="url(#au-red)"/>
        <path d="M0 150C300 150 600 190 1000 236c240 22 450 22 672 6v18H0z" fill="url(#au-blue)"/>
        <path d="M0 150C300 150 600 190 1000 236c240 22 450 22 672 6" stroke="url(#au-shine)" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
        <path d="M1000 200c220 26 440 20 672-110" stroke="#ffd6da" strokeOpacity=".8" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
      </svg>
      <div className="au-intro">
        <Image className="au-logo" src="/assets/marwa-logo-oficial.png" alt="MARWA Redes y Energía" width={1200} height={602} priority/>
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
