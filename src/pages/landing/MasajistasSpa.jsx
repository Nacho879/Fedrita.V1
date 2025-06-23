import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const MasajistasSpa = () => {
  return <LandingPage pageData={landingPagesData.masajistas_spa} />;
};

export default MasajistasSpa;