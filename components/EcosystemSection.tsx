'use client';

import Image from 'next/image';
import {useEffect, useState, type CSSProperties} from 'react';
import {ecosystem} from '@/data/ecosystem';
import {categories} from '@/data/shopSeed';

const icons: Record<string, JSX.Element> = {
  cableado: <path d="M5 4v6a4 4 0 0 0 4 4h6a4 4 0 0 1 4 4v2M5 4h4M5 4H1M19 20h4M19 20h-4"/>,
  fibra: <><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></>,
  networking: <><rect x="2" y="4" width="20" height="6" rx="1.5"/><rect x="2" y="14" width="20" height="6" rx="1.5"/><path d="M6 7h.01M6 17h.01M10 7h4M10 17h4"/></>,
  plastica: <><ellipse cx="6" cy="12" rx="3" ry="7"/><path d="M6 5h12a3 7 0 0 1 0 14H6"/></>,
  hdtv: <><rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 22h8M12 18v4"/></>,
  energia: <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>,
};

export function EcosystemSection() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const line = ecosystem[active];

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setActive(a => (a + 1) % ecosystem.length), 6000);
    return () => clearTimeout(t);
  }, [active, auto]);

  const select = (i: number) => {
    setAuto(false);
    setActive((i + ecosystem.length) % ecosystem.length);
  };

  return (
    <section id="ecosistema" className="eco">
      <div className="container eco-head" data-reveal>
        <p className="eyebrow">Ecosistema MARWA</p>
        <h2>Seis líneas.<br/><span className="tail">Una sola conexión.</span></h2>
        <p>Integramos todo lo que una red necesita, del cableado a la energía, en un solo aliado. Recorre el ecosistema y descubre cada línea.</p>
      </div>

      <div className="container">
        <div className="eco-stage-scroll" data-reveal>
          <div
            className="eco-stage"
            style={{'--x': `${line.spot.x}%`, '--y': `${line.spot.y}%`} as CSSProperties}
          >
            <Image
              src="/assets/ecosistema-marwa.png"
              alt="Ecosistema MARWA: 01 Cableado estructurado, 02 Fibra óptica, 03 Networking, 04 Línea plástica, 05 HDTV y 06 Energía, conectados por una línea de luz"
              width={1774}
              height={887}
              sizes="(max-width: 1220px) 100vw, 1180px"
            />
            <div className="eco-spotlight" aria-hidden="true"/>
            {ecosystem.map((l, i) => (
              <button
                key={l.id}
                className={`eco-spot${i === active ? ' active' : ''}`}
                style={{left: `${l.spot.x}%`, top: `${l.spot.y}%`}}
                onClick={() => select(i)}
                onMouseEnter={() => select(i)}
                aria-label={`Ver línea 0${i + 1}: ${l.title}`}
              >
                <i/>
              </button>
            ))}
          </div>
        </div>

        <div className="eco-tabs" role="tablist" aria-label="Líneas del ecosistema">
          {ecosystem.map((l, i) => (
            <button
              key={l.id}
              role="tab"
              aria-selected={i === active}
              className={i === active ? 'active' : ''}
              onClick={() => select(i)}
            >
              <span>0{i + 1}</span>{l.title}
              {i === active && auto && <em key={active} className="eco-timer"/>}
            </button>
          ))}
        </div>

        <article key={line.id} className="eco-card" role="tabpanel">
          <div className="eco-card-top">
            <small>0{active + 1} / 0{ecosystem.length}</small>
            <span className="eco-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icons[line.id]}</svg>
            </span>
          </div>
          <p className="eco-eyebrow">{line.eyebrow}</p>
          <h3>{line.title}</h3>
          <p className="eco-desc">{line.description}</p>
          <div className="eco-groups">
            {line.groups.map(g => (
              <div key={g.name}>
                <h4>{g.name}</h4>
                <ul>{g.items.map(it => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="eco-card-foot">
            <a className="button primary" href={categories.some(c => c.id === line.id) ? `/tienda?categoria=${line.id}` : '/tienda'} target="_blank" rel="noopener">Ver productos de esta línea <span>→</span></a>
            <div className="eco-arrows">
              <button onClick={() => select(active - 1)} aria-label="Línea anterior">←</button>
              <button onClick={() => select(active + 1)} aria-label="Línea siguiente">→</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
