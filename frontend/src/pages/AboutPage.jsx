import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';

const VALUES = [
  { title: 'Fairness', text: 'Every person deserves equitable treatment within the criminal justice system.' },
  { title: 'Accountability', text: 'Systems and decisions must be examined honestly and transparently.' },
  { title: 'Assistance', text: 'Support should be practical, respectful, and accessible when families need it most.' },
  { title: 'Dignity', text: 'We honor the humanity of every individual and family we serve.' },
];

const TIMELINE_PLACEHOLDER = [
  { label: 'Foundation established', note: '[Client to provide date and details]' },
  { label: 'Mission defined', note: '[Client to provide milestone details]' },
  { label: 'Services expanded', note: '[Client to provide milestone details]' },
  { label: 'Community impact', note: '[Client to provide verified achievements]' },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about the Jackson-Lashley Foundation mission to promote fairness, accountability, and assistance for families affected by injustice."
        path="/about"
      />

      <section className="relative min-h-[70vh] overflow-hidden bg-hero-mesh grain legal-grid px-6 py-28 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-red-leak" />
        <div className="pointer-events-none absolute -right-6 top-16 font-display text-[clamp(5rem,16vw,14rem)] leading-none text-white/[0.04]">
          ABOUT
        </div>
        <div className="relative mx-auto max-w-4xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-signal">
            <span className="h-px w-8 bg-signal" />
            About Us
          </p>
          <h1 className="mt-6 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] text-bone">
            Advocacy Rooted in <span className="text-gradient-red">Justice</span>
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-steel">
            The Jackson-Lashley Foundation was created to support individuals and families navigating
            the criminal justice system with clarity, compassion, and strategic direction.
          </p>
        </div>
      </section>

      <section className="bg-carbon px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl text-bone">Our Story</h2>
            <div className="mt-6 space-y-4 text-steel">
              <p>
                <strong className="text-bone">[PLACEHOLDER — Client to replace]</strong> Share the origin
                story of the Jackson-Lashley Foundation here. Describe what inspired this work and why
                advocacy matters to your community.
              </p>
              <p>
                This section should reflect authentic, approved narrative copy. Do not include unverified
                claims, case outcomes, or statistics until the client provides them.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-4xl text-bone">Our Values</h2>
            <ul className="mt-8 space-y-6">
              {VALUES.map((value) => (
                <li key={value.title} className="border-l-2 border-signal/50 pl-6">
                  <h3 className="font-display text-2xl text-bone">{value.title}</h3>
                  <p className="mt-2 text-steel">{value.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full max-w-full overflow-x-clip bg-obsidian px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-4xl text-bone">Our Journey</h2>
          <p className="mt-4 max-w-2xl text-steel">
            Timeline framework for client-approved milestones. Dates and achievements below are placeholders.
          </p>
          <div className="relative mt-12 space-y-8 border-l border-white/10 pl-6 sm:pl-8">
            {TIMELINE_PLACEHOLDER.map((item) => (
              <div key={item.label} className="relative">
                <span className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-signal" />
                <h3 className="font-display text-xl text-bone">{item.label}</h3>
                <p className="mt-1 text-sm text-steel italic">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-carbon px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div className="border border-signal/30 p-8">
            <h2 className="font-display text-3xl text-bone">What We Are</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-steel">
              <li>An advocacy and support organization</li>
              <li>A provider of consulting and case review services</li>
              <li>A resource for families seeking clarity and direction</li>
              <li>A mission-driven shop supporting our work</li>
            </ul>
          </div>
          <div className="border border-white/10 p-8">
            <h2 className="font-display text-3xl text-bone">What We Are Not</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-steel">
              <li>A law firm or substitute for licensed legal counsel</li>
              <li>A guarantee of dismissal, acquittal, or any specific outcome</li>
              <li>A source of legal advice through general website content</li>
              <li>A replacement for emergency or crisis services</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-obsidian px-6 py-20 text-center lg:px-10">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-4xl text-bone">Ready to Start a Conversation?</h2>
          <p className="mt-4 text-steel">
            Request a consultation to discuss how we may be able to support you.
          </p>
          <Button to="/booking" variant="primary" className="mt-8">
            Request a Consultation
          </Button>
        </div>
      </section>
    </>
  );
}
