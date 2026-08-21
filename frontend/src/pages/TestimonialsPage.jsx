import { useEffect, useState } from 'react';
import SEO from '../components/ui/SEO.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import { getTestimonials } from '../services/publicApi.js';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTestimonials()
      .then((res) => setTestimonials(res.data || []))
      .catch(() => setError('Unable to load testimonials.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Testimonials"
        description="Published testimonials from individuals who have connected with the Jackson-Lashley Foundation."
        path="/testimonials"
      />

      <section className="bg-obsidian px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">Testimonials</p>
          <h1 className="mt-4 font-display text-5xl text-bone md:text-7xl">Voices of Support</h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            These are published testimonials from individuals who chose to share their experience.
            They do not represent guaranteed outcomes or legal results.
          </p>
        </div>
      </section>

      <section className="bg-carbon px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {loading && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Skeleton key={n} className="h-48 rounded-lg" />
              ))}
            </div>
          )}

          {error && (
            <EmptyState title="Unable to load testimonials" description={error} actionLabel="Contact us" actionTo="/contact" />
          )}

          {!loading && !error && testimonials.length === 0 && (
            <EmptyState
              title="No testimonials yet"
              description="Published testimonials will appear here when available."
              actionLabel="Contact us"
              actionTo="/contact"
            />
          )}

          {!loading && !error && testimonials.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => (
                <blockquote
                  key={item._id}
                  className="flex flex-col border border-white/10 bg-obsidian p-8"
                >
                  {item.image?.url && (
                    <img
                      src={item.image.url}
                      alt={item.image.alt || item.displayName}
                      className="mb-6 h-16 w-16 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <p className="flex-1 text-lg italic leading-relaxed text-bone">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <footer className="mt-6 border-t border-white/10 pt-4">
                    <cite className="not-italic">
                      <span className="font-display text-lg text-bone">{item.displayName}</span>
                      {item.roleOrLocation && (
                        <span className="mt-1 block text-sm text-steel">{item.roleOrLocation}</span>
                      )}
                    </cite>
                  </footer>
                </blockquote>
              ))}
            </div>
          )}

          <p className="mt-12 text-center text-sm text-steel">
            Testimonials reflect individual experiences only. They do not guarantee any legal outcome.
          </p>
          <div className="mt-8 text-center">
            <Button to="/booking" variant="primary">
              Share your story — Request a consultation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
