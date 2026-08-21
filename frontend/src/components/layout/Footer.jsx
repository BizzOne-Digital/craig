import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import ScalesIcon from '../svg/ScalesIcon.jsx';

const columns = [
  {
    title: 'Navigate',
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/team', label: 'Our Team' },
      { to: '/blog', label: 'Blog' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { to: '/services', label: 'All Services' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/booking', label: 'Request Review' },
      { to: '/faq', label: 'FAQ' },
      { to: '/testimonials', label: 'Testimonials' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { to: '/shop', label: 'Shop All' },
      { to: '/cart', label: 'Cart' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy' },
      { to: '/terms', label: 'Terms' },
      { to: '/shipping-returns', label: 'Shipping & Returns' },
      { to: '/disclaimer', label: 'Disclaimer' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-black">
      {/* Top CTA strip */}
      <div className="border-y border-white/10 bg-carbon">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-4 py-8 sm:flex-row sm:items-center sm:px-5 sm:py-10 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-signal">Take action</p>
            <p className="mt-2 font-display text-3xl tracking-wide text-white md:text-4xl">
              Your Story Deserves To Be Heard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/booking" magnetic size="lg" className="w-full rounded-none sm:w-auto">
              Request a Case Review
            </Button>
            <Button to="/shop" variant="outline" size="lg" className="w-full rounded-none sm:w-auto">
              Shop With Purpose
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="relative border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(225,6,0,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 bg-[radial-gradient(circle,rgba(225,6,0,0.08),transparent_70%)]" />

        <div className="relative mx-auto max-w-[1400px] px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            {/* Brand column */}
            <div className="lg:col-span-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 hidden h-14 w-16 shrink-0 text-signal sm:block">
                  <ScalesIcon />
                </div>
                <div>
                  <p className="font-display text-6xl leading-none tracking-[0.04em] text-white md:text-7xl">
                    JLF
                  </p>
                  <p className="mt-2 font-display text-xl tracking-[0.2em] text-white/90">
                    JACKSON-LASHLEY
                  </p>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-steel">
                    Foundation
                  </p>
                </div>
              </div>

              <p className="mt-8 max-w-sm text-sm leading-relaxed text-steel">
                Promoting fairness, accountability, and meaningful assistance for individuals and
                families affected by injustice in the criminal justice system.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href="mailto:ceoassociatesllc@gmail.com"
                  className="group flex items-center gap-3 text-sm text-bone transition hover:text-signal"
                >
                  <span className="flex h-9 w-9 items-center justify-center border border-white/10 text-signal transition group-hover:border-signal">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M4 6h16v12H4z" />
                      <path d="M4 7l8 6 8-6" />
                    </svg>
                  </span>
                  ceoassociatesllc@gmail.com
                </a>
                <a
                  href="tel:+13142675674"
                  className="group flex items-center gap-3 text-sm text-bone transition hover:text-signal"
                >
                  <span className="flex h-9 w-9 items-center justify-center border border-white/10 text-signal transition group-hover:border-signal">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M6 4h4l1 4-2 1a12 12 0 005 5l1-2 4 1v4a2 2 0 01-2 2C9 19 5 15 5 10a2 2 0 012-2z" />
                    </svg>
                  </span>
                  314-267-5674
                </a>
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="mb-5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-signal">
                    {col.title}
                  </h3>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="text-sm text-steel transition hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:flex-row sm:text-left lg:px-8">
        <p className="text-xs text-steel/70">
          © {new Date().getFullYear()} Jackson-Lashley Foundation. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-steel/60">
          <span className="hidden h-px w-8 bg-signal/50 sm:block" aria-hidden="true" />
          <span className="uppercase tracking-[0.25em]">Fairness · Accountability · Assistance</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
