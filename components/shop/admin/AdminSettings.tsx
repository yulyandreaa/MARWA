'use client';

import {useState, type FormEvent} from 'react';
import {categories} from '@/data/shopSeed';
import {saveSettings, useSettings, type StoreSettings} from '@/lib/settings';
import {toast} from '../ShopUI';
import {SectionHead} from '../account/AccountUI';
import {PlainSelect} from '../account/PlainSelect';

export function AdminSettings() {
  const saved = useSettings();
  const [v, setV] = useState<StoreSettings>(saved);
  const [line, setLine] = useState<string>(categories[0].id);
  const [sub, setSub] = useState('');
  const set = <K extends keyof StoreSettings>(k: K, value: StoreSettings[K]) => setV(x => ({...x, [k]: value}));
  const fixed = categories.find(c => c.id === line)?.subs ?? [];
  const extra = v.extraSubs[line] ?? [];

  const commit = (next: StoreSettings, message: string) => {
    setV(next);
    toast(saveSettings(next) ? message : 'No se pudo guardar');
  };
  const addSub = () => {
    const name = sub.trim();
    if (!name) return;
    if ([...fixed, ...extra].some(x => x.toLowerCase() === name.toLowerCase())) return toast('Esa subcategoría ya existe');
    setSub('');
    commit({...v, extraSubs: {...v.extraSubs, [line]: [...extra, name]}}, 'Subcategoría agregada');
  };
  const removeSub = (name: string) =>
    commit({...v, extraSubs: {...v.extraSubs, [line]: extra.filter(x => x !== name)}}, 'Subcategoría quitada');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const whatsapp = v.whatsapp.replace(/\D/g, '');
    if (whatsapp.length < 10) return toast('Escribe el WhatsApp con indicativo, por ejemplo 573102569469');
    commit({...v, whatsapp}, 'Ajustes guardados');
  };

  return (
    <>
      <SectionHead title="Ajustes" text="Datos de la empresa, envío y subcategorías de la tienda."/>
      <form className="form pa-form pa-settings" onSubmit={submit}>
        <section className="pa-section">
          <h2>Empresa</h2>
          <p className="pa-section-text">Aparecen en el comprobante de compra.</p>
          <div className="form-grid">
            <label>Razón social<input required value={v.company} onChange={e => set('company', e.target.value)}/></label>
            <label>NIT<input value={v.nit} onChange={e => set('nit', e.target.value)}/></label>
            <label>Dirección<input value={v.address} onChange={e => set('address', e.target.value)}/></label>
            <label>Correo de contacto<input type="email" value={v.email} onChange={e => set('email', e.target.value)}/></label>
            <label>WhatsApp de la tienda<input required inputMode="tel" value={v.whatsapp} onChange={e => set('whatsapp', e.target.value)}/></label>
          </div>
        </section>

        <section className="pa-section">
          <h2>Envío</h2>
          <p className="pa-section-text">Se muestra en el carrito y se suma al total en el pago.</p>
          <div className="form-grid">
            <PlainSelect
              field
              caption="Cómo se cobra"
              label="Cómo se cobra el envío"
              value={v.shippingMode}
              onChange={m => set('shippingMode', m)}
              options={[{value: 'coordinar', label: 'Se coordina al despachar'}, {value: 'fijo', label: 'Tarifa fija'}]}
            />
            {v.shippingMode === 'fijo' && (
              <>
                <label>Tarifa (COP)<input required type="number" min={0} step={100} value={v.shippingFee || ''} onChange={e => set('shippingFee', Number(e.target.value))}/></label>
                <label><span>Gratis desde (COP) <em>(opcional)</em></span><input type="number" min={0} step={1000} value={v.freeFrom || ''} onChange={e => set('freeFrom', Number(e.target.value))}/></label>
              </>
            )}
          </div>
        </section>

        <div className="pa-actions"><button className="button primary">Guardar ajustes</button></div>
      </form>

      <section className="pa-section">
        <h2>Subcategorías</h2>
        <p className="pa-section-text">Las nuevas aparecen en el menú y al subir un producto. Las líneas principales tienen foto y página propias, por eso se cambian con el equipo de desarrollo.</p>
        <div className="pa-subs-tools">
          <PlainSelect field label="Línea" value={line} onChange={setLine} options={categories.map(c => ({value: c.id as string, label: c.name}))}/>
          <input aria-label="Nueva subcategoría" placeholder="Nueva subcategoría" value={sub} onChange={e => setSub(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSub(); } }}/>
          <button type="button" className="button ghost" onClick={addSub}>Agregar</button>
        </div>
        <ul className="pa-subs">
          {fixed.map(x => <li key={x}>{x}</li>)}
          {extra.map(x => <li key={x} className="own">{x}<button type="button" onClick={() => removeSub(x)} aria-label={`Quitar ${x}`}>×</button></li>)}
        </ul>
      </section>
    </>
  );
}
