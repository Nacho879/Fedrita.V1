import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const Peluquerias = () => {
  return <LandingPage pageData={landingPagesData.peluquerias} />;
};

export default Peluquerias;