import type {ReactNode} from 'react';

/* Plantilla de páginas legales de la tienda (textos oficiales tomados de marwa.com.co, 9-nov-2026). */
export function LegalPage({eyebrow, title, intro, children, footnote}: {eyebrow: string; title: string; intro?: ReactNode; children: ReactNode; footnote?: ReactNode}) {
  return (
    <article className="lg">
      <header className="lg-hero">
        <div className="pm-wrap">
          <span className="lg-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </div>
      </header>
      <div className="pm-wrap lg-body">
        {children}
        {footnote && <p className="lg-foot">{footnote}</p>}
      </div>
    </article>
  );
}

export const COMPANY = 'DISTRIBUCIONES BOGOTA CONECTIVIDAD ELECTRICOS E ILUMINACION S.A.S.';

export function SacContact() {
  return (
    <ul className="lg-contact">
      <li><a href="mailto:sac@marwa.com.co">sac@marwa.com.co</a></li>
      <li><a href="tel:+573102569469">310 2569469</a> · PBX 601 6136490</li>
      <li>Lunes a jueves: 7:30 a.m. – 4:00 p.m. · Viernes: 8:00 a.m. – 4:00 p.m.</li>
    </ul>
  );
}
