import SEO from '../components/ui/SEO.jsx';

function LegalLayout({ title, path, children }) {
  return (
    <>
      <SEO title={title} description={`${title} for the Jackson-Lashley Foundation.`} path={path} noIndex />
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

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" path="/privacy">
      <section>
        <h2 className="font-display text-xl text-bone">1. Introduction</h2>
        <p className="mt-3">
          Jackson-Lashley Foundation (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy.
          This Privacy Policy describes how we collect, use, and protect personal information when you visit
          our website, make purchases, or submit inquiries.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">2. Information We Collect</h2>
        <p className="mt-3">
          We may collect name, email address, phone number, shipping address, order details, and messages
          you submit through our forms. Payment information is processed securely by Stripe and is not stored
          on our servers.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">3. How We Use Information</h2>
        <p className="mt-3">
          We use collected information to process orders, respond to inquiries, provide services, send
          confirmations, and improve our website. We do not sell personal information to third parties.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">4. Data Security</h2>
        <p className="mt-3">
          We implement reasonable technical and organizational measures to protect your information.
          No method of transmission over the Internet is 100% secure.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">5. Contact</h2>
        <p className="mt-3">
          For privacy-related questions, contact us at ceoassociatesllc@gmail.com or 314-267-5674.
        </p>
      </section>
    </LegalLayout>
  );
}
