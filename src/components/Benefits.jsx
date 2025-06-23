import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Heart, DollarSign } from 'lucide-react';
const Benefits = () => {
  const benefits = [{
    icon: TrendingUp,
    title: "Aumenta tus ventas hasta 40%",
    description: "Nunca pierdas una cita. Fedrita convierte consultas en reservas automáticamente.",
    stat: "+40%"
  }, {
    icon: Clock,
    title: "Ahorra 15 horas semanales",
    description: "Automatiza tareas repetitivas y enfócate en lo que realmente importa: tus clientes.",
    stat: "15h"
  }, {
    icon: Heart,
    title: "Clientes más satisfechos",
    description: "Respuesta inmediata 24/7 mejora la experiencia y fidelización de clientes.",
    stat: "98%"
  }, {
    icon: DollarSign,
    title: "Reduce costos operativos",
    description: "Menos personal administrativo necesario, más eficiencia en la gestión.",
    stat: "-30%"
  }];
  return <section id="benefits" className="py-20 bg-secondary">
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
            Beneficios para tu <span className="text-hub-coral">Negocio</span>
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto">Descubre cómo Fedrita transforma la gestión y potencia a tu negocio con resultados medibles desde el primer día.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => <motion.div key={index} initial={{
          opacity: 0,
          x: index % 2 === 0 ? -30 : 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: index * 0.2
        }} viewport={{
          once: true
        }} className="bg-card rounded-2xl p-8 shadow-hub hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 rounded-xl bg-hub-coral flex items-center justify-center shadow-lg">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="font-poppins text-xl font-bold text-hub-anthracite">{benefit.title}</h3>
                    <span className="text-2xl font-bold text-hub-coral">{benefit.stat}</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default Benefits;