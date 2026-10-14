import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/motion.js';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll(enabled = true) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;
    document.documentElement.classList.add('lenis');

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: document.body });
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('lenis');
      ScrollTrigger.scrollerProxy(document.body, {});
      ScrollTrigger.refresh();
    };
  }, [enabled]);

  return lenisRef;
}

export default useSmoothScroll;
