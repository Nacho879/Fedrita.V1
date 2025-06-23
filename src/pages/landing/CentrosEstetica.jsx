import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const CentrosEstetica = () => {
  return <LandingPage pageData={landingPagesData.centros_estetica} />;
};

export default CentrosEstetica;