import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { getService } from '../services/publicApi.js';
import { formatMoney } from '../utils/format.js';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getService(slug)
      .then((res) => setService(res.data))
      .catch((err) => {
        setService(null);
        setError(err.response?.status === 404 ? 'Service not found.' : 'Unable to load service.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="mt-6 h-6 w-1/3" />
        <Skeleton className="mt-8 h-48 w-full" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="px-6 py-24 lg:px-10">
        <EmptyState
          title={error || 'Service not found'}
          description="This service may no longer be available."
          actionLabel="View all services"
          actionTo="/services"
        />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={service.seoTitle || service.title}
        description={service.shortDescription || service.description?.slice(0, 160)}
        path={`/services/${service.slug}`}
        type="Service"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.shortDescription,
          provider: { '@type': 'Organization', name: 'CEO Foundation' },
          offers: {
            '@type': 'Offer',
            price: service.price,
            priceCurrency: 'USD',
          },
        }}
      />

      <article className="bg-obsidian">
        <header className="border-b border-white/10 px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <Link to="/services" className="text-sm text-steel hover:text-signal">
              ← All services
            </Link>
            <p className="mt-6 font-display text-4xl text-signal md:text-5xl">
              {service.priceLabel || formatMoney(service.price)}
              {service.billingUnit && service.billingUnit !== 'flat fee' && (
                <span className="text-2xl text-steel"> / {service.billingUnit}</span>
              )}
            </p>
            <h1 className="mt-4 font-display text-5xl text-bone md:text-6xl">{service.title}</h1>
            <p className="mt-6 text-xl text-steel">{service.shortDescription}</p>
            {service.duration && (
              <p className="mt-4 text-sm text-steel">Format: {service.duration}</p>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line text-lg leading-relaxed text-steel">{service.description}</p>
          </div>

          {service.features?.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl text-bone">What&apos;s included</h2>
              <ul className="mt-6 space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-steel">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-signal" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 rounded border border-signal/20 bg-signal/5 p-6">
            <p className="text-sm text-steel">
              <strong className="text-bone">Important:</strong> This service provides strategic support
              and review. It does not guarantee dismissal, acquittal, or any specific legal outcome.
              Outcomes vary based on individual circumstances. This is not legal advice.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              to="/booking"
              state={{ service: service.title, serviceSlug: service.slug }}
              variant="primary"
            >
              {service.ctaLabel || 'Book This Service'}
            </Button>
            <Button to="/contact" variant="outline">
              Ask a Question
            </Button>
            <Button to="/pricing" variant="ghost">
              Compare pricing
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
