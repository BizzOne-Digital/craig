import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? (scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] bg-white/5"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-deep-red via-signal to-signal shadow-[0_0_12px_rgba(225,6,0,0.8)] transition-transform duration-150"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

export default ScrollProgress;
