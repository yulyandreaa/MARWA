'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState, type KeyboardEvent, type MouseEvent} from 'react';
import {categories, type CategoryId} from '@/data/shopSeed';
import {Icon} from '@/components/premium/Icons';

type Line = {id: CategoryId; name: string; icon: string; blurb: string; headline: string; image: string; subs: string[]};

/* Las subcategorías salen de shopSeed; aquí solo va la presentación de cada línea. */
const look: Record<CategoryId, {icon: string; headline: string; image: string}> = {
  cableado: {icon: 'ethernet', headline: 'Conectividad sin interrupciones', image: '/assets/mega-cableado.jpg'},
  fibra: {icon: 'fiber', headline: 'Velocidad para tu operación', image: '/assets/solution-fiber.jpg'},
  plastica: {icon: 'pipes', headline: 'Tu cableado sujeto y organizado', image: '/assets/solution-plastic.jpg'},
  hdtv: {icon: 'tv', headline: 'Tu señal de video, de punta a punta', image: '/assets/solution-hdtv.jpg'},
  canalizacion: {icon: 'duct', headline: 'Canalización ordenada y durable', image: '/assets/solution-plastic.jpg'},
  metalmecanica: {icon: 'server', headline: 'Tu cuarto técnico en orden', image: '/assets/solution-infrastructure.jpg'},
};
const lines: Line[] = categories.map(c => ({id: c.id, name: c.name, blurb: c.description, subs: c.subs, ...look[c.id]}));
const subHref = (id: CategoryId, sub: string) => `/tienda?categoria=${id}&tipo=${encodeURIComponent(sub)}`;

export function CategoryMega({onNavigate}: {onNavigate?: () => void}) {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(lines[0]);
  const close = () => { setShow(false); onNavigate?.(); };

  // Con mouse el menú ya abrió al pasar por encima: el clic no debe cerrarlo.
  const toggle = (e: MouseEvent) => {
    const hovering = e.detail > 0 && window.matchMedia('(hover: hover)').matches;
    setShow(open => hovering || !open);
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShow(false); };

  return (
    <div className={`mg${show ? ' open' : ''}`} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onKeyDown={onKey}>
      <button type="button" className="mg-toggle" aria-expanded={show} onClick={toggle}>
        <Icon name="menu"/>Categorías<Icon name="chevron"/>
      </button>

      <div className="mg-panel">
        <div className="mg-card">
          <ul className="mg-lines">
            {lines.map(l => (
              <li key={l.id}>
                <Link
                  className={l.id === current.id ? 'on' : ''}
                  href={`/tienda?categoria=${l.id}`}
                  onClick={close}
                  onMouseEnter={() => setCurrent(l)}
                  onFocus={() => setCurrent(l)}
                >
                  <Icon name={l.icon}/><span>{l.name}</span><Icon name="chevron"/>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mg-detail">
            <h2>{current.name}</h2>
            <p>{current.blurb}</p>
            <h3>Explora la categoría</h3>
            <ul>
              {current.subs.map(sub => <li key={sub}><Link href={subHref(current.id, sub)} onClick={close}>{sub}</Link></li>)}
            </ul>
            <Link className="mg-all" href="/tienda?vista=todos" onClick={close}>Ver todo el catálogo</Link>
          </div>

          <div className={current.id === 'cableado' ? 'mg-banner' : 'mg-banner striped'}>
            <Image src={current.image} alt="" fill sizes="340px"/>
            <div>
              <span>{current.name}</span>
              <b>{current.headline}</b>
              <Link href={`/tienda?categoria=${current.id}`} onClick={close}>Ver productos <Icon name="arrow"/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
