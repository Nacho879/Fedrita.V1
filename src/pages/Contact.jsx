import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { CheckCircle, HelpCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


const faqData = [
    {
        question: "¿La demo tiene algún coste?",
        answer: "No, la demostración es completamente gratuita y sin ningún tipo de compromiso. Queremos que veas el potencial de Fedrita para tu negocio."
    },
    {
        question: "¿Cuánto dura la demo?",
        answer: "Normalmente, la sesión dura entre 20 y 30 minutos. Nos adaptamos a tu tiempo y respondemos a todas tus preguntas."
    },
    {
        question: "¿Necesito instalar algo para la demo?",
        answer: "No necesitas instalar nada. La demo se realiza a través de una videollamada online que puedes tomar desde tu ordenador o móvil."
    },
    {
        question: "¿Puedo empezar a usar Fedrita después de la demo?",
        answer: "¡Por supuesto! Si te encanta lo que ves, podemos ayudarte a configurar tu cuenta de inmediato para que empieces a transformar tu negocio."
    }
]

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Solicitud de Demo en camino...",
      description: "Esta función estará lista muy pronto. ¡Gracias por tu interés en Fedrita!",
    });
  };

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-hub-anthracite mb-4">Pide una Demo y Transforma tu Negocio</h1>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Descubre cómo Fedrita puede automatizar tu agenda, reducir las ausencias y aumentar tus ingresos. Rellena el formulario y un especialista se pondrá en contacto contigo para una demo gratuita y personalizada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card p-8 rounded-lg border"
            >
              <h2 className="text-3xl font-bold mb-6">Solicita tu Demo Gratuita</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" type="text" placeholder="Tu nombre completo" required />
                </div>
                <div>
                  <Label htmlFor="businessName">Nombre del Negocio</Label>
                  <Input id="businessName" type="text" placeholder="Tu peluquería, clínica, estudio..." />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" required />
                </div>
                 <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="Tu número de teléfono" />
                </div>
                <div>
                  <Label htmlFor="message">Cuéntanos sobre tu negocio</Label>
                  <Textarea id="message" placeholder="¿Qué tipo de negocio tienes? ¿Cuáles son tus mayores desafíos actuales?" required rows={4} />
                </div>
                <Button type="submit" size="lg" className="w-full btn-primary">Solicitar Demo</Button>
              </form>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6">¿Qué esperar de la demo?</h2>
              <p className="text-muted-foreground mb-8">Un experto de nuestro equipo te guiará a través de la plataforma en una sesión 1-a-1. Verás cómo:</p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-hub-coral/10 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-hub-coral" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Ahorrar tiempo y dinero</h4>
                    <p className="text-muted-foreground">Automatiza la gestión de citas y los recordatorios para centrarte en lo que de verdad importa: tus clientes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-hub-coral/10 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-hub-coral" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Reducir las citas fallidas</h4>
                    <p className="text-muted-foreground">Disminuye las ausencias hasta en un 90% con nuestro sistema inteligente de recordatorios por WhatsApp.</p>
                  </div>
                </div>
                 <div className="flex items-start space-x-4">
                  <div className="bg-hub-coral/10 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-hub-coral" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Mejorar la experiencia de cliente</h4>
                    <p className="text-muted-foreground">Ofrece a tus clientes una forma cómoda y moderna de reservar, disponible 24/7 desde su móvil.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-24"
          >
            <div className="text-center max-w-3xl mx-auto mb-12">
                <HelpCircle className="w-12 h-12 mx-auto text-hub-coral mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold">Preguntas Frecuentes</h2>
                <p className="text-muted-foreground mt-2">Resolvemos tus dudas más comunes sobre el proceso de demo.</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((item, index) => (
                    <Collapsible key={index} className="border-b">
                        <CollapsibleTrigger className="flex justify-between items-center w-full py-4 text-lg font-medium text-left hover:text-hub-coral transition-colors">
                            {item.question}
                            <span className="collapsible-arrow">+</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <p className="pb-4 text-muted-foreground">{item.answer}</p>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;