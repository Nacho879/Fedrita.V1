import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const ClinicasFisioterapia = () => {
  return <LandingPage pageData={landingPagesData.clinicas_fisioterapia} />;
};

export default ClinicasFisioterapia;