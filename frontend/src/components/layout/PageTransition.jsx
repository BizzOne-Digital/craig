import { useEffect, useRef } from 'react';
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
    return <div key={location.pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        <motion.div
          className="pointer-events-none fixed inset-0 z-[45] flex origin-left items-stretch"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-1/2 bg-signal" />
          <div className="flex w-1/2 items-center justify-center bg-obsidian">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="font-display text-3xl tracking-[0.12em] text-bone sm:text-5xl md:text-7xl"
            >
              {getPageTitle(location.pathname)}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
