import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const LandingPage = ({ pageData }) => {
  const {
    title,
    subtitle,
    heroImageDescription,
    heroImage,
    benefitImage,
    features,
    ctaText,
    secondaryTitle,
    secondarySubtitle,
    benefits,
  } = pageData;

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-b from-background to-slate-50 dark:to-gray-900">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-hub-anthracite mb-4 leading-tight">{title}</h1>
              <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>
              <Button asChild size="lg" className="btn-primary">
                <Link to="/register">{ctaText}</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <img  
                className="rounded-lg shadow-xl object-cover w-full h-[450px]"
                alt={heroImageDescription} src="https://images.unsplash.com/photo-1649215636705-1084bd6df97a" />
            </motion.div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{secondaryTitle}</h2>
              <p className="text-lg text-muted-foreground">{secondarySubtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-hub-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Transforma tu negocio con Fedrita</h2>
                <ul className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 bg-hub-coral/10 p-2 rounded-full">
                        <CheckCircle className="w-6 h-6 text-hub-coral" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl">{benefit.title}</h4>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:block">
                 <img  
                    className="rounded-lg shadow-xl"
                    alt={benefitImage} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para empezar?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Únete a cientos de negocios que ya están optimizando su gestión con Fedrita.
            </p>
            <Button asChild size="lg" className="btn-primary">
              <Link to="/register">Crear mi cuenta gratis</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;