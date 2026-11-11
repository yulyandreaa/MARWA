'use client';

import Image from 'next/image';
import {useState} from 'react';

/**
 * Portada de la página de inicio: el ecosistema MARWA (10-nov-2026, v4).
 * La imagen (Magnific 4K, 6336x2688, sin textos) solo trae los productos, las plataformas y las conexiones;
 * los títulos de cada línea se escriben en código encima, para que siempre se vean nítidos y se puedan editar.
 * Cada línea es una zona interactiva: al pasar el cursor se ilumina y muestra una tarjeta con "Ver productos";
 * al hacer clic abre la categoría en la tienda. La portada no se mueve sola (pedido del usuario).
 * box = zona sensible (left, top, width, height en % de la imagen) · label = posición del título (x, y en %) y alineación.
 */
type Zone = {
  id: string; title: [string, string?]; text: string; href?: string; color: string;
  box: [number, number, number, number]; label: [number, number, 'left' | 'right' | 'center']; soon?: boolean;
};

const zones: Zone[] = [
  {id: 'cableado', title: ['Cableado', 'estructurado'], text: 'Cables UTP, FTP, LSZH, accesorios y conectividad.', href: '/tienda?categoria=cableado', color: '#1f6bff', box: [16.5, 8, 28.5, 23.5], label: [29.3, 15.5, 'right']},
  {id: 'fibra', title: ['Fibra', 'óptica'], text: 'Monomodo ADSS y DROP, multimodo OM3 y herrajería.', href: '/tienda?categoria=fibra', color: '#13b5c8', box: [55, 6.5, 32, 25], label: [71, 14.5, 'left']},
  {id: 'metalmecanica', title: ['Metalmecánica'], text: 'Racks y gabinetes para telecomunicaciones.', href: '/tienda?categoria=metalmecanica', color: '#e52332', box: [1, 32.5, 28.5, 26], label: [14.2, 41.5, 'right']},
  {id: 'plastica', title: ['Línea', 'plástica'], text: 'Amarres, espirales, cajas de paso, prensa estopas, face plate y organizadores.', href: '/tienda?categoria=plastica', color: '#3b4660', box: [69.5, 35, 30, 23.5], label: [85.6, 41.5, 'left']},
  {id: 'canalizacion', title: ['Canalización', 'y ductería'], text: 'Canaletas, tubería SCH 40, EMT e IMC, ductos y bandejas porta cables.', href: '/tienda?categoria=canalizacion', color: '#1f6bff', box: [8.5, 62, 28.5, 21.5], label: [21.6, 69, 'right']},
  {id: 'hdtv', title: ['HDTV'], text: 'Cables, extender y splitter.', href: '/tienda?categoria=hdtv', color: '#e52332', box: [63, 61, 30, 21.5], label: [79, 70.5, 'left']},
  {id: 'proximo', title: ['Próximo lanzamiento'], text: 'Energía y Networking: nuevas líneas con soluciones integrales.', color: '#10233f', box: [42.5, 66, 15, 34], label: [50, 93.5, 'center'], soon: true},
];

export function EcoHero() {
  const [on, setOn] = useState<string | null>(null);
  return (
    <section className="eh" id="ecosistema" aria-labelledby="eh-title">
      <header className="eh-head pm-wrap">
        <span className="eh-eyebrow">Ecosistema MARWA</span>
        <h1 id="eh-title" data-split>Seis líneas. <em>Una sola conexión.</em></h1>
      </header>

      <div className={`eh-stage${on ? ' has-on' : ''}`}>
        <div className="eh-img">
          <Image src="/assets/ecosistema-marwa-v6.jpg" alt="Ecosistema MARWA Redes y Energía: el logo MARWA al centro conectado a cableado estructurado, fibra óptica, metalmecánica, línea plástica, canalización y ductería, HDTV y un próximo lanzamiento" fill priority quality={92} sizes="(max-width: 767px) 100vw, 1600px"/>
        </div>

        {/* logo oficial del manual sobre el disco central (no lo dibuja la IA) */}
        <span className="eh-logo"><Image src="/assets/marwa-logo-manual.png" alt="MARWA Redes y Energía" width={1600} height={767} sizes="200px" priority/></span>

        {/* títulos de cada línea, escritos en código */}
        {zones.map(z => (
          <span
            key={`t-${z.id}`}
            className={`eh-label is-${z.label[2]}${on === z.id ? ' on' : ''}${z.soon ? ' soon' : ''}`}
            style={{left: `${z.label[0]}%`, top: `${z.label[1]}%`, ['--bar' as string]: z.color}}
            aria-hidden="true"
          >
            <b>{z.title[0]}{z.title[1] && <><br/>{z.title[1]}</>}</b>
            {z.soon && <small>Energía y Networking</small>}
          </span>
        ))}

        {zones.map(z => {
          const style = {left: `${z.box[0]}%`, top: `${z.box[1]}%`, width: `${z.box[2]}%`, height: `${z.box[3]}%`};
          const name = z.title.filter(Boolean).join(' ');
          const inner = (
            <span className={`eh-card${z.box[1] > 50 ? ' up' : ''}`}>
              <b>{name}</b>
              <small>{z.text}</small>
              <span className="eh-card-cta">{z.soon ? 'Muy pronto' : 'Ver productos →'}</span>
            </span>
          );
          const common = {
            className: `eh-zone${on === z.id ? ' on' : ''}${z.soon ? ' soon' : ''}`,
            style,
            onMouseEnter: () => setOn(z.id),
            onMouseLeave: () => setOn(null),
            onFocus: () => setOn(z.id),
            onBlur: () => setOn(null),
          };
          return z.href
            ? <a key={z.id} href={z.href} target="_blank" rel="noopener" aria-label={`${name}: ver productos en la tienda`} {...common}>{inner}</a>
            : <div key={z.id} tabIndex={0} aria-label={`${name}: ${z.text}`} {...common}>{inner}</div>;
        })}
      </div>

      {/* En celular: las líneas como botones debajo de la imagen */}
      <nav className="eh-list pm-wrap" aria-label="Líneas MARWA">
        {zones.filter(z => z.href).map(z => <a key={z.id} href={z.href} target="_blank" rel="noopener">{z.title.filter(Boolean).join(' ')}</a>)}
      </nav>
    </section>
  );
}
