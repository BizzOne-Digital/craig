import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn.js';
import useCart from '../../hooks/useCart.js';
import MobileMenu from './MobileMenu.jsx';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/shop', label: 'Shop' },
  { to: '/team', label: 'Our Team' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { getItemCount, openCart } = useCart();
  const itemCount = getItemCount();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full max-w-full overflow-x-clip transition-all duration-500',
          scrolled || !isHome
            ? 'glass-carbon border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent'
        )}
      >
        <div className="relative mx-auto flex h-[var(--header-height)] max-w-[1400px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-5 lg:px-8">
          {/* Logo */}
          <Link to="/" className="group relative z-10 flex shrink-0 items-center gap-2 sm:gap-3" aria-label="Jackson-Lashley Foundation home">
            <span className="font-display text-3xl leading-none tracking-[0.06em] text-white transition group-hover:text-signal sm:text-4xl md:text-5xl">
              JLF
            </span>
            <span className="hidden border-l border-white/20 pl-2 sm:block sm:pl-3">
              <span className="block font-display text-[0.7rem] leading-tight tracking-[0.18em] text-white sm:text-sm">
                JACKSON-LASHLEY
              </span>
              <span className="block text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-steel sm:text-[0.6rem]">
                Foundation
              </span>
            </span>
          </Link>

          {/* Center nav — desktop */}
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'text-[0.7rem] font-semibold uppercase tracking-[0.22em] transition-colors',
                    isActive ? 'text-signal' : 'text-white/85 hover:text-white'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={openCart}
              className="touch-target inline-flex items-center gap-1.5 text-white transition hover:text-signal sm:gap-2"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path
                  d="M6 6H21L19 14H8L6 6ZM6 6L5 3H2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9.5" cy="19" r="1.5" fill="currentColor" />
                <circle cx="17.5" cy="19" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-sm font-medium tabular-nums">{itemCount}</span>
            </button>

            <Link
              to="/booking"
              className="hidden border border-signal px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-signal transition hover:bg-signal hover:text-white sm:inline-flex"
            >
              Request Review
            </Link>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="relative block h-3.5 w-5">
                <span className={cn('absolute left-0 top-0 block h-0.5 w-full bg-current transition-transform', menuOpen && 'translate-y-1.5 rotate-45')} />
                <span className={cn('absolute left-0 top-1.5 block h-0.5 w-full bg-current transition-opacity', menuOpen && 'opacity-0')} />
                <span className={cn('absolute left-0 top-3 block h-0.5 w-full bg-current transition-transform', menuOpen && '-translate-y-1.5 -rotate-45')} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Header;
