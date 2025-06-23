import React from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { landingPagesData } from '@/lib/landing-pages-data';

const YogaPilates = () => {
  return <LandingPage pageData={landingPagesData.yoga_pilates} />;
};

export default YogaPilates;