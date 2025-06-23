import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const Psicologos = () => {
  return <LandingPage pageData={landingPagesData.psicologos} />;
};

export default Psicologos;