'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import {categories, categoryName, type CategoryId, type Product} from '@/data/shopSeed';
import {allCatalogPage, categoryPages, type CategoryPageInfo} from '@/data/catalogRefs';
import {isOnOffer, useProducts} from '@/lib/shop';
import {money} from '@/lib/format';
import {Icon} from '@/components/premium/Icons';
import {waLink} from '@/components/premium/SiteChrome';
import {MarwaCard} from './ShopUI';
import {sideAd} from '@/data/ads';

/**
 * Página de categoría — réplica de la estructura de anker.com/collections/cables:
 * encabezado + franja de beneficios · barra de categorías · ruta ·
 * filtros (con conteo) + subcategorías + barra (resultados / ordenar) + chips activos + cuadrícula ·
 * Ver más · beneficios · guía · preguntas frecuentes. En móvil los filtros van en un panel lateral.
 */
const sorts = {recomendados: 'Recomendados', 'precio-asc': 'Precio: menor a mayor', 'precio-desc': 'Precio: mayor a menor', nombre: 'Nombre A–Z'} as const;
type Sort = keyof typeof sorts;
const PAGE = 12;


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

  return (
    <div className="pc">
      <section className={`pc-hero${page.hero.includes('/categoria-') ? ' is-studio' : ''}`}>
        <div className="pc-wrap pc-hero-inner">
          <div className="pc-hero-copy">
            <h1>{title}</h1>
            {!q && page.tagline && <p className="pc-hero-tag">{page.tagline}</p>}
            <p>{q ? `${list.length} ${list.length === 1 ? 'producto coincide' : 'productos coinciden'} con tu búsqueda en la tienda MARWA.` : page.intro}</p>
          </div>
        </div>
        <div className="pc-hero-img" aria-hidden="true"><Image src={page.hero} alt="" fill sizes={page.hero.includes('/categoria-') ? '(max-width: 767px) 1300px, 2600px' : '100vw'} quality={92} priority/></div>
        <Marquee/>
      </section>

      {!q && <CategoryRail cat={cat}/>}

      <nav className="pc-wrap pc-crumbs" aria-label="Ruta">
        <Link href="/">Inicio</Link><span>/</span><Link href="/tienda">Tienda</Link><span>/</span><b>{q ? 'Búsqueda' : nameOf(cat)}</b>
      </nav>

      <Listing cat={cat} list={list} search={!!q} sub={sub}/>
      {!q && <Guide page={page} name={nameOf(cat)}/>}
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

/* Barra de categorías bajo el encabezado: las 6 líneas siempre a la vista, solo texto (nivel 1).
   Las subcategorías van debajo como píldoras (nivel 2). */
function CategoryRail({cat}: {cat: Scope}) {
  const items: {id: Scope; name: string; href: string}[] = [
    {id: 'todos', name: 'Todos los productos', href: '/tienda?vista=todos'},
    ...categories.map(c => ({id: c.id as Scope, name: c.name, href: `/tienda?categoria=${c.id}`})),
  ];
  return (
    <nav className="cx-rail" aria-label="Categorías de la tienda">
      <div className="pc-wrap">
        {items.map(c => (
          <Link key={c.id} href={c.href} className={c.id === cat ? 'on' : ''} aria-current={c.id === cat ? 'page' : undefined}>{c.name}</Link>
        ))}
      </div>
    </nav>
  );
}

/* Publicidad fija debajo de los filtros (data/ads.ts). */
function SideAdBox() {
  const img = <Image src={sideAd.image} alt={sideAd.alt} width={sideAd.width} height={sideAd.height} sizes="240px" quality={90}/>;
  return (
    <div className="cx-ad">
      {sideAd.href ? <Link href={sideAd.href}>{img}</Link> : img}
    </div>
  );
}

/* Rangos de precio calculados con los precios reales de la línea (cuartiles redondeados). */
const nice = (n: number) => {
  const p = 10 ** Math.floor(Math.log10(n));
  return [1, 2, 2.5, 5, 10].map(m => m * p).reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));
};
type Range = {id: string; label: string; min: number; max: number};
function priceRanges(prices: number[]): Range[] {
  if (prices.length < 4) return [];
  const s = [...prices].sort((a, b) => a - b);
  const q = (f: number) => s[Math.floor(f * (s.length - 1))];
  const cuts = Array.from(new Set([q(.25), q(.5), q(.75)].map(nice))).filter(c => c > s[0] && c <= s[s.length - 1]);
  if (!cuts.length) return [];
  const edges = [0, ...cuts, Infinity];
  return edges.slice(0, -1).map((min, i) => {
    const max = edges[i + 1];
    const label = min === 0 ? `Hasta ${money(max)}` : max === Infinity ? `Más de ${money(min)}` : `${money(min)} – ${money(max)}`;
    return {id: `${min}-${max}`, label, min, max};
  });
}

type Group = {key: string; label: string; options: {value: string; label: string}[]};
const MAX_OPTS = 5;

/* Listado: subcategorías con conteo · filtros con conteo y chips activos · orden · cuadrícula. */
function Listing({cat, list, search, sub}: {cat: Scope; list: Product[]; search: boolean; sub: string}) {
  const page = pageOf(cat);
  const all = cat === 'todos';
  const name = nameOf(cat);
  const [tipo, setTipo] = useState(sub);
  const [checked, setChecked] = useState<Record<string, string[]>>({});
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState<Sort>('recomendados');
  const [drawer, setDrawer] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawer]);

  /* Subcategorías: en una línea, sus subcategorías oficiales; en todo el catálogo, las líneas. */
  const tabKey = all ? 'linea' : 'tipo';
  const tipos = useMemo(() => {
    const found = Array.from(new Set(list.map(p => valueOf(p, tabKey)).filter(Boolean) as string[]));
    const order = all ? categories.map(c => c.name) : (categories.find(c => c.id === cat)?.subs ?? []);
    return [...order.filter(t => found.includes(t)), ...found.filter(t => !order.includes(t))]
      .map(t => ({value: t, count: list.filter(p => valueOf(p, tabKey) === t).length}));
  }, [list, tabKey, all, cat]);
  const base = useMemo(() => (tipo ? list.filter(p => valueOf(p, tabKey) === tipo) : list), [list, tipo, tabKey]);
  const ranges = useMemo(() => priceRanges(base.map(p => p.price)), [base]);

  /* Grupos: solo los que ayudan a decidir (2 o más valores distintos). */
  const groups = useMemo<Group[]>(() => {
    const out: Group[] = [];
    if (ranges.length > 1) out.push({key: 'precio', label: 'Precio', options: ranges.map(r => ({value: r.id, label: r.label}))});
    for (const f of page.filters) {
      if (f.key === tabKey) continue;
      const vals = Array.from(new Set(base.map(p => valueOf(p, f.key)).filter(Boolean) as string[]))
        .sort((a, b) => a.localeCompare(b, 'es', {numeric: true}));
      if (vals.length > 1) out.push({key: f.key, label: f.label, options: vals.map(v => ({value: v, label: v}))});
    }
    const extra = [];
    if (base.some(p => isOnOffer(p))) extra.push({value: 'oferta', label: 'En oferta'});
    if (base.some(p => p.stock <= 0) && base.some(p => p.stock > 0)) extra.push({value: 'stock', label: 'Solo disponibles'});
    if (extra.length) out.push({key: 'estado', label: 'Disponibilidad', options: extra});
    return out;
  }, [base, ranges, page.filters, tabKey]);

  const matches = (p: Product, key: string, values: string[]) => {
    if (!values.length) return true;
    if (key === 'precio') return values.some(v => { const r = ranges.find(x => x.id === v); return !!r && p.price >= r.min && p.price < r.max; });
    if (key === 'estado') return values.every(v => (v === 'oferta' ? isOnOffer(p) : p.stock > 0));
    return values.includes(valueOf(p, key) ?? '');
  };
  const passAll = (p: Product, skip?: string) => Object.entries(checked).every(([k, v]) => k === skip || matches(p, k, v));
  /* Conteo de cada opción considerando los demás filtros activos (facetas). */
  const countOf = (key: string, value: string) => base.filter(p => passAll(p, key) && matches(p, key, [value])).length;

  const shown = useMemo(() => {
    const out = base.filter(p => passAll(p));
    if (sort === 'recomendados' && !search) out.sort((a, b) => Number(!!b.badge) - Number(!!a.badge));
    if (sort === 'precio-asc') out.sort((a, b) => a.price - b.price);
    if (sort === 'precio-desc') out.sort((a, b) => b.price - a.price);
    if (sort === 'nombre') out.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, checked, sort, ranges, search]);

  const toggle = (key: string, value: string) => { setLimit(PAGE); setChecked(c => {
    const cur = c[key] ?? [];
    return {...c, [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]};
  }); };
  const chips = groups.flatMap(g => (checked[g.key] ?? []).map(v => ({key: g.key, value: v, label: g.options.find(o => o.value === v)?.label ?? v})));
  const clear = () => setChecked({});
  const pick = (t: string) => { setTipo(t); setChecked({}); setLimit(PAGE); };
  const visible = shown.slice(0, limit);
  const side = true; // en escritorio la columna siempre está: filtros (si hay) + publicidad

  const filters = (
    <>
      {groups.map(g => {
        const many = g.options.length > MAX_OPTS && !expanded[g.key];
        const opts = many ? g.options.slice(0, MAX_OPTS) : g.options;
        return (
          <div key={g.key} className="cx-group">
            <button className="cx-group-title" aria-expanded={!closed[g.key]} onClick={() => setClosed(c => ({...c, [g.key]: !c[g.key]}))}>
              {g.label}<Icon name="chevron"/>
            </button>
            {!closed[g.key] && (
              <div className="cx-opts">
                {opts.map(o => {
                  const on = (checked[g.key] ?? []).includes(o.value);
                  const n = countOf(g.key, o.value);
                  return (
                    <label key={o.value} className={`pc-check${!n && !on ? ' is-off' : ''}`}>
                      <input type="checkbox" checked={on} disabled={!n && !on} onChange={() => toggle(g.key, o.value)}/>
                      <span>{o.label}</span><em>{n}</em>
                    </label>
                  );
                })}
                {g.options.length > MAX_OPTS && (
                  <button className="cx-more-opts" onClick={() => setExpanded(e => ({...e, [g.key]: !e[g.key]}))}>
                    {many ? `Ver ${g.options.length - MAX_OPTS} más` : 'Ver menos'}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <section className="cx-listing" id="productos">
      <div className={`pc-wrap cx-body${side ? '' : ' no-side'}`}>
        {side && (
          <aside className="cx-side" aria-label="Filtros">
            <div className="cx-side-head"><b>Filtrar por</b>{chips.length > 0 && <button onClick={clear}>Limpiar</button>}</div>
            {groups.length ? filters : <p className="cx-side-empty">No hay más filtros para esta selección.</p>}
            <SideAdBox/>
          </aside>
        )}

        <div className="cx-main">
          {!all && tipos.length > 1 && (
            <div className="cx-subs" role="tablist" aria-label={all ? 'Líneas' : 'Subcategorías'}>
              <button role="tab" aria-selected={!tipo} className={!tipo ? 'on' : ''} onClick={() => pick('')}>Todos <em>{list.length}</em></button>
              {tipos.map(t => (
                <button key={t.value} role="tab" aria-selected={tipo === t.value} className={tipo === t.value ? 'on' : ''} onClick={() => pick(t.value)}>
                  {t.value} <em>{t.count}</em>
                </button>
              ))}
            </div>
          )}

          <div className="cx-bar">
            {groups.length > 0 && (
              <button className="cx-filter-btn" onClick={() => setDrawer(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>
                Filtrar{chips.length ? ` (${chips.length})` : ''}
              </button>
            )}
            <span className="cx-count"><b>{shown.length}</b> {shown.length === 1 ? 'producto' : 'productos'}</span>
            <label className="pc-sort">
              Ordenar por
              <select value={sort} onChange={e => setSort(e.target.value as Sort)}>
                {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>

          {chips.length > 0 && (
            <div className="cx-chips">
              {chips.map(c => (
                <button key={c.key + c.value} onClick={() => toggle(c.key, c.value)} aria-label={`Quitar filtro ${c.label}`}>
                  {c.label}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
              ))}
              <button className="cx-chips-clear" onClick={clear}>Limpiar todo</button>
            </div>
          )}

          {visible.length ? (
            <div className="cx-grid">{visible.map(p => <MarwaCard key={p.id} p={p} fav sizes="(max-width: 760px) 46vw, 320px"/>)}</div>
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
            <div className="cx-more">
              <p>Viendo {visible.length} de {shown.length} productos</p>
              <button className="pm-btn ghost sm" onClick={() => setLimit(limit + PAGE)}>Ver más productos</button>
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="cx-drawer" role="dialog" aria-modal="true" aria-label="Filtros">
          <button className="cx-drawer-bg" aria-label="Cerrar filtros" onClick={() => setDrawer(false)}/>
          <div className="cx-drawer-panel">
            <div className="cx-drawer-head">
              <b>Filtrar por</b>
              <button onClick={() => setDrawer(false)} aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
            </div>
            <div className="cx-drawer-body">{filters}</div>
            <div className="cx-drawer-foot">
              <button className="pm-btn ghost sm" onClick={clear} disabled={!chips.length}>Limpiar</button>
              <button className="pm-btn sm" onClick={() => setDrawer(false)}>Ver {shown.length} {shown.length === 1 ? 'producto' : 'productos'}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* Guía de compra estilo MARWA: eyebrow rojo con línea, título con acento azul,
   pasos numerados en tarjetas (3 o 4, llenan el ancho) y siempre una franja de asesoría con WhatsApp. */
const guideIcons = ['layers', 'check', 'server', 'tools'];
function Guide({page, name}: {page: CategoryPageInfo; name: string}) {
  const g = page.guide;
  const title = g.title.replace(/ en MARWA$/, '');
  const steps = g.sections.filter(s => !/asesor/i.test(s.h));
  const advice = g.sections.find(s => /asesor/i.test(s.h));
  return (
    <section className="cx-guide-band" aria-labelledby="cx-guide-title">
     <div className="pc-wrap cx-guide">
      <header className="cx-guide-head">
        <span className="cx-eyebrow">Guía de compra</span>
        <h2 id="cx-guide-title">{title} <em>en MARWA</em></h2>
      </header>
      <ol className="cx-guide-grid" style={{gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`}}>
        {steps.map((s, i) => (
          <li key={s.h}>
            <div className="cx-guide-top">
              <span className="cx-guide-icon"><Icon name={guideIcons[i % guideIcons.length]}/></span>
              <span className="cx-guide-num">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </li>
        ))}
      </ol>
      <div className="cx-guide-advice">
        <span className="cx-guide-icon"><Icon name="headset"/></span>
        <div className="cx-guide-advice-copy">
          <h3>{advice?.h ?? '¿Necesitas ayuda con tu proyecto?'}</h3>
          <p>{advice?.p ?? `Un asesor MARWA te ayuda a elegir las referencias de ${inline(name)} y a armar la lista completa de materiales.`}</p>
        </div>
        <a className="cx-guide-cta" href={waLink(`Hola MARWA, necesito asesoría con productos de ${inline(name)}.`)} target="_blank" rel="noopener">
          Hablar con un asesor <Icon name="arrow"/>
        </a>
      </div>
     </div>
    </section>
  );
}

/* Preguntas frecuentes con el diseño del home de la tienda (lx-faq): título y tarjeta de contacto a la izquierda,
   acordeón en tarjetas con ícono por tema a la derecha. */
const faqIcon = (q: string) => {
  const t = norm(q);
  if (/pago|pagar|precio|iva/.test(t)) return 'card';
  if (/envio|despach|entrega/.test(t)) return 'truck';
  if (/pedido|seguimiento|guia/.test(t)) return 'box';
  if (/ayud|asesor|elegir|cotiz/.test(t)) return 'headset';
  if (/diferencia|cual|que tipo|categoria|cat\./.test(t)) return 'layers';
  return 'help';
};
function Faq({page, title}: {page: CategoryPageInfo; title: string}) {
  const [open, setOpen] = useState(0);
  return (
    <section className="cx-faq">
      <div className="pc-wrap lx-faq" aria-labelledby="cx-faq-title">
        <div className="lx-faq-side">
          <span className="lx-faq-eyebrow">Centro de ayuda</span>
          <h2 id="cx-faq-title">Preguntas <em>frecuentes</em></h2>
          <p>Resolvemos las dudas más comunes sobre {title}.</p>
          <div className="lx-faq-contact">
            <span className="lx-faq-contact-icon"><Icon name="chat"/></span>
            <div>
              <b>¿No encuentras tu respuesta?</b>
              <small>Un asesor te responde por WhatsApp.</small>
            </div>
            <a href={waLink(`Hola MARWA, tengo una pregunta sobre ${title}.`)} target="_blank" rel="noopener">Escríbenos <Icon name="arrow"/></a>
          </div>
        </div>
        <div className="lx-faq-list">
          {page.faq.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className={`lx-faq-item${on ? ' open' : ''}`}>
                <button type="button" id={`cx-faq-q-${i}`} aria-expanded={on} aria-controls={`cx-faq-a-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span className="lx-faq-icon"><Icon name={faqIcon(f.q)}/></span>
                  <span className="lx-faq-q">{f.q}</span>
                  <i aria-hidden="true"/>
                </button>
                <div className="lx-faq-a" id={`cx-faq-a-${i}`} role="region" aria-labelledby={`cx-faq-q-${i}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
