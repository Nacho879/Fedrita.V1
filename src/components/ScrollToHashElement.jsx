import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHashElement = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;

    if (hash) {
      const element = document.getElementById(hash.substring(1));

      if (element) {
        const header = document.querySelector('header');
        const headerOffset = header ? header.offsetHeight : 0;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [location]);

  return null;
};

export default ScrollToHashElement;