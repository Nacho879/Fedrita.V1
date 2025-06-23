import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Users, Target, Eye } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-b from-background to-slate-50 dark:to-gray-900">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-hub-anthracite mb-4"
            >
              Nuestra Misión es Potenciar tu Negocio
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl mx-auto text-lg text-muted-foreground"
            >
              En Fedrita, creemos que la tecnología puede transformar los negocios de servicios. Nuestra plataforma está diseñada para liberar a los dueños de negocios de las tareas administrativas, permitiéndoles enfocarse en lo que aman: su oficio y la conexión con sus clientes.
            </motion.p>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="p-6 bg-card rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 border">
                  <Target className="w-12 h-12 text-hub-coral" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Nuestra Misión</h3>
                <p className="text-muted-foreground">
                  Automatizar y simplificar la gestión de negocios basados en citas a través de una plataforma inteligente y fácil de usar, permitiendo a los dueños de negocios prosperar.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="p-6 bg-card rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 border">
                  <Eye className="w-12 h-12 text-hub-coral" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Nuestra Visión</h3>
                <p className="text-muted-foreground">
                  Ser la herramienta indispensable para cada negocio de servicios, impulsando su crecimiento y éxito en la era digital.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="p-6 bg-card rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 border">
                  <Users className="w-12 h-12 text-hub-coral" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Nuestros Valores</h3>
                <p className="text-muted-foreground">
                  Innovación, simplicidad, enfoque en el cliente y pasión por la excelencia. Creemos en construir relaciones sólidas y en crecer junto a nuestros socios.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="order-2 md:order-1"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestra Historia</h2>
                <p className="text-muted-foreground mb-4">
                  Fedrita nació de una necesidad real. Al ver a tantos profesionales talentosos —desde estilistas hasta terapeutas— atrapados en la interminable gestión de citas y recordatorios, supimos que tenía que haber una forma mejor.
                </p>
                <p className="text-muted-foreground">
                  Comenzamos con una misión clara: crear una herramienta tan intuitiva como poderosa que devolviera a los dueños de negocios su recurso más preciado: el tiempo. Lo que empezó como una solución para automatizar reservas se ha convertido en una plataforma integral que no solo organiza, sino que impulsa el crecimiento de negocios en todo el mundo.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="order-1 md:order-2"
              >
                <img 
                  className="rounded-lg shadow-xl object-cover w-full h-full"
                  alt="Dos personas colaborando en un proyecto en una pizarra con post-its"
                 src="https://images.unsplash.com/photo-1562939651-9359f291c988" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;