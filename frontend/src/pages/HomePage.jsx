import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { getProducts, getServices, getTestimonials } from '../services/publicApi.js';
import { formatMoney } from '../utils/format.js';
import { prefersReducedMotion } from '../utils/motion.js';
import ArrowIcon from '../components/svg/ArrowIcon.jsx';

gsap.registerPlugin(ScrollTrigger);

const BUSINESS = {
  name: 'Jackson-Lashley Foundation',
  email: 'ceoassociatesllc@gmail.com',
  phone: '314-267-5674',
};

const HOW_WE_HELP = [
  { step: '01', title: 'Listen', text: 'We start by understanding your situation with care and without judgment.' },
  { step: '02', title: 'Review', text: 'We assess available information and identify practical considerations.' },
  { step: '03', title: 'Build a Strategy', text: 'We outline thoughtful next steps aligned with your goals.' },
  { step: '04', title: 'Support the Next Step', text: 'We remain available as you move forward with clarity and dignity.' },
];

const MANIFESTO_STAGES = [
  {
    label: 'Injustice',
    headline: 'When systems fail people, silence is not an option.',
    body: 'Families deserve clarity, respect, and a path forward—not confusion or abandonment.',
  },
  {
    label: 'Accountability',
    headline: 'Fairness requires honest examination.',
    body: 'We advocate for transparency, due process, and the dignity of every person affected.',
  },
  {
    label: 'Assistance',
    headline: 'Support must be practical and humane.',
    body: 'Our work connects individuals and families with guidance, resources, and strategic direction.',
  },
];

const HERO_BG = '/hero-bg.png';

export default function HomePage() {
  const heroRef = useRef(null);
  const manifestoRef = useRef(null);
  const stagesRef = useRef([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [errorServices, setErrorServices] = useState('');
  const [errorProducts, setErrorProducts] = useState('');

  useEffect(() => {
    let cancelled = false;

    getServices()
      .then((res) => {
        if (!cancelled) setServices(res.data?.slice(0, 3) || []);
      })
      .catch(() => {
        if (!cancelled) setErrorServices('Unable to load services.');
      })
      .finally(() => {
        if (!cancelled) setLoadingServices(false);
      });

    getProducts({ featured: true, limit: 4, active: true })
      .then((res) => {
        if (!cancelled) setProducts(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setErrorProducts('Unable to load featured products.');
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    getTestimonials()
      .then((res) => {
        if (!cancelled) setTestimonials((res.data || []).filter((t) => t.featured).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setTestimonials([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingTestimonials(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !heroRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.to('.hero-eyebrow', { y: 0, opacity: 1, duration: 0.6, delay: 0.2 });
      gsap.to('.hero-line-white', { y: 0, opacity: 1, duration: 0.8, delay: 0.35, ease: 'power4.out' });
      gsap.to('.hero-line-red', { y: 0, opacity: 1, duration: 0.9, delay: 0.5, ease: 'power4.out' });
      gsap.to('.hero-body', { y: 0, opacity: 1, duration: 0.7, delay: 0.75 });
      gsap.to('.hero-cta', { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, delay: 0.95 });
      gsap.to('.hero-pricing', { opacity: 1, duration: 0.6, delay: 1.15 });

      gsap.to('.hero-bg-img', {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !manifestoRef.current) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const ctx = gsap.context(() => {
        const stages = stagesRef.current.filter(Boolean);
        if (!stages.length) return;

        gsap.set(stages.slice(1), { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: 'top top',
            end: `+=${stages.length * 100}%`,
            pin: true,
            scrub: 0.6,
          },
        });

        stages.forEach((stage, index) => {
          if (index === 0) return;
          tl.to(stages[index - 1], { autoAlpha: 0, y: -30, duration: 0.5 })
            .to(stage, { autoAlpha: 1, y: 0, duration: 0.5 }, '<0.2');
        });
      }, manifestoRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <SEO
        title="Home"
        description="Jackson-Lashley Foundation promotes fairness, accountability, and meaningful assistance for individuals and families affected by injustice in the criminal justice system."
        path="/"
      />

      {/* Hero — mockup layout with full-bleed background image */}
      <section
        ref={heroRef}
        className="hero-animate relative -mt-[var(--header-height)] min-h-[100svh] overflow-hidden bg-black"
      >
        {/* Background image — right weighted */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Families standing together with strength and determination"
            className="hero-bg-img h-full w-full object-cover object-[70%_center] sm:object-[75%_center]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20 lg:via-black/75 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>

        {/* Vertical FAIRNESS text — far right */}
        <div
          className="pointer-events-none absolute right-4 top-1/2 hidden origin-center -translate-y-1/2 rotate-90 font-display text-[clamp(3rem,8vw,6rem)] tracking-[0.2em] text-white/[0.07] xl:right-8 xl:block"
          aria-hidden="true"
        >
          FAIRNESS
        </div>

        {/* Content — left column */}
        <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-4 pb-24 pt-[calc(var(--header-height)+1.5rem)] sm:px-5 sm:pb-16 lg:px-10 lg:pb-20">
          <div className="max-w-2xl">
            <p className="hero-eyebrow mb-4 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-signal sm:mb-5 sm:text-xs sm:tracking-[0.35em]">
              Justice • Advocacy • Support
            </p>

            <h1 className="max-w-full overflow-hidden font-display leading-[0.88]">
              <span className="hero-line-white block break-words text-[clamp(2rem,9vw,5.5rem)] tracking-[0.04em] text-white">
                JUSTICE DEMANDS
              </span>
              <span className="hero-line-red mt-1 block break-words text-[clamp(2rem,10vw,7.5rem)] tracking-[0.02em] text-signal">
                ACCOUNTABILITY.
              </span>
            </h1>

            <p className="hero-body mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base md:text-lg">
              Promoting fairness, accountability, and meaningful assistance for individuals and families
              affected by injustice.
            </p>

            <div className="hero-cta mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button
                to="/booking"
                variant="primary"
                size="lg"
                magnetic
                className="w-full rounded-none px-6 sm:w-auto sm:min-w-[220px] sm:px-8"
              >
                Request a Case Review
              </Button>
              <Button
                to="/shop"
                variant="secondary"
                size="lg"
                className="w-full rounded-none border-white/40 px-6 hover:border-white hover:bg-white/10 sm:w-auto sm:min-w-[200px] sm:px-8"
              >
                Shop With Purpose
              </Button>
            </div>

            <p className="hero-pricing mt-5 text-xs text-white/45 sm:mt-6 sm:text-sm">
              Consulting from $100/hr • Pre-Trial Review $3,000
            </p>
          </div>

          <div className="absolute bottom-6 left-4 hidden items-center gap-3 text-white/50 sm:flex lg:bottom-8 lg:left-10">
            <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 pt-2">
              <span className="block h-2 w-0.5 animate-bounce bg-white/70" />
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em]">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="relative w-full max-w-full overflow-x-clip border-y border-white/10 bg-carbon py-5">
        <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-carbon to-transparent sm:w-24" />
        <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-carbon to-transparent sm:w-24" />
        <div className="overflow-x-clip">
          <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-4 flex shrink-0 items-center gap-4 font-display text-xl tracking-[0.14em] text-bone/90 sm:mx-6 sm:gap-6 sm:text-2xl md:text-4xl">
              FAIRNESS
              <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#E10600]" />
              ACCOUNTABILITY
              <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#E10600]" />
              ASSISTANCE
            </span>
          ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="section-padding legal-grid bg-obsidian">
        <div className="container-jlf-wide grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our Mission" title="Fairness. Accountability. Assistance." />
          </div>
          <div className="relative lg:col-span-7">
            <div className="absolute -left-4 top-0 hidden h-full w-px bg-gradient-to-b from-signal via-signal/30 to-transparent lg:block" />
            <div className="border border-white/10 bg-carbon/50 p-8 backdrop-blur-sm lg:ml-8 lg:p-12">
              <p className="text-xl leading-relaxed text-bone/90">
                {BUSINESS.name} exists to support individuals and families navigating the criminal justice
                system with dignity. We provide consulting, case review, and strategic guidance—always with
                clear expectations that outcomes vary and no result is guaranteed.
              </p>
              <Link
                to="/about"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-signal"
              >
                Learn our story
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-carbon">
        <div className="container-jlf-wide">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Services" title="How We Can Help" />
            <Button to="/services" variant="outline">
              View all services
            </Button>
          </div>

          {loadingServices && (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-72 rounded-sm" />
              ))}
            </div>
          )}

          {errorServices && (
            <p className="rounded-sm border border-signal/30 bg-signal/10 px-4 py-3 text-bone">{errorServices}</p>
          )}

          {!loadingServices && !errorServices && (
            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service, index) => (
                <article key={service._id} className="cinematic-card group p-8">
                  <span className="font-display text-6xl text-white/[0.04]">0{index + 1}</span>
                  <p className="mt-2 font-display text-3xl text-signal">{service.priceLabel || formatMoney(service.price)}</p>
                  <h3 className="mt-4 font-display text-2xl text-bone">{service.title}</h3>
                  <p className="mt-3 min-h-[4.5rem] text-steel">{service.shortDescription}</p>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-signal/60 to-transparent" />
                  <Button to={`/services/${service.slug}`} variant="ghost" className="mt-6 w-full">
                    {service.ctaLabel || 'Learn more'}
                  </Button>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Manifesto — pinned desktop, stacked mobile */}
      <section ref={manifestoRef} className="relative w-full max-w-full overflow-x-clip bg-obsidian lg:min-h-screen">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(225,6,0,0.08),transparent_50%)]" />

        {/* Mobile: stacked stages */}
        <div className="container-jlf-wide space-y-12 px-4 py-16 lg:hidden">
          <SectionHeading eyebrow="Why We Exist" title="" />
          {MANIFESTO_STAGES.map((stage) => (
            <article key={stage.label} className="border-b border-white/10 pb-10 last:border-0">
              <span className="font-display text-5xl leading-none text-white/[0.08]">{stage.label}</span>
              <h2 className="mt-3 font-display text-3xl leading-tight text-bone">{stage.headline}</h2>
              <p className="mt-4 text-steel">{stage.body}</p>
              <div className="mt-6 h-1 w-16 bg-signal" />
            </article>
          ))}
        </div>

        {/* Desktop: pinned scroll sequence */}
        <div className="container-jlf-wide relative hidden h-screen flex-col justify-center lg:flex">
          <SectionHeading eyebrow="Why We Exist" title="" className="mb-8" />
          {MANIFESTO_STAGES.map((stage, index) => (
            <div
              key={stage.label}
              ref={(el) => {
                stagesRef.current[index] = el;
              }}
              className="absolute inset-x-0 top-1/2 max-w-3xl -translate-y-1/2"
            >
              <span className="font-display text-[clamp(4rem,12vw,9rem)] leading-none text-white/[0.06]">
                {stage.label}
              </span>
              <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight text-bone">
                {stage.headline}
              </h2>
              <p className="mt-6 max-w-xl text-lg text-steel">{stage.body}</p>
              <div className="mt-8 h-1 w-24 bg-signal" />
            </div>
          ))}
        </div>
      </section>

      {/* How We Help */}
      <section className="section-padding bg-carbon">
        <div className="container-jlf-wide">
          <SectionHeading eyebrow="Process" title="How We Help" />
          <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-signal/30 to-transparent lg:block" />
            {HOW_WE_HELP.map((item) => (
              <div
                key={item.step}
                className="group relative border border-white/10 bg-obsidian/80 p-6 transition hover:border-signal/40 hover:bg-obsidian"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center border border-signal/50 font-display text-xl text-signal transition group-hover:bg-signal group-hover:text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-2xl text-bone">{item.title}</h3>
                <p className="mt-3 text-steel">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-obsidian">
        <div className="container-jlf-wide">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Shop" title="Shop With Purpose" subtitle="Every purchase supports advocacy, education, and assistance for families navigating injustice." />
            <Button to="/shop" variant="primary" magnetic>
              Shop With Purpose
            </Button>
          </div>

          {loadingProducts && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <Skeleton key={n} className="aspect-[3/4] rounded-sm" />
              ))}
            </div>
          )}

          {errorProducts && (
            <p className="rounded-sm border border-signal/30 bg-signal/10 px-4 py-3 text-bone">{errorProducts}</p>
          )}

          {!loadingProducts && !errorProducts && products.length === 0 && (
            <p className="text-steel">Featured products will appear here once available.</p>
          )}

          {!loadingProducts && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/shop/${product.slug}`}
                  className="cinematic-card group overflow-hidden"
                >
                  <div className="duotone-overlay aspect-square overflow-hidden bg-carbon">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-carbon text-steel">No image</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl text-bone">{product.name}</h3>
                    <p className="mt-1 font-semibold text-signal">{formatMoney(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Education */}
      <section className="section-padding bg-carbon legal-grid">
        <div className="container-jlf-wide grid gap-16 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Education"
            title="Understanding Your Rights"
            subtitle="Navigating the criminal justice system can feel overwhelming. Informed families make stronger advocates—for themselves and for their loved ones."
          />
          <div className="space-y-4">
            {[
              {
                title: 'Know the process',
                text: 'From arrest through pre-trial, understanding each stage helps you ask better questions and make thoughtful decisions.',
              },
              {
                title: 'Document everything',
                text: 'Keep organized records of dates, contacts, and communications. Clear documentation supports effective advocacy.',
              },
              {
                title: 'Seek qualified guidance',
                text: 'General information is not legal advice. Consult licensed professionals for case-specific counsel.',
              },
            ].map((item) => (
              <article
                key={item.title}
                className="group border border-white/10 bg-obsidian/60 p-6 transition hover:border-signal/30 hover:bg-obsidian"
              >
                <h3 className="font-display text-xl text-bone group-hover:text-signal">{item.title}</h3>
                <p className="mt-2 text-steel">{item.text}</p>
              </article>
            ))}
            <Link to="/blog" className="group inline-flex items-center gap-2 pt-2 text-sm font-semibold uppercase tracking-[0.18em] text-bone hover:text-signal">
              Read educational articles <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {!loadingTestimonials && testimonials.length > 0 && (
        <section className="section-padding bg-obsidian">
          <div className="container-jlf-wide">
            <SectionHeading eyebrow="Voices" title="What People Share" />
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {testimonials.map((item) => (
                <blockquote
                  key={item._id}
                  className="cinematic-card border-l-2 border-l-signal p-8 pl-8"
                >
                  <p className="text-lg leading-relaxed text-bone">&ldquo;{item.quote}&rdquo;</p>
                  <footer className="mt-6 text-sm text-steel">
                    — {item.displayName}
                    {item.roleOrLocation && `, ${item.roleOrLocation}`}
                  </footer>
                </blockquote>
              ))}
            </div>
            <Button to="/testimonials" variant="ghost" className="mt-10">
              View all testimonials
            </Button>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-carbon py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.15),transparent_60%)]" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-signal/10 blur-[100px] animate-pulseGlow" />
        <div className="container-jlf relative max-w-4xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-signal">Take the first step</p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] text-bone">
            Your Story Deserves To Be Heard.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-steel">
            Reach out for a confidential conversation about how we may be able to support you or your family.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button to="/booking" variant="primary" size="lg" magnetic>
              Request a Case Review
            </Button>
            <Button href={`tel:${BUSINESS.phone.replace(/-/g, '')}`} variant="outline" size="lg">
              Call {BUSINESS.phone}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
