import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-hub-anthracite">
            Lo que dicen nuestros <span className="text-hub-coral">clientes</span>
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Miles de negocios ya confían en Fedrita para transformar su negocio. 
            Descubre sus experiencias y resultados.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-hub hover:shadow-lg transition-all duration-300 relative"
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-border" />
            
            <div className="flex items-center mb-6">
              <img  class="w-16 h-16 rounded-full object-cover mr-4" alt="Barbero sonriendo en su local" src="https://images.unsplash.com/photo-1608546251551-06cd4e66f2e9" />
              <div>
                <h4 className="font-poppins font-bold text-hub-anthracite">Javier López</h4>
                <p className="text-hub-coral font-medium">Barbería The Cut</p>
              </div>
            </div>

            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>

            <p className="text-foreground leading-relaxed italic">"Implementar Fedrita fue un antes y un después. La gestión de citas es automática y mis barberos pueden centrarse en los clientes. ¡Hemos reducido las ausencias en un 50%!"</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-hub hover:shadow-lg transition-all duration-300 relative"
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-border" />
            
            <div className="flex items-center mb-6">
              <img  class="w-16 h-16 rounded-full object-cover mr-4" alt="Dentista profesional en su consultorio" src="https://images.unsplash.com/photo-1629909615957-be38d48fbbe6" />
              <div>
                <h4 className="font-poppins font-bold text-hub-anthracite">Sofía Martínez</h4>
                <p className="text-hub-coral font-medium">Consultorio Dental Sonrisa Plena</p>
              </div>
            </div>

            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>

            <p className="text-foreground leading-relaxed italic">"Como odontóloga, mi tiempo es oro. Fedrita gestiona los recordatorios y confirmaciones por WhatsApp, lo que ha optimizado mi agenda y mejorado la comunicación con los pacientes."</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-hub hover:shadow-lg transition-all duration-300 relative"
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-border" />
            
            <div className="flex items-center mb-6">
              <img  class="w-16 h-16 rounded-full object-cover mr-4" alt="Tatuadora trabajando en un diseño" src="https://images.unsplash.com/photo-1625053224167-22362965b56f" />
              <div>
                <h4 className="font-poppins font-bold text-hub-anthracite">Laura Jiménez</h4>
                <p className="text-hub-coral font-medium">Estudio de Tatuajes Ink Art</p>
              </div>
            </div>

            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>

            <p className="text-foreground leading-relaxed italic">"La IA de Fedrita es increíble. Entiende las consultas de mis clientes para nuevos tatuajes y gestiona la agenda de forma impecable. ¡Me ahorra horas de trabajo administrativo!"</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;