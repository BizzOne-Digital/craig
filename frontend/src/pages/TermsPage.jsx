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

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" path="/terms">
      <section>
        <h2 className="font-display text-xl text-bone">1. Acceptance of Terms</h2>
        <p className="mt-3">
          By accessing or using the CEO Foundation website, you agree to these Terms of Service.
          If you do not agree, please do not use our site.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">2. Services & Information</h2>
        <p className="mt-3">
          Content on this site is for general informational purposes. It does not constitute legal advice
          and does not create an attorney-client relationship. Service outcomes vary and no result is guaranteed.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">3. Online Shop</h2>
        <p className="mt-3">
          Product purchases are subject to availability. Prices are listed in USD. We reserve the right to
          modify product offerings and pricing. Payment is processed through Stripe Checkout.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">4. Limitation of Liability</h2>
        <p className="mt-3">
          To the fullest extent permitted by law, CEO Foundation shall not be liable for any
          indirect, incidental, or consequential damages arising from use of this website or our services.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">5. Contact</h2>
        <p className="mt-3">
          Questions about these terms: ceoassociatesllc@gmail.com or 314-267-5674.
        </p>
      </section>
    </LegalLayout>
  );
}
