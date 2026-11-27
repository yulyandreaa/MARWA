import {useEffect, type RefObject} from 'react';

export const accountTabs = [
  {id: 'pedidos', label: 'Mis compras', icon: 'cart'},
  {id: 'favoritos', label: 'Mis favoritos', icon: 'heart'},
  {id: 'direcciones', label: 'Mis direcciones', icon: 'pin'},
  {id: 'datos', label: 'Mis datos', icon: 'user'},
  {id: 'seguridad', label: 'Seguridad', icon: 'lock'},
  {id: 'pqr', label: 'Ayuda / PQR', icon: 'help'},
];

/* Menú del panel administrativo (27-nov-2026): mismas secciones que app/tienda/admin/page.tsx */
export const adminTabs = [
  {id: 'resumen', label: 'Resumen', icon: 'grid'},
  {id: 'pedidos', label: 'Pedidos', icon: 'box'},
  {id: 'productos', label: 'Productos', icon: 'tag'},
  {id: 'clientes', label: 'Clientes', icon: 'user'},
  {id: 'reportes', label: 'Reportes', icon: 'layers'},
  {id: 'pqr', label: 'PQR', icon: 'help'},
  {id: 'opiniones', label: 'Opiniones', icon: 'star'},
  {id: 'ajustes', label: 'Ajustes', icon: 'tools'},
];

/** Cierra un menú desplegable con Esc o al hacer clic por fuera. */
export function useDismiss(ref: RefObject<HTMLElement>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, open, close]);
}
