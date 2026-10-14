import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { getServices } from '../services/publicApi.js';
import { formatMoney } from '../utils/format.js';

const FAQ_SNIPPET = [
  {
    q: 'Do you guarantee dismissal or acquittal?',
    a: 'No. Our services provide strategic support and review. Outcomes vary and no specific legal result is guaranteed.',
  },
  {
    q: 'Are these services legal advice?',
    a: 'No. General information on this site is not legal advice. Consult a licensed attorney for case-specific counsel.',
  },
  {
    q: 'How do I get started?',
    a: 'Submit a booking request or contact us to discuss which service may be appropriate for your situation.',
  },
];

export default function PricingPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getServices()
      .then((res) => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Unable to load pricing information.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Pricing"
        description="Transparent pricing for consulting, pre-trial case review, and case strategy services. Outcomes vary—no result is guaranteed."
        path="/pricing"
      />

      <section className="bg-obsidian px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">Pricing</p>
          <h1 className="mt-4 font-display text-5xl text-bone md:text-7xl">Clear, Honest Pricing</h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            Choose the level of support that fits your needs. Fixed fees and hourly rates are listed below.
          </p>
        </div>
      </section>

      {loading && (
        <div className="grid gap-6 px-6 pb-16 md:grid-cols-3 lg:px-10">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-80 rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <p className="px-6 pb-16 text-signal lg:px-10">{error}</p>
      )}

      {!loading && !error && (
        <section className="bg-carbon px-6 py-16 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="flex flex-col border border-white/10 bg-obsidian p-8"
              >
                <p className="font-display text-4xl text-signal">{service.priceLabel || formatMoney(service.price)}</p>
                <h2 className="mt-4 font-display text-2xl text-bone">{service.title}</h2>
                <p className="mt-3 flex-1 text-steel">{service.shortDescription}</p>
                {service.features?.length > 0 && (
                  <ul className="mt-6 space-y-2 text-sm text-steel">
                    {service.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-signal">•</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Button to={`/services/${service.slug}`} variant="outline" className="mt-8">
                  Learn more
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Comparison */}
      <section className="bg-obsidian px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl text-bone">Compare Services</h2>

          {/* Mobile cards */}
          <div className="mt-8 space-y-4 lg:hidden">
            {[
              { name: 'Consulting', price: '$100/hour', best: 'Quick guidance & direction', duration: 'By the hour' },
              { name: 'Pre-Trial Review', price: '$3,000 flat', best: 'Pre-trial assessment', duration: 'Multi-phase review' },
              { name: 'Case Strategy', price: 'Up to $10,000', best: 'Complex, in-depth matters', duration: 'Extended engagement' },
            ].map((row) => (
              <article key={row.name} className="border border-white/10 bg-carbon p-5">
                <h3 className="font-display text-xl text-signal">{row.name}</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-steel">Pricing</dt><dd className="text-bone">{row.price}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-steel">Best for</dt><dd className="text-right text-bone">{row.best}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-steel">Duration</dt><dd className="text-bone">{row.duration}</dd></div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-8 hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 pr-4 text-steel">Feature</th>
                  <th className="py-4 px-4 text-bone">Consulting</th>
                  <th className="py-4 px-4 text-bone">Pre-Trial Review</th>
                  <th className="py-4 pl-4 text-bone">Case Strategy</th>
                </tr>
              </thead>
              <tbody className="text-steel">
                <tr className="border-b border-white/5">
                  <td className="py-4 pr-4">Pricing</td>
                  <td className="py-4 px-4">$100/hour</td>
                  <td className="py-4 px-4">$3,000 flat</td>
                  <td className="py-4 pl-4">Up to $10,000</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 pr-4">Best for</td>
                  <td className="py-4 px-4">Quick guidance & direction</td>
                  <td className="py-4 px-4">Pre-trial assessment</td>
                  <td className="py-4 pl-4">Complex, in-depth matters</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 pr-4">Duration</td>
                  <td className="py-4 px-4">By the hour</td>
                  <td className="py-4 px-4">Multi-phase review</td>
                  <td className="py-4 pl-4">Extended engagement</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4">Outcome guarantee</td>
                  <td className="py-4 px-4 text-signal" colSpan={3}>
                    None — outcomes vary
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ snippet */}
      <section className="bg-carbon px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl text-bone">Common Questions</h2>
          <dl className="mt-8 space-y-6">
            {FAQ_SNIPPET.map((item) => (
              <div key={item.q} className="border-b border-white/10 pb-6">
                <dt className="font-display text-lg text-bone">{item.q}</dt>
                <dd className="mt-2 text-steel">{item.a}</dd>
              </div>
            ))}
          </dl>
          <Link to="/faq" className="mt-6 inline-block text-signal hover:underline">
            View full FAQ →
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-signal/20 bg-obsidian px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm leading-relaxed text-steel">
            <strong className="text-bone">Legal Services Disclaimer:</strong> Services provided by the
            CEO Foundation are for strategic support and review purposes only. They do not
            constitute legal advice, do not create an attorney-client relationship, and do not guarantee
            dismissal, acquittal, financial recovery, or any specific legal outcome. Every case is unique
            and results depend on individual circumstances.
          </p>
          <Button to="/booking" variant="primary" className="mt-8">
            Request a Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
