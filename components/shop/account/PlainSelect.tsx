'use client';

import {useCallback, useRef, useState, type KeyboardEvent, type ReactNode} from 'react';
import {Icon} from '@/components/premium/Icons';
import {useDismiss} from './accountNav';

export type SelectOption<T extends string> = {value: T; label: string};

/**
 * Desplegable de los paneles, con el estilo de MARWA en vez del menú del sistema.
 * `field` lo muestra como campo de formulario; `caption` es su etiqueta.
 */
export function PlainSelect<T extends string>({label, value, options, onChange, field, caption, id, placeholder, disabled}: {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  field?: boolean;
  caption?: ReactNode;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const optionEls = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
  const focusOption = (index: number) => {
    const items = optionEls();
    if (items.length) items[(index + items.length) % items.length].focus();
  };
  const onListKey = (e: KeyboardEvent) => {
    const items = optionEls();
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); focusOption(at + 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); focusOption(at - 1); }
    if (e.key.length === 1) {
      const hit = items.findIndex(el => el.textContent?.toLowerCase().startsWith(e.key.toLowerCase()));
      if (hit >= 0) focusOption(hit);
    }
  };
  const openList = () => {
    setOpen(true);
    requestAnimationFrame(() => focusOption(Math.max(options.findIndex(o => o.value === value), 0)));
  };
  const choose = (next: T) => {
    onChange(next);
    close();
    ref.current?.querySelector('button')?.focus();
  };

  return (
    <div className={`ps${field ? ' ps-field' : ''}`} ref={ref}>
      {caption && <span className="ps-caption">{caption}</span>}
      <button id={id} type="button" className="ps-btn" disabled={disabled} aria-haspopup="listbox" aria-expanded={open} aria-label={label} onClick={() => (open ? close() : openList())}>
        <span>{options.find(o => o.value === value)?.label ?? placeholder ?? label}</span>
        <Icon name="chevron"/>
      </button>
      {open && (
        <ul className="ps-list" role="listbox" aria-label={label} onKeyDown={onListKey}>
          {options.map(o => (
            <li key={o.value}>
              <button type="button" role="option" aria-selected={o.value === value} onClick={() => choose(o.value)}>
                {o.label}
                {o.value === value && <Icon name="check"/>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
