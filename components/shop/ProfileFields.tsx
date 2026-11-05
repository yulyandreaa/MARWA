'use client';

import {departments} from '@/data/shopSeed';
import type {Profile} from '@/lib/shop';

export const emptyProfile: Profile = {name: '', company: '', docId: '', phone: '', department: '', city: '', address: ''};

export function ProfileFields({value, onChange}: {value: Profile; onChange: (p: Profile) => void}) {
  const set = (k: keyof Profile) => (e: {target: {value: string}}) => onChange({...value, [k]: e.target.value});
  return (
    <>
      <div className="form-grid">
        <label>Nombre completo<input required value={value.name} onChange={set('name')} autoComplete="name"/></label>
        <label><span>Empresa <em>(opcional)</em></span><input value={value.company} onChange={set('company')} autoComplete="organization"/></label>
        <label>NIT o cédula<input required value={value.docId} onChange={set('docId')} inputMode="numeric"/></label>
        <label>Celular<input required type="tel" value={value.phone} onChange={set('phone')} autoComplete="tel" pattern="[0-9 +]{7,15}" title="Solo números"/></label>
      </div>
      <div className="form-grid">
        <label>Departamento
          <select required value={value.department} onChange={set('department')}>
            <option value="">Selecciona…</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label>Ciudad o municipio<input required value={value.city} onChange={set('city')} autoComplete="address-level2"/></label>
      </div>
      <label>Dirección de entrega<input required value={value.address} onChange={set('address')} autoComplete="street-address" placeholder="Calle, número, oficina / bodega"/></label>
    </>
  );
}
