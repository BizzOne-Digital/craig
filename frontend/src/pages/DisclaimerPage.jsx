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

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" path="/disclaimer">
      <section>
        <h2 className="font-display text-xl text-bone">General Information Only</h2>
        <p className="mt-3">
          Information on this website is provided for general educational and informational purposes only.
          It is not intended as legal advice and should not be relied upon as a substitute for consultation
          with a licensed attorney regarding your specific situation.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">No Guaranteed Outcomes</h2>
        <p className="mt-3">
          Jackson-Lashley Foundation services provide strategic support, consulting, and case review.
          We do not guarantee dismissal, acquittal, financial recovery, reduced sentences, or any other
          specific legal outcome. Every case is unique and results depend on individual circumstances,
          applicable law, and factors beyond our control.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">Not a Law Firm</h2>
        <p className="mt-3">
          Unless explicitly stated and verified, Jackson-Lashley Foundation is not a law firm and does
          not provide legal representation. Use of our services or website does not create an attorney-client
          relationship.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">Testimonials</h2>
        <p className="mt-3">
          Testimonials reflect individual experiences and opinions. They are not guarantees of future results
          or outcomes for other clients.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-bone">Contact</h2>
        <p className="mt-3">
          Questions: ceoassociatesllc@gmail.com or 314-267-5674.
        </p>
      </section>
    </LegalLayout>
  );
}
