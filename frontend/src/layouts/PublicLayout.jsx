import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import CartDrawer from '../components/layout/CartDrawer.jsx';
import CinematicIntro from '../components/layout/CinematicIntro.jsx';
import PageTransition from '../components/layout/PageTransition.jsx';
import ScrollProgress from '../components/layout/ScrollProgress.jsx';
import MobileActionBar from '../components/layout/MobileActionBar.jsx';
import { useSmoothScroll } from '../hooks/useSmoothScroll.js';
import { useMagneticButtons } from '../hooks/useMagneticButtons.js';

export function PublicLayout() {
  useSmoothScroll(true);
  useMagneticButtons();

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-clip bg-obsidian text-bone">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <CinematicIntro />
      <Header />
      <CartDrawer />
      <main id="main-content" className="min-h-screen w-full max-w-full overflow-x-clip pt-[var(--header-height)] pb-mobile-bar lg:pb-0">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}

export default PublicLayout;
