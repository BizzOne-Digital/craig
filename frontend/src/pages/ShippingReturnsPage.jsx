import SEO from '../components/ui/SEO.jsx';

function LegalLayout({ title, path, children }) {
  return (
    <>
      <SEO title={title} description={`${title} for the CEO Foundation.`} path={path} noIndex />
      <article className="bg-obsidian">
        <header className="border-b border-white/10 px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="rounded border border-signal/30 bg-signal/10 px-4 py-2 text-sm text-bone">
              [DRAFT — FOR CLIENT & LEGAL REVIEW] This content is placeholder copy and must be reviewed
              and approved by qualified legal counsel before publication.
            </p>
            <h1 className="mt-8 font-display text-4xl text-bone md:text-5xl">{title}</h1>
            <p className="mt-4 text-sm text-steel">Last updated: [Date to be confirmed by client]</p>
          </div>
        </header>
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-12 text-steel lg:px-10">{children}</div>
      </article>
    </>
  );
}

export default function ShippingReturnsPage() {
  return (
    <LegalLayout title="Shipping & Returns" path="/shipping-returns">
      <section>
        <h2 className="font-display text-xl text-bone">Shipping</h2>
        <p className="mt-3">
          Orders typically ship within 5–7 business days after verified payment. You will receive a
          confirmation email with order details once payment is confirmed. Tracking information will be
          provided when your order ships.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">Shipping Costs</h2>
        <p className="mt-3">
          Shipping costs are calculated at checkout based on your order and delivery address.
          [Client to confirm final shipping rates and regions served.]
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">Returns & Exchanges</h2>
        <p className="mt-3">
          [Client to confirm return policy.] Unworn items in original condition may be eligible for return
          within [X] days of delivery. Contact us at ceoassociatesllc@gmail.com before initiating a return.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">Damaged or Incorrect Items</h2>
        <p className="mt-3">
          If you receive a damaged or incorrect item, contact us within [X] days with your order number
          and photos. We will work to resolve the issue promptly.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">Contact</h2>
        <p className="mt-3">
          Order questions: ceoassociatesllc@gmail.com or 314-267-5674.
        </p>
      </section>
    </LegalLayout>
  );
}
