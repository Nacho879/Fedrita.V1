import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const Veterinarias = () => {
  return <LandingPage pageData={landingPagesData.veterinarias} />;
};

export default Veterinarias;