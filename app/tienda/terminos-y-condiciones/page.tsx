import type {Metadata} from 'next';
import {COMPANY, LegalPage, SacContact} from '@/components/shop/LegalPage';

export const metadata: Metadata = {title: 'Términos y condiciones | Tienda MARWA'};

/**
 * Términos y condiciones de la tienda en línea, redactados por Claude el 10-nov-2026 con base en la normativa
 * colombiana de comercio electrónico (Ley 1480 de 2011, Decreto 1074 de 2015, Decreto 587 de 2016, Ley 527 de 1999,
 * Ley 1581 de 2012). Pendiente: revisión del cliente / asesor legal de MARWA antes de publicar en producción.
 */
export default function TerminosPage() {
  return (
    <LegalPage
      eyebrow="Legal · Términos y condiciones"
      title="Términos y Condiciones de la Tienda en Línea"
      intro="Estos términos regulan el uso de la tienda en línea tiendamarwa.com.co y las compras que se realicen a través de ella. Se rigen por la Ley 1480 de 2011 (Estatuto del Consumidor), el Decreto 1074 de 2015 en lo relativo al comercio electrónico, la Ley 527 de 1999 y las demás normas colombianas aplicables."
      footnote={<>{COMPANY} · NIT 900.758.826-5 · www.marwa.com.co · Versión vigente: noviembre de 2026</>}
    >
      <section>
        <h2>1. Identificación del vendedor</h2>
        <p>La tienda en línea es operada por {COMPANY}, identificada con NIT 900.758.826-5, que comercializa sus productos bajo la marca MARWA · Redes y Energía (en adelante, “MARWA”), con domicilio en la Av. 70 #49-39, Bogotá, Colombia.</p>
        <p>Para cualquier inquietud, petición, queja o reclamo puede contactarnos por los canales de Servicio al Cliente indicados al final de este documento.</p>
      </section>

      <section>
        <h2>2. Aceptación de los términos</h2>
        <p>Al navegar en la tienda, crear una cuenta o realizar una compra, usted declara que ha leído, entendido y aceptado estos términos y condiciones, así como la <a href="/tienda/tratamiento-de-datos">Política de Tratamiento de Datos Personales</a> y la <a href="/tienda/devoluciones">Política de Devoluciones y Garantía</a>. Si no está de acuerdo, le pedimos no utilizar la tienda.</p>
        <p>Para comprar en la tienda debe ser mayor de edad y tener capacidad legal para contratar. Cuando la compra se haga a nombre de una empresa, quien la realiza declara contar con la autorización para obligarla.</p>
      </section>

      <section>
        <h2>3. Cuenta de usuario</h2>
        <p>Para comprar puede ser necesario crear una cuenta con datos verídicos y actualizados. Usted es responsable de la confidencialidad de su contraseña y de toda actividad realizada desde su cuenta. Si detecta un uso no autorizado, debe informarlo de inmediato a Servicio al Cliente.</p>
        <p>MARWA podrá suspender o cancelar cuentas cuando se suministre información falsa o se haga un uso fraudulento o contrario a estos términos.</p>
      </section>

      <section>
        <h2>4. Información de los productos</h2>
        <p>MARWA publica la información de cada producto (características, especificaciones técnicas, presentación y precio) de manera veraz, suficiente y verificable, conforme al artículo 23 de la Ley 1480 de 2011. Las especificaciones técnicas corresponden a las declaradas por el fabricante.</p>
        <p>Las fotografías son de referencia y pueden presentar diferencias menores de color, empaque o acabado frente al producto entregado, sin que ello afecte sus características técnicas.</p>
        <p>La selección de los productos y la validación de las especificaciones para cada proyecto es responsabilidad del cliente. Si tiene dudas, nuestros asesores pueden orientarle antes de la compra.</p>
      </section>

      <section>
        <h2>5. Precios y disponibilidad</h2>
        <p>Todos los precios se expresan en pesos colombianos (COP) e incluyen el IVA. El costo del envío no está incluido en el precio del producto y se informa o se coordina con el cliente antes de despachar el pedido.</p>
        <p>Los precios y la disponibilidad pueden cambiar sin previo aviso, pero el precio que aplica es el vigente al momento de confirmar la compra. Las promociones tienen la vigencia y las condiciones que se indiquen en cada caso y aplican hasta agotar existencias, cuyo número se informará cuando sea limitado.</p>
        <p>Si por un error evidente de digitación un producto se publica con un precio notoriamente inferior al real, MARWA informará al cliente y le dará la opción de continuar la compra con el precio correcto o de cancelarla con la devolución total del dinero pagado.</p>
      </section>

      <section>
        <h2>6. Proceso de compra</h2>
        <ol className="lg-steps">
          <li>Seleccione los productos y agréguelos al carrito.</li>
          <li>Revise el resumen del pedido: productos, cantidades, precio total, IVA y datos de entrega. Antes de pagar podrá corregir cualquier información.</li>
          <li>Elija el medio de pago y confirme la compra.</li>
          <li>Recibirá la confirmación del pedido con su número de referencia y podrá consultar su estado en “Mi cuenta”.</li>
        </ol>
        <p>La compra se entiende perfeccionada cuando el pago es aprobado por la entidad financiera. MARWA podrá abstenerse de procesar un pedido cuando el pago sea rechazado, se detecten indicios de fraude o el producto no esté disponible; en este último caso se informará al cliente y se reintegrará la totalidad del dinero pagado.</p>
      </section>

      <section>
        <h2>7. Medios de pago</h2>
        <p>La tienda acepta pagos con tarjeta débito o crédito y por PSE (incluido Nequi), a través de una pasarela de pagos certificada. MARWA no almacena los datos de sus tarjetas ni de sus cuentas bancarias: estos son procesados directamente por la pasarela bajo sus estándares de seguridad.</p>
      </section>

      <section>
        <h2>8. Envíos y entrega</h2>
        <p>Realizamos despachos a los 32 departamentos de Colombia a la dirección indicada por el cliente. Los tiempos de entrega dependen de la ciudad de destino y de la transportadora, y se informan al momento del despacho junto con el número de guía.</p>
        <p>Salvo que se acuerde un plazo diferente, el pedido se entregará en un término máximo de treinta (30) días calendario contados a partir del día siguiente a la confirmación de la compra, de acuerdo con el artículo 50 de la Ley 1480 de 2011. Si la entrega no se realiza en ese plazo, el cliente podrá resolver el contrato y solicitar la devolución del dinero.</p>
        <p>Al recibir el pedido, verifique el estado del empaque y de los productos. Si encuentra alguna novedad, déjela registrada en la guía de la transportadora y repórtela a Servicio al Cliente.</p>
      </section>

      <section>
        <h2>9. Derecho de retracto</h2>
        <p>De acuerdo con el artículo 47 de la Ley 1480 de 2011, en las compras realizadas a través de la tienda en línea el consumidor podrá retractarse de la compra dentro de los cinco (5) días hábiles siguientes a la entrega del producto.</p>
        <ul>
          <li>El producto debe devolverse por los mismos medios y en las mismas condiciones en que fue recibido: sin uso, en su empaque original y con todos sus accesorios.</li>
          <li>Los costos de transporte y los demás que conlleve la devolución del producto corren por cuenta del consumidor.</li>
          <li>MARWA devolverá la totalidad del dinero pagado, sin descuentos ni retenciones, dentro de los treinta (30) días calendario siguientes al ejercicio del derecho.</li>
        </ul>
        <p>Conforme a la ley, el retracto no aplica, entre otros casos, a productos confeccionados conforme a las especificaciones del consumidor o claramente personalizados, como el cable cortado a la medida solicitada.</p>
      </section>

      <section>
        <h2>10. Reversión del pago</h2>
        <p>De acuerdo con el artículo 51 de la Ley 1480 de 2011 y el Decreto 587 de 2016, cuando la compra se haya pagado con tarjeta de crédito, débito o cualquier otro instrumento de pago electrónico, el consumidor podrá solicitar la reversión del pago en los siguientes casos:</p>
        <ul>
          <li>Cuando sea objeto de fraude o la operación no haya sido solicitada.</li>
          <li>Cuando el producto adquirido no haya sido recibido.</li>
          <li>Cuando el producto entregado no corresponda a lo solicitado o sea defectuoso.</li>
        </ul>
        <p>Para ello, debe presentar la queja ante MARWA y la solicitud ante el emisor del instrumento de pago dentro de los cinco (5) días hábiles siguientes a la fecha en que tuvo noticia de la operación fraudulenta o no solicitada, o en que debió haber recibido el producto. Cuando proceda, el producto deberá devolverse a MARWA.</p>
      </section>

      <section>
        <h2>11. Garantía, devoluciones y cambios</h2>
        <p>Todos los productos cuentan con la garantía legal establecida en los artículos 7 y siguientes de la Ley 1480 de 2011. Las condiciones de garantía, cambios y devoluciones se detallan en la <a href="/tienda/devoluciones">Política de Devoluciones y Garantía</a>.</p>
      </section>

      <section>
        <h2>12. Facturación</h2>
        <p>Por cada compra se emitirá la factura electrónica de venta con los datos de facturación suministrados por el cliente (nombre o razón social, documento de identidad o NIT, dirección y correo electrónico). El cliente es responsable de que estos datos sean correctos y completos.</p>
      </section>

      <section>
        <h2>13. Datos personales</h2>
        <p>Los datos personales suministrados en la tienda se tratan de acuerdo con la Ley 1581 de 2012, el Decreto 1377 de 2013 y nuestra <a href="/tienda/tratamiento-de-datos">Política de Tratamiento de Datos Personales</a>, donde se explican sus finalidades y la forma de ejercer los derechos a conocer, actualizar, rectificar y suprimir la información.</p>
      </section>

      <section>
        <h2>14. Propiedad intelectual</h2>
        <p>La marca MARWA, los logotipos, textos, fotografías, diseños y demás contenidos de la tienda son propiedad de {COMPANY} o de sus respectivos titulares y están protegidos por las normas de propiedad intelectual. No pueden ser copiados, reproducidos ni utilizados sin autorización previa y por escrito.</p>
      </section>

      <section>
        <h2>15. Uso adecuado de la tienda</h2>
        <p>El usuario se compromete a utilizar la tienda de forma lícita, a no suministrar información falsa, a no intentar acceder sin autorización a sus sistemas y a no realizar actividades que afecten su funcionamiento o los derechos de terceros. MARWA procura que la tienda esté disponible de forma continua, pero puede presentar interrupciones por mantenimiento o causas ajenas a su control.</p>
      </section>

      <section>
        <h2>16. Peticiones, quejas y reclamos</h2>
        <p>Puede radicar sus peticiones, quejas, reclamos o sugerencias en la sección <a href="/tienda/pqrs">PQRS</a> o a través de los canales de Servicio al Cliente. Daremos respuesta dentro de los términos establecidos por la ley. Si considera que sus derechos como consumidor no han sido atendidos, puede acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co).</p>
      </section>

      <section>
        <h2>17. Modificaciones, ley aplicable y jurisdicción</h2>
        <p>MARWA podrá actualizar estos términos en cualquier momento. La versión vigente estará siempre publicada en esta página y aplicará a las compras realizadas a partir de su publicación; las compras ya confirmadas se rigen por la versión vigente al momento de la compra.</p>
        <p>Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se resolverá ante las autoridades competentes colombianas, sin perjuicio de los derechos que la ley reconoce al consumidor.</p>
      </section>

      <section>
        <h2>18. Contacto</h2>
        <p>Nuestro equipo de Servicio al Cliente está disponible para resolver cualquier inquietud sobre estos términos.</p>
        <SacContact/>
      </section>
    </LegalPage>
  );
}
