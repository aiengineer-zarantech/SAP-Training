import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Menu, X, ChevronDown, Layers, Radio, PlayCircle,
  Building2, Compass, PhoneCall, Mail, Globe, Clock, Cloud, Code2, Bot, Boxes, BrainCircuit,
  Landmark, Rocket, Target, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { trainingReviews, TRUSTPILOT_URL } from './data/sap-reviews.js';

// Canonical address of this hub. The domain is not final yet: change it here only.
export const SITE_URL = 'https://sap.zarantech.com';
export const CONTENT_CHECKED = '2026-11-07';
const CONTENT_CHECKED_LABEL = 'November 7, 2026';

// Self-paced SAP catalog on ZaranTech's Teachable school.
export const COURSES = 'https://zarantech.teachable.com/l/products?courseCategory=SAP&sortKey=in_progress&sortDirection=desc&page=1';
// Live SAP courses on zarantech.com.
export const LIVE_HOME = 'https://www.zarantech.com/courses/?q=sap';
export const VIDEO_HOME = 'https://zarantech.teachable.com/';
export const ADVISOR_URL = 'https://www.zarantech.com/talk-to-training-advisor/';
const LIVE = (slug) => `https://www.zarantech.com/courses/${slug}`;
const VIDEO = (slug) => `https://zarantech.teachable.com/p/${slug}`;
const GOLD_BUNDLE = VIDEO('sap-gold-bundle');
const EXT = { target: '_blank', rel: 'noopener' };

// Course facts come from the live SAP course pages on zarantech.com, checked November 7, 2026.
export const paths = [
  {
    code: 'S/4', anchor: 'course-s4hana-implementation', icon: Layers, live: LIVE('sap-s-4hana-end-to-end-implementation-training'), tag: 'S/4HANA / FUNCTIONAL', category: 'Functional',
    title: 'SAP S/4HANA Implementation', name: 'SAP S/4HANA End-to-End Implementation', full: 'S/4HANA Implementation',
    bestFor: 'SAP functional consultants, solution architects and project teams',
    description: 'A live program that simulates a full SAP S/4HANA implementation, from SAP Activate and configuration through data migration, testing, cutover and a global implementation capstone.',
    topics: ['SAP Activate', 'S/4HANA foundations', 'Finance processes', 'Supply chain processes', 'Migration and testing', 'Cutover and hypercare'],
    duration: '120 hours over 15 weeks', iso: 'PT120H',
  },
  {
    code: 'BTP', anchor: 'course-sap-btp', icon: Cloud, live: LIVE('sap-btp-masterclass-training'), tag: 'BTP / TECHNICAL', category: 'Technical',
    title: 'SAP BTP Masterclass', name: 'SAP BTP Masterclass Training', full: 'Business Technology Platform',
    bestFor: 'Functional consultants, CAP and Fiori developers, Basis admins and architects',
    description: 'A live cohort with 19 modules, hands-on labs, five portfolio builds and an end-to-end SAP BTP capstone covering integration, extension, automation and AI.',
    topics: ['Governed BTP landscape', 'SAP and non-SAP integration', 'Clean-core S/4HANA extensions', 'Document automation', 'SAP AI prototypes', 'Operations and transports'],
    duration: '60 hours over 8 weeks', iso: 'PT60H',
  },
  {
    code: 'FIN', anchor: 'course-sap-ai-finance', icon: Landmark, live: LIVE('sap-ai-for-finance-consultants-training'), tag: 'FINANCE + AI / FUNCTIONAL', category: 'Functional',
    title: 'SAP AI for Finance', name: 'SAP AI for Finance Consultants Training', full: 'Finance with AI',
    bestFor: 'SAP FICO professionals, finance consultants and controllers',
    description: 'A live cohort that pairs SAP AI concepts with finance-specific labs, from data readiness and forecasting to AP/AR use cases, FP&A and governed finance automation.',
    topics: ['Finance AI use cases', 'AI with S/4HANA Finance', 'Forecasting and what-if planning', 'AP/AR and FP&A use cases', 'Governed finance automation'],
    duration: '40 hours over 5 weeks', iso: 'PT40H',
  },
  {
    code: 'ABAP', anchor: 'course-sap-ai-abap', icon: Code2, live: LIVE('sap-ai-for-abap-consultants-training'), tag: 'ABAP + AI / TECHNICAL', category: 'Technical',
    title: 'SAP AI for ABAP', name: 'SAP AI for ABAP Consultants Training', full: 'ABAP with AI',
    bestFor: 'SAP ABAP developers and technical consultants',
    description: 'A live, hands-on cohort on using AI to understand legacy ABAP, improve code and tests, build RAP applications and integrate SAP AI Core, on S/4HANA on-premise and Public Cloud development environments.',
    topics: ['AI-assisted coding', 'Legacy code analysis', 'Test generation', 'RAP applications', 'SAP AI Core integration', 'AI governance'],
    duration: '40 hours over 7 weeks', iso: 'PT40H',
  },
  {
    code: 'AI', anchor: 'course-sap-ai-masterclass', icon: BrainCircuit, live: LIVE('sap-ai-masterclass'), tag: 'BUSINESS AI / TECHNICAL', category: 'Technical',
    title: 'SAP AI Masterclass', name: 'SAP AI Masterclass', full: 'SAP Business AI',
    bestFor: 'SAP developers, solution architects and data and ML engineers',
    description: 'An advanced live mentorship that simulates SAP Business AI implementation projects across SAP AI Core, Generative AI Hub, Joule, AI agents, RAG and intelligent automation.',
    topics: ['SAP AI Core and Launchpad', 'Generative AI Hub', 'Joule skills and agents', 'RAG solutions', 'Document AI', 'Enterprise AI governance'],
    duration: '40 hours over 7 weeks', iso: 'PT40H',
  },
  {
    code: 'JOULE', anchor: 'course-sap-joule', icon: Bot, live: LIVE('sap-joule'), tag: 'JOULE / FUNCTIONAL', category: 'Functional',
    title: 'SAP Joule', name: 'SAP Joule Training', full: 'SAP Joule',
    bestFor: 'SAP consultants, power users and business professionals',
    description: 'A live cohort covering SAP Joule foundations, configuration, security, integrations, business use cases, SAP Build and hands-on app development.',
    topics: ['Joule architecture', 'Configuration for SAP modules', 'Secure AI patterns', 'Business use cases', 'SAP Build', 'Testing and deployment'],
    duration: '24 hours over 3 weeks', iso: 'PT24H',
  },
];

// More live SAP programs listed on zarantech.com/courses, checked November 7, 2026.
export const moreLive = [
  ['SAP AI for MM Consultants', 'MM + AI', 'sap-ai-for-mm-consultants'],
  ['SAP AI for SD Consultants', 'SD + AI', 'sap-ai-for-sd-consultants-training'],
  ['SAP Joule Studio & AI Agents', 'AI', 'sap-joule-studio-ai-agents-training'],
  ['SAP Joule for Consultants Bootcamp', 'AI', 'sap-joule-for-consultants-practical-bootcamp'],
  ['SAP Joule for ABAP Developers', 'ABAP + AI', 'sap-joule-for-abap-developer'],
  ['SAP Document AI and Intelligent Automation', 'AI', 'sap-document-ai-and-intelligent-automation'],
  ['AI for SAP Consultants with Claude & MCP', 'AI', 'ai-for-sap-consultants-with-claude-mcp'],
  ['AI for SAP Consultants with Microsoft Copilot', 'AI', 'ai-for-sap-consultants-with-microsoft-copilot-training'],
  ['SAP AI Leadership Mastery', 'Leadership', 'sap-ai-leadership-mastery'],
].map(([title, area, slug]) => ({ title, area, href: LIVE(slug) }));

// Self-paced video courses on ZaranTech's Teachable school. Every link checked November 7, 2026.
export const videoCourses = [
  ['SAP for Beginners', 'Foundations', 'sap-for-beginners-training'],
  ['SAP S/4HANA Finance 2023', 'Finance', 'sap-s4-hana-finance-2023-training'],
  ['SAP FICO on ECC', 'Finance', 'sap-fico-training'],
  ['SAP ECC MM (Materials Management)', 'Logistics', 'sap-ecc-mm-training'],
  ['SAP ECC SD (Sales and Distribution)', 'Logistics', 'sap-ecc-sd-sales-and-distribution-training'],
  ['SAP S/4HANA EWM', 'Logistics', 'sap-s-4hana-ewm-training'],
  ['SAP BTP for Beginners', 'BTP', 'sap-btp-for-beginners-training'],
  ['SAP Integration Suite', 'BTP', 'sap-btp-integration-suite-training'],
  ['SAP ABAP on HANA, RAP and Fiori', 'Technical', 'sap-abap-on-hana-rap-and-fiori-training'],
  ['SAP S/4HANA Basis Administration', 'Technical', 'sap-s4-hana-basis-administration-training'],
  ['SAP MDG 9.2', 'Data', 'sap-mdg-9-2-training'],
  ['SAP Joule', 'AI', 'sap-joule-training'],
].map(([title, area, slug]) => ({ title, area, href: VIDEO(slug) }));

const goals = [
  { id: 'start', icon: Rocket, label: 'Start an SAP career from scratch', title: 'Begin with SAP for Beginners', description: 'If SAP is new to you, start with ZaranTech’s self-paced SAP for Beginners course to learn the SAP landscape and core business processes. Then move to a live track that matches your target role, such as S/4HANA implementation, BTP or ABAP.', href: VIDEO('sap-for-beginners-training'), cta: 'View SAP for Beginners' },
  { id: 's4', icon: Layers, label: 'Become an S/4HANA implementation consultant', title: 'Choose S/4HANA End-to-End Implementation', description: 'SAP S/4HANA End-to-End Implementation suits functional consultants, solution architects and project teams. The 120-hour live program covers SAP Activate, Finance, Supply Chain, data migration, testing, cutover, hypercare and a global implementation capstone.', href: paths[0].live, cta: 'View S/4HANA training' },
  { id: 'btp', icon: Cloud, label: 'Build and integrate on SAP BTP', title: 'Choose the SAP BTP Masterclass', description: 'The SAP BTP Masterclass suits functional consultants, developers, Basis admins and architects. The 60-hour live cohort has 19 modules, hands-on labs, five portfolio builds and an end-to-end BTP capstone across integration, extension, automation and AI.', href: paths[1].live, cta: 'View BTP training' },
  { id: 'finance', icon: Landmark, label: 'Apply AI in SAP Finance', title: 'Choose SAP AI for Finance', description: 'SAP AI for Finance Consultants suits FICO professionals, finance consultants and controllers. The 40-hour live cohort covers finance AI use cases, AI with S/4HANA Finance, forecasting, AP/AR, FP&A and governed finance automation.', href: paths[2].live, cta: 'View finance AI training' },
  { id: 'abap', icon: Code2, label: 'Modernize ABAP development with AI', title: 'Choose SAP AI for ABAP', description: 'SAP AI for ABAP Consultants suits ABAP developers and technical consultants. The 40-hour live cohort covers AI-assisted coding, legacy code analysis, test generation, RAP and SAP AI Core integration.', href: paths[3].live, cta: 'View ABAP AI training' },
  { id: 'ai', icon: BrainCircuit, label: 'Implement SAP Business AI', title: 'Choose the SAP AI Masterclass', description: 'The SAP AI Masterclass suits developers, architects and data and ML engineers. The 40-hour advanced mentorship covers SAP AI Core, Generative AI Hub, Joule skills and agents, RAG, Document AI and enterprise AI governance.', href: paths[4].live, cta: 'View SAP AI training' },
  { id: 'joule', icon: Bot, label: 'Use SAP Joule in daily work', title: 'Choose SAP Joule', description: 'SAP Joule training suits consultants, power users and business professionals. The 24-hour live cohort covers Joule architecture, configuration, security, business use cases, SAP Build and testing and deployment.', href: paths[5].live, cta: 'View Joule training' },
  { id: 'lead', icon: Target, label: 'Lead SAP AI strategy', title: 'SAP AI Leadership Mastery', description: 'SAP AI Leadership Mastery is a 24-hour live program for leaders deciding where SAP AI creates real value, when agents should act, which platform to use, how risks are governed and which initiatives deserve investment.', href: LIVE('sap-ai-leadership-mastery'), cta: 'View leadership program' },
  { id: 'selfpaced', icon: PlayCircle, label: 'Study one SAP module at a time', title: 'Self-paced SAP module courses', description: 'ZaranTech’s self-paced SAP catalog has separate courses for areas such as S/4HANA Finance, FICO, MM, SD, EWM, BTP, Integration Suite, ABAP, Fiori, Basis, MDG and Joule. Courses include recorded sessions, assignments, assessments and lab documents.', href: COURSES, cta: 'Browse SAP video courses' },
  { id: 'bundle', icon: Boxes, label: 'Get the full SAP video library', title: 'SAP Gold Bundle', description: 'The SAP Gold Bundle gives access to ZaranTech’s SAP video catalog, including new SAP courses added while the plan is active, on one yearly subscription. Check the included courses and terms before you buy.', href: GOLD_BUNDLE, cta: 'View the SAP Gold Bundle' },
  { id: 'team', icon: Building2, label: 'Upskill a corporate team', title: 'Corporate SAP training', description: 'Corporate SAP training is planned around the work your team owns: finance, supply chain, ABAP, BTP, integration or SAP AI adoption. Scope, labs, schedule and assessments are agreed with your L&D or project lead.', href: ADVISOR_URL, cta: 'Book a team planning call' },
];

// Plain-text answers: reused as-is in the FAQPage structured data.
export const faqs = [
  { q: 'What is SAP S/4HANA?', a: 'SAP S/4HANA is SAP’s current ERP suite for running core business processes such as finance, procurement, sales, manufacturing and supply chain on the SAP HANA in-memory database. It succeeds the older SAP ECC system. SAP S/4HANA training teaches how these processes are configured, implemented and supported, which makes it a common path for SAP functional consultants.' },
  { q: 'What is SAP BTP?', a: 'SAP BTP (Business Technology Platform) is SAP’s cloud platform for integrating, extending and automating SAP and non-SAP systems. It brings together integration, application development, data and analytics, automation and AI services. BTP skills matter because SAP recommends a clean-core approach, where custom logic is built as extensions on BTP instead of inside the S/4HANA core.' },
  { q: 'What is SAP Joule?', a: 'SAP Joule is SAP’s generative AI copilot, built into SAP cloud applications. Users ask questions or give instructions in natural language, and Joule finds information, explains data and helps complete tasks. SAP Joule training covers how Joule works, how it is configured and secured, and how to design business use cases and extensions with SAP Build.' },
  { q: 'Which SAP course should I start with?', a: 'Start with the role you want. SAP S/4HANA End-to-End Implementation suits functional consultants and project teams. The SAP BTP Masterclass suits developers, integration consultants and architects. SAP AI for ABAP suits ABAP developers, and SAP AI for Finance suits FICO and finance professionals. If SAP is completely new to you, begin with the self-paced SAP for Beginners course.' },
  { q: 'How long does it take to learn SAP?', a: 'ZaranTech’s featured live SAP programs run from 24 to 120 hours over 3 to 15 weeks. SAP Joule is 24 hours over 3 weeks, the SAP BTP Masterclass is 60 hours over 8 weeks and SAP S/4HANA End-to-End Implementation is 120 hours over 15 weeks. Plan extra time beyond class hours for hands-on practice, since project confidence comes from repeated lab work.' },
  { q: 'Can a beginner learn SAP?', a: 'Yes, with the right starting point. Complete beginners can start with ZaranTech’s self-paced SAP for Beginners course. The live SAP S/4HANA End-to-End Implementation program suits beginners only if they already understand core business processes, because it moves through a full project lifecycle. Book a free advisor call if you are unsure where to begin.' },
  { q: 'Do ZaranTech live SAP courses include hands-on practice?', a: 'Yes. ZaranTech’s live SAP course pages list hands-on labs in a lab environment, graded assessments, live doubt-clearing and session recordings to revisit. Most programs end in a capstone, portfolio build or implementation plan. Lab scope and access can differ by program, so confirm the details before you enroll.' },
  { q: 'Is there self-paced SAP training?', a: 'Yes. ZaranTech’s self-paced SAP catalog covers S/4HANA Finance, FICO, MM, SD, EWM, BTP, Integration Suite, ABAP on HANA, Fiori, Basis, MDG, Joule and more. Courses include recorded sessions from past live batches, assignments, assessments and lab documents. The SAP Gold Bundle gives access to the SAP video catalog on one yearly subscription.' },
  { q: 'Is there SAP AI training for functional consultants?', a: 'Yes. ZaranTech runs live SAP AI cohorts for specific roles, including SAP AI for Finance Consultants, SAP AI for MM Consultants and SAP AI for SD Consultants, plus several SAP Joule programs. Each applies SAP Business AI and generative AI to the role’s own processes, such as record-to-report, procure-to-pay or order-to-cash.' },
  { q: 'Can my company request customized SAP training?', a: 'Yes. ZaranTech offers role-based corporate SAP training for finance, supply chain, ABAP, BTP, integration and SAP AI teams. Scope, labs, schedules and assessments are agreed with the team, and programs can be timed around an S/4HANA migration, a rollout or AI adoption. Book a free call with a ZaranTech training advisor or email sales@zarantech.com to discuss a plan.' },
  { q: 'Where do I enroll or check current fees?', a: 'View each live program on zarantech.com, browse the self-paced SAP catalog, book a free call with a ZaranTech training advisor, or email sales@zarantech.com for fees, batch dates and access terms. Confirm availability and pricing with an advisor before purchase, since schedules and fees can change.' },
];

// Section summaries for search engines and AI answer engines. Not shown on screen:
// published in the JSON-LD (WebPage.hasPart) and in public/llms.txt instead of hidden HTML,
// because CSS-hidden text breaks Google's spam policies.
export const sectionSummaries = [
  { id: 'goal', name: 'Which SAP course should you take?', text: 'The right first SAP course depends on your background and target role. SAP S/4HANA End-to-End Implementation suits functional consultants and project teams; the SAP BTP Masterclass suits developers and architects; SAP AI for ABAP suits ABAP developers; SAP AI for Finance suits FICO professionals; the SAP AI Masterclass and SAP Joule suit consultants adopting SAP Business AI. Complete beginners can start with the self-paced SAP for Beginners course.' },
  { id: 'courses', name: 'SAP training paths compared', text: 'ZaranTech runs six featured live SAP training tracks: S/4HANA End-to-End Implementation (120 hours over 15 weeks), SAP BTP Masterclass (60 hours over 8 weeks), SAP AI for Finance Consultants (40 hours over 5 weeks), SAP AI for ABAP Consultants (40 hours over 7 weeks), SAP AI Masterclass (40 hours over 7 weeks) and SAP Joule (24 hours over 3 weeks).' },
  { id: 'live-training', name: 'Live, instructor-led SAP programs', text: 'ZaranTech runs live, instructor-led SAP programs with hands-on labs, assessments, session recordings and capstone projects. Beyond the six featured tracks, live SAP programs include SAP AI for MM and SD consultants, SAP Joule Studio and AI agents, Document AI, AI for SAP consultants with Claude or Microsoft Copilot, and SAP AI Leadership Mastery.' },
  { id: 'video-training', name: 'Self-paced SAP video training', text: 'ZaranTech’s self-paced SAP video courses cover areas such as SAP for Beginners, S/4HANA Finance, FICO, MM, SD, EWM, BTP, Integration Suite, ABAP on HANA, Basis, MDG and Joule. Courses include recorded sessions, assignments, assessments and lab documents. The SAP Gold Bundle covers the SAP video catalog on one yearly subscription.' },
  { id: 'reviews', name: 'SAP training reviews', text: 'Learners who took ZaranTech’s SAP courses, including SAP Basis, BTP ABAP on HANA, MDG, Joule and SAP HCM US and Canada Payroll, describe structured, practical and hands-on training in posts and reviews on LinkedIn and Justdial.' },
  { id: 'how-to-learn', name: 'How to learn SAP', text: 'The most reliable way to learn SAP is in three steps: understand the business process, practice it hands-on in a lab system, then explain your design and configuration choices clearly through a capstone or portfolio project.' },
  { id: 'teams', name: 'SAP training formats', text: 'ZaranTech offers SAP training in three formats: live instructor-led cohorts for individuals, self-paced video courses, and custom corporate programs for finance, supply chain, ABAP, BTP and SAP AI teams.' },
];

const stats = [['400+', 'Online Courses'], ['32,000+', 'Learners Trained'], ['37+', 'Countries Served'], ['350+', 'Corporate Clients']];

function Eyebrow({ num, children, pill }) {
  return <p className={'eyebrow' + (pill ? ' eyebrow--pill' : '')}>{num && <span>{num} ·</span>} {children}</p>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['#courses', 'Training paths'], ['#reviews', 'Reviews'], ['#faq', 'FAQ']];
  return (
    <header className="header">
      <div className="wrap header__row">
        <a href="/" className="brand" aria-label="SAP Learning Hub by ZaranTech, home">
          <img src="/img/zarantech-logo.png" alt="ZaranTech" width="150" height="36" />
          <small>SAP LEARNING HUB</small>
        </a>
        <button type="button" className="header__toggle" aria-expanded={open} aria-controls="nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav id="nav" className={'header__nav' + (open ? ' is-open' : '')} aria-label="Main" onClick={() => setOpen(false)}>
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          <a className="btn btn--sm" href={ADVISOR_URL} {...EXT}>Book a call <ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const chips = [[Layers, '6 featured live SAP tracks'], [Clock, '3 to 15 week programs'], [PlayCircle, 'Self-paced SAP courses'], [Building2, 'Corporate team programs']];
  const journey = [['01', 'Choose your track', 'S/4HANA · BTP · Finance · ABAP · Business AI · Joule'], ['02', 'Practice on real scenarios', 'Live sessions · Hands-on labs · Assessments'], ['03', 'Show project readiness', 'Capstones · Portfolio builds · Implementation plans']];
  return (
    <section className="hero grid-bg" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="chip-dot"><span aria-hidden="true" />SAP Learning Hub by ZaranTech · Since 2009</p>
          <h1 id="hero-title"><span className="ul">SAP</span> training{' '}<span className="h1__sub">for S/4HANA, BTP, ABAP, Finance and SAP AI</span></h1>
          <p className="hero__lede">ZaranTech offers live, instructor-led SAP training in six featured tracks: S/4HANA End-to-End Implementation, SAP BTP, SAP AI for Finance, SAP AI for ABAP, the SAP AI Masterclass and SAP Joule. Programs run 24 to 120 hours over 3 to 15 weeks, with hands-on labs and capstone projects. Self-paced and corporate options are also available.</p>
          <div className="actions">
            <a className="btn" href="#courses">Compare training paths <ArrowRight size={16} aria-hidden="true" /></a>
            <a className="btn btn--ghost" href={ADVISOR_URL} {...EXT}>Book a free advisor call <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <ul className="hero__chips">
            {chips.map(([Icon, text]) => <li key={text}><span className="icon-tile"><Icon size={16} aria-hidden="true" /></span>{text}</li>)}
          </ul>
          <p className="micro">Operated by ZaranTech, not affiliated with SAP SE. Course details and enrollment are handled through ZaranTech.</p>
        </div>

        <div className="hero__visual">
          <div className="journey">
            <span className="journey__tag">LEARN WITH PURPOSE · BUILD YOUR NEXT CHAPTER</span>
            <div className="journey__head"><span>YOUR SAP LEARNING JOURNEY</span><span className="live"><i aria-hidden="true" />3 stages</span></div>
            <ol>
              {journey.map(([num, title, desc]) => (
                <li key={num}><span className="journey__num">{num}</span><div><p className="journey__title">{title}</p><p>{desc}</p></div></li>
              ))}
            </ol>
          </div>
          <div className="formula">
            <p className="eyebrow">THE FORMULA</p>
            <p className="formula__text"><strong>Your experience</strong> + <strong>the right SAP track</strong> = progress.</p>
            <a href="#goal" className="formula__link">Find your starting course <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <div className="wrap roles">
        <p className="roles__label"><span />SAP TRAINING BY ROLE<span /></p>
        <div className="roles__row">
          {paths.map((p) => { const Icon = p.icon; return <a key={p.code} href="#courses" className="roles__tile" title={p.name}><span className="roles__icon" aria-hidden="true"><Icon size={22} /></span><b>{p.full}</b></a>; })}
        </div>
      </div>
    </section>
  );
}

function GoalFinder() {
  const [active, setActive] = useState(goals[0].id);
  const goal = goals.find((g) => g.id === active);
  const external = goal.href.startsWith('http');
  const GoalIcon = goal.icon;
  return (
    <section id="goal" className="section section--page" aria-labelledby="goal-title">
      <div className="wrap">
        <div className="section__head">
          <div><Eyebrow num="01">START WITH YOUR GOAL</Eyebrow><h2 id="goal-title">Which SAP course{' '}<br /><span className="hl">should you take?</span></h2></div>
        </div>
        <div className="finder">
          <div className="finder__list" role="tablist" aria-label="What do you want to achieve?">
            {goals.map((g) => (
              <button key={g.id} role="tab" type="button" aria-selected={g.id === active} className={'finder__item' + (g.id === active ? ' is-active' : '')} onClick={() => setActive(g.id)}>
                <span>{g.label}</span><ArrowRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="finder__panel" role="tabpanel" aria-live="polite">
            <span className="finder__orb" aria-hidden="true" />
            <span className="finder__icon" aria-hidden="true"><GoalIcon size={30} /></span>
            <p className="eyebrow">YOUR SUGGESTED STARTING POINT</p>
            <p className="finder__goal">You want to: <strong>{goal.label}</strong></p>
            <h3>{goal.title}</h3>
            <p className="finder__desc">{goal.description}</p>
            <div className="actions">
              <a className="btn" href={goal.href} {...(external ? EXT : {})}>{goal.cta} {external ? <ArrowUpRight size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}</a>
              <a className="btn btn--ghost" href="#courses">Compare all paths</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Courses() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(paths[0].code);
  const visible = useMemo(() => (filter === 'All' ? paths : paths.filter((p) => p.category === filter)), [filter]);
  const current = visible.find((p) => p.code === selected) || visible[0];
  return (
    <section id="courses" className="section section--page section--glow" aria-labelledby="courses-title">
      <div className="wrap">
        <div className="section__head">
          <div><Eyebrow num="02">SAP TRAINING PATHS</Eyebrow><h2 id="courses-title">SAP training paths{' '}<br /><span className="hl">compared.</span></h2></div>
        </div>
        <div className="filters" role="group" aria-label="Filter training paths">
          {[['All', 'All paths'], ['Functional', 'Functional'], ['Technical', 'Technical & AI']].map(([value, label]) => (
            <button key={value} type="button" className={'filter' + (filter === value ? ' is-active' : '')} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
          ))}
        </div>
        <div className="paths">
          <article className="featured grid-bg grid-bg--dark">
            <span className="badge badge--cyan">{current.tag}</span>
            <h3>{current.title}</h3>
            <p><strong>Best for:</strong> {current.bestFor}.</p>
            <p>{current.description}</p>
            <ul className="featured__topics" aria-label="Key topics">{current.topics.map((t) => <li key={t}>{t}</li>)}</ul>
            <p className="featured__meta"><Clock size={15} aria-hidden="true" /> {current.duration} · Live, instructor-led</p>
            <div className="featured__foot">
              <a className="btn btn--cyan" href={current.live} {...EXT}>View {current.title} course <ArrowUpRight size={16} aria-hidden="true" /></a>
              <span className="featured__code" aria-hidden="true">{current.code}</span>
            </div>
          </article>
          <div className="pathlist">
            <div className="pathlist__head"><span>CHOOSE A PATHWAY</span><span>{visible.length} paths</span></div>
            {visible.map((p) => (
              <button key={p.code} type="button" className={'pathlist__item' + (p.code === current.code ? ' is-active' : '')} aria-pressed={p.code === current.code} onClick={() => setSelected(p.code)}>
                <span className="pathlist__meta">{p.tag}</span>
                <strong>{p.title}</strong>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="compare">
          <table>
            <caption>SAP training paths at a glance. Source: ZaranTech live course pages, checked {CONTENT_CHECKED_LABEL}.</caption>
            <thead><tr><th scope="col">Track</th><th scope="col">Best for</th><th scope="col">Duration</th><th scope="col">Format</th></tr></thead>
            <tbody>
              {paths.map((p) => (
                <tr key={p.code} id={p.anchor}>
                  <th scope="row"><a href={p.live} {...EXT}>{p.name}</a></th>
                  <td>{p.bestFor}</td>
                  <td>{p.duration}</td>
                  <td>Live, instructor-led</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function LiveTraining() {
  return (
    <section id="live-training" className="section" aria-labelledby="live-title">
      <div className="wrap">
        <div className="section__head">
          <div><Eyebrow num="03">LIVE SAP TRAINING</Eyebrow><h2 id="live-title">Live, instructor-led{' '}<br /><span className="hl">SAP programs.</span></h2></div>
          <div className="section__aside">
            <a className="btn" href={LIVE_HOME} {...EXT}>See all live SAP training <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="offer-grid">
          {paths.map((p) => (
            <a key={p.code} className="offer" href={p.live} {...EXT}>
              <span className="offer__top"><span className="offer__code">{p.code}</span><span className="offer__tag">LIVE</span></span>
              <h3>{p.name}</h3>
              <p>{p.bestFor}.</p>
              <span className="offer__meta"><Clock size={14} aria-hidden="true" /> {p.duration}</span>
              <span className="offer__go">View course<span className="sr-only">: {p.name}</span> <ArrowUpRight size={14} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
        <p className="subhead subhead--gap">MORE LIVE SAP PROGRAMS</p>
        <ul className="video-grid video-grid--3">
          {moreLive.map((v) => (
            <li key={v.href}>
              <a className="video" href={v.href} {...EXT}>
                <span className="video__icon" aria-hidden="true"><Radio size={18} /></span>
                <span><small>{v.area.toUpperCase()} · LIVE</small><strong>{v.title}</strong></span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function VideoTraining() {
  return (
    <section id="video-training" className="section section--soft" aria-labelledby="video-title">
      <div className="wrap">
        <div className="section__head">
          <div><Eyebrow num="04">SELF-PACED SAP VIDEO TRAINING</Eyebrow><h2 id="video-title">Learn SAP{' '}<br /><span className="hl">at your own pace.</span></h2></div>
          <div className="section__aside">
            <a className="btn" href={COURSES} {...EXT}>Browse SAP video courses <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <ul className="video-grid">
          {videoCourses.map((v) => (
            <li key={v.href}>
              <a className="video" href={v.href} {...EXT}>
                <span className="video__icon" aria-hidden="true"><PlayCircle size={18} /></span>
                <span><small>{v.area.toUpperCase()} · SELF-PACED</small><strong>{v.title}</strong></span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <p className="section__note">Showing 12 SAP courses. See the <a href={COURSES} {...EXT}>full SAP video catalog</a>, or get the whole library with the <a href={GOLD_BUNDLE} {...EXT}>SAP Gold Bundle</a>.</p>
      </div>
    </section>
  );
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function sourceLabel(source) {
  if (source === 'Trustpilot') return 'Trustpilot review';
  if (source === 'LinkedIn') return 'LinkedIn post';
  if (source === 'Justdial') return 'Justdial review';
  return 'Verified learner';
}

// Horizontal slider: CSS scroll-snap track, arrow buttons scroll one page. Works by swipe and keyboard too.
function Slider({ label, className = '', children }) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);
  const go = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth, behavior: 'smooth' });
  return (
    <div className="slider" role="region" aria-roledescription="carousel" aria-label={label}>
      <button type="button" className="slider__btn slider__btn--prev" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous reviews"><ChevronLeft size={20} aria-hidden="true" /></button>
      <div className={'slider__track ' + className} ref={track} onScroll={update} tabIndex={0}>{children}</div>
      <button type="button" className="slider__btn slider__btn--next" onClick={() => go(1)} disabled={edge.end} aria-label="Next reviews"><ChevronRight size={20} aria-hidden="true" /></button>
    </div>
  );
}

function TrainingReviews() {
  return (
    <section id="reviews" className="section grid-bg" aria-labelledby="reviews-title">
      <div className="wrap">
        <div className="section__head">
          <div><Eyebrow num="05">SAP TRAINING REVIEWS</Eyebrow><h2 id="reviews-title">What SAP learners say{' '}<br /><span className="hl">about ZaranTech training.</span></h2></div>
          <div className="section__aside">
            <a className="btn btn--ghost" href={TRUSTPILOT_URL} {...EXT}>Read all reviews on Trustpilot <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <Slider label="SAP training reviews" className="slider__track--4">
          {trainingReviews.map((r) => (
            <figure key={r.author} className="review">
              <div className="review__head">
                <span className="avatar avatar--soft" aria-hidden="true">{initials(r.author)}</span>
                <figcaption><strong>{r.author}</strong><span>{sourceLabel(r.source)}</span></figcaption>
              </div>
              <blockquote className="review__text"><p>{r.text}</p></blockquote>
              <a className="review__src" href={r.url} {...EXT} aria-label={`View Post: ${r.author} on ${r.source}`}>View Post</a>
            </figure>
          ))}
        </Slider>
      </div>
    </section>
  );
}

function Progress() {
  const steps = [
    ['01', 'BUILD FOUNDATIONS', 'Learn the business process first.', 'Connect SAP concepts to real business flows such as procure-to-pay, order-to-cash and record-to-report before you configure or code anything.'],
    ['02', 'PRACTICE IN A LAB', 'Configure, build and test.', 'Work through configuration, development or integration tasks in a lab system until each scenario runs end to end.'],
    ['03', 'EXPLAIN YOUR WORK', 'Make your skills visible.', 'Describe the requirement, your design choices, how you tested them and the result. Capstones and portfolio builds give you real work to walk through in interviews and project reviews.'],
  ];
  return (
    <section id="how-to-learn" className="section grid-bg" aria-labelledby="progress-title">
      <div className="wrap">
        <Eyebrow num="06" pill>HOW TO LEARN SAP</Eyebrow>
        <h2 id="progress-title">Learn it. Apply it. <span className="hl">Explain it.</span></h2>
        <ol className="timeline">
          {steps.map(([num, label, title, text]) => (
            <li key={num}>
              <span className="timeline__dot">{num}</span>
              <p className="timeline__label">{label}</p>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="stats" aria-label="ZaranTech at a glance">
          {stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </div>
        <p className="stats__note">Figures for ZaranTech across all programs since 2009, not SAP training alone.</p>
      </div>
    </section>
  );
}

function Formats() {
  const rows = [
    { icon: Building2, meta: 'CUSTOM · TEAM-WIDE', title: 'Corporate SAP training', points: ['Role-based programs for finance, supply chain, ABAP, BTP and SAP AI teams', 'Timed around an S/4HANA migration, rollout or AI adoption', 'Scope, labs, schedule and assessments agreed with your L&D lead', 'Book a call to request a team plan'], href: ADVISOR_URL, external: true },
    { icon: PlayCircle, meta: 'FLEXIBLE · ON YOUR TIME', title: 'Self-paced video', points: ['SAP Gold Bundle: the SAP video catalog on one yearly subscription', 'Recorded sessions, assignments, assessments and lab documents', 'Ask support about SAP server access after purchase', 'Check the included courses and terms before you buy'], href: GOLD_BUNDLE, external: true },
    { icon: Radio, meta: 'GUIDED · REAL-TIME', title: 'Live instructor-led', points: ['Featured programs from 24 to 120 hours', 'Hands-on labs, assessments and live doubt-clearing', 'Session recordings and course materials to revisit', 'Confirm batch dates and lab access before enrolling'], href: '#courses' },
  ];
  return (
    <section id="teams" className="section section--page" aria-labelledby="teams-title">
      <div className="wrap">
        <div className="section__head">
          <div><Eyebrow num="07">SAP TRAINING FORMATS</Eyebrow><h2 id="teams-title">Live, self-paced or{' '}<br /><span className="hl">corporate SAP training.</span></h2></div>
          <div className="section__aside">
            <a className="btn" href={ADVISOR_URL} {...EXT}>Book a call to plan team training <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <p className="subhead">COMPARE THE FORMATS</p>
        <div className="formats">
          {rows.map((r, i) => {
            const Icon = r.icon;
            return (
              <a key={r.title} className="format" href={r.href} {...(r.external ? EXT : {})}>
                <span className="format__num">0{i + 1}</span>
                <span className="format__title"><span className="icon-tile icon-tile--lg"><Icon size={20} aria-hidden="true" /></span><span><small>{r.meta}</small><strong>{r.title}</strong></span></span>
                <ul className="format__points">{r.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                <span className="format__go" aria-hidden="true">{r.external ? <ArrowUpRight size={18} /> : <ArrowRight size={18} />}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="wrap faq">
        <div>
          <Eyebrow num="08">SAP TRAINING FAQ</Eyebrow>
          <h2 id="faq-title">SAP training <span className="hl">questions, answered.</span></h2>
          <p>Still unsure? <a href={ADVISOR_URL} {...EXT}>Book a free call with a training advisor</a> for a course recommendation, current fees and batch dates, or email <a href="mailto:sales@zarantech.com">sales@zarantech.com</a>.</p>
        </div>
        <div className="faq__list">
          {faqs.map(({ q, a }, i) => (
            <details key={q} open={i === 0}>
              <summary><h3 className="faq__q">{q}</h3><ChevronDown size={18} aria-hidden="true" /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cta">
          <div>
            <p className="eyebrow">TALK TO A TRAINING ADVISOR</p>
            <h2>SAP skills.{' '}<br /><span className="hl-cyan">Real possibilities.</span></h2>
          </div>
          <div className="actions">
            <a className="btn btn--cyan" href={ADVISOR_URL} {...EXT}>Book a call with an advisor <ArrowUpRight size={16} aria-hidden="true" /></a>
            <a className="btn btn--outline-light" href={COURSES} {...EXT}>Explore SAP courses <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/img/zarantech-logo.png" alt="ZaranTech" width="150" height="36" loading="lazy" />
            <p>SAP Learning Hub by ZaranTech, an enterprise IT training company founded in 2009. Compare SAP training paths here, then view course details and enroll through ZaranTech.</p>
          </div>
          <div><p className="footer__h">LEARNING PATHS</p>{paths.map((p) => <a key={p.code} href={p.live} {...EXT}>{p.title}</a>)}</div>
          <div><p className="footer__h">EXPLORE</p><a href="#live-training">Live SAP training</a><a href="#video-training">Self-paced SAP courses</a><a href={GOLD_BUNDLE} {...EXT}>SAP Gold Bundle</a><a href="#reviews">SAP training reviews</a><a href="#teams">Corporate training</a><a href="#faq">SAP training FAQ</a></div>
          <div><p className="footer__h">GET IN TOUCH</p><a href={ADVISOR_URL} {...EXT}><PhoneCall size={14} aria-hidden="true" /> Book a call with an advisor</a><a href="mailto:sales@zarantech.com"><Mail size={14} aria-hidden="true" /> sales@zarantech.com</a><a href="https://www.zarantech.com/" {...EXT}><Globe size={14} aria-hidden="true" /> Visit ZaranTech</a><a href="https://www.zarantech.com/policies/privacy-policy/" {...EXT}><Compass size={14} aria-hidden="true" /> Privacy policy</a></div>
        </div>
        <p className="footer__legal">Operated by ZaranTech. This is an independent training resource, not an official SAP website. SAP, SAP S/4HANA, SAP BTP, SAP Joule and other SAP products named here are trademarks or registered trademarks of SAP SE. No SAP sponsorship or authorization is implied. Training does not guarantee employment.</p>
        <div className="footer__bottom"><span>© 2026 ZaranTech. Content checked <time dateTime={CONTENT_CHECKED}>{CONTENT_CHECKED_LABEL}</time>.</span><span>Confirm current availability, pricing, access terms and lab access with an advisor before purchase.</span></div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main"><Hero /><GoalFinder /><Courses /><LiveTraining /><VideoTraining /><TrainingReviews /><Progress /><Formats /><FAQ /></main>
      <Footer />
    </>
  );
}
