import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn.js';

function isTouchDevice() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
}

function isFormField(element) {
  if (!element) return false;
  const tag = element.tagName?.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    tag === 'label' ||
    element.isContentEditable
  );
}

export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouchDevice()) return undefined;

    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    let rafId = 0;
    const position = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onMove = (event) => {
      if (isFormField(event.target)) {
        dotRef.current?.classList.add('opacity-0');
        ringRef.current?.classList.add('opacity-0');
      } else {
        dotRef.current?.classList.remove('opacity-0');
        ringRef.current?.classList.remove('opacity-0');
      }

      target.x = event.clientX;
      target.y = event.clientY;
    };

    const animate = () => {
      position.x += (target.x - position.x) * 0.18;
      position.y += (target.y - position.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-[10001] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full',
          'border border-signal/50 transition-opacity duration-200'
        )}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-[10002] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal',
          'transition-opacity duration-200'
        )}
      />
    </>
  );
}

export default CustomCursor;
