import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initSmoothScrolling, scrollToTop } from '@/utils/scrollUtils';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Initialize smooth scrolling for all anchor links
    const cleanup = initSmoothScrolling();
    
    // Handle route changes
    if (!hash) {
      // Scroll to top on route change
      scrollToTop({ behavior: 'smooth' });
    } else {
      // Handle anchor links with smooth scrolling
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure the page has rendered
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
        
        return () => clearTimeout(timer);
      }
    }

    // Clean up event listeners when component unmounts
    return () => {
      cleanup?.();
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
