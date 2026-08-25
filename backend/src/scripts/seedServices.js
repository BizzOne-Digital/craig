import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Service from '../models/Service.js';
import { validateEnv } from '../config/env.js';
import { CONSULTATION_SERVICES } from '../data/consultationServices.js';

dotenv.config();

const services = [
  {
    title: 'Consulting',
    slug: 'consulting',
    shortDescription: 'Focused guidance for individuals and families navigating complex criminal justice challenges.',
    description:
      'Hourly consulting for clarity, direction, and practical next steps. This service provides strategic conversation and support—it does not guarantee any legal outcome.',
    price: 100,
    priceLabel: '$100/hour',
    billingUnit: 'hour',
    features: ['One-on-one strategic conversation', 'Clarifying questions and practical guidance', 'Follow-up summary when applicable'],
    duration: 'Scheduled by the hour',
    ctaLabel: 'Book Consulting',
    featured: true,
    active: true,
    displayOrder: 1,
  },
  {
    title: 'Pre-Trial Case Review',
    slug: 'pre-trial-case-review',
    shortDescription: 'A structured review to assess case context and identify strategic considerations before trial.',
    description:
      'A comprehensive pre-trial review focused on understanding your case context, reviewing available information, and outlining strategic considerations. Outcomes vary and no result is guaranteed.',
    price: 3000,
    priceLabel: '$3,000',
    billingUnit: 'flat fee',
    features: ['Structured case review', 'Issue identification', 'Strategic considerations outline', 'Next-step recommendations'],
    duration: 'Multi-phase review',
    ctaLabel: 'Request Pre-Trial Review',
    featured: true,
    active: true,
    displayOrder: 2,
  },
  {
    title: 'Case Strategy & Dismissal-Focused Review',
    slug: 'case-strategy-dismissal-focused-review',
    shortDescription: 'In-depth case strategy support toward a favorable resolution—without guaranteeing dismissal or acquittal.',
    description:
      'An intensive dismissal-focused review and case strategy engagement for complex matters requiring deeper analysis. This service supports advocacy toward a favorable resolution but does not promise dismissal, acquittal, or any specific legal result.',
    price: 10000,
    priceLabel: 'Up to $10,000',
    billingUnit: 'engagement',
    features: ['Deep case analysis', 'Dismissal-focused strategy review', 'Documentation guidance', 'Ongoing strategic support'],
    duration: 'Extended engagement',
    ctaLabel: 'Discuss Case Strategy',
    featured: true,
    active: true,
    displayOrder: 3,
  },
  ...CONSULTATION_SERVICES,
];

async function seedServices() {
  validateEnv();
  await connectDB();

  for (const service of services) {
    await Service.findOneAndUpdate({ slug: service.slug }, service, { upsert: true, new: true });
    console.log('Seeded service:', service.title);
  }

  process.exit(0);
}

seedServices().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
