import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { prefersReducedMotion } from '../../utils/motion.js';

export function PageTransition({ children }) {
  const location = useLocation();
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'auto' : 'instant' });
  }, [location.pathname, reducedMotion]);

  return (
    <div key={location.pathname} className="w-full max-w-full overflow-x-clip">
      {children}
    </div>
  );
}

export default PageTransition;
