import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const Logopedia = () => {
  return <LandingPage pageData={landingPagesData.logopedia} />;
};

export default Logopedia;