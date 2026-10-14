import { useEffect } from 'react';
import { prefersReducedMotion } from '../utils/motion.js';

export function useMagneticButtons() {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return undefined;

    const onMove = (event) => {
      const target = event.target.closest('[data-magnetic="true"]');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      target.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    };

    const onLeave = (event) => {
      const target = event.target.closest('[data-magnetic="true"]');
      if (target) target.style.transform = '';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseout', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);
}

export default useMagneticButtons;
