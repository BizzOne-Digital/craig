import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { getOrderBySession } from '../services/publicApi.js';
import { formatMoney, formatDate } from '../utils/format.js';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided. Unable to verify your order.');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        const res = await getOrderBySession(sessionId);
        if (!cancelled) {
          if (res.data?.paymentStatus === 'paid') {
            setOrder(res.data);
          } else {
            setError('Payment is still being processed. Please check your email for confirmation.');
          }
        }
      } catch {
        if (!cancelled) {
          setError('Unable to verify order status. If you completed payment, check your email for confirmation.');
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
      <SEO title="Order Confirmed" description="Your order has been received." path="/order/success" noIndex />

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
            <h1 className="font-display text-4xl text-bone">Verification Pending</h1>
            <p className="mt-6 text-steel">{error}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/shop" variant="primary">
                Continue shopping
              </Button>
              <Button to="/contact" variant="outline">
                Contact support
              </Button>
            </div>
          </div>
        )}

        {!loading && order && (
          <div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-signal bg-signal/10">
                <svg className="h-8 w-8 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-display text-4xl text-bone">Thank You!</h1>
              <p className="mt-4 text-steel">
                Your payment has been verified. A confirmation email has been sent to {order.customer?.email}.
              </p>
            </div>

            <dl className="mt-10 space-y-4 rounded border border-white/10 p-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-steel">Order number</dt>
                <dd className="font-mono text-bone">{order.orderNumber}</dd>
              </div>
              {order.paidAt && (
                <div className="flex justify-between">
                  <dt className="text-steel">Date</dt>
                  <dd className="text-bone">{formatDate(order.paidAt)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-steel">Total</dt>
                <dd className="font-display text-xl text-signal">{formatMoney(order.total)}</dd>
              </div>
            </dl>

            {order.lineItems?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl text-bone">Items</h2>
                <ul className="mt-4 space-y-3">
                  {order.lineItems.map((item, i) => (
                    <li key={i} className="flex justify-between border-b border-white/5 pb-3 text-sm">
                      <span className="text-bone">
                        {item.name} × {item.quantity}
                        {(item.size || item.color) && (
                          <span className="text-steel">
                            {' '}
                            ({[item.size, item.color].filter(Boolean).join(', ')})
                          </span>
                        )}
                      </span>
                      <span className="text-steel">{formatMoney(item.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-8 text-center text-sm text-steel">
              Questions about your order? Contact{' '}
              <a href="mailto:ceoassociatesllc@gmail.com" className="text-signal hover:underline">
                ceoassociatesllc@gmail.com
              </a>
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/shop" variant="primary">
                Continue shopping
              </Button>
              <Link to="/" className="text-sm text-steel hover:text-signal">
                Return home
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
