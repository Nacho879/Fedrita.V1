import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Settings, Rocket } from 'lucide-react';
const HowItWorks = () => {
  const steps = [{
    icon: UserPlus,
    title: "1. Regístrate gratis",
    description: "Crea tu cuenta en menos de 2 minutos y configura los datos básicos de tu negocio."
  }, {
    icon: Settings,
    title: "2. Configura tu asistente",
    description: "Personaliza Fedrita con tus servicios, horarios y equipo de trabajo."
  }, {
    icon: Rocket,
    title: "3. ¡Listo para funcionar!",
    description: "Conecta tu WhatsApp y deja que Fedrita gestione automáticamente tus reservas."
  }];
  return <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true
      }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-hub-anthracite">
            ¿Cómo <span className="text-hub-coral">funciona</span>?
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto">En solo 3 pasos simples tendrás tu asistente virtual funcionando y transformando la gestión de tu negocio.</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-hub-border hidden md:block"></div>
          {steps.map((step, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: index * 0.2
        }} viewport={{
          once: true
        }} className={`flex items-center justify-center md:justify-normal my-16 md:my-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : 'flex-row'}`}>
              <div className="w-1/2 px-8 hidden md:block">
                 <div className={`text-center ${index % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                  <h3 className="font-poppins text-2xl font-bold mb-4 text-hub-anthracite">{step.title}</h3>
                  <p className="text-lg text-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              <div className="relative z-10 bg-background px-4">
                <div className="w-24 h-24 bg-hub-coral rounded-full flex items-center justify-center shadow-lg border-4 border-background">
                  <step.icon className="w-12 h-12 text-white" />
                </div>
              </div>

               <div className="w-1/2 px-8 md:hidden">
                 <div className="text-center">
                  <h3 className="font-poppins text-2xl font-bold mb-4 text-hub-anthracite">{step.title}</h3>
                  <p className="text-lg text-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>

            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default HowItWorks;