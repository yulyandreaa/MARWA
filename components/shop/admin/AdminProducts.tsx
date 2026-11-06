'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useMemo, useState, type FormEvent} from 'react';
import {categories, categoryName, type CategoryId, type Product} from '@/data/shopSeed';
import {deleteProduct, resetProducts, saveProduct, useProducts} from '@/lib/shop';
import {compressPhoto, money, slug} from '@/lib/format';
import {ProductImage, toast} from '../ShopUI';
import {Drawer} from './Drawer';
import {LOW_STOCK} from './AdminSummary';

type Filter = 'todos' | 'agotados' | 'bajo' | 'ocultos';

export function AdminProducts() {
  const products = useProducts();
  const router = useRouter();
  const editId = useSearchParams()?.get('producto');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'todas' | CategoryId>('todas');
  const [filter, setFilter] = useState<Filter>('todos');
  const [confirmReset, setConfirmReset] = useState(false);

  const count = {
    todos: products.length,
    agotados: products.filter(p => p.stock <= 0).length,
    bajo: products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK).length,
    ocultos: products.filter(p => !p.visible).length,
  };
  const units = products.reduce((s, p) => s + p.stock, 0);
  const value = products.reduce((s, p) => s + p.stock * p.price, 0);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter(p =>
      (cat === 'todas' || p.category === cat) &&
      (filter === 'todos' || (filter === 'agotados' && p.stock <= 0) || (filter === 'bajo' && p.stock > 0 && p.stock <= LOW_STOCK) || (filter === 'ocultos' && !p.visible)) &&
      (!s || `${p.name} ${p.sku}`.toLowerCase().includes(s)));
  }, [products, q, cat, filter]);

  const setEdit = (id: string | null) => router.replace(`/tienda/admin?tab=productos${id ? `&producto=${id}` : ''}`, {scroll: false});
  const editing = editId === 'nuevo' ? null : products.find(p => p.id === editId);

  return (
    <>
      <div className="account-head row">
        <div>
          <h2>Productos e inventario</h2>
          <p>{units.toLocaleString('es-CO')} unidades · {money(value)} en inventario a precio de venta</p>
        </div>
        <button className="button primary" onClick={() => setEdit('nuevo')}>Subir producto <span>＋</span></button>
      </div>

      <div className="kpis small">
        {([['todos', 'Productos'], ['agotados', 'Agotados'], ['bajo', `Stock bajo (≤${LOW_STOCK})`], ['ocultos', 'No visibles']] as [Filter, string][]).map(([k, label]) => (
          <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(filter === k ? 'todos' : k)}>
            <small>{label}</small><b>{count[k]}</b>
          </button>
        ))}
      </div>

      <div className="admin-toolbar">
        <input className="admin-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o referencia"/>
        <select value={cat} onChange={e => setCat(e.target.value as typeof cat)} aria-label="Categoría">
          <option value="todas">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table className="admin-table products">
          <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>En tienda</th></tr></thead>
          <tbody>
            {shown.map(p => (
              <tr key={p.id} onClick={() => setEdit(p.id)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setEdit(p.id)}>
                <td>
                  <div className="prod-cell">
                    <span className="thumb"><ProductImage src={p.image} alt="" sizes="48px"/></span>
                    <div><b>{p.name}</b><small>Ref. {p.sku}{p.custom ? ' · Subido' : ''}</small></div>
                  </div>
                </td>
                <td>{categoryName(p.category)}</td>
                <td><b>{money(p.price)}</b><small>{p.unit}</small></td>
                <td><span className={`stock-tag ${p.stock <= 0 ? 'out' : p.stock <= LOW_STOCK ? 'low' : 'ok'}`}>{p.stock} u.</span></td>
                <td onClick={e => e.stopPropagation()}>
                  <button
                    role="switch" aria-checked={p.visible} className={`switch${p.visible ? ' on' : ''}`}
                    onClick={() => { saveProduct({...p, visible: !p.visible}); toast(p.visible ? 'Oculto en la tienda' : 'Visible en la tienda'); }}
                    aria-label={`${p.name} visible en la tienda`}
                  ><i/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!shown.length && <p className="muted pad">Ningún producto coincide.</p>}
      </div>

      <div className="admin-foot">
        {confirmReset ? (
          <span>¿Restaurar los 7 productos iniciales con precios y stock de ejemplo? Se pierden los cambios y productos subidos.
            <button className="link-danger" onClick={() => { resetProducts(); setConfirmReset(false); toast('Catálogo restaurado'); }}>Sí, restaurar</button>
            <button className="summary-link" onClick={() => setConfirmReset(false)}>No</button>
          </span>
        ) : <button className="summary-link" onClick={() => setConfirmReset(true)}>Restaurar catálogo inicial</button>}
      </div>

      {(editId === 'nuevo' || editing) && (
        <ProductEditor key={editId} product={editing ?? null} onClose={() => setEdit(null)} existingIds={products.map(p => p.id)}/>
      )}
    </>
  );
}

const blank: Product = {id: '', sku: '', name: '', category: 'cableado', description: '', image: '', features: [], price: 0, unit: 'unidad', stock: 0, visible: true, custom: true};

function ProductEditor({product, onClose, existingIds}: {product: Product | null; onClose: () => void; existingIds: string[]}) {
  const [p, setP] = useState<Product>(product ?? blank);
  const [features, setFeatures] = useState((product?.features ?? []).join('\n'));
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isNew = !product;
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP(x => ({...x, [k]: v}));

  const onPhoto = async (file?: File) => {
    if (!file) return;
    try {
      set('image', await compressPhoto(file));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!p.image) return setError('Sube una foto del producto.');
    let id = p.id;
    if (isNew) {
      const base = slug(p.name) || 'producto';
      id = base;
      for (let n = 2; existingIds.includes(id); n++) id = `${base}-${n}`;
    }
    const ok = saveProduct({...p, id, features: features.split('\n').map(f => f.trim()).filter(Boolean)});
    if (!ok) return setError('No hay espacio en el almacenamiento del navegador. Usa una foto más liviana.');
    toast(isNew ? 'Producto publicado' : 'Cambios guardados');
    onClose();
  };

  return (
    <Drawer title={isNew ? 'Subir producto' : 'Editar producto'} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <div className="photo-field">
          <span className="thumb big">{p.image ? <ProductImage src={p.image} alt="" sizes="160px"/> : <em>Sin foto</em>}</span>
          <label className="button ghost">
            {p.image ? 'Cambiar foto' : 'Subir foto'}
            <input type="file" accept="image/*" hidden onChange={e => onPhoto(e.target.files?.[0])}/>
          </label>
        </div>
        <label>Nombre<input required value={p.name} onChange={e => set('name', e.target.value)}/></label>
        <div className="form-grid">
          <label>Referencia (SKU)<input required value={p.sku} onChange={e => set('sku', e.target.value.toUpperCase())}/></label>
          <label>Categoría
            <select value={p.category} onChange={e => setP(x => ({...x, category: e.target.value as CategoryId, specs: {...x.specs, tipo: ''}}))}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>Subcategoría
            <select required value={p.specs?.tipo ?? ''} onChange={e => set('specs', {...p.specs, tipo: e.target.value})}>
              <option value="">Elige una</option>
              {categories.find(c => c.id === p.category)?.subs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </label>
          <label>Precio (COP, IVA incluido)<input required type="number" min={0} step={100} value={p.price || ''} onChange={e => set('price', Number(e.target.value))}/></label>
          <label>Presentación<input required value={p.unit} onChange={e => set('unit', e.target.value)} placeholder="unidad, caja x 305 m, bobina…"/></label>
          <label>Stock disponible (unidades)<input required type="number" min={0} step={1} value={p.stock} onChange={e => set('stock', Math.max(0, Math.floor(Number(e.target.value))))}/></label>
          <label><span>Etiqueta <em>(opcional)</em></span><input value={p.badge ?? ''} onChange={e => set('badge', e.target.value || undefined)} placeholder="Más vendido, Nuevo…"/></label>
        </div>
        <label>Descripción<textarea required rows={3} value={p.description} onChange={e => set('description', e.target.value)}/></label>
        <label><span>Características <em>(una por línea)</em></span><textarea rows={4} value={features} onChange={e => setFeatures(e.target.value)}/></label>
        <label className="shop-check"><input type="checkbox" checked={p.visible} onChange={e => set('visible', e.target.checked)}/>Visible en la tienda</label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button primary block">{isNew ? 'Publicar producto' : 'Guardar cambios'} <span>→</span></button>
      </form>

      {!isNew && (
        confirmDelete ? (
          <div className="danger-box">
            <p>¿Eliminar “{p.name}” del catálogo? Los pedidos anteriores lo conservan.</p>
            <div>
              <button className="button danger" onClick={() => { deleteProduct(p.id); toast('Producto eliminado'); onClose(); }}>Sí, eliminar</button>
              <button className="button ghost" onClick={() => setConfirmDelete(false)}>No</button>
            </div>
          </div>
        ) : <button className="link-danger" onClick={() => setConfirmDelete(true)}>Eliminar producto</button>
      )}
    </Drawer>
  );
}
