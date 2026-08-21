import { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import ArrowIcon from '../svg/ArrowIcon.jsx';

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/shop', label: 'Shop' },
  { to: '/team', label: 'Our Team' },
  { to: '/contact', label: 'Contact' },
  { to: '/booking', label: 'Request Review' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/faq', label: 'FAQ' },
];

export function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) {
      document.body.classList.remove('menu-open');
      return undefined;
    }

    document.body.classList.add('menu-open');
    const focusables = panelRef.current?.querySelectorAll('a, button');
    focusables?.[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('menu-open');
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={cn(
        'fixed inset-0 z-[60] lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={cn(
          'absolute inset-0 bg-obsidian/90 backdrop-blur-md transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0'
        )}
        aria-label="Close menu backdrop"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        data-lenis-prevent
        className={cn(
          'absolute inset-y-0 right-0 flex w-[min(100%,24rem)] flex-col border-l border-steel/10 bg-carbon px-4 py-6 pb-safe transition-transform duration-500 sm:px-6 sm:py-8',
          prefersReducedMotion() ? '' : 'ease-out-expo',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="font-display text-2xl tracking-[0.12em] text-white">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="border border-steel/20 px-3 py-2 text-xs uppercase tracking-[0.18em] text-steel hover:text-white"
          >
            Close
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto" aria-label="Mobile">
          <ul className="space-y-2">
            {primaryLinks.map((link, index) => (
              <li
                key={link.to}
                className="overflow-hidden"
                style={{ transitionDelay: open ? `${index * 40}ms` : '0ms' }}
              >
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center justify-between gap-3 border-b border-steel/10 py-3 font-display text-2xl tracking-[0.06em] transition-colors sm:py-4 sm:text-3xl',
                      isActive ? 'text-signal' : 'text-white hover:text-signal'
                    )
                  }
                >
                  {link.label}
                  <ArrowIcon className="opacity-0 transition-opacity group-hover:opacity-100" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 space-y-2 border-t border-steel/10 pt-6 text-sm text-steel">
          <a href="mailto:ceoassociatesllc@gmail.com" className="block break-all hover:text-signal">
            ceoassociatesllc@gmail.com
          </a>
          <a href="tel:+13142675674" className="block hover:text-signal">
            314-267-5674
          </a>
          <Link to="/shop" onClick={onClose} className="mt-4 inline-block text-signal">
            Shop With Purpose →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
