import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, Users, Sparkles } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-card text-hub-coral px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Automatización inteligente para negocios</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-hub-anthracite">
              <span className="text-hub-coral">Fedrita</span>, tu asistente
              <br />
              inteligente para{' '}
              <span className="inline-block text-left min-w-[12ch]">
                <TypeAnimation
                  sequence={[
                    'salones',
                    3000,
                    'barberías',
                    3000,
                    'peluquerías',
                    3000,
                    'gabinetes',
                    3000,
                    'consultorios',
                    3000,
                    'asesorías',
                    3000,
                  ]}
                  wrapper="span"
                  speed={70}
                  deletionSpeed={70}
                  repeat={Infinity}
                  cursor={true}
                />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Atiende WhatsApp, agenda turnos y gestiona tu equipo sin esfuerzo. 
              La IA que revoluciona la gestión de tu negocio.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" asChild className="btn-primary text-lg px-8 py-4">
              <Link to="/register">Crear cuenta gratuita</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-card">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 bg-card rounded-lg p-4 shadow-hub">
              <MessageCircle className="w-8 h-8 text-hub-coral" />
              <span className="font-semibold text-foreground">WhatsApp Automático</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-card rounded-lg p-4 shadow-hub">
              <Calendar className="w-8 h-8 text-hub-coral" />
              <span className="font-semibold text-foreground">Agenda Inteligente</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-card rounded-lg p-4 shadow-hub">
              <Users className="w-8 h-8 text-hub-coral" />
              <span className="font-semibold text-foreground">Gestión de Equipo</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;