import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 lg:py-24">
        <div className="prose prose-lg dark:prose-invert mx-auto max-w-4xl">
          <h1>Política de Privacidad</h1>
          <p className="lead">Última actualización: 20 de junio de 2025</p>

          <h2>1. Responsable del Tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos recabados a través del presente sitio web Fedrita (el "Servicio") es:
          </p>
          <ul>
            <li><strong>Razón Social:</strong> WITAR TECHNOLOGY SL</li>
            <li><strong>NIF:</strong> B56653280</li>
            <li><strong>Domicilio Social:</strong> CALLE MAYOR, 94, 3 5. 46960, ALDAIA (VALENCIA). ESPAÑA.</li>
            <li><strong>Email:</strong> <a href="mailto:hola@fedrita.com">hola@fedrita.com</a></li>
          </ul>

          <h2>2. Introducción</h2>
          <p>
            WITAR TECHNOLOGY SL ("nosotros", "nuestro" o "nos") se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando utiliza nuestra plataforma SaaS.
          </p>

          <h2>3. Información que Recopilamos</h2>
          <p>
            Podemos recopilar información de identificación personal, como su nombre, dirección de correo electrónico, número de teléfono y datos de pago. También recopilamos datos relacionados con su negocio, como información del salón, detalles de los empleados, servicios ofrecidos y datos de los clientes. Además, recopilamos datos de uso sobre cómo interactúa con nuestro Servicio.
          </p>

          <h2>4. Cómo Usamos su Información</h2>
          <p>
            Usamos la información que recopilamos para:
          </p>
          <ul>
            <li>Proporcionar, operar y mantener nuestro Servicio.</li>
            <li>Mejorar, personalizar y ampliar nuestro Servicio.</li>
            <li>Entender y analizar cómo utiliza nuestro Servicio.</li>
            <li>Desarrollar nuevos productos, servicios, características y funcionalidades.</li>
            <li>Comunicarnos con usted para servicio al cliente, para proporcionarle actualizaciones y otra información relacionada con el Servicio.</li>
            <li>Procesar sus transacciones.</li>
            <li>Enviar correos electrónicos promocionales.</li>
          </ul>

          <h2>5. Cómo Compartimos su Información</h2>
          <p>
            No vendemos, comercializamos ni transferimos de otro modo a terceros su información de identificación personal, excepto en las siguientes circunstancias:
          </p>
          <ul>
              <li>Con proveedores de servicios de confianza que nos ayudan a operar nuestro Servicio.</li>
              <li>Para cumplir con las leyes y regulaciones aplicables.</li>
              <li>Para proteger nuestros derechos, privacidad, seguridad o propiedad.</li>
          </ul>

          <h2>6. Seguridad de los Datos</h2>
          <p>
            Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal. Utilizamos cifrado estándar de la industria y seguimos las mejores prácticas para proteger los datos.
          </p>

          <h2>7. Retención de Datos</h2>
          <p>
            Retendremos su información personal solo durante el tiempo que sea necesario para los fines establecidos en esta Política de Privacidad. Retendremos y utilizaremos su información en la medida necesaria para cumplir con nuestras obligaciones legales.
          </p>
          
          <h2>8. Sus Derechos de Protección de Datos</h2>
          <p>
            Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, incluido el derecho a acceder, corregir, eliminar o restringir el uso de su información personal.
          </p>

          <h2>9. Cambios a esta Política</h2>
          <p>
            Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en <a href="mailto:hola@fedrita.com">hola@fedrita.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;