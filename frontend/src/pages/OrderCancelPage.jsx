import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';

export default function OrderCancelPage() {
  return (
    <>
      <SEO title="Checkout Cancelled" description="Your checkout was cancelled." path="/order/cancel" noIndex />

      <section className="mx-auto max-w-xl px-6 py-24 text-center lg:px-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20">
          <svg className="h-8 w-8 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-display text-4xl text-bone">Checkout Cancelled</h1>
        <p className="mt-6 text-lg text-steel">
          Your payment was not completed. No charges have been made. Your cart items are still saved if
          you would like to try again.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button to="/cart" variant="primary">
            Return to cart
          </Button>
          <Button to="/shop" variant="outline">
            Continue shopping
          </Button>
        </div>
        <p className="mt-8 text-sm text-steel">
          Need help?{' '}
          <Link to="/contact" className="text-signal hover:underline">
            Contact us
          </Link>{' '}
          or call{' '}
          <a href="tel:3142675674" className="text-signal hover:underline">
            314-267-5674
          </a>
        </p>
      </section>
    </>
  );
}
