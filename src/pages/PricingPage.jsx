import React from 'react';
import Header from '@/components/Header';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const PricingPage = () => {
  return (
    <div className="bg-background">
      <Header />
      <main>
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;