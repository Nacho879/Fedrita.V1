import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const PsicologiaInfantil = () => {
  return <LandingPage pageData={landingPagesData.psicologia_infantil} />;
};

export default PsicologiaInfantil;