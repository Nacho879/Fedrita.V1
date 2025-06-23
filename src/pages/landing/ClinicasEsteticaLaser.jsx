import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const ClinicasEsteticaLaser = () => {
  return <LandingPage pageData={landingPagesData.clinicas_estetica_laser} />;
};

export default ClinicasEsteticaLaser;