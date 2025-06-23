import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const Dentistas = () => {
  return <LandingPage pageData={landingPagesData.dentistas} />;
};

export default Dentistas;