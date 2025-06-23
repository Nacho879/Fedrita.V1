import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const Fisioterapeutas = () => {
  return <LandingPage pageData={landingPagesData.fisioterapeutas} />;
};

export default Fisioterapeutas;