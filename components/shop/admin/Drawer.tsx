'use client';

import {useEffect, type ReactNode} from 'react';

export function Drawer({title, onClose, children}: {title: ReactNode; onClose: () => void; children: ReactNode}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
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
