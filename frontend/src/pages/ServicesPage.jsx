import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { getServices } from '../services/publicApi.js';
import { formatMoney } from '../utils/format.js';
import { prefersReducedMotion } from '../utils/motion.js';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getServices()
      .then((res) => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Unable to load services. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !scrollRef.current || !trackRef.current || services.length === 0) {
      return undefined;
    }

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current;
      const scrollWidth = track.scrollWidth - scrollRef.current.offsetWidth;

      const tween = gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: scrollRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => tween.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, [services]);

  return (
    <>
      <SEO
        title="Services"
        description="Consulting, pre-trial case review, and case strategy services from the CEO Foundation. Outcomes vary—no result is guaranteed."
        path="/services"
      />

      <section className="bg-obsidian px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">Services</p>
          <h1 className="mt-4 font-display text-5xl text-bone md:text-7xl">Strategic Support</h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            Professional guidance for individuals and families navigating criminal justice challenges.
            All services are provided with clear expectations—outcomes vary and no result is guaranteed.
          </p>
        </div>
      </section>

      {loading && (
        <div className="space-y-6 px-6 pb-24 lg:px-10">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="mx-auto h-72 max-w-7xl rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <div className="px-6 pb-24 lg:px-10">
          <EmptyState title="Services unavailable" description={error} actionLabel="Contact us" actionTo="/contact" />
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="px-6 pb-24 lg:px-10">
          <EmptyState title="No services available" description="Please check back soon or contact us directly." actionTo="/contact" actionLabel="Contact us" />
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <>
          {/* Desktop horizontal scroll */}
          <div ref={scrollRef} className="hidden overflow-hidden bg-carbon lg:block">
            <div ref={trackRef} className="flex gap-8 px-10 py-16">
              {services.map((service, index) => (
                <article
                  key={service._id}
                  className="flex w-[420px] shrink-0 flex-col border border-white/10 bg-obsidian p-10"
                >
                  <span className="font-display text-6xl text-white/10">{String(index + 1).padStart(2, '0')}</span>
                  <p className="mt-4 font-display text-3xl text-signal">{service.priceLabel || formatMoney(service.price)}</p>
                  <h2 className="mt-4 font-display text-3xl text-bone">{service.title}</h2>
                  <p className="mt-4 flex-1 text-steel">{service.shortDescription}</p>
                  {service.duration && (
                    <p className="mt-4 text-sm text-steel">Duration: {service.duration}</p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button to={`/services/${service.slug}`} variant="primary" size="sm">
                      View details
                    </Button>
                    <Button to="/booking" variant="outline" size="sm">
                      Book this service
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Mobile stacked cards */}
          <div className="space-y-6 bg-carbon px-6 py-16 lg:hidden">
            {services.map((service) => (
              <article key={service._id} className="border border-white/10 bg-obsidian p-8">
                <p className="font-display text-2xl text-signal">{service.priceLabel || formatMoney(service.price)}</p>
                <h2 className="mt-2 font-display text-2xl text-bone">{service.title}</h2>
                <p className="mt-3 text-steel">{service.shortDescription}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button to={`/services/${service.slug}`} variant="primary" size="sm">
                    View details
                  </Button>
                  <Button to="/contact" variant="outline" size="sm">
                    Ask a question
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <section className="border-t border-white/10 bg-obsidian px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-steel">
            <strong className="text-bone">Disclaimer:</strong> Services provide strategic support and review.
            They do not guarantee dismissal, acquittal, financial recovery, or any specific legal outcome.
            This is not legal advice.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button to="/pricing" variant="ghost">View pricing</Button>
            <Button to="/faq" variant="ghost">Read FAQ</Button>
          </div>
        </div>
      </section>
    </>
  );
}
