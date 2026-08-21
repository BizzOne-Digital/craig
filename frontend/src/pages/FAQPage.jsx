import { useState } from 'react';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';

const FAQ_CATEGORIES = [
  {
    name: 'Services',
    items: [
      {
        q: 'What services does the Jackson-Lashley Foundation offer?',
        a: 'We offer consulting ($100/hour), pre-trial case review ($3,000), and case strategy & dismissal-focused review (up to $10,000). Each service provides strategic support—not guaranteed legal outcomes.',
      },
      {
        q: 'Do you provide legal representation?',
        a: 'No. We provide advocacy support, consulting, and case review services. We are not a law firm and do not replace licensed legal counsel.',
      },
      {
        q: 'What is a dismissal-focused review?',
        a: 'It is an in-depth analysis that examines strategic considerations toward a favorable resolution. It does not promise or guarantee dismissal or acquittal.',
      },
    ],
  },
  {
    name: 'Process',
    items: [
      {
        q: 'How do I get started?',
        a: 'Submit a booking request through our online form or contact us by phone or email. We will respond using your preferred contact method.',
      },
      {
        q: 'What information should I prepare?',
        a: 'Prepare a general overview of your situation. Do not submit Social Security numbers, payment card data, or confidential evidence through the public form.',
      },
      {
        q: 'How is case-related information handled?',
        a: 'We treat inquiries with confidentiality. Sensitive documents should only be shared through secure channels we provide after initial contact.',
      },
    ],
  },
  {
    name: 'Pricing',
    items: [
      {
        q: 'Are prices fixed or variable?',
        a: 'Consulting is billed hourly at $100/hour. Pre-trial review is a $3,000 flat fee. Case strategy is priced up to $10,000 depending on scope.',
      },
      {
        q: 'Do you offer payment plans?',
        a: 'Payment arrangements may be discussed during your consultation. Contact us for details specific to your situation.',
      },
    ],
  },
  {
    name: 'Shop & Orders',
    items: [
      {
        q: 'How does checkout work?',
        a: 'We use secure Stripe Checkout. You do not need to create an account. Payment is processed securely and order confirmation is sent by email after verified payment.',
      },
      {
        q: 'Can I use a discount code?',
        a: 'Yes. Enter your discount code at checkout. Valid codes and their values are configured on our server—only approved codes will apply.',
      },
      {
        q: 'Where can I find shipping and return information?',
        a: 'See our Shipping & Returns policy page for current shipping timelines and return procedures.',
      },
    ],
  },
  {
    name: 'Privacy',
    items: [
      {
        q: 'What personal information do you collect?',
        a: 'We collect information you provide through forms and checkout, such as name, email, phone, and shipping address. See our Privacy Policy for full details.',
      },
      {
        q: 'Do you sell personal data?',
        a: 'No. We do not sell your personal information to third parties.',
      },
    ],
  },
  {
    name: 'Disclaimer',
    items: [
      {
        q: 'Do you guarantee any legal outcome?',
        a: 'No. Outcomes vary based on individual circumstances. We never guarantee dismissal, acquittal, financial recovery, or any specific result.',
      },
      {
        q: 'Is website content legal advice?',
        a: 'No. All general information on this site is for educational purposes only and is not legal advice.',
      },
    ],
  },
];

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-white/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
          aria-expanded={isOpen}
        >
          <span className="font-display text-lg text-bone">{question}</span>
          <span className={`shrink-0 text-signal transition ${isOpen ? 'rotate-45' : ''}`} aria-hidden>
            +
          </span>
        </button>
      </h3>
      <div
        className={`overflow-hidden transition-all ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
        role="region"
      >
        <p className="text-steel">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openKey, setOpenKey] = useState(null);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }))
    ),
  };

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently asked questions about Jackson-Lashley Foundation services, pricing, shop orders, and policies."
        path="/faq"
        jsonLd={faqJsonLd}
      />

      <section className="bg-obsidian px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">FAQ</p>
          <h1 className="mt-4 font-display text-5xl text-bone md:text-6xl">Common Questions</h1>
          <p className="mt-6 text-steel">
            Find answers about our services, process, and policies. Contact us if you need additional help.
          </p>
        </div>
      </section>

      <section className="bg-carbon px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-3xl space-y-16">
          {FAQ_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h2 className="font-display text-2xl text-signal">{category.name}</h2>
              <div className="mt-6">
                {category.items.map((item, i) => {
                  const key = `${category.name}-${i}`;
                  return (
                    <AccordionItem
                      key={key}
                      question={item.q}
                      answer={item.a}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-obsidian px-6 py-16 text-center lg:px-10">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl text-bone">Still have questions?</h2>
          <p className="mt-4 text-steel">We are here to help. Reach out by phone, email, or our contact form.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button to="/contact" variant="primary">
              Contact us
            </Button>
            <Button to="/booking" variant="outline">
              Request a consultation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
