import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/motion.js';

const pageTitles = {
  '/': 'Home',
  '/about': 'About',
  '/services': 'Services',
  '/shop': 'Shop',
  '/cart': 'Cart',
  '/booking': 'Booking',
  '/team': 'Team',
  '/pricing': 'Pricing',
  '/blog': 'Blog',
  '/contact': 'Contact',
  '/testimonials': 'Testimonials',
  '/faq': 'FAQ',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/shipping-returns': 'Shipping',
  '/disclaimer': 'Disclaimer',
};

function getPageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/services/')) return 'Service';
  if (pathname.startsWith('/shop/')) return 'Product';
  if (pathname.startsWith('/blog/')) return 'Article';
  if (pathname.startsWith('/order/')) return 'Order';
  return 'Jackson-Lashley';
}

export function PageTransition({ children }) {
  const location = useLocation();
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'auto' : 'instant' });
  }, [location.pathname, reducedMotion]);

  if (reducedMotion) {
    return <div key={location.pathname} className="w-full max-w-full overflow-x-clip">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className="w-full max-w-full overflow-x-clip">
        <motion.div
          className="pointer-events-none fixed inset-0 z-[45] flex items-center justify-center overflow-hidden bg-obsidian"
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          animate={{ clipPath: 'inset(0 0 100% 0)' }}
          exit={{ clipPath: 'inset(100% 0 0 0)' }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-signal" aria-hidden="true" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            className="max-w-[90vw] truncate px-4 text-center font-display text-3xl tracking-[0.1em] text-signal sm:text-5xl"
          >
            {getPageTitle(location.pathname)}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-full overflow-x-clip"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
