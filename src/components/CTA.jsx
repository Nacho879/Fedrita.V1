import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section id="cta" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-hub p-12 text-center max-w-4xl mx-auto overflow-hidden relative">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-hub-coral/10 rounded-full"></div>
           <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-hub-coral/10 rounded-full"></div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-hub-anthracite">
              ¿Listo para transformar
              <br />
              tu <span className="text-hub-coral">negocio</span> con IA?
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto mb-10">
              Únete a miles de profesionales que ya están optimizando su gestión, 
              ahorrando tiempo y aumentando sus ingresos con Fedrita.
            </p>
            <Button size="lg" asChild className="btn-primary text-lg px-8 py-4">
              <Link to="/register">Empieza ahora gratis</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;