'use client';

import {useState} from 'react';
import {Icon} from '@/components/premium/Icons';

/** Parte una lista larga en páginas; `pager` es null si cabe en una sola. */
export function usePaged<T>(items: T[], size = 20) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pages - 1);
  const go = (n: number) => { setPage(n); window.scrollTo({top: 0, behavior: 'smooth'}); };
  return {
    items: items.slice(current * size, (current + 1) * size),
    pager: pages > 1 ? (
      <nav className="pa-pager" aria-label="Páginas">
        <button type="button" disabled={current === 0} onClick={() => go(current - 1)} aria-label="Página anterior"><Icon name="chevron"/></button>
        <span>Página {current + 1} de {pages}</span>
        <button type="button" disabled={current === pages - 1} onClick={() => go(current + 1)} aria-label="Página siguiente"><Icon name="chevron"/></button>
      </nav>
    ) : null,
  };
}
