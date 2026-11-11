'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useMemo, useRef, useState, type FormEvent} from 'react';
import {categories, categoryName, type CategoryId, type Datasheet, type Product} from '@/data/shopSeed';
import {bulkUpdateProducts, deleteProduct, resetProducts, saveProduct, useProducts, useStockLog} from '@/lib/shop';
import {useSubsOf} from '@/lib/settings';
import {downloadCsv} from '@/lib/csv';
import {compressPhoto, dateTime, fileSize, money, openFile, readPdf, slug} from '@/lib/format';
import {ProductImage, toast} from '../ShopUI';
import {Dialog, SectionHead} from '../account/AccountUI';
import {usePaged} from '../account/Pager';
import {PlainSelect} from '../account/PlainSelect';
import {Icon} from '@/components/premium/Icons';
import {Modal} from './Drawer';
import {LOW_STOCK} from '@/lib/notifications';

const MAX_PHOTOS = 8;

type Sort = 'catalogo' | 'nombre' | 'precio-menor' | 'precio-mayor' | 'stock';
const sortOptions: {value: Sort; label: string}[] = [
  {value: 'catalogo', label: 'Ordenar por'},
  {value: 'nombre', label: 'Nombre (A-Z)'},
  {value: 'precio-menor', label: 'Menor precio'},
  {value: 'precio-mayor', label: 'Mayor precio'},
  {value: 'stock', label: 'Menos stock'},
];
const sorters: Record<Sort, (a: Product, b: Product) => number> = {
  catalogo: () => 0,
  nombre: (a, b) => a.name.localeCompare(b.name, 'es'),
  'precio-menor': (a, b) => a.price - b.price,
  'precio-mayor': (a, b) => b.price - a.price,
  stock: (a, b) => a.stock - b.stock,
};

type Filter = 'todos' | 'agotados' | 'bajo' | 'ocultos';

export function AdminProducts() {
  const [sort, setSort] = useState<Sort>('catalogo');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [adjusting, setAdjusting] = useState(false);
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
      (!s || `${p.name} ${p.sku}`.toLowerCase().includes(s)))
      .sort(sorters[sort]);
  }, [products, q, cat, filter, sort]);
  const {items, pager} = usePaged(shown);

  const ids = Array.from(selected);
  const toggle = (id: string) => setSelected(list => {
    const next = new Set(list);
    if (!next.delete(id)) next.add(id);
    return next;
  });
  const allOnPage = items.length > 0 && items.every(p => selected.has(p.id));
  const togglePage = () => setSelected(list => {
    const next = new Set(list);
    items.forEach(p => (allOnPage ? next.delete(p.id) : next.add(p.id)));
    return next;
  });
  const setVisible = (visible: boolean) => {
    bulkUpdateProducts(ids, p => ({...p, visible}));
    toast(`${ids.length} ${ids.length === 1 ? 'producto' : 'productos'} ${visible ? 'visibles' : 'ocultos'}`);
    setSelected(new Set());
  };
  const exportAll = () => downloadCsv(
    'inventario-marwa',
    ['Referencia', 'Producto', 'Categoría', 'Subcategoría', 'Precio', 'Precio antes', 'Presentación', 'Stock', 'Visible'],
    shown.map(p => [p.sku, p.name, categoryName(p.category), p.specs?.tipo ?? '', p.price, p.listPrice ?? '', p.unit, p.stock, p.visible ? 'Sí' : 'No']),
  );

  const setEdit = (id: string | null) => router.replace(`/tienda/admin?tab=productos${id ? `&producto=${id}` : ''}`, {scroll: false});
  const editing = editId === 'nuevo' ? null : products.find(p => p.id === editId);

  return (
    <>
      <SectionHead
        title="Productos e inventario"
        text={`${units.toLocaleString('es-CO')} unidades · ${money(value)} en inventario a precio de venta`}
        action={<div className="pa-head-actions">
          <button type="button" className="button ghost" onClick={exportAll}>Exportar a Excel</button>
          <button className="button primary" onClick={() => setEdit('nuevo')}>Subir producto</button>
        </div>}
      />

      <div className="kpis small">
        {([['todos', 'Productos'], ['agotados', 'Agotados'], ['bajo', `Stock bajo (≤${LOW_STOCK})`], ['ocultos', 'No visibles']] as [Filter, string][]).map(([k, label]) => (
          <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(filter === k ? 'todos' : k)}>
            <small>{label}</small><b>{count[k]}</b>
          </button>
        ))}
      </div>

      <div className="pa-tools" role="search">
        <label className="pa-search">
          <Icon name="search"/>
          <span className="au-sr">Buscar productos</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Busca por nombre o referencia..."/>
        </label>
        <PlainSelect
          label="Categorías"
          value={cat}
          onChange={setCat}
          options={[{value: 'todas' as typeof cat, label: 'Categorías'}, ...categories.map(c => ({value: c.id as typeof cat, label: c.name}))]}
        />
        <PlainSelect label="Ordenar por" value={sort} onChange={setSort} options={sortOptions}/>
      </div>

      {ids.length > 0 && (
        <div className="pa-bulk" role="status">
          <b>{ids.length} {ids.length === 1 ? 'seleccionado' : 'seleccionados'}</b>
          <button type="button" className="pa-text-btn" onClick={() => setVisible(false)}>Ocultar</button>
          <button type="button" className="pa-text-btn" onClick={() => setVisible(true)}>Mostrar</button>
          <button type="button" className="pa-text-btn" onClick={() => setAdjusting(true)}>Ajustar precio</button>
          <button type="button" className="pa-text-btn" onClick={() => setSelected(new Set())}>Quitar selección</button>
        </div>
      )}

      <div className="table-wrap">
        <table className="admin-table products">
          <thead><tr><th className="pa-col-check"><input type="checkbox" aria-label="Seleccionar esta página" checked={allOnPage} onChange={togglePage}/></th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>En tienda</th></tr></thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} onClick={() => setEdit(p.id)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setEdit(p.id)}>
                <td className="pa-col-check" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" aria-label={`Seleccionar ${p.name}`} checked={selected.has(p.id)} onChange={() => toggle(p.id)}/>
                </td>
                <td>
                  <div className="prod-cell">
                    <span className="thumb"><ProductImage src={p.image} alt="" sizes="48px"/></span>
                    <div><b>{p.name}</b><small>Ref. {p.sku}{p.custom ? ' · Subido' : ''}</small></div>
                  </div>
                </td>
                <td data-label="Categoría">{categoryName(p.category)}</td>
                <td data-label="Precio"><b>{money(p.price)}</b><small>{p.unit}</small></td>
                <td data-label="Stock"><span className={`stock-tag ${p.stock <= 0 ? 'out' : p.stock <= LOW_STOCK ? 'low' : 'ok'}`}>{p.stock} u.</span></td>
                <td data-label="En tienda" onClick={e => e.stopPropagation()}>
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

      {pager}

      <div className="admin-foot">
        {confirmReset ? (
          <span>¿Restaurar el catálogo inicial con precios y stock de ejemplo? Se borran los productos subidos y todos los cambios.
            <button className="link-danger" onClick={() => { resetProducts(); setConfirmReset(false); toast('Catálogo restaurado'); }}>Sí, restaurar</button>
            <button className="summary-link" onClick={() => setConfirmReset(false)}>No</button>
          </span>
        ) : <button className="summary-link" onClick={() => setConfirmReset(true)}>Restaurar catálogo inicial</button>}
      </div>

      {adjusting && <PriceDialog ids={ids} onClose={() => setAdjusting(false)} onDone={() => { setAdjusting(false); setSelected(new Set()); }}/>}

      {(editId === 'nuevo' || editing) && (
        <ProductEditor key={editId} product={editing ?? null} onClose={() => setEdit(null)} existingIds={products.map(p => p.id)}/>
      )}
    </>
  );
}

function PriceDialog({ids, onClose, onDone}: {ids: string[]; onClose: () => void; onDone: () => void}) {
  const [percent, setPercent] = useState('');
  const value = Number(percent);
  const apply = () => {
    if (!value || value <= -100) return toast('Escribe un porcentaje válido');
    bulkUpdateProducts(ids, p => ({...p, price: Math.round((p.price * (1 + value / 100)) / 100) * 100}));
    toast(`Precio actualizado en ${ids.length} ${ids.length === 1 ? 'producto' : 'productos'}`);
    onDone();
  };
  return (
    <Dialog
      title="Ajustar precio"
      onClose={onClose}
      actions={<>
        <button type="button" className="button primary" onClick={apply}>Aplicar</button>
        <button type="button" className="button ghost" onClick={onClose}>Cancelar</button>
      </>}
    >
      <p>Se aplica a {ids.length} {ids.length === 1 ? 'producto' : 'productos'} y redondea a centenas. Usa un número negativo para bajar el precio.</p>
      <label className="pa-field">Porcentaje
        <input type="number" step={1} placeholder="Ej. 10 o -5" value={percent} onChange={e => setPercent(e.target.value)} data-autofocus/>
      </label>
    </Dialog>
  );
}

const blank: Product = {id: '', sku: '', name: '', category: 'cableado', description: '', image: '', features: [], price: 0, unit: 'unidad', stock: 0, visible: true, custom: true};

function ProductEditor({product, onClose, existingIds}: {product: Product | null; onClose: () => void; existingIds: string[]}) {
  const [p, setP] = useState<Product>(product ?? blank);
  const [photos, setPhotos] = useState<string[]>(product ? [product.image, ...(product.gallery ?? [])].filter(Boolean) : []);
  const [features, setFeatures] = useState((product?.features ?? []).join('\n'));
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isNew = !product;
  const subsOf = useSubsOf();
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP(x => ({...x, [k]: v}));

  const addPhotos = async (files: File[]) => {
    const room = MAX_PHOTOS - photos.length;
    setError(files.length > room ? `Puedes subir hasta ${MAX_PHOTOS} fotos por producto.` : '');
    try {
      const added = await Promise.all(files.slice(0, room).map(f => compressPhoto(f)));
      setPhotos(list => [...list, ...added]);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const removePhoto = (i: number) => setPhotos(list => list.filter((_, n) => n !== i));
  const movePhoto = (from: number, to: number) => setPhotos(list => {
    const next = [...list];
    next.splice(to, 0, ...next.splice(from, 1));
    return next;
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!photos.length) return setError('Sube al menos una foto del producto.');
    if (!p.specs?.tipo) return setError('Elige la subcategoría del producto.');
    if (p.listPrice && p.listPrice <= p.price) return setError('El precio antes de la oferta debe ser mayor que el precio actual.');
    let id = p.id;
    if (isNew) {
      const base = slug(p.name) || 'producto';
      id = base;
      for (let n = 2; existingIds.includes(id); n++) id = `${base}-${n}`;
    }
    const [image, ...gallery] = photos;
    const ok = saveProduct({...p, id, image, gallery, features: features.split('\n').map(f => f.trim()).filter(Boolean)});
    if (!ok) return setError('No hay espacio en el almacenamiento del navegador. Quita algunas fotos o usa unas más livianas.');
    toast(isNew ? 'Producto publicado' : 'Cambios guardados');
    onClose();
  };

  return (
    <Modal
      title={isNew ? 'Subir producto' : 'Editar producto'}
      onClose={onClose}
      footer={confirmDelete ? (
        <>
          <p>¿Eliminar “{p.name}” del catálogo? Los pedidos anteriores lo conservan.</p>
          <button type="button" className="button ghost" onClick={() => setConfirmDelete(false)}>No</button>
          <button type="button" className="button danger" onClick={() => { deleteProduct(p.id); toast('Producto eliminado'); onClose(); }}>Sí, eliminar</button>
        </>
      ) : (
        <>
          {!isNew && <button type="button" className="link-danger" onClick={() => setConfirmDelete(true)}>Eliminar producto</button>}
          <button type="button" className="button ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" form="product-form" className="button primary">{isNew ? 'Publicar producto' : 'Guardar cambios'}</button>
        </>
      )}
    >
      <form id="product-form" className="form pe-form" onSubmit={submit}>
        <PhotoManager photos={photos} onAdd={addPhotos} onRemove={removePhoto} onMove={movePhoto}/>
        <div className="pe-fields">
          <section>
            <h3>Información básica</h3>
            <label>Nombre<input required value={p.name} onChange={e => set('name', e.target.value)}/></label>
            <div className="form-grid">
              <label>Referencia (SKU)<input required value={p.sku} onChange={e => set('sku', e.target.value.toUpperCase())}/></label>
              <PlainSelect
                field
                caption="Categoría"
                label="Categoría"
                value={p.category}
                onChange={c => setP(x => ({...x, category: c, specs: {...x.specs, tipo: ''}}))}
                options={categories.map(c => ({value: c.id, label: c.name}))}
              />
              <PlainSelect
                field
                caption="Subcategoría"
                label="Subcategoría"
                placeholder="Elige una"
                value={p.specs?.tipo ?? ''}
                onChange={tipo => set('specs', {...p.specs, tipo})}
                options={subsOf(p.category, categories.find(c => c.id === p.category)?.subs ?? []).map(sub => ({value: sub, label: sub}))}
              />
              <label><span>Etiqueta <em>(opcional)</em></span><input value={p.badge ?? ''} onChange={e => set('badge', e.target.value || undefined)} placeholder="Más vendido, Nuevo…"/></label>
            </div>
          </section>
          <section>
            <h3>Precio e inventario</h3>
            <div className="form-grid">
              <label>Precio (COP, IVA incluido)<input required type="number" min={0} step={100} value={p.price || ''} onChange={e => set('price', Number(e.target.value))}/></label>
              <label><span>Precio antes de la oferta <em>(opcional)</em></span><input type="number" min={0} step={100} value={p.listPrice || ''} onChange={e => set('listPrice', Number(e.target.value) || undefined)}/></label>
              <label>Stock disponible (unidades)<input required type="number" min={0} step={1} value={p.stock} onChange={e => set('stock', Math.max(0, Math.floor(Number(e.target.value))))}/></label>
              <label>Presentación<input required value={p.unit} onChange={e => set('unit', e.target.value)} placeholder="unidad, caja x 305 m, bobina…"/></label>
            </div>
            <label className="shop-check"><input type="checkbox" checked={p.visible} onChange={e => set('visible', e.target.checked)}/>Visible en la tienda</label>
          </section>
          <section>
            <h3>Detalle del producto</h3>
            <label>Descripción<textarea required rows={3} value={p.description} onChange={e => set('description', e.target.value)}/></label>
            <label><span>Características <em>(una por línea)</em></span><textarea rows={4} value={features} onChange={e => setFeatures(e.target.value)}/></label>
          </section>
          <DatasheetField value={p.datasheet} onChange={d => set('datasheet', d)} onError={setError}/>
          {!isNew && <StockHistory productId={p.id}/>}
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
      </form>
    </Modal>
  );
}

/* Ficha técnica en PDF: se muestra en la página del producto con botones Ver y Descargar. */
function DatasheetField({value, onChange, onError}: {value?: Datasheet; onChange: (d?: Datasheet) => void; onError: (msg: string) => void}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const upload = async (file?: File) => {
    if (!file) return;
    try {
      const url = await readPdf(file);
      onChange({name: file.name, url, size: file.size});
      onError('');
    } catch (e) {
      onError((e as Error).message);
    }
  };
  return (
    <section>
      <h3>Ficha técnica <em className="pe-optional">(opcional · PDF hasta 2 MB)</em></h3>
      {value ? (
        <div className="pe-sheet">
          <span className="pe-sheet-ico">PDF</span>
          <span className="pe-sheet-name"><b>{value.name}</b>{value.size ? <small>{fileSize(value.size)}</small> : null}</span>
          <button type="button" className="button ghost" onClick={() => openFile(value.url)}>Ver</button>
          <button type="button" className="button ghost" onClick={() => input.current?.click()}>Reemplazar</button>
          <button type="button" className="link-danger" onClick={() => onChange(undefined)}>Quitar</button>
        </div>
      ) : (
        <button
          type="button"
          className={`pe-sheet-drop${over ? ' over' : ''}`}
          onClick={() => input.current?.click()}
          onDragOver={e => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files[0]); }}
        >
          <b>Subir ficha técnica</b>
          <span>Arrastra el PDF aquí o haz clic para elegirlo</span>
        </button>
      )}
      <input ref={input} type="file" accept="application/pdf,.pdf" hidden onChange={e => { upload(e.target.files?.[0]); e.target.value = ''; }}/>
    </section>
  );
}

function StockHistory({productId}: {productId: string}) {
  const moves = useStockLog().filter(m => m.productId === productId).slice(0, 10);
  return (
    <section>
      <h3>Historial de inventario</h3>
      {moves.length ? (
        <ul className="pe-moves">
          {moves.map(m => (
            <li key={m.id}>
              <span>{m.reason}{m.ref ? ` · ${m.ref}` : ''}<small>{dateTime(m.at)}</small></span>
              <b className={m.delta > 0 ? 'in' : 'out'}>{m.delta > 0 ? '+' : ''}{m.delta} u.</b>
            </li>
          ))}
        </ul>
      ) : <p className="pe-empty">Aún no hay movimientos registrados.</p>}
    </section>
  );
}

function PhotoManager({photos, onAdd, onRemove, onMove}: {
  photos: string[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const endDrag = () => { setDragging(null); setOver(null); };

  /* En celular no existe el arrastre nativo: se activa al mantener presionada la foto. */
  const list = useRef<HTMLUListElement>(null);
  const hold = useRef<ReturnType<typeof setTimeout>>();
  const touched = useRef<{from: number; to: number | null} | null>(null);
  const cancelHold = () => clearTimeout(hold.current);
  const startHold = (i: number) => {
    cancelHold();
    hold.current = setTimeout(() => { touched.current = {from: i, to: null}; setDragging(i); }, 250);
  };
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const move = (e: TouchEvent) => {
      if (!touched.current) return cancelHold();
      e.preventDefault();
      const {clientX, clientY} = e.touches[0];
      const tile = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>('[data-photo]');
      if (!tile) return;
      touched.current.to = Number(tile.dataset.photo);
      setOver(touched.current.to);
    };
    const end = () => {
      cancelHold();
      const t = touched.current;
      if (t && t.to !== null && t.to !== t.from) onMove(t.from, t.to);
      touched.current = null;
      endDrag();
    };
    el.addEventListener('touchmove', move, {passive: false});
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
    return () => {
      el.removeEventListener('touchmove', move);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchcancel', end);
    };
  }, [onMove]);

  return (
    <div className="pe-photos">
      <div className="pe-photos-head">
        <h3>Fotos del producto</h3>
        <span>{photos.length} de {MAX_PHOTOS}</span>
      </div>
      <p>Sube las fotos de tu producto y arrástralas para elegir el orden. La primera será la principal.</p>
      <ul ref={list}>
        {photos.map((src, i) => (
          <li
            key={`${i}-${src.length}`}
            className={`pe-photo${dragging === i ? ' dragging' : ''}${over === i && dragging !== i ? ' over' : ''}`}
            data-photo={i}
            draggable
            onTouchStart={() => startHold(i)}
            onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; setDragging(i); }}
            onDragOver={e => { e.preventDefault(); setOver(i); }}
            onDrop={e => { e.preventDefault(); if (dragging !== null && dragging !== i) onMove(dragging, i); endDrag(); }}
            onDragEnd={endDrag}
          >
            <ProductImage src={src} alt={`Foto ${i + 1}`} sizes="160px"/>
            <em className={i === 0 ? 'main' : ''}>{i === 0 ? 'Principal' : i + 1}</em>
            <button type="button" className="pe-remove" onClick={() => onRemove(i)} aria-label={`Quitar foto ${i + 1}`}><Icon name="close"/></button>
          </li>
        ))}
        {photos.length < MAX_PHOTOS && (
          <li className="pe-photo-add">
            <label className="pe-add">
              <span aria-hidden="true">+</span>
              <b>{photos.length ? 'Agregar fotos' : 'Subir fotos'}</b>
              <input
                type="file" accept="image/*" multiple hidden
                onChange={e => { onAdd(Array.from(e.target.files ?? [])); e.target.value = ''; }}
              />
            </label>
          </li>
        )}
      </ul>
    </div>
  );
}
