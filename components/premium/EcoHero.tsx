'use client';

import Image from 'next/image';
import {useState} from 'react';
import {LOGO_BARS, LOGO_VB, LOGO_WORD} from '@/data/logoMarwa';

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
  {id: 'cableado', title: ['Cableado', 'estructurado'], text: 'Cables UTP, FTP, LSZH, accesorios y conectividad.', href: '/tienda?categoria=cableado', color: '#1f6bff', box: [27.7, 6.8, 15.6, 25.9], label: [27.1, 18.0, 'right']},
  {id: 'fibra', title: ['Fibra', 'óptica'], text: 'Monomodo ADSS y DROP, multimodo OM3 y herrajería.', href: '/tienda?categoria=fibra', color: '#13b5c8', box: [55.4, 6.8, 15.2, 25.9], label: [70.5, 16.3, 'left']},
  {id: 'metalmecanica', title: ['Metalmecánica'], text: 'Racks y gabinetes para telecomunicaciones.', href: '/tienda?categoria=metalmecanica', color: '#e52332', box: [14.7, 35.1, 16.5, 27.6], label: [14.7, 48.9, 'right']},
  {id: 'plastica', title: ['Línea', 'plástica'], text: 'Amarres, espirales, cajas de paso, prensa estopas, face plate y organizadores.', href: '/tienda?categoria=plastica', color: '#3b4660', box: [68.1, 38.6, 15.2, 24.1], label: [83.4, 52.4, 'left']},
  {id: 'canalizacion', title: ['Canalización', 'y ductería'], text: 'Canaletas, tubería SCH 40, EMT e IMC, ductos y bandejas porta cables.', href: '/tienda?categoria=canalizacion', color: '#1f6bff', box: [23.2, 63.3, 15.2, 24.1], label: [23.1, 75.4, 'right']},
  {id: 'hdtv', title: ['HDTV'], text: 'Cables, extender y splitter.', href: '/tienda?categoria=hdtv', color: '#e52332', box: [61.6, 64.2, 15.2, 24.1], label: [76.6, 77.1, 'left']},
];

/* Logo del manual (LOGO MARWA.ai) en VECTOR, encima de la plataforma hexagonal de la imagen:
   se ve nítido en cualquier pantalla. Las 3 barras y la palabra entran por separado;
   el brillo usa la silueta del logo como máscara. */
function HexLogo() {
  const shapes = (white?: boolean) => (
    <>
      {LOGO_BARS.map((p, i) => <path key={`b${i}`} className={white ? undefined : `eh-hex-bar b${i + 1}`} d={p.d} fill={white ? '#fff' : p.fill}/>)}
      <g className={white ? undefined : 'eh-hex-word'}>{LOGO_WORD.map((p, i) => <path key={`w${i}`} d={p.d} fill={white ? '#fff' : p.fill}/>)}</g>
    </>
  );
  const [x, y, w, h] = LOGO_VB.split(' ').map(Number);
  return (
    <span className="eh-hex" role="img" aria-label="MARWA Redes y Energía">
      <svg viewBox={LOGO_VB} aria-hidden="true" shapeRendering="geometricPrecision">
        <defs>
          <mask id="eh-logo-mask" maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h}>{shapes(true)}</mask>
          <linearGradient id="eh-hex-shine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset=".5" stopColor="#fff" stopOpacity=".75"/><stop offset="1" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {shapes()}
        <g mask="url(#eh-logo-mask)">
          <rect className="eh-hex-shine" x={x - 170} y={y - 50} width="160" height={h + 100} fill="url(#eh-hex-shine)"/>
        </g>
      </svg>
    </span>
  );
}

export function EcoHero() {
  const [on, setOn] = useState<string | null>(null);
  return (
    <section className="eh" id="ecosistema" aria-labelledby="eh-title">
      {/* título solo para lectores de pantalla y buscadores: en pantalla se quitó para no saturar (19-nov-2026) */}
      <h1 id="eh-title" className="eh-sr">MARWA Redes y Energía: seis líneas de producto, una sola conexión</h1>

      <div className={`eh-stage${on ? ' has-on' : ''}`}>
        <div className="eh-img">
          <Image src="/assets/ecosistema-marwa-v17.jpg" alt="Ecosistema MARWA Redes y Energía: el logo MARWA sobre una plataforma hexagonal al centro, conectado a cableado estructurado, fibra óptica, metalmecánica, línea plástica, canalización y ductería y HDTV" fill priority quality={92} sizes="(max-width: 767px) 100vw, 1600px"/>
        </div>

        {/* logo oficial del manual dentro del hexágono (no lo dibuja la IA); entra animado una sola vez */}
        <HexLogo/>

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
