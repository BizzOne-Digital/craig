import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { getDonationBySession } from '../services/publicApi.js';
import { formatMoney, formatDate } from '../utils/format.js';

export default function DonateSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided. Unable to verify your donation.');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        const res = await getDonationBySession(sessionId);
        if (!cancelled) {
          if (res.data?.paymentStatus === 'paid') {
            setDonation(res.data);
          } else {
            setError('Payment is still being processed. If you completed payment, thank you — confirmation may take a moment.');
          }
        }
      } catch {
        if (!cancelled) {
          setError('Unable to verify donation status. If you completed payment, thank you for your support.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <>
      <SEO title="Thank You" description="Your donation to CEO Foundation." path="/donate/success" noIndex />

      <section className="mx-auto max-w-2xl px-6 py-24 lg:px-10">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center">
            <h1 className="font-display text-4xl text-bone">Thank You</h1>
            <p className="mt-6 text-steel">{error}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/" variant="primary">
                Return home
              </Button>
              <Button to="/contact" variant="outline">
                Contact us
              </Button>
            </div>
          </div>
        )}

        {!loading && donation && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-signal bg-signal/10">
              <svg className="h-8 w-8 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-4xl text-bone">Thank You!</h1>
            <p className="mt-4 text-steel">
              Your generous donation of {formatMoney(donation.amount)} helps CEO Foundation advance justice,
              advocacy, and support in our community.
            </p>
            {donation.customer?.email ? (
              <p className="mt-2 text-sm text-steel">A receipt has been sent to {donation.customer.email}.</p>
            ) : null}

            <dl className="mt-10 space-y-4 rounded border border-white/10 p-6 text-left text-sm">
              <div className="flex justify-between">
                <dt className="text-steel">Reference</dt>
                <dd className="font-mono text-bone">{donation.donationNumber}</dd>
              </div>
              {donation.paidAt && (
                <div className="flex justify-between">
                  <dt className="text-steel">Date</dt>
                  <dd className="text-bone">{formatDate(donation.paidAt)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-steel">Amount</dt>
                <dd className="font-display text-xl text-signal">{formatMoney(donation.amount)}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/" variant="primary">
                Return home
              </Button>
              <Link to="/about" className="text-sm text-steel hover:text-signal">
                Learn about our mission
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
