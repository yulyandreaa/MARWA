'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState, type KeyboardEvent, type MouseEvent} from 'react';
import {categories, type CategoryId} from '@/data/shopSeed';
import {Icon} from '@/components/premium/Icons';
import {waLink} from '@/components/premium/SiteChrome';

type Line = {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  headline: string;
  image?: string;
  links: [label: string, href: string][];
  /** Con categoría hay productos; sin ella la línea aún no se vende en la tienda. */
  category?: CategoryId;
};

const find = (q: string) => `/tienda?q=${encodeURIComponent(q)}`;
const blurb = (id: CategoryId) => categories.find(c => c.id === id)?.description ?? '';
const line = (id: CategoryId, name: string, icon: string, headline: string, image: string, links: Line['links']): Line =>
  ({id, name, icon, headline, image, links, category: id, blurb: blurb(id)});

const lines: Line[] = [
  line('cableado', 'Cableado estructurado', 'ethernet', 'Conectividad sin interrupciones', '/assets/mega-cableado.jpg', [
    ['Cables de red (UTP / FTP)', find('UTP')],
    ['Conectores y plugs', find('RJ45')],
    ['Patch cords', find('Patch cord')],
    ['Patch panels', find('Patch panel')],
    ['Organizadores de cable', find('Organizador')],
    ['Racks y gabinetes', '/tienda?categoria=infraestructura'],
  ]),
  line('fibra', 'Fibra óptica', 'fiber', 'Velocidad para tu operación', '/assets/solution-fiber.jpg', [
    ['Cables de fibra', find('Cable de fibra')],
    ['Patch cords de fibra', find('Patch cord de fibra')],
    ['Conectores', find('Conector rápido')],
    ['Cajas NAP', find('NAP')],
  ]),
  line('networking', 'Networking', 'network', 'Redes que crecen contigo', '/assets/solution-networking.jpg', [
    ['Switches', find('Switch')],
    ['Routers', find('Router')],
    ['Access points', find('Access point')],
    ['Módulos SFP', find('SFP')],
  ]),
  line('plastica', 'Línea plástica', 'pipes', 'Canalización ordenada y durable', '/assets/solution-plastic.jpg', [
    ['Canaletas', find('Canaleta')],
    ['Tubería conduit', find('conduit')],
    ['Cajas plásticas', find('Caja plástica')],
    ['Accesorios para canaleta', find('Ángulo')],
  ]),
  line('infraestructura', 'Infraestructura', 'server', 'Tu cuarto técnico en orden', '/assets/solution-infrastructure.jpg', [
    ['Racks de piso', find('Rack de piso')],
    ['Gabinetes', find('Gabinete')],
    ['Bandejas', find('Bandeja')],
    ['Multitomas', find('Multitoma')],
    ['Organizadores', find('Organizador')],
  ]),
  {id: 'hdtv', name: 'HDTV', icon: 'tv', blurb: 'Estamos preparando esta línea para la tienda.', headline: 'Muy pronto en la tienda', links: []},
  {id: 'energia', name: 'Energía', icon: 'bolt', blurb: 'Estamos preparando esta línea para la tienda.', headline: 'Muy pronto en la tienda', links: []},
];

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
            {lines.map(l => {
              const props = {
                className: l.id === current.id ? 'on' : '',
                onMouseEnter: () => setCurrent(l),
                onFocus: () => setCurrent(l),
              };
              const body = <><Icon name={l.icon}/><span>{l.name}</span>{l.category ? <Icon name="chevron"/> : <small>Próximamente</small>}</>;
              return (
                <li key={l.id}>
                  {l.category
                    ? <Link {...props} href={`/tienda?categoria=${l.category}`} onClick={close}>{body}</Link>
                    : <button {...props} type="button" onClick={() => setCurrent(l)}>{body}</button>}
                </li>
              );
            })}
          </ul>

          <div className="mg-detail">
            <h2>{current.name}</h2>
            <p>{current.blurb}</p>
            {current.links.length > 0 && (
              <>
                <h3>Explora la categoría</h3>
                <ul>
                  {current.links.map(([label, href]) => <li key={label}><Link href={href} onClick={close}>{label}</Link></li>)}
                </ul>
              </>
            )}
            <Link className="mg-all" href="/tienda?vista=todos" onClick={close}>Ver todo el catálogo</Link>
          </div>

          <div className={current.id === 'cableado' ? 'mg-banner' : 'mg-banner striped'}>
            {current.image && <Image src={current.image} alt="" fill sizes="340px"/>}
            <div>
              <span>{current.name}</span>
              <b>{current.headline}</b>
              {current.category
                ? <Link href={`/tienda?categoria=${current.category}`} onClick={close}>Ver productos <Icon name="arrow"/></Link>
                : <a href={waLink(`Hola MARWA, quiero cotizar productos de ${current.name}.`)} target="_blank" rel="noopener">Cotizar con un asesor <Icon name="arrow"/></a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
