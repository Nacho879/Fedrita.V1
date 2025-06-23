import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const Barberias = () => {
  return <LandingPage pageData={landingPagesData.barberias} />;
};

export default Barberias;