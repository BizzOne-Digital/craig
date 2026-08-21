import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { cn } from '../../utils/cn.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import ScalesIcon from '../svg/ScalesIcon.jsx';

const INTRO_KEY = 'jlf_intro_seen';
const INTRO_OVERRIDE = import.meta.env.VITE_FORCE_INTRO === 'true';

function shouldPlayIntro() {
  if (INTRO_OVERRIDE) return true;
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(INTRO_KEY) !== '1';
}

function markIntroSeen() {
  sessionStorage.setItem(INTRO_KEY, '1');
}

export function CinematicIntro({ onComplete }) {
  const location = useLocation();
  const [active, setActive] = useState(() => shouldPlayIntro() && location.pathname === '/');
  const [visible, setVisible] = useState(active);
  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    markIntroSeen();
    document.body.classList.remove('intro-active');
    setVisible(false);
    setActive(false);
    onComplete?.();
  }, [onComplete]);

  const skip = useCallback(() => {
    timelineRef.current?.kill();
    finish();
  }, [finish]);

  useEffect(() => {
    if (!active) return undefined;

    document.body.classList.add('intro-active');

    if (prefersReducedMotion()) {
      const timer = window.setTimeout(finish, 280);
      return () => {
        window.clearTimeout(timer);
        document.body.classList.remove('intro-active');
      };
    }

    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      });

      timelineRef.current = tl;

      tl.fromTo('.intro-line', { scaleY: 0 }, { scaleY: 1, duration: 0.7, transformOrigin: 'top' })
        .fromTo('.intro-jlf', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.55 }, '-=0.2')
        .fromTo(
          '.intro-scales path',
          { strokeDasharray: 120, strokeDashoffset: 120, opacity: 0.2 },
          { strokeDashoffset: 0, opacity: 1, duration: 0.8, stagger: 0.05 },
          '-=0.15'
        )
        .fromTo('.intro-beat', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.25 }, '-=0.2')
        .to('.intro-panel-left', { x: '-102%', duration: 0.55, ease: 'power4.inOut' }, '+=0.15')
        .to('.intro-panel-right', { x: '102%', duration: 0.55, ease: 'power4.inOut' }, '<')
        .to(root, { autoAlpha: 0, duration: 0.35 }, '-=0.15');
    }, root);

    return () => {
      ctx.revert();
      timelineRef.current = null;
      document.body.classList.remove('intro-active');
    };
  }, [active, finish]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-obsidian',
        !active && 'pointer-events-none'
      )}
      aria-hidden={!active}
    >
      <div className="intro-panel-left absolute inset-y-0 left-0 w-1/2 bg-obsidian">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(225,6,0,0.15),transparent_50%)]" />
      </div>
      <div className="intro-panel-right absolute inset-y-0 right-0 w-1/2 bg-carbon">
        <div className="absolute inset-0 legal-grid opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="intro-line mb-10 h-24 w-px origin-top bg-signal" />
        <p className="intro-jlf font-display text-[clamp(4rem,16vw,9rem)] leading-none tracking-[0.08em] text-white drop-shadow-[0_0_40px_rgba(225,6,0,0.35)]">
          JLF
        </p>
        <div className="intro-scales mt-8 h-20 w-28 text-signal">
          <ScalesIcon animated />
        </div>
        <div className="mt-10 space-y-2">
          {['Fairness', 'Accountability', 'Assistance'].map((word) => (
            <p key={word} className="intro-beat font-display text-2xl tracking-[0.24em] text-bone md:text-3xl">
              {word}
            </p>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute bottom-6 right-4 z-20 touch-target border border-steel/30 px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-steel transition-colors hover:border-signal hover:text-white sm:bottom-8 sm:right-8 sm:text-xs"
      >
        Skip intro
      </button>
    </div>
  );
}

export default CinematicIntro;
