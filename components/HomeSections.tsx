import Image from 'next/image';
import {CountUp} from './HomeMotion';

const WHATSAPP = `https://wa.me/573102569469?text=${encodeURIComponent('Hola MARWA, quiero cotizar un proyecto.')}`;

export function VisionSection() {
  const stats = [
    {value: 12, prefix: '+', label: 'Años de trayectoria'},
    {value: 6, label: 'Líneas de producto'},
    {value: 32, label: 'Departamentos con despacho'},
  ];
  return (
    <section className="vision">
      <div className="container vision-grid">
        <p className="eyebrow" data-reveal>Nuestra visión</p>
        <div data-reveal>
          <h2>La infraestructura debe impulsar tu negocio, <span className="tail">no detenerlo.</span></h2>
          <p>
            En MARWA convertimos el abastecimiento de redes y energía en algo simple, confiable y a tiempo.
            Como importadores y distribuidores directos, integramos seis líneas de producto con infraestructura
            confiable, escalable y alineada a estándares internacionales.
          </p>
        </div>
      </div>
      <div className="container vision-stats">
        {stats.map(s => (
          <div key={s.label} data-reveal>
            <b><CountUp value={s.value} prefix={s.prefix}/></b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WhySection() {
  const reasons = [
    {title: 'Importación directa', text: 'Sin intermediarios: precios mayoristas competitivos y control de calidad desde el origen.'},
    {title: 'Despachos a todo Colombia', text: 'Logística nacional para que tu proyecto avance sin esperas, en los 32 departamentos.'},
    {title: 'Cumplimiento normativo', text: 'Productos alineados a RITEL y RETIE, con calidad comprobada en cada entrega.'},
    {title: 'Respaldo técnico', text: 'Asesoría experta para elegir la solución correcta, de la cotización a la instalación.'},
  ];
  return (
    <section id="por-que" className="why">
      <div className="container why-grid">
        <header data-reveal>
          <p className="eyebrow">Por qué MARWA</p>
          <h2>Un solo aliado mayorista. <span className="tail">Todo lo que tu red necesita.</span></h2>
          <p>Eficiencia operativa, alto rendimiento y continuidad en la cadena de suministro para distribuidores, integradores e instaladores.</p>
          <a className="button primary" href={`https://wa.me/573102569469?text=${encodeURIComponent('Hola MARWA, quiero ser distribuidor.')}`} target="_blank" rel="noopener">Quiero ser distribuidor <span>→</span></a>
        </header>
        <div className="why-list">
          {reasons.map((r, i) => (
            <article key={r.title} data-reveal style={{transitionDelay: `${i * 80}ms`}}>
              <small>0{i + 1}</small>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeamSection() {
  const pillars = [
    {title: 'Trayectoria comprobada', text: 'Más de 12 años abasteciendo el sector de redes y telecomunicaciones.'},
    {title: 'Alianzas internacionales', text: 'Importación directa de fabricantes que cumplen estándares globales.'},
    {title: 'Servicio cercano', text: 'Un equipo que acompaña cada pedido, en todo el país.'},
  ];
  return (
    <section id="nosotros" className="team">
      <div className="container team-grid">
        <div className="team-photo" data-reveal>
          <Image src="/assets/equipo-marwa-colombia.png" alt="Equipo técnico colombiano trabajando en una solución de redes e infraestructura" fill sizes="(max-width: 900px) 92vw, 46vw"/>
          <div className="team-badge"><b>+12</b><span>años conectando<br/>a Colombia</span></div>
        </div>
        <div data-reveal>
          <p className="eyebrow light">Quiénes somos</p>
          <h2>El equipo detrás de las <span className="tail">redes de Colombia.</span></h2>
          <p>
            <b>MARWA Redes y Energía</b> es importador y distribuidor directo, especialista en suministro de
            soluciones completas en cableado estructurado, fibra óptica, networking, línea plástica, HDTV y energía.
          </p>
          <ul className="team-pillars">
            {pillars.map(p => <li key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function DefineSection() {
  const values = [
    {word: 'Tecnología', text: 'Productos y equipos para redes de alto rendimiento.'},
    {word: 'Innovación', text: 'Nuevas soluciones para una conectividad que evoluciona.'},
    {word: 'Confianza', text: 'Calidad comprobada y cumplimiento normativo en cada entrega.'},
  ];
  return (
    <section className="define">
      <div className="container">
        <p className="eyebrow light" data-reveal>Lo que nos define</p>
        <h2 className="define-word" data-reveal aria-label="MARWA">mar<span>w</span>a</h2>
        <ul className="define-rows">
          {values.map((v, i) => (
            <li key={v.word} data-reveal style={{transitionDelay: `${i * 90}ms`}}>
              <small>Conectamos</small>
              <b>{v.word}</b>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
        <p className="define-claim" data-reveal>Empresa colombiana de redes y energía. En MARWA, conectamos tecnología, innovación y confianza.</p>
      </div>
    </section>
  );
}

export function ContactCTA() {
  return (
    <section className="cta-final">
      <div className="container" data-reveal>
        <p className="eyebrow">Hablemos</p>
        <h2>Cuéntanos qué necesitas <span className="tail">conectar.</span></h2>
        <p>Cada gran instalación empieza por entender el reto. Nuestro equipo está listo para cotizar y asesorarte.</p>
        <div className="cta-actions">
          <a className="button primary" href={WHATSAPP} target="_blank" rel="noopener">Cotizar por WhatsApp <span>→</span></a>
          <a className="button ghost" href="mailto:info@marwa.com.co">info@marwa.com.co</a>
        </div>
        <small>Av. 70 #49-39 · Bogotá, Colombia · 310 256 9469</small>
      </div>
    </section>
  );
}
