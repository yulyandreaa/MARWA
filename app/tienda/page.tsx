'use client';

import Link from 'next/link';
import {Suspense, useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {categories, categoryName} from '@/data/shopSeed';
import {isOnOffer, useProducts} from '@/lib/shop';
import {useSubsOf} from '@/lib/settings';
import {useHydrated} from '@/lib/persist';
import {Loading, PageTitle, ProductCard, ProductRow} from '@/components/shop/ShopUI';
import {LineIcon} from '@/components/shop/LineIcon';
import {StoreLanding} from '@/components/shop/StoreLanding';
import {CategoryPage} from '@/components/shop/CategoryPage';

const sorts = {
  relevancia: 'Relevancia',
  'precio-asc': 'Precio: menor a mayor',
  'precio-desc': 'Precio: mayor a menor',
  nombre: 'Nombre A–Z',
} as const;
type Sort = keyof typeof sorts;
type View = 'grid' | 'list';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const VIEW_KEY = 'marwa.catalog-view';

function Results({q, cat}: {q: string; cat: string | null}) {
  const products = useProducts();
  const [sort, setSort] = useState<Sort>('relevancia');
  const [onlyStock, setOnlyStock] = useState(false);
  const [view, setView] = useState<View>('grid');

  useEffect(() => {
    try {
      if (localStorage.getItem(VIEW_KEY) === 'list') setView('list');
    } catch {}
  }, []);
  const changeView = (v: View) => {
    setView(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch {}
  };

  const visible = useMemo(() => products.filter(p => p.visible), [products]);
  const shown = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    const list = visible.filter(p => {
      if (cat && p.category !== cat) return false;
      if (onlyStock && p.stock <= 0) return false;
      const hay = norm(`${p.name} ${p.sku} ${p.description} ${categoryName(p.category)}`);
      return words.every(w => hay.includes(w));
    });
    if (sort === 'precio-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'precio-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'nombre') list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return list;
  }, [visible, q, cat, sort, onlyStock]);

  const current = categories.find(c => c.id === cat);
  const title = q ? <>Resultados para <span className="hl">“{q}”</span></> : current ? current.name : <>Todo el <span className="hl">catálogo</span></>;

  return (
    <>
      <section className="sl-results-head">
        <div className="container">
          <nav className="shop-crumbs" aria-label="Ruta"><Link href="/tienda">Tienda</Link> / <span>{q ? 'Búsqueda' : current?.name ?? 'Catálogo'}</span></nav>
          <h1>{title}</h1>
          {current && <p>{current.description}</p>}
          <div className="sl-tabs left" role="tablist" aria-label="Categorías">
            <Link href="/tienda?vista=todos" className={!cat && !q ? 'active' : ''}>Todos</Link>
            {categories.map(c => (
              <Link key={c.id} href={`/tienda?categoria=${c.id}`} className={cat === c.id ? 'active' : ''}>{c.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <div className="shop-bar">
        <div className="container">
          <p><b>{shown.length}</b> {shown.length === 1 ? 'producto' : 'productos'} · Precios en COP, IVA incluido</p>
          <div className="shop-bar-tools">
            <button className={`toggle${onlyStock ? ' on' : ''}`} onClick={() => setOnlyStock(!onlyStock)} aria-pressed={onlyStock}>
              <i/> Solo disponibles
            </button>
            <select value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="Ordenar">
              {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="view-switch" role="group" aria-label="Vista">
              <button className={view === 'grid' ? 'active' : ''} onClick={() => changeView('grid')} aria-label="Ver en cuadrícula" title="Cuadrícula"><LineIcon id="todo"/></button>
              <button className={view === 'list' ? 'active' : ''} onClick={() => changeView('list')} aria-label="Ver en lista" title="Lista">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="container shop-results">
        {shown.length ? (
          view === 'grid'
            ? <div className="shop-grid">{shown.map(p => <ProductCard key={p.id} product={p}/>)}</div>
            : <ul className="shop-list">{shown.map(p => <ProductRow key={p.id} product={p}/>)}</ul>
        ) : (
          <div className="shop-empty">
            <LineIcon id={cat ?? 'todo'} className="shop-empty-icon"/>
            <h2>{cat && !q ? 'Muy pronto en la tienda' : 'No encontramos productos'}</h2>
            <p>{cat && !q
              ? `Estamos cargando la línea de ${categoryName(cat).toLowerCase()}. Mientras tanto, cotízala con un asesor.`
              : 'Prueba con otra palabra o referencia, o pregúntale a un asesor.'}</p>
            <div>
              <Link className="button ghost pill" href="/tienda?vista=todos">Ver todo el catálogo</Link>
              <a className="button primary pill" href="https://wa.me/573102569469" target="_blank" rel="noopener">Hablar con un asesor <span>→</span></a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

/** Ofertas: productos con precio anterior. Novedades: etiqueta o productos subidos. */
function StoreView({view}: {view: 'novedades' | 'ofertas'}) {
  const products = useProducts();
  const hydrated = useHydrated();
  const offers = view === 'ofertas';
  const list = products.filter(p => p.visible && (offers ? isOnOffer(p) || p.badge === 'Oferta' : p.badge === 'Nuevo' || p.custom));
  if (!hydrated) return <Loading/>;
  return (
    <div className="container">
      <PageTitle eyebrow="Tienda" title={offers ? 'Ofertas' : 'Novedades'}/>
      {list.length ? (
        <div className="ct-reco-grid">{list.map(p => <ProductCard key={p.id} product={p}/>)}</div>
      ) : (
        <div className="shop-empty">
          <h2>{offers ? 'Por ahora no hay ofertas activas' : 'Por ahora no hay novedades'}</h2>
          <p>Mientras tanto, explora todo el catálogo.</p>
          <div><Link className="button primary" href="/tienda?vista=todos">Ver el catálogo</Link></div>
        </div>
      )}
    </div>
  );
}

function Shop() {
  const params = useSearchParams();
  const subsOf = useSubsOf();
  const q = params?.get('q') ?? '';
  const cat = params?.get('categoria') ?? null;
  const view = params?.get('vista');
  const line = categories.find(c => c.id === cat);
  const tipo = params?.get('tipo') ?? '';
  const all = view === 'todos';
  if (!q && !cat && (view === 'novedades' || view === 'ofertas')) return <StoreView view={view}/>;
  if (!q && !cat && !all) return <StoreLanding/>;
  if (!q && line) return <CategoryPage key={`${line.id}|${tipo}`} cat={line.id} sub={subsOf(line.id, line.subs).includes(tipo) ? tipo : ''}/>;
  if (all || !line) return <CategoryPage key={`todos|${q}`} cat="todos" q={q}/>;
  return <Results key={`${q}|${cat}`} q={q} cat={cat}/>;
}

export default function ShopPage() {
  return <Suspense><Shop/></Suspense>;
}
