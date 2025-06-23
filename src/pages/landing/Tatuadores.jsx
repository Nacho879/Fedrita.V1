import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const Tatuadores = () => {
  return <LandingPage pageData={landingPagesData.tatuadores} />;
};

export default Tatuadores;