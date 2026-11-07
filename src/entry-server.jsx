import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App, {
  SITE_URL, CONTENT_CHECKED, COURSES, LIVE_HOME, ADVISOR_URL, paths, faqs, sectionSummaries, videoCourses, moreLive,
} from './App.jsx';

const MAIN_URL = 'https://www.zarantech.com';
const ORG_ID = `${MAIN_URL}/#organization`;

// Official ZaranTech profiles (same sources as the reviews data).
const PROFILES = [
  `${MAIN_URL}/`,
  'https://www.linkedin.com/company/zarantech-software-pvt--ltd-/',
  'https://www.trustpilot.com/review/zarantech.com',
  'https://www.glassdoor.com/Reviews/ZaranTech-Reviews-E1153534.htm',
  'https://www.ambitionbox.com/reviews/zarantech-reviews',
];

export function render() {
  return renderToString(<StrictMode><App /></StrictMode>);
}

// Structured data for search engines and AI answer engines.
// Google retired Course info rich results in 2025, so no offers or prices are marked up.
// The course list uses Google's "all-in-one page" ItemList format: each item points to an anchor on this page,
// with the zarantech.com course page in sameAs. No Review or AggregateRating markup (self-serving reviews are not eligible).
export function structuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': ORG_ID,
        name: 'ZaranTech',
        legalName: 'Zarantech LLC',
        url: `${MAIN_URL}/`,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/img/zarantech-logo.png` },
        foundingDate: '2009',
        founder: { '@type': 'Person', name: 'Alok Kumar', jobTitle: 'CEO and Founder' },
        email: 'sales@zarantech.com',
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'sales@zarantech.com', url: ADVISOR_URL, availableLanguage: 'English' },
        description: 'US-based EdTech and enterprise IT training company offering live instructor-led, corporate, self-paced and mentoring programs in SAP, Workday, Salesforce, Cloud, AI, Cybersecurity and Data Science.',
        knowsAbout: ['SAP S/4HANA', 'SAP BTP', 'SAP ABAP', 'SAP FICO', 'SAP Business AI', 'SAP Joule', 'Workday', 'Artificial intelligence'],
        sameAs: PROFILES,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'SAP Learning Hub by ZaranTech',
        publisher: { '@id': ORG_ID },
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: 'SAP Training: S/4HANA, BTP, ABAP, Finance and SAP Business AI',
        description: 'Compare ZaranTech live SAP training paths for S/4HANA End-to-End Implementation, SAP BTP, SAP AI for Finance, SAP AI for ABAP, the SAP AI Masterclass and SAP Joule, plus self-paced SAP video courses.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/img/og-image.jpg` },
        mainEntity: { '@id': `${SITE_URL}/#courses` },
        hasPart: sectionSummaries.map((x) => ({ '@type': 'WebPageElement', '@id': `${SITE_URL}/#section-${x.id}`, name: x.name, description: x.text, url: `${SITE_URL}/#${x.id}` })),
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.hero__lede', '.faq__list details p'] },
        datePublished: '2026-11-07',
        dateModified: CONTENT_CHECKED,
        inLanguage: 'en',
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#courses`,
        name: 'ZaranTech live SAP training paths',
        numberOfItems: paths.length,
        itemListElement: paths.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Course',
            '@id': `${SITE_URL}/#${p.anchor}`,
            url: `${SITE_URL}/#${p.anchor}`,
            name: p.name,
            description: `${p.description} Best for: ${p.bestFor}.`,
            provider: { '@id': ORG_ID },
            sameAs: p.live,
            inLanguage: 'en',
            teaches: p.topics,
            hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: p.iso },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
}

// Full plain-text version of the page for AI crawlers (/llms-full.txt). Built from the same data as the page.
export function llmsFull(today) {
  const L = [];
  L.push('# SAP Learning Hub by ZaranTech: full page text', '');
  L.push(`> ${SITE_URL}/ compares ZaranTech's live and self-paced SAP training. Operated by ZaranTech (Zarantech LLC, founded 2009). Not an official SAP website and not affiliated with SAP SE. Generated ${today}; course facts checked ${CONTENT_CHECKED}.`, '');
  L.push('## Summary');
  sectionSummaries.forEach((x) => L.push(`- ${x.name}: ${x.text}`));
  L.push('', '## Featured live SAP training paths');
  paths.forEach((p) => {
    L.push(`### ${p.name}`);
    L.push(`- Duration: ${p.duration}. Format: live, instructor-led, online.`);
    L.push(`- Best for: ${p.bestFor}.`);
    L.push(`- About: ${p.description}`);
    L.push(`- Key topics: ${p.topics.join(', ')}.`);
    L.push(`- Course page: ${p.live}`, '');
  });
  L.push('## More live SAP programs');
  moreLive.forEach((v) => L.push(`- ${v.title}: ${v.href}`));
  L.push(`- All live SAP training: ${LIVE_HOME}`, '');
  L.push('## Self-paced SAP video courses');
  videoCourses.forEach((v) => L.push(`- ${v.title} (${v.area}): ${v.href}`));
  L.push(`- Full SAP video catalog: ${COURSES}`, '');
  L.push('## Frequently asked questions');
  faqs.forEach((f) => L.push(`### ${f.q}`, f.a, ''));
  L.push('## About ZaranTech');
  L.push('- Zarantech LLC, US-based EdTech and enterprise IT training company, established 2009. India subsidiary: ZaranTech Software Pvt Ltd. CEO and Founder: Alok Kumar.');
  L.push('- Across all programs: 400+ courses, 32,000+ learners trained, 350+ corporate clients, 37+ countries served.');
  L.push('- Training does not guarantee employment. Confirm fees, batch dates and lab access with an advisor before purchase.', '');
  L.push('## Contact');
  L.push(`- Book a free call with a training advisor: ${ADVISOR_URL}`);
  L.push('- Email: sales@zarantech.com', '');
  return L.join('\n');
}
