import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Gratuito',
    price: 'Gratis',
    period: '',
    description: 'Para siempre. Perfecto para empezar y probar la plataforma.',
    features: [
      '15 citas por mes',
      '1 Salón',
      '1 Empleado',
      'Página de reserva online',
    ],
    cta: 'Elegir Plan',
    link: '/register',
    popular: false,
  },
  {
    name: 'Básico',
    price: '$12',
    period: '/mes',
    description: 'Ideal para salones pequeños que buscan organizarse y crecer.',
    features: [
      '50 citas por mes',
      '1 Salón',
      'Hasta 5 Empleados',
      'Recordatorios automáticos',
    ],
    cta: 'Elegir Plan',
    link: '/register',
    popular: true,
  },
  {
    name: 'Crecimiento',
    price: '$18',
    period: '/mes',
    description: 'Para negocios que necesitan más potencia y automatización.',
    features: [
      '100 citas por mes',
      'Hasta 3 Salones',
      'Hasta 10 Empleados',
      'Métricas del negocio',
    ],
    cta: 'Elegir Plan',
    link: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$31',
    period: '/mes',
    description: 'La solución completa para optimizar y escalar tu negocio.',
    features: [
      '200 citas por mes',
      'Salones Ilimitados',
      'Empleados Ilimitados',
      'Soporte prioritario',
    ],
    cta: 'Elegir Plan',
    link: '/register',
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="precios" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Planes para cada tipo de negocio
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades. Simple, transparente y sin sorpresas.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={cn('flex flex-col h-full', { 'border-primary ring-2 ring-primary shadow-lg': plan.popular })}>
                {plan.popular && (
                  <div className="absolute top-0 right-4 -mt-3">
                    <div className="inline-flex items-center gap-x-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                      <Star className="h-4 w-4" />
                      Más Popular
                    </div>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className={cn('w-full', { 'btn-primary': plan.popular })} variant={plan.popular ? 'default' : 'outline'}>
                    <Link to={plan.link}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            ¿Necesitas algo diferente?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Regístrate para explorar planes personalizados
            </Link>
            {' '}y descubrir todas las funcionalidades.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;