'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useMemo, useRef, useState} from 'react';
import {categories, categoryName, type CategoryId, type Product} from '@/data/shopSeed';
import {allCatalogPage, categoryPages, type CategoryPageInfo} from '@/data/catalogRefs';
import {useProducts} from '@/lib/shop';
import {money} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {waLink} from '@/components/premium/SiteChrome';
import {FavoriteButton, ProductImage} from './ShopUI';

/**
 * Página de categoría — réplica de la estructura de anker.com/collections/cables:
 * encabezado + franja de beneficios · ruta · Más vendidos · pestañas de subcategoría ·
 * barra (filtros / limpiar / resultados / ordenar) · filtros + cuadrícula con banner ·
 * Ver más · beneficios · guía · preguntas frecuentes.
 */
const sorts = {recomendados: 'Recomendados', 'precio-asc': 'Precio: menor a mayor', 'precio-desc': 'Precio: mayor a menor', nombre: 'Nombre A–Z'} as const;
type Sort = keyof typeof sorts;
const PAGE = 9;

const priceRanges = [
  {id: 'p1', label: 'Menos de $50.000', test: (n: number) => n < 50000},
  {id: 'p2', label: '$50.000 – $200.000', test: (n: number) => n >= 50000 && n < 200000},
  {id: 'p3', label: '$200.000 – $600.000', test: (n: number) => n >= 200000 && n <= 600000},
  {id: 'p4', label: 'Más de $600.000', test: (n: number) => n > 600000},
];

/* Fondos de las tarjetas "Más vendidos". */
const tones = [
  'linear-gradient(160deg, #b8cdf5 0%, #3d6fe8 50%, #063fdf 100%)',
  'linear-gradient(160deg, #c9cfe2 0%, #39406a 55%, #060a2b 100%)',
  'linear-gradient(160deg, #f6d0d2 0%, #e2545b 55%, #b50d16 100%)',
  'linear-gradient(160deg, #e6eaf4 0%, #8a96bd 55%, #3c4878 100%)',
]
const labelTone: Record<string, string> = {'Más vendido': 'hot', Nuevo: 'new', Recomendado: 'hot', Profesional: 'pro'};

type Scope = CategoryId | 'todos';
const pageOf = (cat: Scope): CategoryPageInfo => (cat === 'todos' ? allCatalogPage : categoryPages[cat]);
const nameOf = (cat: Scope) => (cat === 'todos' ? 'Todo el catálogo' : categories.find(c => c.id === cat)!.name);
/** Nombre de la línea dentro de una frase; HDTV es sigla y no va en minúscula. */
const inline = (name: string) => (name === 'HDTV' ? name : name.toLowerCase());
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
/** Valor de un producto para un filtro: la línea o una especificación. */
const valueOf = (p: Product, key: string) => (key === 'linea' ? categoryName(p.category) : p.specs?.[key]);

export function CategoryPage({cat, q = '', sub = ''}: {cat: Scope; q?: string; sub?: string}) {
  const page = pageOf(cat);
  const title = q ? <>Resultados para “{q}”</> : nameOf(cat);
  const products = useProducts();
  const list = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    return products.filter(p => {
      if (!p.visible || (cat !== 'todos' && p.category !== cat)) return false;
      const hay = norm(`${p.name} ${p.sku} ${p.description} ${categoryName(p.category)} ${Object.values(p.specs ?? {}).join(' ')}`);
      return words.every(w => hay.includes(w));
    });
  }, [products, cat, q]);
  const best = useMemo(() => [...list].sort((a, b) => Number(!!b.badge) - Number(!!a.badge)).slice(0, 6), [list]);

  return (
    <div className="pc">
      <section className="pc-hero">
        <div className="pc-wrap pc-hero-inner">
          <div className="pc-hero-copy">
            <h1>{title}</h1>
            <p>{q ? `${list.length} ${list.length === 1 ? 'producto coincide' : 'productos coinciden'} con tu búsqueda en la tienda MARWA.` : page.intro}</p>
          </div>
        </div>
        <div className="pc-hero-img" aria-hidden="true"><Image src={page.hero} alt="" fill sizes="60vw" priority/></div>
        <Marquee/>
      </section>

      <nav className="pc-wrap pc-crumbs" aria-label="Ruta">
        <Link href="/">Inicio</Link><span>/</span><Link href="/tienda">Tienda</Link><span>/</span><b>{q ? 'Búsqueda' : nameOf(cat)}</b>
      </nav>

      {!q && best.length >= 2 && <BestSellers items={best}/>}
      <Listing cat={cat} list={list} search={!!q} sub={sub}/>
      <TrustRow/>
      {!q && <Guide page={page}/>}
      <Faq page={page} title={cat === 'todos' ? 'la tienda MARWA' : inline(nameOf(cat))}/>
    </div>
  );
}

/* Franja de beneficios en movimiento continuo. */
function Marquee() {
  const items: [string, string][] = [
    ['truck', 'Despacho a los 32 departamentos'],
    ['shield', 'Calidad certificada RITEL · RETIE'],
    ['card', 'Pago seguro'],
    ['chat', 'Asesoría experta'],
    ['tag', 'Precios con IVA incluido'],
  ];
  const row = items.map(([i, t]) => <span key={t}><Icon name={i}/>{t}</span>);
  return (
    <div className="pc-marquee" aria-label="Beneficios de comprar en MARWA">
      <div><div>{row}</div><div aria-hidden="true">{row}</div></div>
    </div>
  );
}

/* Más vendidos: tarjetas de color con el producto sobresaliendo por arriba. */
function BestSellers({items}: {items: Product[]}) {
  const track = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => track.current?.scrollBy({left: dir * 300, behavior: 'smooth'});
  return (
    <section className="pc-wrap pc-best">
      <h2 className="pc-h2">Más vendidos</h2>
      <div className="pc-best-track">
        <div className="pc-best-row" ref={track}>
          {items.map((p, i) => (
            <article key={p.id} className="pc-best-card" style={{background: tones[i % tones.length]}}>
              <Link href={`/tienda/producto/${p.id}`} className="pc-best-img" aria-hidden="true" tabIndex={-1}>
                <ProductImage src={p.image} alt="" sizes="220px"/>
              </Link>
              <div className="pc-best-copy">
                {p.badge && <small>{p.badge}</small>}
                <h3><Link href={`/tienda/producto/${p.id}`}>{p.name}</Link></h3>
              </div>
              <div className="pc-best-foot">
                <b>{money(p.price)}</b>
                <Link className="pc-buy" href={`/tienda/producto/${p.id}`}>Comprar</Link>
              </div>
            </article>
          ))}
        </div>
        {items.length > 4 && <button className="pc-best-next" onClick={() => move(1)} aria-label="Ver más productos"><Icon name="chevron"/></button>}
      </div>
    </section>
  );
}

/* Pestañas de subcategoría + barra + filtros + cuadrícula. */
function Listing({cat, list, search, sub}: {cat: Scope; list: Product[]; search: boolean; sub: string}) {
  const page = pageOf(cat);
  const all = cat === 'todos';
  const name = nameOf(cat);
  const [tipo, setTipo] = useState(sub);
  const [checked, setChecked] = useState<Record<string, string[]>>({});
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState<Sort>('recomendados');
  const [showFilters, setShowFilters] = useState(true);
  const [limit, setLimit] = useState(PAGE);
  // En celular los filtros empiezan ocultos, como en Anker.
  useEffect(() => { if (window.innerWidth < 760) setShowFilters(false); }, []);

  /* Pestañas: en una línea, sus subcategorías oficiales; en todo el catálogo, las líneas. */
  const tabKey = all ? 'linea' : 'tipo';
  const tipos = useMemo(() => {
    const found = Array.from(new Set(list.map(p => valueOf(p, tabKey)).filter(Boolean) as string[]));
    if (all) return categories.map(c => c.name).filter(n => found.includes(n));
    const subs = categories.find(c => c.id === cat)?.subs ?? [];
    return [...subs, ...found.filter(t => !subs.includes(t))];
  }, [list, tabKey, all, cat]);
  const base = useMemo(() => (tipo ? list.filter(p => valueOf(p, tabKey) === tipo) : list), [list, tipo, tabKey]);

  const groups = useMemo(() => [
    {key: 'precio', label: 'Precio', options: priceRanges.filter(r => base.some(p => r.test(p.price))).map(r => ({value: r.id, label: r.label}))},
    {key: 'stock', label: 'Disponibilidad', options: [{value: 'si', label: 'Solo disponibles'}]},
    ...page.filters.filter(f => !(tipo && f.key === tabKey)).map(f => ({
      key: f.key,
      label: f.label,
      options: Array.from(new Set(base.map(p => valueOf(p, f.key)).filter(Boolean) as string[]))
        .sort((a, b) => a.localeCompare(b, 'es', {numeric: true}))
        .map(v => ({value: v, label: v})),
    })),
  ].filter(g => g.options.length), [base, page.filters, tipo]);

  const shown = useMemo(() => {
    const out = base.filter(p => Object.entries(checked).every(([key, values]) => {
      if (!values.length) return true;
      if (key === 'precio') return values.some(v => priceRanges.find(r => r.id === v)?.test(p.price));
      if (key === 'stock') return p.stock > 0;
      return values.includes(valueOf(p, key) ?? '');
    }));
    if (sort === 'recomendados' && !search) out.sort((a, b) => Number(!!b.badge) - Number(!!a.badge));
    if (sort === 'precio-asc') out.sort((a, b) => a.price - b.price);
    if (sort === 'precio-desc') out.sort((a, b) => b.price - a.price);
    if (sort === 'nombre') out.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return out;
  }, [base, checked, sort]);

  const toggle = (key: string, value: string) => setChecked(c => {
    const cur = c[key] ?? [];
    return {...c, [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]};
  });
  const active = Object.values(checked).reduce((n, v) => n + v.length, 0);
  const clear = () => setChecked({});
  const pick = (t: string) => { setTipo(t); setChecked({}); setLimit(PAGE); };
  const visible = shown.slice(0, limit);

  return (
    <section className="pc-listing" id="productos">
      <div className="pc-tabs" role="tablist" aria-label="Subcategorías">
        <div className="pc-wrap">
          <button role="tab" aria-selected={!tipo} className={!tipo ? 'on' : ''} onClick={() => pick('')}>Todos</button>
          {tipos.map(t => <button key={t} role="tab" aria-selected={tipo === t} className={tipo === t ? 'on' : ''} onClick={() => pick(t)}>{t}</button>)}
        </div>
      </div>

      <div className="pc-wrap">
        <div className="pc-bar">
          <div>
            <button className="pc-toggle" onClick={() => setShowFilters(!showFilters)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </button>
            {active > 0 && <button className="pc-clear" onClick={clear}>Limpiar</button>}
            <span>{shown.length} {shown.length === 1 ? 'producto encontrado' : 'productos encontrados'}</span>
          </div>
          <label className="pc-sort">
            Ordenar
            <select value={sort} onChange={e => setSort(e.target.value as Sort)}>
              {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>

        <div className={`pc-body${showFilters ? '' : ' no-filters'}`}>
          {showFilters && (
            <aside className="pc-filters" aria-label="Filtros">
              {groups.map(g => (
                <div key={g.key} className="pc-group">
                  <button className="pc-group-title" aria-expanded={!closed[g.key]} onClick={() => setClosed(c => ({...c, [g.key]: !c[g.key]}))}>
                    {g.label}<Icon name="chevron"/>
                  </button>
                  {!closed[g.key] && g.options.map(o => (
                    <label key={o.value} className="pc-check">
                      <input type="checkbox" checked={(checked[g.key] ?? []).includes(o.value)} onChange={() => toggle(g.key, o.value)}/>
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </aside>
          )}

          <div>
            {visible.length ? (
              <div className="pc-grid">
                {visible.flatMap((p, i) => {
                  const card = <ListCard key={p.id} p={p}/>;
                  return i === 1 ? [card, <Promo key="promo" name={all ? '' : name}/>] : [card];
                })}
              </div>
            ) : (
              <div className="pc-empty">
                <b>{list.length ? 'Ningún producto coincide con los filtros' : search ? 'No encontramos productos' : 'Muy pronto en la tienda'}</b>
                <p>{list.length ? 'Prueba quitando algún filtro.' : search ? 'Prueba con otra palabra o referencia, o pregúntale a un asesor.' : 'Estamos cargando esta línea. Un asesor te cotiza lo que necesites.'}</p>
                {list.length
                  ? <button className="pm-btn ghost sm" onClick={clear}>Limpiar filtros</button>
                  : <a className="pm-btn sm" href={waLink(`Hola MARWA, quiero cotizar productos de ${inline(name)}.`)} target="_blank" rel="noopener">Cotizar con un asesor</a>}
              </div>
            )}
            {shown.length > limit && (
              <button className="pc-more" onClick={() => setLimit(limit + PAGE)}>Ver más <Icon name="chevron"/></button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ListCard({p}: {p: Product}) {
  const out = p.stock <= 0;
  const href = `/tienda/producto/${p.id}`;
  return (
    <article className={`pc-card${out ? ' is-out' : ''}`}>
      <Link href={href} className="pc-card-img" aria-label={p.name}>
        <ProductImage src={p.image} alt="" sizes="(max-width: 760px) 46vw, 330px"/>
        <span className="pc-eye" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
        </span>
      </Link>
      <FavoriteButton product={p}/>
      <div className="pc-card-body">
        {p.badge && <small className={`pc-label ${labelTone[p.badge] ?? 'hot'}`}>{p.badge}</small>}
        <h3><Link href={href}>{p.name}</Link></h3>
        <b className={out ? 'out' : ''}>{out ? 'Agotado' : money(p.price)}</b>
      </div>
    </article>
  );
}

/* Banner intercalado en la cuadrícula (ocupa dos filas). */
function Promo({name}: {name: string}) {
  return (
    <article className="pc-promo">
      <div className="pc-promo-copy">
        <span>MARWA · Asesoría experta</span>
        <h3>¿No sabes qué {name ? inline(name) : 'producto'} elegir? Te ayudamos</h3>
        <a className="pc-buy" href={waLink(name ? `Hola MARWA, necesito asesoría con productos de ${inline(name)}.` : 'Hola MARWA, necesito asesoría para elegir productos.')} target="_blank" rel="noopener">Cotizar ahora</a>
      </div>
      <div className="pc-promo-img"><Image src="/assets/solution-infrastructure.jpg" alt="" fill sizes="(max-width: 760px) 92vw, 330px"/></div>
    </article>
  );
}

function TrustRow() {
  const items: [string, string][] = [['truck', 'Despacho a todo Colombia'], ['shield', 'Calidad certificada'], ['card', 'Pago seguro'], ['chat', 'Asesoría experta']];
  return (
    <section className="pc-wrap pc-trust">
      {items.map(([i, t]) => <div key={t}><Icon name={i}/><span>{t}</span></div>)}
    </section>
  );
}

function Guide({page}: {page: CategoryPageInfo}) {
  const g = page.guide;
  return (
    <section className="pc-wrap pc-guide">
      <h2 className="pc-h2">{g.title}</h2>
      {g.sections.map(s => (
        <div key={s.h}>
          <h3>{s.h}</h3>
          <p>{s.p}</p>
        </div>
      ))}
    </section>
  );
}

function Faq({page, title}: {page: CategoryPageInfo; title: string}) {
  const [open, setOpen] = useState(-1);
  return (
    <section className="pc-faq">
      <div className="pc-wrap">
        <h2 className="pc-h2">Preguntas frecuentes sobre {title}</h2>
        {page.faq.map((f, i) => (
          <div key={f.q} className={`pc-faq-item${open === i ? ' open' : ''}`}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              {f.q}<Icon name="chevron"/>
            </button>
            {open === i && <p>{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
