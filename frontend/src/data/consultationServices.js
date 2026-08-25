const CONSULTATION_DISCLAIMER =
  ' Includes expert consultation. General guidance only—not legal advice. No specific outcome is guaranteed.';

function consultationService({
  id,
  title,
  slug,
  shortDescription,
  description,
  features,
  displayOrder,
  stateFees = false,
}) {
  return {
    _id: id,
    title,
    slug,
    shortDescription,
    description:
      description ||
      `${shortDescription}${CONSULTATION_DISCLAIMER}${
        stateFees ? ' State filing fees are not included and are paid separately.' : ''
      }`,
    price: 100,
    priceLabel: stateFees ? '$100 with consultation (+ state fees)' : '$100 with consultation',
    billingUnit: 'consultation',
    features: features || [
      'Expert consultation included',
      'Practical next-step guidance',
      'Clear process overview',
    ],
    duration: 'Consultation-based',
    ctaLabel: 'Request Consultation',
    featured: false,
    active: true,
    displayOrder,
  };
}

export const CONSULTATION_SERVICES = [
  consultationService({
    id: 'fallback-traffic-services',
    title: 'Traffic Services',
    slug: 'traffic-services',
    shortDescription: 'Expert assistance with traffic-related concerns.',
    features: [
      'Review of traffic-related concerns',
      'Expert consultation',
      'Guidance on practical next steps',
    ],
    displayOrder: 4,
  }),
  consultationService({
    id: 'fallback-child-support-services',
    title: 'Child Support Services',
    slug: 'child-support-services',
    shortDescription: 'Expert assistance with child support issues.',
    features: [
      'Child support issue review',
      'Expert consultation',
      'Direction on documentation and process',
    ],
    displayOrder: 5,
  }),
  consultationService({
    id: 'fallback-copyright-protection-guidance',
    title: 'Copyright Protection Guidance',
    slug: 'copyright-protection-guidance',
    shortDescription: 'Strategies for safeguarding creative works.',
    features: [
      'Copyright protection overview',
      'Expert consultation',
      'Guidance on safeguarding creative works',
      'State filing fees billed separately',
    ],
    displayOrder: 6,
    stateFees: true,
  }),
  consultationService({
    id: 'fallback-property-protection-consultation',
    title: 'Property Protection Consultation',
    slug: 'property-protection-consultation',
    shortDescription: 'Expert guidance on property protection.',
    features: [
      'Property protection consultation',
      'Risk and process overview',
      'Practical next-step guidance',
    ],
    displayOrder: 7,
  }),
  consultationService({
    id: 'fallback-birth-certificate-authentication',
    title: 'Authentication of Birth Certificate with Consultation',
    slug: 'birth-certificate-authentication',
    shortDescription:
      'Comprehensive birth certificate authentication service with expert consultation.',
    features: [
      'Birth certificate authentication support',
      'Expert consultation included',
      'Documentation guidance',
    ],
    displayOrder: 8,
  }),
  consultationService({
    id: 'fallback-national-passport-consultation',
    title: 'National Passport with Consultation',
    slug: 'national-passport-consultation',
    shortDescription: 'Secure your passport with expert guidance.',
    features: [
      'Passport process consultation',
      'Documentation checklist',
      'Expert guidance throughout',
    ],
    displayOrder: 9,
  }),
  consultationService({
    id: 'fallback-trademark-registration-assistance',
    title: 'Trademark Registration Assistance',
    slug: 'trademark-registration-assistance',
    shortDescription: 'Streamlined process for trademark registration.',
    features: [
      'Trademark registration guidance',
      'Expert consultation included',
      'Streamlined process overview',
      'State filing fees billed separately',
    ],
    displayOrder: 10,
    stateFees: true,
  }),
];
