import type {Metadata} from 'next';
import {COMPANY, LegalPage} from '@/components/shop/LegalPage';

export const metadata: Metadata = {title: 'Tratamiento de datos personales | Tienda MARWA'};

export default function DatosPage() {
  return (
    <LegalPage
      eyebrow="Legal · Protección de datos"
      title="Política de Tratamiento de Datos Personales"
      intro={<>{COMPANY} (en adelante MARWA · Redes y Energía), en cumplimiento de la Ley 1581 de 2012, el Decreto 1074 de 2015 y demás normas concordantes sobre protección de datos personales, informa a los titulares la presente política.</>}
      footnote={<>Última actualización: junio de 2026 · {COMPANY}</>}
    >
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>{COMPANY}<br/>Sitio web: www.marwa.com.co<br/>Correo electrónico para asuntos de datos personales: <a href="mailto:info@marwa.com.co">info@marwa.com.co</a></p>
      </section>
      <section>
        <h2>2. Tratamiento y finalidad</h2>
        <p>Le informamos que sus datos personales podrán ser utilizados para apoyar estrategias de marketing, análisis de consumo y preferencias, así como para generar y fortalecer relaciones comerciales entre las partes. Su información será protegida conforme a los protocolos de seguridad implementados por nuestra compañía.</p>
      </section>
      <section>
        <h2>3. Derechos del titular</h2>
        <p>Como titular de los datos, usted podrá en cualquier momento ejercer sus derechos de acceso, modificación, supresión y/o actualización de sus datos personales, de conformidad con lo previsto en la Ley 1581 de 2012, así como conocer, rectificar, solicitar prueba de la autorización otorgada, presentar quejas ante la Superintendencia de Industria y Comercio y revocar la autorización.</p>
      </section>
      <section>
        <h2>4. Cómo ejercer sus derechos</h2>
        <p>Puede ejercer sus derechos mediante el envío de un correo electrónico a <a href="mailto:info@marwa.com.co">info@marwa.com.co</a>, indicando su solicitud y los datos que permitan su identificación. Daremos respuesta en los términos establecidos por la ley.</p>
      </section>
      <section>
        <h2>5. Manual de políticas y procedimientos</h2>
        <p>Para más información, puede consultar el Manual de Políticas y Procedimientos de Protección de Datos disponible en nuestra página web: www.marwa.com.co.</p>
      </section>
      <section>
        <h2>6. Autorización</h2>
        <p>Al diligenciar nuestros formularios y suministrar sus datos de contacto, usted autoriza de manera previa, expresa e informada a {COMPANY} para realizar el tratamiento de sus datos personales conforme a las finalidades aquí descritas.</p>
      </section>
    </LegalPage>
  );
}
