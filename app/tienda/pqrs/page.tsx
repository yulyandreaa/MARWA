'use client';

import {useState, type FormEvent} from 'react';
import {LegalPage} from '@/components/shop/LegalPage';
import {createPqr, pqrTypes, type PqrType} from '@/lib/pqr';
import {toast} from '@/components/shop/ShopUI';

/* PQRS pública (mismo formulario de marwa.com.co/pqr). Se guarda con createPqr, así el equipo la ve en el admin. */
export default function PqrsPage() {
  const [sent, setSent] = useState<string | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? '').trim();
    const extra = [`Teléfono: ${v('telefono')}`, v('ciudad') && `Ciudad: ${v('ciudad')}`].filter(Boolean).join(' · ');
    const pqr = createPqr({
      type: v('tipo') as PqrType, name: v('nombre'), email: v('correo'), orderId: v('pedido') || undefined,
      subject: `${v('tipo')} desde la tienda`, message: `${v('mensaje')}\n\n${extra}`,
    });
    if (!pqr) { toast('No pudimos guardar tu solicitud. Intenta de nuevo.'); return; }
    setSent(pqr.id);
    e.currentTarget.reset();
  };
  return (
    <LegalPage
      eyebrow="Servicio al Cliente · SAC"
      title="PQRS · Peticiones, Quejas, Reclamos y Sugerencias"
      intro="Tu opinión nos ayuda a mejorar. Diligencia el formulario y nuestro equipo de Servicio al Cliente (SAC) te dará respuesta."
    >
      <div className="lg-pqrs">
        {sent ? (
          <div className="lg-sent" role="status">
            <b>Recibimos tu solicitud {sent}</b>
            <p>Nuestro equipo de Servicio al Cliente te responderá al correo que registraste.</p>
            <button type="button" className="lg-btn ghost" onClick={() => setSent(null)}>Enviar otra solicitud</button>
          </div>
        ) : (
          <form className="lg-form" onSubmit={submit}>
            <select name="tipo" required defaultValue="" className="span2" aria-label="Tipo de solicitud">
              <option value="" disabled>Tipo de solicitud *</option>
              {pqrTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input name="nombre" required placeholder="Nombre completo o razón social *" className="span2" aria-label="Nombre completo o razón social"/>
            <input name="correo" type="email" required placeholder="Correo electrónico *" aria-label="Correo electrónico"/>
            <input name="telefono" type="tel" required placeholder="Teléfono de contacto *" aria-label="Teléfono de contacto"/>
            <input name="ciudad" placeholder="Ciudad" aria-label="Ciudad"/>
            <input name="pedido" placeholder="N.º de pedido o factura (si aplica)" aria-label="Número de pedido o factura"/>
            <textarea name="mensaje" required rows={5} placeholder="Describe tu petición, queja, reclamo o sugerencia… *" className="span2" aria-label="Mensaje"/>
            <label className="lg-check span2">
              <input type="checkbox" name="autorizacion" required/>
              <span>Autorizo el tratamiento de mis datos personales conforme a la <a href="/tienda/tratamiento-de-datos">Política de Tratamiento de Datos</a> de MARWA. *</span>
            </label>
            <button type="submit" className="lg-btn span2">Enviar PQRS</button>
          </form>
        )}
        <aside className="lg-sac">
          <h2>Servicio al Cliente · SAC</h2>
          <ul>
            <li><a href="mailto:sac@marwa.com.co">sac@marwa.com.co</a></li>
            <li><a href="tel:+573102569469">310 2569469</a></li>
            <li>Av. 70 #49-39, Bogotá · Colombia</li>
            <li><a href="https://wa.me/573102569469" target="_blank" rel="noopener">WhatsApp · Servicio al Cliente</a></li>
          </ul>
        </aside>
      </div>
    </LegalPage>
  );
}
