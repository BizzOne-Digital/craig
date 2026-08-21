import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';

export default function TeamPage() {
  return (
    <>
      <SEO
        title="Our Team"
        description="Leadership information for the Jackson-Lashley Foundation."
        path="/team"
      />

      <section className="relative min-h-[70vh] overflow-hidden bg-obsidian px-6 py-24 lg:px-10">
        <div className="pointer-events-none absolute -right-10 top-20 font-display text-[10rem] text-white/[0.03]">
          TEAM
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">Our Team</p>
          <h1 className="mt-6 font-display text-5xl text-bone md:text-7xl">Leadership</h1>
          <div className="mx-auto mt-12 max-w-xl border border-white/10 bg-carbon p-12">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-signal/40">
              <span className="font-display text-3xl text-signal/60">JLF</span>
            </div>
            <h2 className="font-display text-3xl text-bone">Leadership Information Coming Soon</h2>
            <p className="mt-4 text-steel">
              We are preparing verified team profiles with approved biographies and credentials. Until then,
              we will not display placeholder team members or unverified qualifications.
            </p>
            <p className="mt-6 text-sm text-steel">
              For inquiries, contact us directly at{' '}
              <a href="mailto:ceoassociatesllc@gmail.com" className="text-signal hover:underline">
                ceoassociatesllc@gmail.com
              </a>{' '}
              or{' '}
              <a href="tel:3142675674" className="text-signal hover:underline">
                314-267-5674
              </a>
              .
            </p>
            <Button to="/contact" variant="primary" className="mt-8">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
