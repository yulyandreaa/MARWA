'use client';

import Image from 'next/image';
import {useMemo, useState} from 'react';
import {catalogProducts, type CatalogProduct} from '@/data/catalogProducts';

type CartLine = CatalogProduct & {quantity:number};
const filters = ['Todos','Infraestructura','Fibra óptica','Cableado'] as const;

export function StoreSection(){
  const [filter,setFilter]=useState<(typeof filters)[number]>('Todos');
  const [cart,setCart]=useState<CartLine[]>([]);
  const [cartOpen,setCartOpen]=useState(false);
  const [selected,setSelected]=useState<CatalogProduct|null>(null);
  const [sent,setSent]=useState(false);
  const shown=useMemo(()=>filter==='Todos'?catalogProducts:catalogProducts.filter(p=>p.category===filter),[filter]);
  const total=cart.reduce((sum,p)=>sum+p.quantity,0);
  const add=(product:CatalogProduct)=>{setCart(lines=>{const found=lines.find(p=>p.id===product.id);return found?lines.map(p=>p.id===product.id?{...p,quantity:p.quantity+1}:p):[...lines,{...product,quantity:1}]});setCartOpen(true);setSent(false)};
  const update=(id:string,delta:number)=>setCart(lines=>lines.map(p=>p.id===id?{...p,quantity:p.quantity+delta}:p).filter(p=>p.quantity>0));

  return <section className="store-section" id="tienda">
    <div className="container catalog-hero">
      <Image src="/assets/catalogo-hero-marbot-v2.png" alt="Catálogo MARWA: todo para conectar tu próximo proyecto" fill priority sizes="(max-width: 1220px) 100vw, 1180px"/>
      <h1 className="sr-only">Catálogo MARWA: todo para conectar tu próximo proyecto</h1>
      <button className="catalog-hero-cart" onClick={()=>setCartOpen(true)} aria-label={`Abrir carrito con ${total} productos`}><span>Mi selección</span><b>{total}</b></button>
    </div>
    <div className="container filter-row" role="group" aria-label="Filtrar productos">{filters.map(item=><button key={item} className={filter===item?'active':''} onClick={()=>setFilter(item)}>{item}</button>)}</div>
    <div className="container store-grid">{shown.map((product,index)=><article className="store-card" key={product.id}>
      <div className="store-image"><span className="product-index">{String(index+1).padStart(2,'0')}</span><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 30vw"/>{product.badge&&<small>{product.badge}</small>}</div>
      <div className="store-card-body"><p>{product.category}</p><h3>{product.name}</h3><span>{product.description}</span><button className="detail-link" onClick={()=>setSelected(product)}>Ver detalle <span>→</span></button><div className="store-card-foot"><b>Precio bajo cotización</b><button onClick={()=>add(product)}>Agregar <i>＋</i></button></div></div>
    </article>)}</div>
    <div className="store-campaign"><button className="container campaign-art" onClick={()=>setCartOpen(true)} aria-label="Cotizar productos de la línea de fibra óptica MARWA"><Image src="/assets/banner-fibra-optica-marwa-v2.jpg" alt="Línea Fibra Óptica MARWA — Soluciones que conectan" width={1920} height={541} sizes="(max-width: 1220px) 100vw, 1180px"/><span>Cotizar línea de fibra óptica →</span></button></div>

    {selected&&<div className="product-detail-backdrop" onClick={()=>setSelected(null)}><article className="product-detail" onClick={event=>event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="product-detail-title"><button className="product-detail-close" onClick={()=>setSelected(null)} aria-label="Cerrar detalle">×</button><div className="product-detail-image"><Image src={selected.image} alt={selected.name} fill sizes="(max-width: 760px) 100vw, 50vw"/><span>{selected.badge||'Producto MARWA'}</span></div><div className="product-detail-copy"><small>{selected.category}</small><h2 id="product-detail-title">{selected.name}</h2><p>{selected.description}</p><div className="product-features"><b>Características principales</b><ul>{selected.features.map(feature=><li key={feature}><i>✓</i>{feature}</li>)}</ul></div><div className="product-detail-actions"><div><span>Precio</span><b>Bajo cotización</b></div><button onClick={()=>{setSelected(null);add(selected)}}>Agregar al carrito <span>＋</span></button></div><em>Disponibilidad y especificaciones finales sujetas a confirmación comercial.</em></div></article></div>}

    {cartOpen&&<div className="cart-backdrop" onClick={()=>setCartOpen(false)}><aside className="cart-panel" onClick={e=>e.stopPropagation()} aria-label="Carrito de cotización">
      <div className="cart-header"><div><small>Tu selección</small><h3>Carrito MARWA</h3></div><button onClick={()=>setCartOpen(false)} aria-label="Cerrar carrito">×</button></div>
      {sent?<div className="cart-success"><i>✓</i><h3>Solicitud preparada</h3><p>Un asesor MARWA se comunicará contigo para confirmar precios, disponibilidad y despacho.</p><button className="button primary" onClick={()=>{setSent(false);setCart([]);setCartOpen(false)}}>Continuar navegando</button></div>:<>
        <div className="cart-lines">{cart.length===0?<div className="cart-empty"><b>Tu carrito está vacío</b><p>Agrega productos del catálogo para solicitar una cotización.</p></div>:cart.map(line=><div className="cart-line" key={line.id}><div className="cart-thumb"><Image src={line.image} alt="" fill sizes="72px"/></div><div><small>{line.category}</small><b>{line.name}</b><div className="quantity"><button onClick={()=>update(line.id,-1)}>−</button><span>{line.quantity}</span><button onClick={()=>update(line.id,1)}>＋</button></div></div><button className="remove" onClick={()=>setCart(lines=>lines.filter(p=>p.id!==line.id))}>×</button></div>)}</div>
        {cart.length>0&&<div className="cart-checkout"><div><span>Productos seleccionados</span><b>{total}</b></div><p>El valor final será confirmado por nuestro equipo comercial.</p><button className="button primary" onClick={()=>setSent(true)}>Solicitar cotización <span>→</span></button></div>}
      </>}
    </aside></div>}
  </section>
}
