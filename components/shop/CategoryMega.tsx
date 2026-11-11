'use client';

import {useSubsOf} from '@/lib/settings';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useRef, useState, type KeyboardEvent, type MouseEvent} from 'react';
import {categories, type CategoryId} from '@/data/shopSeed';
import {Icon} from '@/components/premium/Icons';

/**
 * Menú de categorías al estilo del de LUMINA: panel plano a todo el ancho bajo el encabezado,
 * una columna de texto por línea (subcategorías + "Ver todo") y 2 tarjetas pequeñas con foto.
 * Sin banners: liviano y fácil de leer.
 */
const icons: Record<CategoryId, string> = {
  cableado: 'ethernet', fibra: 'fiber', plastica: 'pipes', hdtv: 'tv', canalizacion: 'duct', metalmecanica: 'server',
};
const subHref = (id: CategoryId, sub: string) => `/tienda?categoria=${id}&tipo=${encodeURIComponent(sub)}`;

const cards = [
  {label: 'Todo el catálogo', href: '/tienda?vista=todos', image: '/assets/tienda-carrete.jpg'},
  {label: 'Novedades', href: '/tienda?vista=novedades', image: '/assets/producto-cable-cat5e.jpg'},
];

export function CategoryMega({onNavigate}: {onNavigate?: () => void}) {
  const subsOf = useSubsOf();
  const [show, setShow] = useState(false);
  const close = () => { setShow(false); onNavigate?.(); };
  // Al mover el mouse del botón al panel se cruza un espacio del encabezado: esperar un momento
  // antes de cerrar evita que el menú se cierre y se vuelva a abrir (parpadeo).
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const enter = () => { clearTimeout(timer.current); setShow(true); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setShow(false), 250); };
  useEffect(() => () => clearTimeout(timer.current), []);

  // Con mouse el menú ya abrió al pasar por encima: el clic no debe cerrarlo.
  const toggle = (e: MouseEvent) => {
    const hovering = e.detail > 0 && window.matchMedia('(hover: hover)').matches;
    setShow(open => hovering || !open);
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShow(false); };

  return (
    <div className={`mg${show ? ' open' : ''}`} onMouseEnter={enter} onMouseLeave={leave} onKeyDown={onKey}>
      <button type="button" className="mg-toggle" aria-expanded={show} onClick={toggle}>
        <Icon name="menu"/>Categorías<Icon name="chevron"/>
      </button>

      <div className="mg-panel">
        <div className="pm-wrap mg-in">
          <div className="mg-cols">
            {categories.map(c => (
              <div key={c.id} className="mg-col">
                <Link className="mg-col-title" href={`/tienda?categoria=${c.id}`} onClick={close}>
                  <Icon name={icons[c.id]}/><span>{c.name}</span>
                </Link>
                <ul>
                  {subsOf(c.id, c.subs).slice(0, 5).map(sub => (
                    <li key={sub}><Link href={subHref(c.id, sub)} onClick={close}>{sub}</Link></li>
                  ))}
                </ul>
                <Link className="mg-col-all" href={`/tienda?categoria=${c.id}`} onClick={close}>Ver todo</Link>
              </div>
            ))}
          </div>

          <div className="mg-cards">
            {cards.map(card => (
              <Link key={card.label} href={card.href} className="mg-card2" onClick={close}>
                <span><Image src={card.image} alt="" fill sizes="200px"/></span>
                <b>{card.label}</b>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
