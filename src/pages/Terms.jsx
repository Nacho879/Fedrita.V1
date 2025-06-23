import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 lg:py-24">
        <div className="prose prose-lg dark:prose-invert mx-auto max-w-4xl">
          <h1>Términos y Condiciones</h1>
          <p className="lead">Última actualización: 20 de junio de 2025</p>

          <h2>1. Datos Identificativos del Titular</h2>
          <p>
            De acuerdo con la normativa vigente, se informa al usuario de que este sitio web es titularidad de:
          </p>
          <ul>
            <li><strong>Razón Social:</strong> WITAR TECHNOLOGY SL</li>
            <li><strong>NIF:</strong> B56653280</li>
            <li><strong>Forma Jurídica:</strong> Sociedad Limitada</li>
            <li><strong>Domicilio Social:</strong> CALLE MAYOR, 94, 3 5. 46960, ALDAIA (VALENCIA). ESPAÑA.</li>
          </ul>

          <h2>2. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar Fedrita (el "Servicio"), operado por WITAR TECHNOLOGY SL, usted acepta estar sujeto a estos Términos y Condiciones ("Términos"). Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.
          </p>

          <h2>3. Descripción del Servicio</h2>
          <p>
            Fedrita es una plataforma SaaS que proporciona a los salones de belleza herramientas de gestión, automatización de la comunicación a través de IA, gestión de reservas y otras funcionalidades relacionadas para optimizar sus operaciones comerciales.
          </p>

          <h2>4. Cuentas de Usuario</h2>
          <p>
            Para utilizar ciertas funciones del Servicio, debe registrarse para obtener una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y es totalmente responsable de todas las actividades que ocurran bajo su cuenta. Se compromete a notificar inmediatamente a Fedrita sobre cualquier uso no autorizado de su cuenta.
          </p>

          <h2>5. Suscripciones y Pagos</h2>
          <p>
            El Servicio se factura por suscripción. Usted acepta pagar todas las tarifas o cargos a su cuenta de acuerdo con las tarifas, los cargos y los términos de facturación vigentes en el momento en que una tarifa o cargo se debe y es pagadero.
          </p>

          <h2>6. Política de Uso Aceptable</h2>
          <p>
            Usted acepta no utilizar el Servicio para ningún propósito ilegal o prohibido por estos Términos. No puede usar el Servicio de ninguna manera que pueda dañar, deshabilitar, sobrecargar o deteriorar el Servicio.
          </p>

          <h2>7. Propiedad Intelectual</h2>
          <p>
            El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de WITAR TECHNOLOGY SL y sus licenciantes. El Servicio está protegido por derechos de autor, marcas comerciales y otras leyes tanto de España como de países extranjeros.
          </p>

          <h2>8. Limitación de Responsabilidad</h2>
          <p>
            En ningún caso WITAR TECHNOLOGY SL, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de los daños indirectos, incidentales, especiales, consecuentes o punitivos, incluidos, entre otros, la pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de su acceso o uso o incapacidad para acceder o usar el Servicio.
          </p>

          <h2>9. Cambios en los Términos</h2>
          <p>
            Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es importante, intentaremos proporcionar un aviso de al menos 30 días antes de que entren en vigor los nuevos términos.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Si tiene alguna pregunta sobre estos Términos, contáctenos en <a href="mailto:hola@fedrita.com">hola@fedrita.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;