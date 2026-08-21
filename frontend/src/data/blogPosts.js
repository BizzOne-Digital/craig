export const blogPosts = [
  {
    slug: 'understanding-your-rights-after-an-arrest',
    title: 'Understanding Your Rights After an Arrest',
    excerpt:
      'A plain-language overview of common procedural steps, communication boundaries, and why early clarity can matter for families navigating the criminal justice system.',
    category: 'Education',
    readingTime: '6 min read',
    publishedAt: '2025-11-12',
    author: 'Jackson-Lashley Foundation',
    disclaimer:
      'This article provides general educational information only. It is not legal advice, and reading it does not create an attorney-client relationship.',
    content: [
      'An arrest can feel disorienting for everyone involved—not only the person taken into custody, but also parents, partners, and children trying to understand what happens next. While every jurisdiction follows its own rules, several principles appear frequently across cases.',
      'First, individuals generally have the right to remain silent and the right to request an attorney. Exercising those rights calmly and respectfully is not an admission of guilt; it is a protective choice while facts are still being gathered.',
      'Families often benefit from documenting what they know: dates, locations, agency names, and the names of officers or investigators when available. Keep copies of paperwork, bond information, and court notices in one secure folder.',
      'Support can take many forms—emotional steadiness, childcare coordination, transportation to court, or help locating qualified legal counsel. Advocacy organizations may also connect families with community resources, though they cannot guarantee any particular outcome.',
      'If you are unsure whether a situation requires immediate legal representation, consider requesting a structured case review rather than relying on informal advice alone. Professional review can clarify options without promising a specific result.',
    ],
  },
  {
    slug: 'how-to-prepare-for-a-case-review-consultation',
    title: 'How to Prepare for a Case Review Consultation',
    excerpt:
      'Practical steps for organizing timelines, questions, and non-sensitive documents before a consultation—so your conversation stays focused and respectful of privacy.',
    category: 'Process',
    readingTime: '5 min read',
    publishedAt: '2025-12-03',
    author: 'Jackson-Lashley Foundation',
    disclaimer:
      'This article provides general educational information only. It is not legal advice, and no consultation can guarantee dismissal, acquittal, or any specific legal result.',
    content: [
      'A case review consultation is most useful when it focuses on clarity: what is known, what is uncertain, and what realistic next steps may exist. Preparation helps both the client and the reviewer use limited time well.',
      'Start with a simple timeline. Note key dates such as arrest, arraignment, bond hearings, and scheduled court appearances. Avoid including Social Security numbers, full account numbers, or unencrypted copies of sensitive evidence in initial messages.',
      'Write down your primary questions in advance. Examples include: What procedural stage is this case in? What deadlines should we track? What documents might a qualified attorney need later?',
      'Gather publicly shareable documents when possible: docket entries, bond paperwork, or correspondence that does not expose confidential investigative material. If you are unsure whether a document is appropriate to share, ask before sending.',
      'Remember that a consultation explains options and strategy considerations—it does not promise a particular verdict, sentence, or financial recovery. Outcomes depend on facts, law, and the decisions of courts and agencies.',
    ],
  },
  {
    slug: 'supporting-a-loved-one-during-pretrial-proceedings',
    title: 'Supporting a Loved One During Pretrial Proceedings',
    excerpt:
      'Guidance for families who want to show up with dignity, maintain boundaries, and avoid common mistakes while a case is still active.',
    category: 'Family Support',
    readingTime: '7 min read',
    publishedAt: '2026-01-18',
    author: 'Jackson-Lashley Foundation',
    disclaimer:
      'This article provides general educational information only. It is not legal advice and should not replace guidance from licensed professionals.',
    content: [
      'Pretrial proceedings can last weeks or months. During that period, families often carry stress, financial pressure, and uncertainty while trying to remain steady for children and other dependents.',
      'Consistent communication matters, but so do boundaries. Follow facility or court rules about calls, visits, and mail. Avoid discussing case details on non-secure phone lines when advised otherwise.',
      'Create a small support network with defined roles: one person tracks court dates, another manages childcare, another handles approved financial tasks. Rotating responsibilities prevents burnout.',
      'Be cautious about public social media posts. Statements made online can be misunderstood or used out of context. Share updates privately with trusted contacts instead.',
      'Seek reputable educational resources and qualified legal counsel when appropriate. Community advocacy can complement professional representation, but it cannot substitute for licensed legal judgment or guarantee any outcome.',
    ],
  },
];

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getRelatedPosts(slug, limit = 2) {
  return blogPosts.filter((post) => post.slug !== slug).slice(0, limit);
}

export default blogPosts;
