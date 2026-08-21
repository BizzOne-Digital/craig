import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found."
        path="/404"
        noIndex
      />

      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-obsidian px-6 py-24 text-center lg:px-10">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[clamp(8rem,30vw,20rem)] leading-none text-white/[0.03]">
            404
          </span>
        </div>
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.3em] text-signal">Page not found</p>
          <h1 className="mt-4 font-display text-5xl text-bone md:text-6xl">Lost in the System</h1>
          <p className="mx-auto mt-6 max-w-md text-steel">
            The page you requested does not exist or may have been moved. Let us help you find your way back.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button to="/" variant="primary">
              Return home
            </Button>
            <Button to="/contact" variant="outline">
              Contact us
            </Button>
          </div>
          <nav className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-steel">
            <Link to="/services" className="hover:text-signal">Services</Link>
            <Link to="/shop" className="hover:text-signal">Shop</Link>
            <Link to="/booking" className="hover:text-signal">Request review</Link>
            <Link to="/faq" className="hover:text-signal">FAQ</Link>
          </nav>
        </div>
      </section>
    </>
  );
}
