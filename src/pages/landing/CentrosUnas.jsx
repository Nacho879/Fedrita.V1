import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const CentrosUnas = () => {
  return <LandingPage pageData={landingPagesData.centros_unas} />;
};

export default CentrosUnas;