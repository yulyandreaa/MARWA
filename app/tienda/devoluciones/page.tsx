import type {Metadata} from 'next';
import {COMPANY, LegalPage, SacContact} from '@/components/shop/LegalPage';

export const metadata: Metadata = {title: 'Devoluciones y garantía | Tienda MARWA'};

export default function DevolucionesPage() {
  return (
    <LegalPage
      eyebrow="Legal · Devoluciones y garantía"
      title="Política de Devoluciones y Garantía Legal"
      intro="La presente política se fundamenta en los artículos 7, 11, 16 y 47 de la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia) y aplica a todas las compras realizadas en la tienda en línea tiendamarwa.com.co y en los demás canales comerciales de MARWA · Redes y Energía."
      footnote={<>{COMPANY} · NIT 900.758.826-5 · www.marwa.com.co · Versión vigente: agosto de 2026</>}
    >
      <section>
        <h2>1. Principio general</h2>
        <p>MARWA · Redes y Energía actúa como el canal directo de respaldo entre el Fabricante Internacional y el Cliente Final en Colombia. Nuestra garantía cubre exclusivamente defectos de fabricación y vicios ocultos que impidan el rendimiento nominal de los productos bajo condiciones normales de operación.</p>
        <p>MARWA · Redes y Energía no tiene participación ni responsabilidad en el desarrollo de los proyectos del cliente. La selección de los productos y la validación de las especificaciones es responsabilidad del cliente.</p>
      </section>
      <section>
        <h2>2. Política de devolución</h2>
        <p>Estimado cliente: para aplicar a una devolución o cambio de producto, debe tener en cuenta lo siguiente.</p>
        <ol className="lg-steps">
          <li>Deberá presentar el producto en perfecto estado (sin uso, sin armar, en el empaque original, con catálogos, manuales y todas sus piezas completas). Tiene un plazo máximo de 6 días hábiles, una vez facturado el producto, para acercarse a nuestras instalaciones o, en dado caso, hacer llegar el producto a nuestro domicilio. Allí se revisará el estado del producto y se realizará el debido proceso para finalizar su solicitud.</li>
          <li>Una vez recibimos el producto, nuestro departamento de Logística lo revisa y aprueba, para posteriormente contar con la aprobación de nuestro equipo de Ingeniería y Soporte, quienes validan el correcto funcionamiento del equipo.</li>
          <li>No se aceptarán cambios o devoluciones de cable o de productos cortados o elaborados a la medida, bajo especificaciones particulares, o adquiridos a través de redención de puntos o rebates.</li>
          <li>Podrá acercarse a nuestras instalaciones y presentar el producto en perfecto estado con la factura correspondiente (en caso de no contar con ella, puede solicitar la constancia y/o certificado de compra al ingeniero comercial asignado). Allí se revisará el producto y se realizará el debido proceso para finalizar su solicitud.</li>
          <li>Una vez aceptada la devolución del equipo por nuestra parte, se genera Nota Crédito (NC) y con esta el cliente puede escoger el equipo que requiera de todo el listado de productos y gestionar la entrega con el comercial asignado.</li>
          <li>No se realiza devolución de dinero previo al pago de la misma. Para casos puntuales donde el cliente requiere dinero reembolsado, se genera una sanción del 25% del valor pagado, el cual se descuenta del monto transferido y se gira a la cuenta corriente/ahorros que el cliente autorice previamente. Este pago puede tardar hasta 30 días como máximo.</li>
        </ol>
      </section>
      <section>
        <h2>3. Garantía legal</h2>
        <p>Todos los productos comercializados por MARWA · Redes y Energía cuentan con garantía legal mínima conforme al artículo 11 de la Ley 1480 de 2011. El plazo de garantía es de doce (12) meses desde la fecha de entrega al comprador, o el plazo indicado por el fabricante, el que resulte mayor.</p>
        <div className="lg-cols">
          <div className="lg-card ok">
            <h3>La garantía cubre</h3>
            <ul>
              <li>Defectos de fabricación del producto tal como fue entregado.</li>
              <li>Fallas en el funcionamiento dentro de las especificaciones técnicas declaradas por el fabricante.</li>
            </ul>
          </div>
          <div className="lg-card no">
            <h3>La garantía NO cubre</h3>
            <ul>
              <li>Daños causados por instalación incorrecta, incumplimiento de la normativa o mala manipulación del producto en el momento de la instalación.</li>
              <li>Uso fuera de las especificaciones técnicas del fabricante (voltaje, temperatura, tracción, etc.).</li>
              <li>Modificaciones, reparaciones o alteraciones realizadas por el comprador o terceros no autorizados.</li>
              <li>Daños por accidentes, sobrecargas eléctricas, corrosión, humedad excesiva u otras causas externas.</li>
              <li>Desgaste normal por uso.</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2>4. Contacto</h2>
        <p>Nuestro equipo de Servicio al Cliente acompaña todo el proceso de devoluciones y garantías.</p>
        <SacContact/>
      </section>
    </LegalPage>
  );
}
