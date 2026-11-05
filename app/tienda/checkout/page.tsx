'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState, type FormEvent, type ReactNode} from 'react';
import {detailCart, paymentLabel, placeOrder, rememberAddress, updateProfile, useAddresses, useCart, useProducts, useSessionUser, type Address, type PaymentMethod, type Profile} from '@/lib/shop';
import {useHydrated} from '@/lib/persist';
import {money} from '@/lib/format';
import {departments} from '@/data/shopSeed';
import {municipios} from '@/data/municipios';
import {Icon} from '@/components/premium/Icons';
import {Loading, ProductImage} from '@/components/shop/ShopUI';
import {emptyProfile} from '@/components/shop/ProfileFields';

// Nequi se paga dentro de PSE; sigue en paymentLabel solo para mostrar pedidos anteriores.
const checkoutMethods: PaymentMethod[] = ['tarjeta', 'pse'];

function Field({label, select, children}: {label: string; select?: boolean; children: ReactNode}) {
  return <label className={select ? 'co-f co-f-select' : 'co-f'}>{children}<span>{label}</span></label>;
}

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useSessionUser();
  const {lines, subtotal, units} = detailCart(useCart(), useProducts());
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [notes, setNotes] = useState('');
  const [save, setSave] = useState(true);
  const [method, setMethod] = useState<PaymentMethod>('tarjeta');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(false);
  const addresses = useAddresses(user?.email);
  const [addressId, setAddressId] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const applyAddress = (a?: Address) => {
    setAddressId(a?.id ?? '');
    if (!a) return;
    setProfile(p => ({...p, department: a.department, city: a.city, address: a.address}));
    setNotes([`Recibe: ${a.recipient} (${a.phone})`, a.notes].filter(Boolean).join('. '));
  };

  // Prefill with the buyer's saved data
  useEffect(() => {
    if (user) {
      const {name, company, docId, phone, department, city, address} = user;
      setProfile({name, company, docId, phone, department, city, address});
      applyAddress(addresses.find(a => a.isDefault));
    }
  }, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hydrated && !user) router.replace('/tienda/ingresar?next=/tienda/checkout');
  }, [hydrated, user, router]);

  if (!hydrated || !user || placed) return <Loading/>;
  if (!lines.length) {
    return (
      <div className="container shop-empty">
        <h2>No hay productos para pagar</h2>
        <p>Tu carrito está vacío.</p>
        <div><Link className="button primary" href="/tienda">Ir al catálogo <span>→</span></Link></div>
      </div>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setPaying(true);
  };

  const approve = () => {
    try {
      if (save && user.role === 'comprador') {
        updateProfile(user.email, profile);
        rememberAddress(user.email, profile);
      }
      const order = placeOrder({email: user.email, customer: profile, notes, method});
      setPlaced(true);
      router.push(`/tienda/pedido/${order.id}`);
    } catch (err) {
      setPaying(false);
      setError((err as Error).message);
    }
  };

  const reject = () => {
    setPaying(false);
    setError('El pago fue rechazado por la entidad (simulación). No se hizo ningún cobro; puedes intentarlo de nuevo o elegir otro medio.');
  };

  const set = (k: keyof Profile) => (e: {target: {value: string}}) => setProfile(p => ({...p, [k]: e.target.value}));
  const cities = municipios[profile.department] ?? [];
  const chooseDepartment = (department: string) => {
    const options = municipios[department] ?? [];
    setProfile(p => ({...p, department, city: options.length === 1 ? options[0] : ''}));
  };

  return (
    <div className="co">
      <div className="co-bar">
        <div className="co-bar-in">
          <Link href="/tienda" className="co-logo" aria-label="MARWA, volver a la tienda">
            <Image src="/assets/marwa-logo-h.png" alt="" width={358} height={82} priority/>
          </Link>
          <Link href="/tienda/carrito" className="co-back"><Icon name="cart"/>Volver al carrito</Link>
        </div>
      </div>

      <form className="co-grid" onSubmit={submit}>
        <aside className="co-side" aria-label="Resumen del pedido">
          <div className="co-side-in">
            <button type="button" className="co-toggle" aria-expanded={showSummary} aria-controls="co-summary" onClick={() => setShowSummary(v => !v)}>
              <span>Resumen del pedido <Icon name="chevron"/></span>
              <b>{money(subtotal)}</b>
            </button>
            <div id="co-summary" className={showSummary ? 'co-summary open' : 'co-summary'}>
              <h2 className="co-sum-title">Resumen del pedido</h2>
              <ul className="co-items">
                {lines.map(l => (
                  <li key={l.id}>
                    <span className="co-thumb">
                      <span className="co-thumb-img"><ProductImage src={l.product.image} alt="" sizes="64px"/></span>
                      <b aria-label={`Cantidad ${l.qty}`}>{l.qty}</b>
                    </span>
                    <span className="co-item-name">{l.product.name}<small>Ref. {l.product.sku}</small></span>
                    <span className="co-item-price">{money(l.product.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="co-costs">
                <div><dt>Subtotal · {units} {units === 1 ? 'producto' : 'productos'}</dt><dd>{money(subtotal)}</dd></div>
                <div><dt>Envío</dt><dd className="soft">Se coordina al despachar</dd></div>
                <div className="total"><dt>Total</dt><dd><small>COP</small> {money(subtotal)}</dd></div>
              </dl>
              <div className="co-why">
                <h2>Por qué comprar en MARWA</h2>
                <ul>
                  <li><Icon name="shield"/>Tienda oficial MARWA</li>
                  <li><Icon name="truck"/>Despacho a los 32 departamentos</li>
                  <li><Icon name="headset"/>Asesoría por WhatsApp</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <div className="co-main">
          <div className="co-main-in">
            <section>
              <h1>Finalizar compra</h1>
              <p className="co-sub">Completa tus datos para recibir tu pedido</p>
              <h2>Datos de entrega</h2>
              <div className="co-fields">
                <Field label="Correo electrónico"><input value={user.email} readOnly placeholder=" "/></Field>
                {addresses.length > 0 && (
                  <Field label="Dirección guardada" select>
                    <select value={addressId} onChange={e => applyAddress(addresses.find(a => a.id === e.target.value))}>
                      {addresses.map(a => <option key={a.id} value={a.id}>{a.label} · {a.address}, {a.city}</option>)}
                      <option value="">Usar otra dirección</option>
                    </select>
                  </Field>
                )}
                <div className="co-two">
                  <Field label="Nombre completo"><input required value={profile.name} onChange={set('name')} autoComplete="name" placeholder=" "/></Field>
                  <Field label="NIT o cédula"><input required value={profile.docId} onChange={set('docId')} inputMode="numeric" placeholder=" "/></Field>
                </div>
                <div className="co-two">
                  <Field label="Celular"><input required type="tel" value={profile.phone} onChange={set('phone')} autoComplete="tel" pattern="[0-9 +]{7,15}" title="Solo números" placeholder=" "/></Field>
                  <Field label="Empresa (opcional)"><input value={profile.company} onChange={set('company')} autoComplete="organization" placeholder=" "/></Field>
                </div>
                <div className="co-two">
                  <Field label="Departamento" select>
                    <select required value={profile.department} onChange={e => chooseDepartment(e.target.value)}>
                      <option value="">Selecciona…</option>
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Ciudad o municipio" select>
                    <select required value={profile.city} onChange={set('city')} disabled={!profile.department} autoComplete="address-level2">
                      <option value="">{profile.department ? 'Selecciona…' : 'Elige un departamento'}</option>
                      {profile.city && !cities.includes(profile.city) && <option>{profile.city}</option>}
                      {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Dirección de entrega"><input required value={profile.address} onChange={set('address')} autoComplete="street-address" placeholder=" "/></Field>
                <Field label="Indicaciones para la entrega (opcional)"><textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder=" "/></Field>
                {user.role === 'comprador' && (
                  <label className="co-check"><input type="checkbox" checked={save} onChange={e => setSave(e.target.checked)}/>Guardar estos datos en mi cuenta</label>
                )}
              </div>
            </section>

            <section>
              <h2>Pago</h2>
              <p className="co-lead">Modo de prueba: el pago es simulado y no se realiza ningún cobro real.</p>
              <div className="co-pay-list" role="radiogroup" aria-label="Medio de pago">
                {checkoutMethods.map(m => (
                  <div key={m} className={method === m ? 'co-pay-opt active' : 'co-pay-opt'}>
                    <label>
                      <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)}/>
                      <b>{m === 'pse' ? 'PSE (bancos y Nequi)' : paymentLabel[m]}</b>
                      <Icon name={m === 'tarjeta' ? 'card' : 'lock'}/>
                    </label>
                    {method === m && <p>Al pagar se abrirá la pasarela de prueba para simular la respuesta del banco.</p>}
                  </div>
                ))}
              </div>
            </section>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button primary co-submit">Pagar ahora</button>
          </div>
        </div>
      </form>

      {paying && (
        <div className="modal-veil" role="dialog" aria-modal="true" aria-labelledby="pay-title">
          <div className="pay-modal">
            <p className="eyebrow">Pasarela de prueba</p>
            <h2 id="pay-title">{paymentLabel[method]}</h2>
            <p>Simula la respuesta del banco para el pago de <b>{money(subtotal)}</b>.</p>
            <div className="pay-actions">
              <button className="button primary" onClick={approve} autoFocus>Aprobar pago <span>✓</span></button>
              <button className="button ghost" onClick={reject}>Rechazar</button>
            </div>
            <button className="summary-link" onClick={() => setPaying(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
