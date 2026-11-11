'use client';

import {useEffect, type ReactNode} from 'react';

function useOverlay(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
}

export function Drawer({title, onClose, children}: {title: ReactNode; onClose: () => void; children: ReactNode}) {
  useOverlay(onClose);
  return (
    <div className="modal-veil drawer-veil" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true">
        <header>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  );
}

/** Ventana centrada para formularios: no se cierra al tocar afuera para no perder lo escrito. */
export function Modal({title, onClose, footer, children}: {title: ReactNode; onClose: () => void; footer: ReactNode; children: ReactNode}) {
  useOverlay(onClose);
  return (
    <div className="modal-veil pe-veil">
      <section className="pe-modal" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <div className="pe-body">{children}</div>
        <footer>{footer}</footer>
      </section>
    </div>
  );
}
